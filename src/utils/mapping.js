const mapFile = row => ({
    id: row.id,
	name : row.name,
	status : row.status,
	type: row.type
}) 

const mapMessage = row => ({
    id: row.id ,
    desc : row.desc, 
	fileId : row.fileid, 
	status : row.status, 
	creatorId : row.creatorId,
	receiverId : row.receiverId, 
	createdDate : row.createdDate,
	firstMessageDay : row.firstMessageDay
})

module.exports = {
    mapFile,
    mapMessage
}