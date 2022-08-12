const { param, body } = require('express-validator');
const { message } = require('../../config');
const { isObjectIdValid } = require('../../utilities/common-utils');
const { PersonalityTypes, CareerPaths } = require('../../db/models');

const idValidation = (value) => isObjectIdValid(value);

const validate = (method) => {
    if (method === "check-request-id"){
        return [
            param("carrerPathId")
                .exists().withMessage(message.ID_NOT_FOUND)
        ]
    }
    if (method === 'save-career-path') {
        return [
            body('career_path_id').exists().not().isEmpty().withMessage(message.CAREER_PATH_ID_REQUIRED)
                .trim()
                .custom(async(value) => {
                    const count = await CareerPaths.count({ career_path_id: value });
                    if (count) {
                        return Promise.reject(message.CAREER_PATH_ALREADY_EXISTS);
                    }
                    return true;
                }),
            body('title').optional().exists().withMessage(message.CAREER_PATH_TITLE_REQUIRED)
                .trim()
                .custom(value => value.length >= 1 && value.length <= 255).withMessage(message.CAREER_PATH_TITLE_CHARS_LIMIT_EXCEEDED),
            body('description').optional().exists().withMessage(message.CAREER_PATH_DESCRIPTION_REQUIRED)
                .trim(),
            body('best_for').optional().exists().withMessage(message.CAREER_PATH_BEST_FOR_REQUIRED)
                .custom(async(values) => {
                    if (!Array.isArray(values)) {
                        return Promise.reject(message.CAREER_PATH_BEST_FOR_INVALID_VALUE);
                    }

                    const temp_array = [];
                    for (let _index=0; _index<values.length; _index=_index+1) {
                        let value = values[_index];
                        let count = await PersonalityTypes.count({ personality_type_id: value });
                        if (!count) temp_array.push(value);
                    }
                    if (temp_array.length) {
                        return Promise.reject(message.CAREER_PATH_BEST_FOR_INVALID_VALUE);
                    }
                    return true;
                }),
            body('personality_type').optional().exists().withMessage(message.CAREER_PATH_PERSONALITY_TYPE_REQUIRED)
                .custom(async(values) => {
                    if (!Array.isArray(values)) {
                        return Promise.reject(message.CAREER_PATH_PERSONALITY_TYPE_INVALID_VALUE);
                    }

                    const temp_array = [];
                    for (let _index=0; _index<values.length; _index=_index+1) {
                        let value = values[_index];
                        let count = await PersonalityTypes.count({ personality_type_id: value });
                        if (!count) temp_array.push(value);
                    }
                    if (temp_array.length) {
                        return Promise.reject(message.CAREER_PATH_PERSONALITY_TYPE_INVALID_VALUE);
                    }
                    return true;
                }),
        ]
    }
}

module.exports = { validate }