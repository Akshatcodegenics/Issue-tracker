import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Chip,
  Paper,
  styled,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Close,
  Circle,
  CheckCircle,
  Clear,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveTracking } from '../contexts/LiveTrackingContext';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 400,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
  },
}));

const NotificationItem = styled(motion.div)(({ theme }) => ({
  margin: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const ConnectionIndicator = styled(Box)<{ connected: boolean }>(({ connected, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: connected ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
  borderRadius: theme.spacing(1),
  margin: theme.spacing(2),
}));

const LiveNotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, markNotificationRead, clearNotifications, getUnreadCount } = useLiveTracking();

  const unreadCount = getUnreadCount();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'warning': return <Circle sx={{ color: '#ff9800' }} />;
      case 'error': return <Circle sx={{ color: '#f44336' }} />;
      default: return <Circle sx={{ color: '#2196f3' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#2196f3';
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          onClick={handleToggle}
          color="inherit"
          sx={{
            position: 'relative',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                  '100%': { transform: 'scale(1)' },
                },
              },
            }}
          >
            {unreadCount > 0 ? (
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <NotificationsActive />
              </motion.div>
            ) : (
              <Notifications />
            )}
          </Badge>
        </IconButton>
      </motion.div>

      <StyledDrawer anchor="right" open={isOpen} onClose={handleClose}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                🔔 Live Updates
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={clearNotifications}>
                  <Clear />
                </IconButton>
                <IconButton size="small" onClick={handleClose}>
                  <Close />
                </IconButton>
              </Box>
            </Box>

            {/* Connection Status */}
            <ConnectionIndicator connected={state.isConnected}>
              <motion.div
                animate={{ scale: state.isConnected ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Circle 
                  sx={{ 
                    fontSize: 12, 
                    color: state.isConnected ? '#4caf50' : '#f44336' 
                  }} 
                />
              </motion.div>
              <Typography variant="body2">
                {state.isConnected ? 'Connected' : 'Disconnected'}
              </Typography>
              {state.isConnected && (
                <Chip
                  label={`${state.recentUpdates.length} updates`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: '20px' }}
                />
              )}
            </ConnectionIndicator>
          </Box>

          {/* Notifications List */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {state.notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Notifications sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                </motion.div>
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Live updates will appear here
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {state.notifications.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ListItem
                        sx={{
                          opacity: notification.read ? 0.7 : 1,
                          borderLeft: notification.read ? 'none' : `4px solid ${getNotificationColor(notification.type)}`,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatTimeAgo(notification.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                        {!notification.read && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Circle sx={{ fontSize: 8, color: '#2196f3' }} />
                          </motion.div>
                        )}
                      </ListItem>
                    </NotificationItem>
                  ))}
                </AnimatePresence>
              </List>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#764ba2',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                },
              }}
            >
              Refresh Connection
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default LiveNotificationPanel;