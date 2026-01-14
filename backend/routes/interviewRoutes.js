import express from 'express';
import multer from 'multer';
import { startInterview, getNextQuestion, submitAnswer, submitVoiceAnswer } from '../controllers/interviewController.js';
import { parseResume } from '../services/resumeService.js';
import InterviewSession from '../models/InterviewSession.js';
import { protect } from '../middleware/auth.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/start', protect, startInterview);
router.get('/:id/next', protect, getNextQuestion);
router.post('/:id/answer', protect, submitAnswer);
router.post('/:id/answer-voice', protect, upload.single('audio'), submitVoiceAnswer);

// Resume parsing route
router.post('/parse-resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file provided' });
    }

    const result = await parseResume(req.file.path, req.file.mimetype);
    
    // Clean up uploaded file with delay to avoid EBUSY error
    setTimeout(() => {
      try {
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        console.warn("Warning: Could not clean up uploaded file:", cleanupError.message);
        // Don't throw error, just log it
      }
    }, 1000); // 1 second delay

    res.json({
      success: true,
      parsedText: result.parsedText,
      skills: result.skills,
      experience: result.experience,
      education: result.education,
      structuredData: result.structuredData
    });
  } catch (error) {
    console.error('Resume parsing error:', error);
    
    // Clean up uploaded file even if parsing fails (with delay)
    setTimeout(() => {
      try {
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        console.warn("Warning: Could not clean up uploaded file:", cleanupError.message);
      }
    }, 1000);
    
    res.status(500).json({ 
      message: 'Failed to parse resume', 
      error: error.message 
    });
  }
});

// Summary Route
router.get('/:id/summary', protect, async (req, res) => {
  const session = await InterviewSession.findById(req.params.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json(session);
});

// History Route
router.get('/history', protect, async (req, res) => {
  const sessions = await InterviewSession.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select('type difficulty status createdAt responses');
  res.json(sessions);
});

export default router;