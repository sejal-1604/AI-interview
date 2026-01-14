import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  difficulty: { type: String, required: true },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  questions: [{
    questionId: { 
      type: mongoose.Schema.Types.Mixed, // Accept both ObjectId and string
      required: true 
    },
    text: String,
    category: String
  }],
  responses: [{
    questionId: { 
      type: mongoose.Schema.Types.Mixed, // Accept both ObjectId and string
      required: true 
    },
    responseText: String,
    evaluation: {
      score: Number,
      feedback: String,
      improvements: [String]
    },
    timestamp: { type: Date, default: Date.now }
  }],
  currentQuestionIndex: { type: Number, default: 0 }
}, { timestamps: true });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;