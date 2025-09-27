import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  styled,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  BugReport,
  Assignment,
  TrendingUp,
  Speed,
  Timeline,
  NavigateNext,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { issueApi, Issue } from '../services/api';
import AnimatedLoader from './AnimatedLoader';
import LiveActivityFeed from './LiveActivityFeed';

// Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    background: 'rgba(255, 255, 255, 0.95)',
  },
}));

const StatCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'left 0.8s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const FloatingParticle = styled(motion.div)<{ size: number; delay: number }>(({ size, delay }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
  pointerEvents: 'none',
  zIndex: 0,
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '24px',
  padding: theme.spacing(6, 4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

interface DashboardStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  closedIssues: number;
  criticalIssues: number;
  recentIssues: Issue[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalIssues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    closedIssues: 0,
    criticalIssues: 0,
    recentIssues: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all issues to calculate stats
      const response = await issueApi.getIssues({
        page: 1,
        pageSize: 100, // Get more issues for better stats
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      let issues: Issue[] = [];
      
      if (response?.data) {
        if (Array.isArray(response.data.issues)) {
          issues = response.data.issues;
        } else if (Array.isArray(response.data)) {
          issues = response.data;
        }
      }
      
      // If no issues found, provide sample data
      if (!Array.isArray(issues) || issues.length === 0) {
        issues = [
          {
            _id: 'demo-1',
            title: 'Welcome to Issue Tracker Pro!',
            description: 'Get started by exploring the features',
            status: 'open' as const,
            priority: 'medium' as const,
            assignee: 'Demo User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: 'demo-2',
            title: 'Create your first project',
            description: 'Set up your project structure',
            status: 'in-progress' as const,
            priority: 'high' as const,
            assignee: 'Project Lead',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: 'demo-3',
            title: 'System setup completed',
            description: 'Initial configuration done',
            status: 'closed' as const,
            priority: 'low' as const,
            assignee: 'Admin',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            _id: 'demo-4',
            title: 'Critical bug fix needed',
            description: 'High priority issue requiring immediate attention',
            status: 'open' as const,
            priority: 'critical' as const,
            assignee: 'DevOps Team',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: 'demo-5',
            title: 'Feature enhancement request',
            description: 'User requested new dashboard features',
            status: 'in-progress' as const,
            priority: 'medium' as const,
            assignee: 'UI/UX Team',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ];
      }
      
      const dashboardStats: DashboardStats = {
        totalIssues: issues.length,
        openIssues: issues.filter(issue => issue.status === 'open').length,
        inProgressIssues: issues.filter(issue => issue.status === 'in-progress').length,
        closedIssues: issues.filter(issue => issue.status === 'closed').length,
        criticalIssues: issues.filter(issue => issue.priority === 'critical').length,
        recentIssues: issues.slice(0, 5), // Get 5 most recent issues
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Show sample data on error
      const sampleStats: DashboardStats = {
        totalIssues: 5,
        openIssues: 2,
        inProgressIssues: 2,
        closedIssues: 1,
        criticalIssues: 1,
        recentIssues: [
          {
            _id: 'error-sample-1',
            title: 'Connection Error - Demo Data Shown',
            description: 'Backend server unavailable. This is sample data.',
            status: 'open' as const,
            priority: 'critical' as const,
            assignee: 'System Admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: 'error-sample-2',
            title: 'Demo Issue - Explore Features',
            description: 'This is a sample issue to demonstrate the interface.',
            status: 'in-progress' as const,
            priority: 'medium' as const,
            assignee: 'Demo User',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
      setStats(sampleStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Issues',
      value: stats.totalIssues,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
    },
    {
      title: 'Open Issues',
      value: stats.openIssues,
      icon: <BugReport sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      bgColor: 'rgba(255, 107, 107, 0.1)',
    },
    {
      title: 'In Progress',
      value: stats.inProgressIssues,
      icon: <Speed sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #feca57, #ff9ff3)',
      bgColor: 'rgba(254, 202, 87, 0.1)',
    },
    {
      title: 'Resolved',
      value: stats.closedIssues,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #48dbfb, #0abde3)',
      bgColor: 'rgba(72, 219, 251, 0.1)',
    },
    {
      title: 'Critical Issues',
      value: stats.criticalIssues,
      icon: <Timeline sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #ff3838, #ff6b6b)',
      bgColor: 'rgba(255, 56, 56, 0.1)',
    },
  ];

  const quickActions = [
    {
      title: 'View All Issues',
      description: 'Browse and manage all issues',
      icon: <Assignment />,
      action: () => navigate('/issues'),
      color: '#667eea',
    },
    {
      title: 'Create Issue',
      description: 'Report a new issue',
      icon: <BugReport />,
      action: () => navigate('/issues'),
      color: '#ff6b6b',
    },
    {
      title: 'Dashboard Analytics',
      description: 'View detailed analytics',
      icon: <DashboardIcon />,
      action: () => navigate('/dashboard'),
      color: '#feca57',
    },
  ];

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Floating Particles Background */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle
            key={i}
            size={Math.random() * 20 + 10}
            delay={i * 0.2}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.3,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Hero Section */}
        <HeroSection>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 5, -5, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <DashboardIcon sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
            </motion.div>
            
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Welcome to Issue Tracker Pro
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(55, 65, 81, 0.8)',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 500,
              }}
            >
              Manage your projects efficiently with our advanced issue tracking system.
              Monitor progress, assign tasks, and keep your team synchronized.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Assignment />}
                  onClick={() => navigate('/issues')}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  }}
                >
                  View All Issues
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Refresh />}
                  onClick={fetchDashboardData}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: '#764ba2',
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    },
                  }}
                >
                  Refresh Data
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </HeroSection>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={card.title}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <StatCard
                  style={{ background: card.color }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      background: 'rgba(255, 255, 255, 0.2)',
                      mr: 2 
                    }}>
                      {card.icon}
                    </Box>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                        {card.value}
                      </Typography>
                    </motion.div>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {card.title}
                  </Typography>
                </StatCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🚀 Quick Actions
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={action.title}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <GlassCard 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={action.action}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)`,
                            color: action.color,
                            mr: 2,
                          }}
                        >
                          {action.icon}
                        </Box>
                        <NavigateNext sx={{ color: 'text.secondary' }} />
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {action.title}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {action.description}
                      </Typography>
                    </CardContent>
                  </motion.div>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Recent Issues */}
            {stats.recentIssues.length > 0 && (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  📋 Recent Issues
                </Typography>

                <GlassCard sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 0 }}>
                    {stats.recentIssues.map((issue, index) => (
                      <motion.div
                        key={issue._id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}
                        onClick={() => navigate(`/issues/${issue._id}`)}
                        style={{ 
                          padding: 16,
                          cursor: 'pointer',
                          borderBottom: index < stats.recentIssues.length - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {issue.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              #{issue._id.slice(-8)} • {issue.assignee || 'Unassigned'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={issue.status}
                              size="small"
                              color={
                                issue.status === 'open' ? 'error' :
                                issue.status === 'in-progress' ? 'warning' : 'success'
                              }
                            />
                            <Chip
                              label={issue.priority}
                              size="small"
                              variant="outlined"
                              color={
                                issue.priority === 'critical' ? 'error' :
                                issue.priority === 'high' ? 'warning' :
                                issue.priority === 'medium' ? 'info' : 'success'
                              }
                            />
                            <NavigateNext sx={{ color: 'text.secondary', ml: 1 }} />
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </CardContent>
                </GlassCard>
              </>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <LiveActivityFeed />
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Dashboard;