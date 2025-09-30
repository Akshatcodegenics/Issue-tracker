/*
  Seed script to populate local MongoDB with sample issues.
*/
const mongoose = require('mongoose');
require('dotenv').config();
const Issue = require('../models/Issue');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/issue-tracker';

async function seed() {
  try {
    console.log('Connecting to MongoDB:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected. Seeding data...');

    const sampleIssues = [
      {
        title: 'Welcome to Issue Tracker Pro!',
        description: 'This is a seeded issue to get you started. Feel free to edit or delete it.',
        status: 'open',
        priority: 'medium',
        assignee: 'Demo User',
      },
      {
        title: 'Set up your first real project',
        description: 'Create your first issue by clicking the Create Issue button.',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Project Manager',
      },
      {
        title: 'Explore dashboard analytics',
        description: 'Check out the dashboard with real-time statistics.',
        status: 'closed',
        priority: 'low',
        assignee: 'Analytics Team',
      },
    ];

    // Optional: clear existing issues in local dev
    await Issue.deleteMany({});

    await Issue.insertMany(sampleIssues);

    const count = await Issue.countDocuments();
    console.log(`Seeded ${count} issues.`);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seed();