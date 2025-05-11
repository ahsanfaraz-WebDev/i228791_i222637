# GatherSpace - Community Event Management Platform

A full-featured MERN stack application for creating, managing, and attending community events. This application allows users to register, create events, join events, and manage their event history.

## Features

- User authentication with JWT
- Create, edit, and delete events
- Browse events with filtering by category, location, and date
- Join events and see attendee lists
- User dashboard with created and joined events
- Responsive design with Tailwind CSS
- Beautiful UI with animations

## Tech Stack

- **Frontend**: React with TypeScript, React Router, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT

## Environment Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Environment Variables

Create a `.env` file in the root directory using the `.env.example` as a template:

```
MONGODB_URI=mongodb+srv://your_mongodb_username:your_mongodb_password@cluster0.mongodb.net/eventapp?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
PORT=8000
NODE_ENV=development
```

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret key for JWT token generation
- `PORT`: The port for the backend server
- `NODE_ENV`: The environment (development, production)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development servers:

```bash
npm run dev
```

This will start both the backend server and frontend development server concurrently.

## Project Structure

```
/app
  /client          # React frontend
    /public        # Public assets
    /src           # Source code
      /components  # Reusable components
      /contexts    # React contexts
      /pages       # Page components
      /types       # TypeScript types
      /utils       # Utility functions
  /server          # Node.js backend
    /config        # Configuration
    /middleware    # Express middleware
    /models        # Mongoose models
    /routes        # API routes
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Events

- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `POST /api/events/:id/join` - Join an event
- `DELETE /api/events/:id/join` - Leave an event

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update user password

## License

MIT