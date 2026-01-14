import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// OpenRouter client - replacing OpenAI completely
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "Interview App"
  }
});

// Debug: Check if API key is loaded
console.log("🔑 OpenRouter API Key loaded:", process.env.OPENROUTER_API_KEY ? "✅ Yes" : "❌ No");
console.log("🔑 API Key length:", process.env.OPENROUTER_API_KEY?.length || 0);

// Gemini client for speech-to-text
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1" // Use stable API version
});

// Free models for different tasks
const MODELS = {
  evaluation: "meta-llama/llama-3.1-8b-instruct-json",
  questions: "microsoft/wizardlm-2-8x22b", 
  transcription: "meta-llama/llama-3.1-8b-instruct"
};

export const transcribeAudio = async (filePath) => {
  try {
    console.log("🎤 Using Gemini for speech-to-text...");
    
    // Read audio file
    const audioBuffer = fs.readFileSync(filePath);
    
    // Get Gemini model
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Convert audio to base64 for Gemini
    const audioBase64 = audioBuffer.toString('base64');
    
    const prompt = "Transcribe this audio interview response accurately. Return only the transcribed text.";
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: audioBase64,
          mimeType: 'audio/mpeg'
        }
      },
      prompt
    ]);
    
    const transcription = result.response.text();
    console.log("✅ Gemini transcription successful:", transcription.substring(0, 100) + "...");
    return transcription.trim();
    
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    throw new Error("Failed to transcribe audio with Gemini");
  }
};

// Fallback evaluation function (no OpenAI API required)
const evaluateResponseFallback = (question, response) => {
  console.log("🚀 Using Enhanced Resume-Worthy Evaluation (No OpenAI API):", question.substring(0, 50) + "...");
  
  // Check if this is a voice response with transcription failure
  const isVoiceResponse = response.includes("Voice response submitted - transcription unavailable");
  
  // Comprehensive evaluation criteria
  const responseLength = response.length;
  const hasKeywords = checkKeywords(question, response);
  const isComprehensive = responseLength >= 50;
  const isRelevant = hasKeywords;
  const hasStructure = checkAnswerStructure(response);
  const hasExamples = checkForExamples(response);
  const hasTechnicalDepth = checkTechnicalDepth(response);
  const hasBusinessImpact = checkBusinessImpact(response);
  
  // Calculate score based on multiple factors
  let score = 0;
  let feedback = "";
  let improvements = [];
  
  // Special handling for voice responses
  if (isVoiceResponse) {
    score = 75; // Give benefit of doubt for voice responses
    feedback = "Voice response recorded successfully! Since transcription is unavailable due to API limits, we've credited you with a strong score. Continue with your next question.";
    improvements = [
      "Voice responses show confidence in communication",
      "Consider using text responses when transcription is available for detailed feedback",
      "Great job utilizing voice features in the interview"
    ];
  } else {
    // Base score for length (15% of total)
    if (responseLength >= 20) score += 5;
    if (responseLength >= 50) score += 5;
    if (responseLength >= 100) score += 5;
    
    // Bonus for relevance (20% of total)
    if (isRelevant) score += 20;
    
    // Bonus for structure (15% of total)
    if (hasStructure) score += 15;
    
    // Bonus for examples (20% of total)
    if (hasExamples) score += 20;
    
    // Bonus for technical depth (15% of total)
    if (hasTechnicalDepth) score += 15;
    
    // Bonus for business impact (15% of total)
    if (hasBusinessImpact) score += 15;
    
    // Generate detailed feedback based on score
    if (score >= 90) {
      feedback = "Exceptional response! Demonstrates deep technical expertise, structured thinking, and practical application with concrete examples. This is interview-ready performance.";
      improvements = [
        "Consider quantifying your impact with specific metrics (e.g., 'improved performance by 40%')",
        "Mention cross-functional collaboration and stakeholder management",
        "Highlight how your approach aligns with industry best practices and standards"
      ];
    } else if (score >= 80) {
      feedback = "Outstanding response! Well-structured, comprehensive, and demonstrates strong technical knowledge with relevant examples.";
      improvements = [
        "Add specific metrics and measurable outcomes to strengthen your impact",
        "Include lessons learned and how you've applied them to future projects",
        "Mention scalability considerations and long-term maintenance strategies"
      ];
    } else if (score >= 70) {
      feedback = "Strong response with good structure and relevant content. Shows solid understanding but could benefit from more specific examples.";
      improvements = [
        "Add concrete examples with specific technologies and frameworks used",
        "Include measurable outcomes and business impact when possible",
        "Mention collaboration with cross-functional teams and stakeholders"
      ];
    } else if (score >= 60) {
      feedback = "Good response that addresses question effectively. Needs more depth and specific technical examples.";
      improvements = [
        "Provide more detailed examples from your professional experience",
        "Structure your answer using STAR method (Situation, Task, Action, Result)",
        "Include specific technologies, tools, and methodologies you've used"
      ];
    } else if (score >= 50) {
      feedback = "Decent attempt with relevant content. Lacks sufficient detail and structure for a strong interview response.";
      improvements = [
        "Use STAR method consistently for behavioral questions",
        "Add 2-3 specific examples with technical details",
        "Structure answer with clear introduction, body, and conclusion",
        "Include measurable results and business impact"
      ];
    } else if (score >= 40) {
      feedback = "Basic response that needs significant improvement. Lacks detail, structure, and professional examples.";
      improvements = [
        "Practice using STAR method for all behavioral questions",
        "Research and prepare specific examples for common technical scenarios",
        "Structure answers with clear points and supporting details",
        "Include specific technologies, frameworks, and methodologies"
      ];
    } else {
      feedback = "Response requires major improvement. Lacks depth, structure, and examples expected in a professional interview.";
      improvements = [
        "Master STAR method (Situation, Task, Action, Result) for all answers",
        "Prepare 5-7 detailed examples from your experience with specific outcomes",
        "Practice structuring answers with introduction, key points, and conclusion",
        "Include specific technologies, metrics, and business impact in every example"
      ];
    }
  }
  
  return {
    score: Math.min(score, 100),
    feedback,
    improvements
  };
};

