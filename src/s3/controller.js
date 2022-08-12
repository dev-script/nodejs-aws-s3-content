const s3 = require('../../lib');

const upload = async (data) => {
    try {
        const content = await s3.uploadContent(data);
        return content;
    } catch (uploadError) {
        throw new Error(uploadError);
    }
}

module.exports = {
    upload,
}