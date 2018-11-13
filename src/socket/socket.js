import SocketIO from 'socket.io';
import * as KEY from './key';
import Message from './../models/message';
import UserSocket from './../models/userSocket';
import jwt from 'jsonwebtoken';
import { create, update } from '../utils/handle';
import { popMsg } from '../utils/populate';
import { popOneMsg } from '../utils/popDbUser';
import { connectDbUser } from './../databases';

module.exports = (server) => {
	console.log('-----------------------------------------------------------');
	let io = new SocketIO(server);
	io.on('connection', (socket) => {
		onVerifyingUser(io, socket);
	});
}

const onVerifyingUser = async (io, socket) => {
	try {
		const dbUser = await connectDbUser();
		const userDecode = jwt.decode(socket.handshake.query.token, process.env.JWT_KEY);
		const user = userDecode;
		if (!user) {
			socket.disconnect();
			return;
		}
		const userId = user.user._id;
		socket.userId = userId;
		const userCurrent = await UserSocket.findOne({userId: userId});
		if (userCurrent) {
			await update(UserSocket, {
				_id: userCurrent._id,
				socketId: socket.id
			})
		}
		else {
			console.log('thien')
			await create(UserSocket, {
				userId: user.user._id,
				socketId: socket.id
			})
		}

		onConnected(io, socket, dbUser);
	} 
	catch (err) {
		console.log(err)
		error(socket, err);
	}
}

function onConnected(io, socket, dbUser) {
	console.log(`${socket.id} connect`)
    socket.emit(KEY.CONNECTED,  executeResponse({}));
    onListenFunctions(io, socket, dbUser);
    onDisconnect(io, socket); // On disconnect
}

function onDisconnect(io, socket) {
    socket.on('disconnect', function () {
  	    console.log(`${socket.id} disconnect`)
    });
}

function onListenFunctions(io, socket, dbUser) {
	socket.on(KEY.SEND_MESSAGE,(data) => {
		sendMessage(io, socket, dbUser, data);
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

const sendMessage = async (io, socket, dbUser, data) => {
	const msgData = {
		desc: data.desc,
		creatorId : socket.userId,
		receiverId : data.receiverId
	}
	if (data.fileId) {
		msgData.fileId = data.fileId;
	}
	const newMsg = await create(Message, msgData);
	const msgPopAvt = await popMsg(Message, newMsg);
	const msgPopUser = await popOneMsg(dbUser, msgPopAvt);
	const userCurrent = await UserSocket.findOne({userId: data.receiverId});
	if (userCurrent) {
		console.log('Send msg: ', userCurrent.socketId)
		io.to(`${userCurrent.socketId}`).emit(KEY.SEND_MESSAGE, executeResponse({ message : msgPopUser}));
	}
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
	
	io.to(`${id}`).emit(KEY.SEND_MESSAGE, executeResponse({ message : newMsg }));
}

const socketTyping = async (io, socket, data) => {
	const newMsg = await create(Message, {
		desc: data.desc,
		creatorId : socket.userId,
		receiverId : data.receiverId,
	});
	const msg = await popMsg(Message, newMsg);
	const userCurrent = await UserSocket.findOne({userId: data.receiverId});
	if (userCurrent) {
		console.log('Send msg: ', userCurrent.socketId)
		io.to(`${userCurrent.socketId}`).emit(KEY.TYPING, executeResponse({ message : true}));
	}
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