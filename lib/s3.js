const AWS = require('aws-sdk');

/**
 * Upload image to aws s3 and return image url and other meta deta.
 * @param {buffer} buffer image buffer
 * @param {Object} data Input data required to upload image.
 */
const uploadContent = async (buffer, userId) => {
    try {
		console.log("uploading pdf report to s3...")
		const s3 = new AWS.S3({
			accessKeyId: process.env.S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		});
		const params = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key:  `report-${userId}`,
			Body: buffer,
			ContentType: "application/pdf",
			ACL: 'public-read',
			ContentDisposition: 'inline',
		};
		const uploaded = await s3.upload(params).promise();
		if(!uploaded || !uploaded.Location) throw new Error('unable to upload content to s3::');
		console.log("pdf report uploaded on s3::");
		return uploaded;
	} catch (err) {
		throw new Error(err);
	}
};

module.exports = {
	uploadContent
};
