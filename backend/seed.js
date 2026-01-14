import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const questions = [
  {
    text: "Explain the difference between 'let', 'const', and 'var' in JavaScript.",
    category: "Technical",
    difficulty: "Entry",
    tags: ["javascript", "basics"]
  },
  {
    text: "How does the 'this' keyword work in JavaScript?",
    category: "Technical",
    difficulty: "Mid",
    tags: ["javascript", "advanced"]
  },
  {
    text: "Describe a difficult situation you faced at work and how you handled it.",
    category: "Behavioral",
    difficulty: "Mid",
    tags: ["soft-skills", "conflict-resolution"]
  },
  {
    text: "What are React hooks and why were they introduced?",
    category: "Technical",
    difficulty: "Mid",
    tags: ["react", "frontend"]
  },
  {
    text: "Tell me about a time you had to learn a new technology quickly. How did you approach it?",
    category: "Behavioral",
    difficulty: "Entry",
    tags: ["learning", "adaptability"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Question.deleteMany({}); // Clear existing questions
    await Question.insertMany(questions);
    console.log("Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();