// Connect to the Socket.io server
const socket = io('http://localhost:9090');

// Function to add a new message to the chat interface
function addMessage(message) {
  const messageList = document.getElementById('messageList');
  const listItem = document.createElement('li');
  listItem.textContent = `${message.from}: ${message.text}`;
  messageList.appendChild(listItem);
}

// Function to add a server message to the chat interface
function addServerMessage(message) {
  const messageList = document.getElementById('messageList');
  const listItem = document.createElement('li');
  listItem.classList.add('server-message');
  listItem.textContent = message;
  messageList.appendChild(listItem);
}

// Listen for 'receive-message' events from the server
socket.on('receive-message', (message) => {
  addMessage(message);
});

// Listen for 'server-message' events from the server
socket.on('server-message', (message) => {
  addServerMessage(message);
});

function sendMessage(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the values from the form
  const nameInput = document.querySelector('input[name="from"]');
  const textInput = document.querySelector('input[name="text"]');
  const from = nameInput.value;
  const text = textInput.value;

  // Emit a 'send-message' event to the server with the message data
  socket.emit('send-message', { from, text });

  // Clear the input fields after sending the message
  nameInput.value = '';
  textInput.value = '';
}
const messageForm = document.querySelector('#messageForm');
messageForm.addEventListener('submit', sendMessage);

