// src/models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  fileName: String,
  cloudinaryUrl: String,
  content: String
},{
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
