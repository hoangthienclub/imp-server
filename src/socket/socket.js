import SocketIO from 'socket.io';
import * as KEY from './key';
import Message from './../models/message';
import Contact from './../models/contact';
import UserSocket from './../models/userSocket';
import jwt from 'jsonwebtoken';
import { create, update, findById } from '../utils/handle';
import { popMsg } from '../utils/populate';
import { popOneMsg } from '../utils/popDbUser';
import { connectDbUser } from './../databases';
import mongoose from 'mongoose';

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
		await create(UserSocket, {
			userId: user.user._id,
			socketId: socket.id
		})

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
		UserSocket.deleteOne({
			userId: socket.userId,
			socketId: socket.id
		});
  	    console.log(`${socket.id} disconnect`)
    });
}

function onListenFunctions(io, socket, dbUser) {
	socket.on(KEY.SEND_MESSAGE,(data) => {
		sendMessage(io, socket, dbUser, data);
	});

	socket.on(KEY.TYPING, (data) => {
		console.log('typing message');
		socketTyping(io, socket, dbUser, data);
	});

	socket.on(KEY.EDIT_MESSAGE,(data) => {
		console.log('edit message');
		editMessage(io, socket, dbUser, data);
	});

	socket.on(KEY.DEL_MESSAGE,(data) => {
		console.log('del message');
		delMessage(io, socket, dbUser, data);
	});

	socket.on(KEY.JOIN_CONVERSATION,(data) => {
		console.log('join conversation message');
		joinConversation(io, socket, data);
	});

}

const sendMessage = async (io, socket, dbUser, data) => {
	console.log(`${socket.id} send msg: ${JSON.stringify(data)}`)
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
	const userCurrent = await UserSocket.find({
		$or : [
			{
				userId: data.receiverId
			},
			{
				userId: socket.userId
			}
		]
	})
	if (userCurrent.length > 0) {
		userCurrent.map(user => {
			io.to(`${user.socketId}`).emit(KEY.SEND_MESSAGE, executeResponse({ message : msgPopUser}));
		})
		await Contact.findOneAndUpdate({
			creatorId: socket.userId,
			userId: data.receiverId
		}, {
			lastActiveCreator: new Date()
		});

		await Contact.findOneAndUpdate({
			userId: socket.userId,
			creatorId: data.receiverId
		}, {
			lastActiveUser: new Date()
		});
	}
}

const editMessage = async (io, socket, dbUser, data) => {
	const msg = await Message.findOne({
		_id: data.msgId,
		creatorId: socket.userId
	});
	if (!msg) {
		return error(socket, 'err');
	}
	const updateMsgData = {
		desc: data.desc,
		_id: data.msgId,
		status: 2
	}
	const updateMsg = await update(Message, updateMsgData);
	const msgPopAvt = await popMsg(Message, updateMsg);
	const msgPopUser = await popOneMsg(dbUser, msgPopAvt);
	const userCurrent = await UserSocket.findOne({userId: msgPopAvt.receiverId});
	if (userCurrent) {
		io.to(`${userCurrent.socketId}`).emit(KEY.EDIT_MESSAGE, executeResponse({ message : msgPopUser }));
	}
}

const delMessage = async (io, socket, dbUser, data) => {
	const msg = await Message.findOne({
		_id: data.msgId,
		creatorId: socket.userId
	});
	if (!msg) {
		return error(socket, 'err');
	}
	const updateMsgData = {
		_id: data.msgId,
		status: 3
	}
	const updateMsg = await update(Message, updateMsgData);
	const msgPopAvt = await popMsg(Message, updateMsg);
	const msgPopUser = await popOneMsg(dbUser, msgPopAvt);
	const userCurrent = await UserSocket.findOne({userId: msgPopAvt.receiverId});
	if (userCurrent) {
		io.to(`${userCurrent.socketId}`).emit(KEY.DEL_MESSAGE, executeResponse({ message : msgPopUser }));
	}
}

const socketTyping = async (io, socket, dbUser, data) => {
	const userCurrent = await UserSocket.findOne({userId: data.receiverId});
	const msg = {
		creatorId: mongoose.Types.ObjectId(socket.userId),
		receiverId: mongoose.Types.ObjectId(data.receiverId),
		type: data.type
	}
	const msgPopUser = await popOneMsg(dbUser, msg);
	if (userCurrent) {
		console.log('Send msg: ', userCurrent.socketId)
		io.to(`${userCurrent.socketId}`).emit(KEY.TYPING, executeResponse({ message : msgPopUser}));
	}
}

const joinConversation = async (io, socket, data) => {
	try {
		await Contact.updateMany({
			creatorId: socket.userId
		}, {
			lastActiveCreator: new Date()
		});
		await Contact.updateMany({
			userId: socket.userId
		}, {
			lastActiveUser: new Date()
		})
	}
	catch (err) {
		console.log(err)
		return error(socket, 'err');
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