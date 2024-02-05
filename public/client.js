const socket = io()
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelectorAll('.container')

var audio = new Audio("ting.mp3");

function scrollToBottom() {
    var messageContainer = document.getElementById('message-container');
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

console.log('messageContainer:', messageContainer[0])
const append = (message, position) => {
    const messageElement = document.createElement("div")
    messageElement.innerText = message
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer[0].appendChild(messageElement)
    scrollToBottom()
    if (position == "left") {
        audio.play()
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value
    console.log(message);
    if (!message) {
        socket.emit('send', { message: "please Fill s your name" })
        return;
    }
    append(`you: ${message}`, "right")
    socket.emit('send', message)
    messageInput.value = ''

})


const name = prompt("Enter your name to join a chat");
if (name) socket.emit("new-user-joined", name)

socket.on("user-joined", name => {
    append(`${name} joined the chat `, 'right')

})
socket.on("receive", data => {

    append(`${data.name}: ${data.message}`, 'left')

})

socket.on("left", name => {
    if (name)
        append(`${name} left the chat `, 'right')
})

