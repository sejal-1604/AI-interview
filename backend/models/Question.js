import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Technical', 'Behavioral'
  difficulty: { type: String, enum: ['Entry', 'Mid', 'Senior'], default: 'Mid' },
  tags: [String]
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;