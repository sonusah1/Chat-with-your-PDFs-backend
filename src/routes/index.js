// src/routes/index.js
import express from 'express';
import { upload, handleUpload } from '../controller/uploadController.js';
import { chatWithDoc } from '../controller/chatController.js';

const router = express.Router();

router.post('/upload', upload.single('pdf'), handleUpload);
router.post('/chat', chatWithDoc);

export default router;
