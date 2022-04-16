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

const createClient = function(conn, id = createId()) {
  return new Client(conn, id);
}

const createSession = function(id = createId()) {
  if (sessions.has(id)) {
    throw new Error(`Session ${id} already exists`);
  }

  const session = new Session(id);
  console.log("creating session", session);

  sessions.set(id, session);

  return session;
};

const getSession = function(id) {
  return sessions.get(id);
};

const broadcastSession = function(session) {
  const clients = [...session.clients];
  clients.forEach((client) => {
    client.send({
      type: 'session-broadcast',
      peers: {
        you: client.id,
        clients: clients.map(client => client.id),
      }
    })
  })
}

server.on('connection', conn => {
  console.log('connection established');
  const client = createClient(conn);

  conn.on('message', msg => {
    msg = msg.toString();
    console.log('Message received', msg);
    const data =  JSON.parse(msg);
    // console.log(data)

    if (data.type === 'create-session') {
      const id = createSession();
      const session = new Session(id);
      session.join(client);
      
      client.send({
        type: 'session-created',
        id: session.id,
      });
      console.log(sessions);
    } else if (data.type === 'join-session') {
      const session = getSession(data.id) || createSession(data.id);
      session.join(client);

      broadcastSession(session);

      console.log('Session', sessions);

    }
  });

  conn.on('close', () => {
    console.log('Connection closed');
    const session = client.session;

    if (session) {
      session.leave(client);
      if (session.clients.size === 0) {
        sessions.delete(session.id);
      }
    }

    broadcastSession(session);
  });
});