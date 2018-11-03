import SocketIO from 'socket.io';
import * as KEY from './key';
import Message from './../models/message';

module.exports = (server) => {
	console.log('-----------------------------------------------------------');
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
		console.log('typing message');
		socketTyping(io, socket, data);
	});

	socket.on(KEY.EDIT_MESSAGE,(data) => {
		console.log('edit message');
		editMessage(io, socket, data);
	});

	socket.on(KEY.DEL_MESSAGE,(data) => {
		console.log('del message');
		delMessage(io, socket, data);
	});

}

function sendMessage(io, socket, data) {
	const id = data.id;
	const newMsg = Message({
		desc: data.desc,
		creatorId : 1,
		receiverId : 2,
	});
	
	io.to(`${id}`).emit(KEY.SEND_MESSAGE, executeResponse({ message : data.desc }));
}

function editMessage(io, socket, data) {
	const id = data.id;
	const newMsg = Message({
		desc: data.desc,
		creatorId : 1,
		receiverId : 2,
	});
	
	io.to(`${id}`).emit(KEY.SEND_MESSAGE, executeResponse({ message : data.desc }));
}

function delMessage(io, socket, data) {
	const id = data.id;
	const newMsg = Message({
		desc: data.desc,
		creatorId : 1,
		receiverId : 2,
	});
	
	io.to(`${id}`).emit(KEY.SEND_MESSAGE, executeResponse({ message : data.desc }));
}

function socketTyping(io, socket, data) {
	const id = data.id;
	io.to(`${id}`).emit(KEY.TYPING, executeResponse({ message : 'typing ' }));
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