const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Support both "/api/*" and root-level routes by stripping "/api" prefix if present
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

// --- Simple in-memory pub-sub for Server-Sent Events (SSE) ---
const sseClients = new Set();
const sseBroadcast = (event, data) => {
  const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch (_) {
      // ignore stale clients
    }
  }
};

// SSE endpoint for live updates
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.flushHeaders && res.flushHeaders();

  // Initial hello to establish stream
  res.write(`event: connected\n` + `data: ${JSON.stringify({ ts: Date.now() })}\n\n`);

  sseClients.add(res);

  // Heartbeat
  const heartbeat = setInterval(() => {
    try {
      res.write(`event: ping\n` + `data: ${Date.now()}\n\n`);
    } catch (_) {
      // client likely disconnected
      clearInterval(heartbeat);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
    try { res.end(); } catch (_) {}
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/issue-tracker';
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Running without database connection for testing...');
  }
};

// Helper: check DB connection status
const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Connect to database
connectDB();

// Use shared Issue model
const Issue = require('./models/Issue');

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: isDbConnected() });
});

// GET /issues - Get all issues with search, filter, sort, pagination
app.get('/issues', async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      assignee,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      page = 1,
      pageSize = 10
    } = req.query;

    // If DB is not connected, return an empty, well-formed response
    if (!isDbConnected()) {
      return res.json({
        issues: [],
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: 0,
          totalPages: 0
        }
      });
    }

    // Build query object
    let query = {};

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filters
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (assignee && assignee !== 'all') {
      query.assignee = assignee;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const issues = await Issue.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Issue.countDocuments(query);

    res.json({
      issues,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / parseInt(pageSize))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /issues/:id - Get single issue
app.get('/issues/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /issues - Create new issue
app.post('/issues', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { title, description, status, priority, assignee } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const issue = new Issue({
      title,
      description,
      status: status || 'open',
      priority: priority || 'medium',
      assignee: assignee || 'Unassigned'
    });

    const savedIssue = await issue.save();

    // Notify subscribers
    sseBroadcast('issue-created', { issue: savedIssue });

    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /issues/:id - Update issue
app.put('/issues/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { title, description, status, priority, assignee } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Update fields if provided
    if (title) issue.title = title;
    if (description) issue.description = description;
    if (status) issue.status = status;
    if (priority) issue.priority = priority;
    if (assignee !== undefined) issue.assignee = assignee;

    const updatedIssue = await issue.save();

    // Notify subscribers
    sseBroadcast('issue-updated', { issue: updatedIssue });

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /assignees - Get unique assignees for filter dropdown
app.get('/assignees', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([]);
    }
    const assignees = await Issue.distinct('assignee');
    res.json(assignees.filter(assignee => assignee && assignee !== 'Unassigned'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// Only start a server in non-serverless environments
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
