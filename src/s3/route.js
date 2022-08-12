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
                // check request middleware error
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(ERROR.BAD_REQUEST.CODE).send({
                        status: 0,
                        message: errors.array({ onlyFirstError: true })[0].msg,
                    });
                };
                const data = await s3Controller.upload(req.body);
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