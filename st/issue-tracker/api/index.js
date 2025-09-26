const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Connect to database
connectDB();

// Issue Schema
const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignee: {
    type: String,
    default: 'Unassigned'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
issueSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

const Issue = mongoose.model('Issue', issueSchema);

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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
    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /issues/:id - Update issue
app.put('/issues/:id', async (req, res) => {
  try {
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
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /assignees - Get unique assignees for filter dropdown
app.get('/assignees', async (req, res) => {
  try {
    const assignees = await Issue.distinct('assignee');
    res.json(assignees.filter(assignee => assignee && assignee !== 'Unassigned'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;