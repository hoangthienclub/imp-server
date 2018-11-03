module.exports = ['message', 'file']
.map(model => require(`./${model}`));