import fs from 'fs';

module.exports = {
    getAll: async (req, res, next) => {
        try {
            let companies = await req.dbMain.collection('ep_codeTags').find().toArray();
            res.data = companies;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
}