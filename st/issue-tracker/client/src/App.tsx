import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import IssuesList from './components/IssuesList';
import IssueDetail from './components/IssueDetail';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          {/* Main App Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <AppBar 
              position="static" 
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Toolbar>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1,
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '0.5px',
                  }}
                >
                  🚀 Issue Tracker Pro
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Container 
              maxWidth="lg" 
              sx={{ 
                mt: 4, 
                mb: 4,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Routes>
                <Route path="/" element={<IssuesList />} />
                <Route path="/issues/:id" element={<IssueDetail />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
