import path from 'path';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';
import File from './../../models/file';
const pathFile = './src/files/';

const handleFileName = (filename) => {
	let arrName = filename.replace(/[^A-Za-z0-9.-]/g, '_').split(' ').join('').split(".");
	let ext = "." + arrName.pop();
	return arrName.join('') + ext;
}

var upload = multer({storage : multer.diskStorage(
    {
        destination: function (req, file, callback) {
            callback(null, pathFile);
        },
        filename: function (req, file, callback) {
            callback(null, handleFileName(file.originalname));
    }
})}).array('attachment');



module.exports = {
    createFile: async (req, res, next) => {
        try {
            upload(req, res, function (err) {
                let promises = req.files.map(async file => {
                    let item = new File({
                        name : file.filename,
                        size : file.size
                    });
                    await item.save();
                })
                res.data = {};
                next();
            });
        }
        catch (err) {
            console.log(err);
        }
    },

    getFile: async (req, res, next) => {
        try {
            const file = await File.findById(req.params.fileId)
            const x = path.join(pathFile, file._id + file.type);
            const y = file.name + file.type;
            res.download(x, y);
        }
        catch (err) {
            console.log(err)
        }
    },

    updateFile: async (req, res, next) => {
        try {
            var oldFile = await File.findById(req.params.fileId)
            const x = path.join(pathFile, oldFile._id + oldFile.type);
            fs.unlinkSync(x);
            var upload = multer({storage : multer.diskStorage(
                {
                    destination: function (req, file, callback) {
                        callback(null, pathFile);
                    },
                    filename: function (req, file, callback) {
                        oldFile.type = path.extname(file.originalname);
                        callback(null, oldFile._id + path.extname(file.originalname));
                }
            })}).single('file');

            upload(req, res, async (err) => {
                oldFile.size = req.file.size;
                oldFile.name = path.basename(req.file.originalname, path.extname(req.file.originalname));
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
            const x = path.join(pathFile, file._id + file.type);
            fs.unlinkSync(x);
            await file.remove();
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
        }
    }
}