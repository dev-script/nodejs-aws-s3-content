const { param, body } = require('express-validator');
const { message } = require('../../config');

const validate = (method) => {
    if (method === "s3-upload"){
        return [
            param("carrerPathId")
                .exists().withMessage(message.ID_NOT_FOUND)
        ]
    }
}

module.exports = { validate }