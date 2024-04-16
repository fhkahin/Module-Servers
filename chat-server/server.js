import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.min.js; style-src 'self' https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css; font-src 'self' https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/fonts/glyphicons-halflings-regular.woff2; img-src 'self' data:; media-src 'self'; connect-src 'self' http://localhost:9090"
  );
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const io = new Server(9090, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"]
  }
});

const welcomeMessage = {
  id: 0,
  from: 'Fathi',
  text: "Welcome to Fathi's chat system!",
};

let messages = [welcomeMessage];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.get('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = messages.find((msg) => msg.id === messageId);
  if (!message) {
    return res.sendStatus(404);
  }
  res.json(message);
});

app.post('/messages', (req, res) => {
  const { from, text } = req.body;
  if (!from || !text) {
    return res.status(400).json({ error: 'Missing from or text in request body' });
  }
  const newMessage = {
    id: messages.length,
    from,
    text,
  };
  messages.push(newMessage);
  io.emit('receive-message', newMessage); // Broadcast the new message to all clients
  res.status(201).json(newMessage);
});

app.delete('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const index = messages.findIndex((msg) => msg.id === messageId);
  if (index === -1) {
    return res.sendStatus(404);
  }
  messages.splice(index, 1);
  res.sendStatus(204);
});

const server = app.listen(9090, () => {
  console.log(`Server is listening on port 9090`);
});

io.on('connection', (socket) => {
  console.log('A user connected');
  io.emit('server-message', 'A user connected');
});

export default server; // Export the server for Nodemon
