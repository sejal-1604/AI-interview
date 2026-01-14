# Interview App

A full-stack interview application with AI-powered questions and real-time feedback.

## Project Structure

```
interview-app/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── package.json       # Root package.json for managing both
└── README.md         # This file
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Development Mode
```bash
npm run dev
```
This will start both frontend (port 8080) and backend (port 5000) concurrently.

### 3. Production Build
```bash
npm run build
```

### 4. Production Start
```bash
npm run start
```

## Individual Scripts

- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build frontend for production
- `npm run start` - Start backend in production mode

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Radix UI
- React Router
- React Query

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- OpenAI Integration

## Deployment

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `frontend/dist` folder to your hosting service

### Backend Deployment
1. Deploy the `backend` folder to your hosting service
2. Set environment variables in your hosting platform
3. Run: `npm start`

## Features

- User authentication (register/login)
- AI-powered interview questions
- Real-time interview interface
- Voice recording capabilities
- Resume parsing and analysis
- Interview history and summaries
- Responsive design

## License

Private
