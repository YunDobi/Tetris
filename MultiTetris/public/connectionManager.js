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
    console.log(player);
    ['pos', 'matrix', 'score'].forEach(key => {
      player.event.listen(key, () => {
        this.send({
          type: 'state-update',
          fragment: 'player',
          state: [key, player[key]],
        });
      });
    });
    // this.player.event.listen('pos', pos => {
    //   console.log("Player pos", pos);
    // });
    // this.player.event.listen('matrix', matrix => {
    //   console.log("Player matrix", matrix);
    // });
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
  
  receive(msg) {
    const data = JSON.parse(msg);
    if (data.type === 'session-created') {
      window.location.hash = data.id;
    } else if (data.type === 'session-broadcast') {
      console.log("+++ updating");
      this.updateMangager(data.peers);
    }
  }

  send(data) {
    const msg = JSON.stringify(data);
    console.log(`Sending message ${msg}`);
    this.conn.send(msg);
  }
}