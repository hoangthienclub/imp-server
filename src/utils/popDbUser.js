let popMsgUser = async function (db, data) {
    let msgs = JSON.parse(JSON.stringify(data));
    return new Promise((resolve, reject) => {
        const userIds = [];
        data.map(msg => {
            userIds.push(msg.creatorId);
            userIds.push(msg.receiverId);
        })
        db.collection('users').find({
            _id: { $in : userIds }
        }).toArray()
        .then(users => {
            msgs.map(msg => {
                msg.creatorId = users.filter(user => user._id = msg.creatorId)[0];
                msg.receiverId = users.filter(user => user._id = msg.receiverId)[0];
                return msg;
            })
            resolve(msgs);
        })
    })
}

let popOneMsg = async function (db, data) {
    let msg = JSON.parse(JSON.stringify(data));
    return new Promise((resolve, reject) => {
        const userIds = [];
        userIds.push(data.creatorId);
        userIds.push(data.receiverId);
        db.collection('users').find({
            _id: { $in : userIds }
        }).toArray()
        .then(users => {
            msg.creatorId = users.filter(user => user._id == msg.creatorId)[0];
            msg.receiverId = users.filter(user => user._id == msg.receiverId)[0];
            resolve(msg);
        })
    })
}

let popContact = async function (db, data) {
    let contact = JSON.parse(JSON.stringify(data));
    return new Promise((resolve, reject) => {
        const userIds = [];
        userIds.push(data.creatorId);
        userIds.push(data.userId);
        db.collection('users').find({
            _id: { $in : userIds }
        }).toArray()
        .then(users => {
            contact.creatorId = users.filter(user => user._id == contact.creatorId)[0];
            contact.userId = users.filter(user => user._id == contact.userId)[0];
            resolve(contact);
        }) 
    })
}

let popUserContact = async function (db, data) {
    let msgs = JSON.parse(JSON.stringify(data));
    return new Promise((resolve, reject) => {
        const userIds = [];
        data.map(msg => {
            userIds.push(msg.userId);
        })
        db.collection('users').find({
            _id: { $in : userIds }
        }).toArray()
        .then(users => {
            msgs.map(msg => {
                msg.userId = users.filter(user => user._id = msg.userId)[0];
                return msg;
            })
            resolve(msgs);
        })
    })
}

module.exports = {
    popMsgUser,
    popOneMsg,
    popContact,
    popUserContact
}