// (function connect() {
//     let socket = io.connect('http://localhost:3000')

//     let username = document.querySelector('#username')
//     let usernameBtn = document.querySelector('#usernameBtn')
//     let curUsername = document.querySelector('.card-header')

//     let message = document.querySelector('#message')
//     let messageBtn = document.querySelector('#messageBtn')
//     let messageList = document.querySelector('#message-list')

//     let info = document.querySelector('.info')

//     usernameBtn.addEventListener('click', e => {
//         console.log(username.value)
//         socket.emit('change_username', {
//             username: username.value
//         });
//         curUsername.textContent = username.value
//         username.value = ''
//     })


//     messageBtn.addEventListener('click', e => {
//         console.log(message.value)
//         socket.emit('new_message', { message: message.value })
//         message.value = ''
//     })

//     socket.on('receive_message', data => {
//         console.log(data)
//         let listItem = document.createElement('li')
//         listItem.textContent = data.username + ': ' + data.message
//         listItem.classList.add('list-group-item')
//         messageList.appendChild(listItem)
//     })

//     message.addEventListener('keypress', e => {
//         socket.emit('typing')
//     })

//     socket.on('typing', data => {
//         info.textContent = data.username + " is typing..."
//         setTimeout(() => { info.textContent = '' }, 5000)
//     })

// })()


let socket = io.connect('http://localhost:3000')

const UNAME = "User_" + Math.floor((Math.random() * 10) + 1);

/* Meme */
var memes = [
    'Yes. I do.'
];

var random = document.querySelector('#random');

random.innerHTML = memes[Math.floor(Math.random() * memes.length)];

/* Time */
var deviceTime = document.querySelector('.status-bar .time');
var messageTime = document.querySelectorAll('.message .time');

deviceTime.innerHTML = moment().format('h:mm');

setInterval(function () {
    deviceTime.innerHTML = moment().format('h:mm');
}, 1000);

for (var i = 0; i < messageTime.length; i++) {
    messageTime[i].innerHTML = moment().format('h:mm A');
}

/* Message */
var form = document.querySelector('.conversation-compose');
var conversation = document.querySelector('.conversation-container');

form.addEventListener('submit', newMessage);

socket.emit('change_username', {
    username: UNAME
});

socket.on('receive_message', data => {
    console.log(`Received Message: ${data.message} from ${data.username}`);

    if (data.username !== UNAME) {
        var message = buildReceivedMessage(data.message);
        conversation.appendChild(message);
        conversation.scrollTop = conversation.scrollHeight;
    }
});

function newMessage(e) {
    var input = e.target.input;

    if (input.value) {
        var message = buildSentMessage(input.value);
        conversation.appendChild(message);
        animateMessage(message);
        socket.emit('new_message', { message: input.value })
    }

    input.value = '';
    conversation.scrollTop = conversation.scrollHeight;

    e.preventDefault();
}

function buildSentMessage(text) {
    var element = document.createElement('div');

    element.classList.add('message', 'sent');

    element.innerHTML = text +
        '<span class="metadata">' +
        '<span class="time">' + moment().format('h:mm A') + '</span>' +
        '<span class="tick tick-animation">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>' +
        '</span>' +
        '</span>';

    return element;
}

function buildReceivedMessage(text) {
    var element = document.createElement('div');
    element.classList.add('message', 'received');
    element.innerHTML = text +
        '<span class="metadata"><span class="time"></span></span>';

    return element;
}

function animateMessage(message) {
    setTimeout(function () {
        var tick = message.querySelector('.tick');
        tick.classList.remove('tick-animation');
    }, 500);
}