import inspection from '../controller/inspection.controller';
import authenticator from '../middleware/authenticator';
import express from 'express';
import multer from 'multer';

//! Use of Multer
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})
// defile upload object
const upload = multer({
    storage: storage
});


const router = express.Router();
// upload inspections
router.post("/inspection", upload.single('file'), inspection.upload);


module.exports = router;