// Main OpenRouter evaluation function
export const evaluateResponse = async (questionText, responseText) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODELS.evaluation,
      messages: [{
        role: "system",
        content: `You are an expert interview evaluator. Provide JSON response with:
{
  "score": 0-100,
  "feedback": "Professional feedback paragraph",
  "improvements": ["improvement1", "improvement2", "improvement3"]
}`
      }, {
        role: "user",
        content: `Question: "${questionText}"
        
Candidate's Answer: "${responseText}"
        
Evaluate this interview response and provide detailed feedback.`
      }],
      temperature: 0.3,
      max_tokens: 500
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("OpenRouter Evaluation Error:", error);
    return evaluateResponseFallback(questionText, responseText);
  }
};

// Test OpenRouter connection
export const testOpenRouterConnection = async () => {
  try {
    console.log("🔍 Testing OpenRouter connection...");
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [{
        role: "user",
        content: "Say 'OpenRouter is working!'"
      }],
      max_tokens: 10
    });
    console.log("✅ OpenRouter connection successful:", completion.choices[0].message.content);
    return true;
  } catch (error) {
    console.error("❌ OpenRouter connection failed:", error.message);
    return false;
  }
};

// Question generation function using OpenRouter
export const generateInterviewQuestions = async (jobRole, difficulty, type, resumeText = null) => {
  try {
    // Add randomness to prompt for variety
    const randomSeed = Math.random().toString(36).substring(7);
    const currentTime = new Date().toISOString();
    
    let model = MODELS.questions;
    let completion;
    
    try {
      // Try primary model first
      completion = await openai.chat.completions.create({
        model: model,
        messages: [{
                role: "system",
                content: `You are an expert technical interviewer. Generate exactly 5 interview questions for a ${jobRole} position (${difficulty} difficulty, ${type} type)${resumeText ? ` based on this resume: ${resumeText}` : ''}.

Return ONLY a JSON object with this exact format:
{"questions": [{"text": "question 1", "category": "${type.toLowerCase()}"}, {"text": "question 2", "category": "${type.toLowerCase()}"}, {"text": "question 3", "category": "${type.toLowerCase()}"}, {"text": "question 4", "category": "${type.toLowerCase()}"}, {"text": "question 5", "category": "${type.toLowerCase()}"}]}

No extra text. No explanations. No markdown. Just the JSON.`
}, {
                role: "user",
                content: `Generate 5 interview questions for ${jobRole} (${difficulty}, ${type})${resumeText ? ' based on resume' : ''}. Return only JSON.`
              }],
        temperature: 0.9, // Higher temperature for more randomness
        max_tokens: 1500
      });
    } catch (primaryError) {
      console.warn("⚠️ Primary model failed, trying fallback model:", primaryError.message);
      // Try fallback model
      model = "meta-llama/llama-3.1-8b-instruct";
      completion = await openai.chat.completions.create({
        model: model,
        messages: [{
          role: "system",
          content: `Generate 5 interview questions for ${jobRole} (${difficulty}, ${type}). Return JSON only: {"questions": [{"text": "question", "category": "${type.toLowerCase()}"}]}`
        }, {
          role: "user",
          content: `Generate 5 interview questions for ${jobRole}. JSON only.`
        }],
        temperature: 0.7,
        max_tokens: 1000
      });
    }

    const response = completion.choices[0].message.content.trim();
    console.log("🤖 AI Response (model: ${model}):", response);
    
    // Clean up response to handle markdown formatting
    let cleanedResponse = response;
    
    // Remove markdown code blocks if present
    if (response.startsWith('```json')) {
      cleanedResponse = response.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (response.startsWith('```')) {
      cleanedResponse = response.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to find JSON in the response if it's not pure JSON
    if (!cleanedResponse.startsWith('{')) {
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
    }
    
    // Parse JSON response
    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      console.error("❌ Cleaned Response:", cleanedResponse);
      // If JSON parsing fails, return fallback questions
      return getFallbackQuestions(jobRole, difficulty);
    }
  } catch (error) {
    console.error("OpenRouter Question Generation Error:", error);
    return getFallbackQuestions(jobRole, difficulty);
  }
};

// Fallback questions if AI fails
const getFallbackQuestions = (jobRole, difficulty) => {
  const questionBank = {
    "Software Engineer": {
      "questions": [
        {"text": "Describe a complex bug you encountered and how you debugged it step by step.", "category": "technical"},
        {"text": "How would you optimize the performance of a slow React application?", "category": "technical"},
        {"text": "Explain how you would design a scalable REST API for a social media platform.", "category": "technical"},
        {"text": "What's your approach to writing maintainable and testable code?", "category": "technical"},
        {"text": "How do you handle state management in large React applications?", "category": "technical"},
        {"text": "Describe a time you had to learn a new technology quickly for a project.", "category": "behavioral"},
        {"text": "How do you ensure code quality in a team environment?", "category": "technical"},
        {"text": "What's your experience with CI/CD pipelines and deployment?", "category": "technical"},
        {"text": "How do you approach debugging production issues?", "category": "technical"},
        {"text": "Describe your experience with database optimization.", "category": "technical"}
      ]
    },
    "Frontend Developer": {
      "questions": [
        {"text": "How do you ensure cross-browser compatibility in your projects?", "category": "technical"},
        {"text": "Describe your approach to responsive web design.", "category": "technical"},
        {"text": "What are your favorite CSS methodologies and why?", "category": "technical"},
        {"text": "How do you optimize web application performance?", "category": "technical"},
        {"text": "Describe a challenging UI/UX problem you solved.", "category": "technical"},
        {"text": "How do you stay updated with frontend technologies?", "category": "behavioral"},
        {"text": "What's your experience with modern JavaScript frameworks?", "category": "technical"},
        {"text": "How do you handle accessibility in web development?", "category": "technical"},
        {"text": "Describe your component-based architecture approach.", "category": "technical"},
        {"text": "How do you test frontend applications?", "category": "technical"}
      ]
    },
    "Full Stack Developer": {
      "questions": [
        {"text": "Describe a full-stack project you're most proud of.", "category": "technical"},
        {"text": "How do you design database schemas for complex applications?", "category": "technical"},
        {"text": "What's your approach to API security?", "category": "technical"},
        {"text": "How do you handle authentication and authorization?", "category": "technical"},
        {"text": "Describe your experience with cloud deployment platforms.", "category": "technical"},
        {"text": "How do you balance frontend and backend development?", "category": "behavioral"},
        {"text": "What's your experience with microservices architecture?", "category": "technical"},
        {"text": "How do you optimize database queries?", "category": "technical"},
        {"text": "Describe your approach to system scalability.", "category": "technical"},
        {"text": "How do you handle real-time features in web apps?", "category": "technical"}
      ]
    }
  };

  const roleQuestions = questionBank[jobRole] || questionBank["Software Engineer"];
  
  // Randomly select 5 questions from the role-specific bank
  const shuffled = roleQuestions.questions.sort(() => 0.5 - Math.random());
  return {
    "questions": shuffled.slice(0, 5)
  };
};

// Helper function to check keywords in response
const checkKeywords = (question, response) => {
  const questionLower = question.toLowerCase();
  const responseLower = response.toLowerCase();
  
  // Common technical keywords to look for
  const technicalKeywords = [
    'javascript', 'react', 'node', 'api', 'database', 'sql', 'html', 'css',
    'python', 'java', 'git', 'aws', 'docker', 'kubernetes', 'microservices',
    'algorithm', 'data structure', 'function', 'variable', 'array', 'object',
    'async', 'await', 'promise', 'callback', 'error handling', 'testing',
    'debugging', 'performance', 'security', 'authentication', 'authorization'
  ];
  
  // Behavioral keywords
  const behavioralKeywords = [
    'team', 'collaborate', 'communication', 'project', 'deadline', 'conflict',
    'leadership', 'management', 'problem-solving', 'solution', 'approach',
    'strategy', 'planning', 'organization', 'priority', 'stakeholder'
  ];
  
  const allKeywords = [...technicalKeywords, ...behavioralKeywords];
  
  // Count how many keywords appear in response
  let keywordCount = 0;
  for (const keyword of allKeywords) {
    if (responseLower.includes(keyword)) {
      keywordCount++;
    }
  }
  
  // Check if response contains relevant keywords for the question
  const questionKeywords = extractKeywords(question);
  const relevantKeywordCount = questionKeywords.filter(keyword => 
    responseLower.includes(keyword.toLowerCase())
  ).length;
  
  return relevantKeywordCount > 0 || keywordCount >= 2;
};

// Helper function to extract keywords from question
const extractKeywords = (question) => {
  const keywords = [];
  
  // Simple keyword extraction - look for technical terms and concepts
  const words = question.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    if (word.length > 4 && !isStopWord(word)) {
      keywords.push(word);
    }
  }
  
  return [...new Set(keywords)];
};

