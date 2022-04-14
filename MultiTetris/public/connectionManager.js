class Connection {

  constructor() {
    this.conn = null;
  }

  connect(adress) {
    this.conn = new WebSocket(adress);

    this.conn.addEventListener('open', () => {
      console.log('connection establish');
      
      this.send({
        type: 'create-session',
      });
    });

    this.conn.addEventListener('message', event => {
      console.log("received message",event.data);

    });
  }

  send(data) {
    const msg = JSON.stringify(data);
    console.log(`Sending message ${msg}`);
    this.conn.send(msg);
  }

}