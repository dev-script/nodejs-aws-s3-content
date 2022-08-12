const { validationResult } = require('express-validator');
const { constants, message } = require('../../config');
const { catchFunction } = require('../../utilities/common-utils');
const s3Controller = require('./controller');
const s3Validation = require('./validation');

const { SUCCESS, ERROR } = constants;

module.exports = (app) => {

    app.route('/api/v1/upload').post(
        s3Validation.validate('s3-upload'),
        async(req,res) => {
            try {
                if (req && !req.files) {
                    return res.status(ERROR.BAD_REQUEST.CODE).send({
                        status: 0,
                        message: 'please upload file',
                    });
                }
                const { file } = req.files;
                const validFileType = file.mimetype.includes('image') || file.mimetype.includes('video');
                if (!validFileType) {
                    return res.status(ERROR.BAD_REQUEST.CODE).send({
                        status: 0,
                        message: 'please upload valid file',
                    });
                }

                const data = await s3Controller.upload(file.data);
                return res.status(SUCCESS.CODE).send({
                    message: message.CREATED_SUCCESSFULLY,
                    status: 1,
                    data,
                });
            } catch (error) {
                return catchFunction({
                    res,
                    requestId: req._id,
                    fileName: 's3-controller',
                    methodName: 's3Upload',
                    error,
                });
            }
        }
    );
}