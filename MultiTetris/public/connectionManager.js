class Connection {

  constructor(tetrisManager) {
    this.conn = null;
    this.peers = new Map;

    this.tetrisManager = tetrisManager;
    this.localTetris = [...tetrisManager.instance][0];
  }

  connect(adress) {
    this.conn = new WebSocket(adress);

    this.conn.addEventListener('open', () => {
      console.log('connection establish');
      this.initSession();
      this.whatchEvents();
    });

    this.conn.addEventListener('message', event => {
      console.log("received message",event.data);
      this.receive(event.data);
    });
  }

  initSession()
  {
    const sessionId = window.location.hash.split('#')[1];
    if (sessionId) {
      console.log("sending join-session");
      this.send({
        type: 'join-session',
        id: sessionId,
      });
    } else {
      this.send({
        type: 'create-session',
      });
    }
  }

  whatchEvents() {
    const local = this.localTetris;

    const player = local.player;
    console.log("player", player);
    ['pos', 'matrix', 'score'].forEach(key => {
      player.event.listen(key, value => {
        this.send({
          type: 'state-update',
          fragment: 'player',
          state: [key, value],
        });
      });
    });

    const arena = local.arena;
    console.log(arena);
    ['matrix'].forEach(key => {
      arena.event.listen(key, (value) => {
        this.send({
          type: 'state-update',
          fragment: 'arena',
          state: [key, value],
        });
      });
    });
  }

  updateMangager(peers) {
    const me = peers.you;
    const clients = peers.clients.filter(id => me !== id);
    clients.forEach(id => {
      if (!this.peers.has(id)) {
        const tetris = this.tetrisManager.createPlayer();
        this.peers.set(id, tetris);
      }
    });

    [...this.peers.entries()].forEach(([id, tetris]) => {
      if (clients.indexOf(id) === -1) {
        this.tetrisManager.removePlayer(tetris);
        this.peers.delete(id);
      }
    });
  }

  updatePeer(id, fragment, [prop, value]) {
    if (!this.peers.has(id)) {
      console.error('Client doese not exist', id);
      return;
    }

    const tetris = this.peers.get(id);
    tetris[fragment][prop] = value;
    console.log("96",prop);

    if (prop === 'score') {
      tetris.UpdateScore(value);
    } else {
      tetris.Draw();
    }
  }
  
  receive(msg) {
    const data = JSON.parse(msg);
    if (data.type === 'session-created') {
      window.location.hash = data.id;
    } else if (data.type === 'session-broadcast') {
      console.log("+++ updating");
      this.updateMangager(data.peers);
    } else if (data.type === 'state-update') {
      this.updatePeer(data.clientId, data.fragment, data.state);
    }
  }

  send(data) {
    const msg = JSON.stringify(data);
    console.log(`Sending message ${msg}`);
    this.conn.send(msg);
  }
}