// Helper function to check answer structure
const checkAnswerStructure = (response) => {
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const hasIntroduction = response.length > 20;
  const hasMultiplePoints = sentences.length >= 2;
  const hasConclusion = sentences.length >= 3;
  
  return hasIntroduction && hasMultiplePoints;
};

// Helper function to check for examples
const checkForExamples = (response) => {
  const exampleIndicators = [
    'for example', 'for instance', 'such as', 'like when', 
    'specifically', 'in one case', 'demonstrated', 'implemented',
    'achieved', 'resulted in', 'led to', 'successfully'
  ];
  
  const responseLower = response.toLowerCase();
  return exampleIndicators.some(indicator => responseLower.includes(indicator));
};

// Helper function to check for business impact
const checkBusinessImpact = (response) => {
  const impactIndicators = [
    'revenue', 'cost', 'savings', 'efficiency', 'productivity', 'customer satisfaction',
    'user engagement', 'conversion', 'retention', 'growth', 'market share',
    'reduced', 'increased', 'improved', 'optimized', 'streamlined',
    'business value', 'roi', 'kpi', 'metrics', 'impact', 'results'
  ];
  
  const responseLower = response.toLowerCase();
  return impactIndicators.some(indicator => responseLower.includes(indicator));
};

// Helper function to check technical depth
const checkTechnicalDepth = (response) => {
  const depthIndicators = [
    'architecture', 'design pattern', 'algorithm', 'optimization', 'performance',
    'scalability', 'security', 'database', 'api', 'framework', 'library',
    'implementation', 'deployment', 'testing', 'debugging', 'monitoring',
    'version control', 'ci/cd', 'microservices', 'cloud', 'infrastructure'
  ];
  
  const responseLower = response.toLowerCase();
  return depthIndicators.some(indicator => responseLower.includes(indicator));
};

// Helper function to filter out common words
const isStopWord = (word) => {
  const stopWords = ['the', 'is', 'at', 'which', 'what', 'how', 'when', 'where', 'why', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'does', 'do', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall'];
  return stopWords.includes(word.toLowerCase());
};

export { evaluateResponseFallback };