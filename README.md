## Small Issue Tracker

A lightweight and simple Issue Tracking System designed to help small teams or solo developers manage tasks, bugs, and feature requests efficiently. This project is ideal for learning web development, project management, and CRUD operations.

### Features
 Create Issues – Add new issues with a title, description, priority, and status.
 View Issues – See all issues in a structured list with filtering options.
 Update Issues – Modify issue details or change the status (Open, In Progress, Closed).
 Delete Issues – Remove issues that are resolved or no longer relevant.
 Responsive UI – Works well on both desktop and mobile devices.

### Tech Stack

 Frontend: HTML, CSS, JavaScript (or React.js if applicable)

 Backend: Node.js + Express.js (if applicable)

 Database: MongoDB / SQLite / Local Storage (depending on implementation)

 Version Control: Git & GitHub

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Akshatcodegenics/Issue-tracker.git
   cd Issue-tracker
   ```

2. **Install dependencies:**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all project dependencies
   npm run install-all
   ```

3. **Set up MongoDB:**
   - Make sure MongoDB is running locally on `mongodb://localhost:27017`
   - The API will automatically connect to `issue-tracker` database

4. **Seed the database with sample data:**
   ```bash
   cd api
   npm run seed
   ```

5. **Run the application:**
   ```bash
   # Run both frontend and backend concurrently
   npm run dev
   
   # Or run separately:
   npm run server  # Backend on http://localhost:5000
   npm run client  # Frontend on http://localhost:3000
   ```

6. **Open your browser and go to:**
   - Frontend: http://localhost:3000
   - API Health Check: http://localhost:5000/health

Usage

Add a new issue using the "Add Issue" form.

Track the status of your issues in the Issue List.

Edit or update issues as required.

Delete issues that are resolved



### Contributing

Contributions are welcome! To contribute:

Fork the repository.

Create a new branch: git checkout -b feature-name

Make your changes and commit them: git commit -m "Add feature"

Push to the branch: git push origin feature-name

Open a Pull Request.

### License

This project is licensed under the MIT License. 
