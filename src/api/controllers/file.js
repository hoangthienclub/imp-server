import path from 'path';
import multer from 'multer';
import fs from 'fs';
import File from './../../models/file';
import { mapFile } from './../../utils/mapping';

const pathFile = './src/files/';
var upload = multer({storage : multer.diskStorage(
    {
        destination: function (req, file, callback) {
            callback(null, pathFile);
        },
        filename: function (req, file, callback) {
            callback(null, Date.now().toString());
    }
})}).array('attachment');

module.exports = {
    createFile: async (req, res, next) => {
        try {
            upload(req, res, function (err) {
                let promises = req.files.map(async file => {
                    return new Promise((resolve, reject) => {
                        let item = new File({
                            pathName : file.filename,
                            name: file.originalname, 
                            size : file.size,
                            type: path.extname(file.originalname)
                        });
                        item.save()
                        .then(item => {
                            resolve(item._id);
                        })
                    })
                })
                Promise.all(promises)
                .then(result => {
                    res.data = result;
                    next();
                })
            });
        }
        catch (err) {
            console.log(err);
        }
    },

    getFile: async (req, res, next) => {
        try {
            const file = await File.findById(req.params.fileId)
            const x = path.join(pathFile, file.pathName);
            const y = file.name;
            res.download(x, y);
        }
        catch (err) {
            console.log(err)
        }
    },

    updateFile: async (req, res, next) => {
        try {
            var oldFile = await File.findById(req.params.fileId)
            const x = path.join(pathFile, oldFile.pathName);
            fs.unlinkSync(x);

            upload(req, res, async (err) => {
                oldFile.size = req.files[0].size;
                oldFile.pathName = req.files[0].filename;
                oldFile.name = req.files[0].originalname;
                const newFile = await oldFile.save();
                res.data = newFile;
                next();
            });
        }
        catch (err) {
            console.log(err)
        }
    },

    deleteFile: async (req, res, next) => {
        try {
            const file = await File.findById(req.params.fileId);
            const x = path.join(pathFile, file.pathName);
            fs.unlinkSync(x);
            await file.remove();
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
        }
    },

    listFile: async (req, res, next) => {
        try {
            const files = await File.find();
            res.data = files.map(mapFile);
            next();
        }
        catch (err) {
            console.log(err)
        }
    }
}