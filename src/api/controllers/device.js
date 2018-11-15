import fs from 'fs';
import Device from './../../models/device';
import { create, find, findById, update, deleteFn } from '../../utils/handle';

module.exports = {
    create: async (req, res, next) => {
        try {
            const device = await create(Device, { ...req.body, userId: req.user._id });
            res.data = device;
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },

    deleteDevice: async (req, res, next) => {
        try {
            const data = {
                userId: req.user._id,
                token: req.body.token
            }
            await Device.remove({
                userId: req.user._id,
                deviceId: req.body.deviceId
            })
            res.data = {};
            next();
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    },
}