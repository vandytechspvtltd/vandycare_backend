const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const authenticate = require('../../../middleware/authMiddleware');
const controller = require('./profile.controller');

const router = express.Router();

/* =========================================================
   PROFILE IMAGE UPLOAD DIRECTORY
========================================================= */

const uploadDir = path.join(
    process.cwd(),
    'uploads',
    'profile'
);

fs.mkdirSync(uploadDir, {
    recursive: true
});

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const extension = path.extname(
            file.originalname
        );

        cb(
            null,
            `${req.user.id}-${Date.now()}${extension}`
        );
    }
});

/* =========================================================
   MULTER
========================================================= */

const upload = multer({

    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

/* =========================================================
   AUTH
========================================================= */

router.use(authenticate);

/* =========================================================
   PROFILE
========================================================= */

router.get(
    '/',
    controller.getProfile
);

router.post(
    '/',
    upload.single('image'),
    controller.createProfile
);

router.put(
    '/',
    upload.single('image'),
    controller.updateProfile
);

module.exports = router;