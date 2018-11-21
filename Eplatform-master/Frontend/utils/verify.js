function verifyData(object, list) {
    let result = [];
    var count = list.length;

    for(var i = 0; i < count; i++) {
        var item = list[i];
        if(!object[item]) {
            result.push(item);
        }
    }

    return result;
}

module.exports = {
    verifyData: verifyData
}