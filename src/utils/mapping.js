const mapFile = row => ({
    id: row.id,
	name : row.name,
	status : row.status,
	type: row.type
}) 

module.exports = {
    mapFile
}