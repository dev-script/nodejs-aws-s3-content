const AWS = require('aws-sdk');
const fs = require('fs');
const { Readable } = require('stream');
const { constants } = require('../config');

const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME, } = constants;

/**
 * Upload image to aws s3 and return image url and other meta deta.
 * @param {buffer} buffer image buffer
 */
const uploadContent = async (data) => {
    try {
		console.log("uploading pdf report to s3...")
        const contentId = `content-${Date.now()}`;
		const s3 = new AWS.S3({
			accessKeyId: AWS_S3_ACCESS_KEY_ID,
			secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
		});

        const stream = Readable.from(data);

		const params = {
			Bucket: AWS_S3_BUCKET_NAME,
			Key: contentId,
			Body: stream,
			ACL: 'public-read',
			ContentDisposition: 'inline',
		};
		// const uploaded = s3.upload(params).promise();
		// if(!uploaded || !uploaded.Location) throw new Error('unable to upload content to s3::');
		// console.log("pdf report uploaded on s3::");
        s3.upload(params, (err, data)=>{
            if (err) {
                console.log(`s3 file ${contentId} upload error :`, err);
                return;
            }
            console.log(`file ${contentId} upload data :`, data);
        })
		return { location: `https://${AWS_S3_BUCKET_NAME}.s3.ca-central-1.amazonaws.com/${contentId}` };
	} catch (err) {
		throw new Error(err);
	}
};

module.exports = {
	uploadContent
};
