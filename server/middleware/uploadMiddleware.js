
const multer = require('multer');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

// File filter - only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and image files are allowed'));
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// S3 upload helper
async function uploadToS3(fileBuffer, fileName, mimeType, folder = '') {
  const bucket = process.env.AWS_BUCKET_NAME;
  const key = folder ? `${folder}/${fileName}` : fileName;
  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = { upload, uploadToS3 };