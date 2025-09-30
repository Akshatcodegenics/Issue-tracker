import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import IssuesList from './components/IssuesList';
import IssueDetail from './components/IssueDetail';
import Dashboard from './components/Dashboard';
import Watermark3D from './components/Watermark3D';
import WatermarkImages from './components/WatermarkImages';
import PageTransition from './components/PageTransition';
import NavigationBar from './components/NavigationBar';
import { LiveTrackingProvider } from './contexts/LiveTrackingContext';
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
    <LiveTrackingProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          {/* Watermark Backgrounds */}
          <Watermark3D />
          <WatermarkImages />
          
          {/* Main App Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <NavigationBar />
            
            <Container 
              maxWidth="lg" 
              sx={{ 
                mt: 4, 
                mb: 4,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/issues" element={<IssuesList />} />
                  <Route path="/issues/:id" element={<IssueDetail />} />
                </Routes>
              </PageTransition>
            </Container>
          </Box>
        </Box>
        </Router>
      </ThemeProvider>
    </LiveTrackingProvider>
  );
}

export default App;
