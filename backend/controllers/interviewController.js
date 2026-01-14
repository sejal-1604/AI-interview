import InterviewSession from '../models/InterviewSession.js';
import Question from '../models/Question.js';
import { evaluateResponse, transcribeAudio, evaluateResponseFallback, generateInterviewQuestions } from '../services/aiService.js';
import fs from 'fs';

// Helper to process response, evaluate, and save session
const processAndSave = async (session, responseText) => {
  if (!responseText) {
    console.log("No response text provided, skipping");
    return session;
  }
  console.log("Processing response:", responseText.substring(0, 100) + "...");
  
  try {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion || !currentQuestion.text) {
      console.log("Question not found, skipping evaluation");
      // Just save the response without evaluation
      session.responses.push({
        questionId: currentQuestion?.questionId || null,
        responseText,
        evaluation: { score: 0, feedback: "No evaluation available", improvements: [] }
      });
    } else {
      // Skip AI evaluation for skipped questions
      if (responseText === "Question skipped by user") {
        session.responses.push({
          questionId: currentQuestion.questionId,
          responseText,
          evaluation: { score: 0, feedback: "Question skipped", improvements: [] }
        });
      } else {
        const evaluation = await evaluateResponse(currentQuestion.text, responseText);
        console.log("Evaluation result:", evaluation);

        session.responses.push({
          questionId: currentQuestion.questionId,
          responseText,
          evaluation
        });
      }
    }

    if (session.currentQuestionIndex + 1 >= session.questions.length) {
      session.status = 'completed';
    } else {
      session.currentQuestionIndex++;
    }
    
    return await session.save();
  } catch (error) {
    console.error("Error processing response:", error);
    // Fallback evaluation if AI service fails
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const fallbackEvaluation = await evaluateResponseFallback(currentQuestion?.text || "Unknown question", responseText);
    session.responses.push({
      questionId: currentQuestion?.questionId || null,
      responseText,
      evaluation: fallbackEvaluation
    });

    if (session.currentQuestionIndex + 1 >= session.questions.length) {
      session.status = 'completed';
    } else {
      session.currentQuestionIndex++;
    }
    
    return await session.save();
  }
};

export const startInterview = async (req, res) => {
  const { type, difficulty, jobRole, resumeText } = req.body;
  
  try {
    console.log("🤖 Generating AI questions for:", { jobRole, difficulty, type, hasResume: !!resumeText });
    
    // Generate questions using AI with resume context
    const aiQuestions = await generateInterviewQuestions(jobRole || 'Software Engineer', difficulty, type, resumeText);
    const questions = aiQuestions.questions || [];
    
    if (questions.length === 0) {
      console.log("❌ No AI questions generated, falling back to database");
      // Fallback to database questions
      const fallbackQuestions = await Question.aggregate([
        { $match: { category: type, difficulty: difficulty } },
        { $sample: { size: 5 } }
      ]);
      
      if (fallbackQuestions.length === 0) {
        return res.status(404).json({ message: 'No questions found' });
      }
      
      const session = await InterviewSession.create({
        userId: req.user._id,
        type,
        difficulty,
        questions: fallbackQuestions.map(q => ({ questionId: q._id, text: q.text })),
        currentQuestionIndex: 0
      });
      res.status(201).json(session);
      return;
    }

    console.log("✅ AI Generated Questions:", questions.length, resumeText ? "(Resume-based)" : "(General)");
    
    const session = await InterviewSession.create({
      userId: req.user._id,
      type,
      difficulty,
      questions: questions.map((q, index) => ({ 
        questionId: `ai_${index}`, 
        text: q.text,
        category: q.category || type
      })),
      currentQuestionIndex: 0,
      resumeText: resumeText || null // Store resume text for reference
    });
    
    res.status(201).json(session);
  } catch (error) {
    console.error("❌ Error starting interview:", error);
    res.status(500).json({ message: 'Error starting interview', error: error.message });
  }
};

export const getNextQuestion = async (req, res) => {
  const session = await InterviewSession.findById(req.params.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  const currentQuestion = session.questions[session.currentQuestionIndex];
  res.json({ question: currentQuestion, currentIndex: session.currentQuestionIndex, totalQuestions: session.questions.length });
};

export const submitAnswer = async (req, res) => {
  try {
    const { responseText } = req.body;
    const session = await InterviewSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    await processAndSave(session, responseText);
    res.json({ success: true });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: 'Error submitting answer', error: error.message });
  }
};

export const submitVoiceAnswer = async (req, res) => {
  const session = await InterviewSession.findById(req.params.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  if (!req.file) return res.status(400).json({ message: 'No audio file provided' });

  try {
    // 1. Transcribe audio to text
    let transcribedText;
    try {
      transcribedText = await transcribeAudio(req.file.path);
      console.log("Transcribed text:", transcribedText.substring(0, 100) + "...");
    } catch (transcriptionError) {
      console.log("🎤 Transcription failed, using placeholder text:", transcriptionError.message);
      // Fallback when transcription fails due to quota limits
      transcribedText = "Voice response submitted - transcription unavailable due to API limits";
    }
    
    // 2. Evaluate the transcribed response
    await processAndSave(session, transcribedText);
    
    // 3. Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error submitting voice answer:", error);
    res.status(500).json({ message: 'Error submitting voice answer', error: error.message });
  }
};