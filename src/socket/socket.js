import SocketIO from 'socket.io';
import * as KEY from './key';
import mongoose from 'mongoose';

module.exports = (server) => {
	console.log('-----------------------------------------------------------');
	console.log('test connect')
	let io = new SocketIO(server);
	io.on('connection', (socket) => {
		console.log(`${socket.id} connect`)
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
  	    console.log(`${socket.id} disconnect`)
    });
}

function onListenFunctions(io, socket) {
	socket.on(KEY.SEND_MESSAGE,(data) => {
		console.log('send message');
		sendMessage(io, socket, data);
	});


	socket.on(KEY.TYPING,(data) => {
		console.log('typing');
		socketTypingMessage(io, socket, data);
	});

}

function sendMessage(io, socket, data) {
	const id = data.id;
	// const newMsg = createChatMessage({
	// 	desc: data.desc
	// });
	io.to(`${id}`).emit(KEY.SEND_MESSAGE, executeResponse({ message : data.desc }));
}

function socketTypingMessage(io, socket, data) {
	const id = data.id;
    socket.broadcast.to(`${id}`).emit(KEY.TYPING, executeResponse({ message : 'typing' }));
}

function createChatMessage(data) {
	const ChatMessage = mongoose.model('ChatMessage');
	let chatMessage = new ChatMessage({
		desc: data.desc,
		creatorId: data.createrId
	});
	return chatMessage;
}

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
	return socket.emit(KEY.ERROR, executeResponse('error'));
} 