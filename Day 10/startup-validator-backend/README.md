# Startup Validator Backend

This is a Node.js/Express backend for validating startup ideas using AI and managing user-submitted ideas. It provides authentication, idea submission, and AI-powered idea evaluation, storing results in MongoDB.

## Features
- User registration and login (JWT authentication)
- Submit startup ideas for AI validation
- Retrieve all ideas submitted by a user
- MongoDB integration for persistent storage

## Requirements
- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)
- Python AI validation service running at `http://localhost:8000/validate-idea`

## Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd startup-validator-backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file in the root directory with the following variables:**
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. **Start the server:**
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT

### Ideas
- `GET /api/ideas/:userId` — Get all ideas for a user (JWT required)
- `POST /api/ideas/validate/:userId` — Submit an idea for AI validation (JWT required)
  - Body: `{ "title": "Your startup idea" }`

## Environment Variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for JWT signing

## Notes
- The AI validation endpoint (`http://localhost:8000/validate-idea`) must be running and accessible for idea validation to work.
- All protected routes require the `Authorization: Bearer <token>` header.

## License
ISC 