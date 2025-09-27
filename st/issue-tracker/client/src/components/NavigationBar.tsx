import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, alpha, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { Assignment, Home } from '@mui/icons-material';
import LiveNotificationPanel from './LiveNotificationPanel';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  borderRadius: '12px',
  padding: '8px 16px',
  margin: '0 4px',
  transition: 'all 0.3s ease',
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  '&.active': {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
}));

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <Home sx={{ mr: 1, fontSize: 20 }} />,
    },
    {
      label: 'Issues',
      path: '/issues',
      icon: <Assignment sx={{ mr: 1, fontSize: 20 }} />,
    },
  ];

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            🚀 Issue Tracker Pro
          </Typography>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path === '/' && location.pathname === '/dashboard');
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavButton
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    className={isActive ? 'active' : ''}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #ff6b6b, #feca57)',
                          borderRadius: '1px',
                        }}
                      />
                    )}
                  </NavButton>
                </motion.div>
              );
            })}
            
            {/* Live Notification Panel */}
            <LiveNotificationPanel />
          </Box>
        </motion.div>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationBar;