import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  styled,
} from '@mui/material';
import {
  BugReport,
  Update,
  CheckCircle,
  PriorityHigh,
  Person,
  Schedule,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveTracking } from '../contexts/LiveTrackingContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const ActivityItem = styled(motion.div)(({ theme }) => ({
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const LiveActivityFeed: React.FC = () => {
  const { state } = useLiveTracking();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'issue-created': return <BugReport sx={{ color: '#4caf50' }} />;
      case 'issue-updated': return <Update sx={{ color: '#2196f3' }} />;
      case 'status-changed': return <CheckCircle sx={{ color: '#ff9800' }} />;
      case 'priority-changed': return <PriorityHigh sx={{ color: '#f44336' }} />;
      default: return <Person sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'issue-created': return '#4caf50';
      case 'issue-updated': return '#2196f3';
      case 'status-changed': return '#ff9800';
      case 'priority-changed': return '#f44336';
      default: return '#9e9e9e';
    }
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

  const getActivityDescription = (update: any) => {
    switch (update.type) {
      case 'issue-created':
        return `New issue created: "${update.issue.title}"`;
      case 'status-changed':
        const statusChange = update.changes?.find((c: any) => c.field === 'status');
        return `Status changed from ${statusChange?.from} to ${statusChange?.to}`;
      case 'priority-changed':
        const priorityChange = update.changes?.find((c: any) => c.field === 'priority');
        return `Priority changed from ${priorityChange?.from} to ${priorityChange?.to}`;
      default:
        return `Issue updated: "${update.issue.title}"`;
    }
  };

  return (
    <StyledPaper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div
            animate={{ 
              rotate: state.isConnected ? [0, 360] : 0,
            }}
            transition={{ 
              duration: 2, 
              repeat: state.isConnected ? Infinity : 0, 
              ease: "linear" 
            }}
          >
            <Schedule sx={{ color: '#667eea' }} />
          </motion.div>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🔄 Live Activity Feed
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Chip 
            label={state.isConnected ? 'Live' : 'Offline'} 
            color={state.isConnected ? 'success' : 'error'}
            size="small"
            sx={{
              animation: state.isConnected ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {state.recentUpdates.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <Schedule sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            </motion.div>
            <Typography variant="body2" color="text.secondary">
              Waiting for activity...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time updates will appear here
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {state.recentUpdates.slice(0, 10).map((update, index) => (
                <ActivityItem
                  key={update.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    scale: 1.01
                  }}
                >
                  <ListItem sx={{ px: 3, py: 2 }}>
                    <ListItemAvatar>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          delay: index * 0.1,
                          ease: "easeInOut"
                        }}
                      >
                        <Avatar
                          sx={{
                            background: `linear-gradient(135deg, ${getActivityColor(update.type)}20, ${getActivityColor(update.type)}10)`,
                            color: getActivityColor(update.type),
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getActivityIcon(update.type)}
                        </Avatar>
                      </motion.div>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {update.issue.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {getActivityDescription(update)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={update.issue.status}
                              size="small"
                              color={
                                update.issue.status === 'open' ? 'error' :
                                update.issue.status === 'in-progress' ? 'warning' : 'success'
                              }
                              sx={{ height: '20px', fontSize: '0.7rem' }}
                            />
                            <Chip
                              label={update.issue.priority}
                              size="small"
                              variant="outlined"
                              color={
                                update.issue.priority === 'critical' ? 'error' :
                                update.issue.priority === 'high' ? 'warning' :
                                update.issue.priority === 'medium' ? 'info' : 'success'
                              }
                              sx={{ height: '20px', fontSize: '0.7rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(update.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                </ActivityItem>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {state.recentUpdates.length > 0 
            ? `Showing ${Math.min(state.recentUpdates.length, 10)} of ${state.recentUpdates.length} updates`
            : 'No recent activity'
          }
        </Typography>
      </Box>
    </StyledPaper>
  );
};

export default LiveActivityFeed;