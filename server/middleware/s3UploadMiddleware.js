const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../config/s3Config');
const path = require('path');

const uploadS3 = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const folder = file.fieldname === 'resume' ? 'resumes' :
                file.fieldname === 'profilePhoto' ? 'profile-photos' :
                    file.fieldname === 'companyLogo' ? 'employer-logos' : 'others';

            const fileName = `${folder}/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, and image files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = uploadS3;
