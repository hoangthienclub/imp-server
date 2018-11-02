import SocketIO from 'socket.io';
import * as KEY from './key';

module.exports = (server) => {
	console.log('-----------------------------------------------------------');
	console.log('test connect')
	let io = new SocketIO(server);
	io.on('connection', (socket) => {
		console.log('connect')
		onVerifyingUser(io, socket);
	});
}

function onVerifyingUser(io, socket) {
    onConnected(io, socket);
}

function onConnected(io, socket) {
    socket.emit(KEY.CONNECTED,  executeResponse({}));
    onListenFunctions(io, socket);
    onDisconnect(io, socket); // On disconnect
}

function onDisconnect(io, socket) {
    socket.on('disconnect', function () {
  	    console.log('disconnect')
    });
}

function onListenFunctions(io, socket) {
	socket.on(KEY.SEND_MESSAGE,(data) => {
		console.log('send message');
		socketMessage(io, socket, data);
	});


	socket.on(KEY.TYPING,(data) => {
		console.log('typing');
		socketTypingMessage(io, socket, data);
	});

}

function socketMessage(io, socket, data) {
    io.sockets.in(data._id).emit(KEY.SEND_MESSAGE, executeResponse({ message : 'data' }));
}

function socketTypingMessage(io, socket, data) {
    socket.broadcast.to('id room').emit(KEY.TYPING, executeResponse({message : 'typing'}));
}

// function createChatMessage(data) {
// 	let chatRoomId = data._id;
// 	let msg = JSON.parse(JSON.stringify(data));
// 	if (msg._id) delete msg._id;
// 	let chatMessage = new ChatMessage(msg);
// 	chatMessage.chatRoomId = chatRoomId; // exist status : announcement
// 	if (data.message) chatMessage.desc = data.message;
// 	if (data.file) chatMessage.file = data.file;
// 	chatMessage.creatorId = data.userId;
// 	if (data.status) chatMessage.status = data.status;
// 	if (data.members) {chatMessage.members = data.members}
// 	if (data.firstMessageDay) chatMessage.firstMessageDay = true;
// 	chatMessage.companyId = data.companyId;
// 	return chatMessage;
// }


function executeResponse(data){
	return {
		success : (!data.status ? true : false),
		code : data.status || 200,
		results : data.message || {}
	};
}

function error(socket, err) {
	if (err) {
		console.log(err)
	};
	return socket.emit(keyChat.error, executeResponse(code.ERROR));
} 