const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const { connectDB, disconnectDB } = require('../db');
const Issue = require('../models/Issue');

const sampleIssues = [
  {
    title: 'Fix login page authentication',
    description: 'Users are experiencing intermittent login failures. Need to investigate and fix the authentication process.',
    status: 'open',
    priority: 'high',
    assignee: 'Sarah Johnson'
  },
  {
    title: 'Implement dark mode',
    description: 'Add dark mode support to improve user experience in low-light environments.',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Michael Chen'
  },
  {
    title: 'Optimize database queries',
    description: 'Current queries are slow during peak usage. Need to optimize for better performance.',
    status: 'open',
    priority: 'critical',
    assignee: 'David Rodriguez'
  },
  {
    title: 'Fix responsive layout on mobile',
    description: 'The dashboard layout breaks on small mobile screens. Need to implement responsive design fixes.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Emily Wilson'
  },
  {
    title: 'Add export to PDF feature',
    description: 'Users need the ability to export reports to PDF format for offline viewing.',
    status: 'open',
    priority: 'medium',
    assignee: 'Unassigned'
  },
  {
    title: 'Fix broken image links',
    description: 'Several product images are not displaying correctly on the catalog page.',
    status: 'closed',
    priority: 'low',
    assignee: 'Alex Thompson'
  },
  {
    title: 'Implement user notifications',
    description: 'Add real-time notifications for users when issues are updated or assigned to them.',
    status: 'open',
    priority: 'medium',
    assignee: 'Unassigned'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing data
    await Issue.deleteMany({});
    console.log('Cleared existing issues');
    
    // Insert sample data
    const issues = await Issue.insertMany(sampleIssues);
    console.log(`Added ${issues.length} sample issues to the database`);
    
    // Disconnect from the database
    await disconnectDB();
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();