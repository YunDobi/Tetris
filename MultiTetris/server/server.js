const { WebSocketServer } = require('ws');
const server = new WebSocketServer({port: 9000});
const Session = require('./session');
const Client = require('./client');


const sessions = new Map;


const createId = function(len = 6, chars = 'abcdefghjkmnopqrstvwxyz01234567890') {
  let id = '';
  while (len--) {
    id += chars[Math.random() * chars.length | 0];
  }
  return id;
};

server.on('connection', conn => {
  console.log('connection established');
  const client = new Client(conn);

  conn.on('message', msg => {
    msg = msg.toString();
    console.log('Message received', msg);
    const data =  JSON.parse(msg);
    console.log(data)

    if (data.type === 'create-session') {
      const id = createId();
      const session = new Session(id);
      session.join(client);

      sessions.set(session.id, session);
      client.send({
        type: 'session-created',
        id: 'session.id',
      });
    }
  });

  conn.on('close', () => {
    console.log('Connection is lost');
    const session = client.session;

    if (session) {
      session.leave(client);
      if (session.clients.size === 0) {
        sessions.delete(session.id);
      }
    }
  });
});