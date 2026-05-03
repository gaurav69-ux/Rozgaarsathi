
const multer = require('multer');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

// File filter - only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedExts = /pdf|doc|docx|jpeg|jpg|png|webp|gif|heic/;
  const isAllowedExt = allowedExts.test(path.extname(file.originalname).toLowerCase());
  
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const isAllowedMime = file.mimetype.startsWith('image/') || allowedMimeTypes.includes(file.mimetype);

  if (isAllowedExt && isAllowedMime) {
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