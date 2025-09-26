# Issue Tracker - MERN Stack

A full-stack Issue Tracker application built with MongoDB, Express.js, React, and Node.js, designed for deployment on Vercel.

## Features

### Backend (Express.js + MongoDB)
- **Health Check**: `GET /health` - Returns server status
- **Issues CRUD**:
  - `GET /issues` - List all issues with filtering, searching, sorting, and pagination
  - `GET /issues/:id` - Get a specific issue
  - `POST /issues` - Create a new issue
  - `PUT /issues/:id` - Update an existing issue
- **Assignees**: `GET /assignees` - Get list of unique assignees
- **Search**: Search issues by title
- **Filters**: Filter by status, priority, and assignee
- **Sorting**: Sort by any field (id, title, assignee, updatedAt)
- **Pagination**: Support for page and pageSize parameters

### Frontend (React + TypeScript + Material-UI)
- **Issues List Page**:
  - Table view with columns: ID, Title, Status, Priority, Assignee, Updated At
  - Search functionality by title
  - Filters for status, priority, and assignee
  - Sortable columns
  - Pagination controls
  - Create and Edit buttons
- **Issue Detail Page**:
  - Full issue information display
  - Raw JSON data view
  - Edit functionality
- **Issue Form**:
  - Create new issues
  - Edit existing issues
  - Form validation

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React 18, TypeScript, Material-UI (MUI)
- **Deployment**: Vercel
- **API Client**: Axios
- **Routing**: React Router DOM

## Project Structure

```
issue-tracker/
├── api/                    # Backend (Express.js)
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   └── App.tsx        # Main App component
│   └── package.json       # Frontend dependencies
├── vercel.json            # Vercel deployment config
└── README.md             # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd issue-tracker
   ```

2. **Set up the Backend**
   ```bash
   cd api
   npm install
   
   # Create .env file with your MongoDB connection string
   echo "MONGODB_URI=mongodb://localhost:27017/issue-tracker" > .env
   echo "PORT=5000" >> .env
   
   # Start the backend server
   npm run dev
   ```

3. **Set up the Frontend**
   ```bash
   cd ../client
   npm install
   
   # Start the React development server
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

#### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

#### Frontend (.env.local) - Optional
```
REACT_APP_API_URL=http://localhost:5000
```

## Deployment on Vercel

### Option 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Using GitHub + Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
   - Deploy

### Environment Variables for Production

In your Vercel project settings, add:
- `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/issue-tracker`)

## API Endpoints

### Health Check
```
GET /health
Response: {"status": "ok"}
```

### Issues
```
GET /issues?search=bug&status=open&priority=high&assignee=john&sortBy=updatedAt&sortOrder=desc&page=1&pageSize=10
POST /issues
PUT /issues/:id
GET /issues/:id
```

### Assignees
```
GET /assignees
```

## Issue Schema

```javascript
{
  _id: "ObjectId",
  title: "string (required)",
  description: "string (required)",
  status: "open" | "in-progress" | "closed",
  priority: "low" | "medium" | "high" | "critical",
  assignee: "string",
  createdAt: "Date",
  updatedAt: "Date"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.