import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Assignment, Add, Refresh } from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Issues Found",
  description = "Get started by creating your first issue or refresh to load existing ones.",
  actionText = "Create Issue",
  onAction,
  showRefresh = true,
  onRefresh,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Pattern */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 1px, transparent 1px),
                              radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            zIndex: 0,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Animated Icon */}
          <motion.div
            animate={{ 
              rotateY: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Assignment 
              sx={{ 
                fontSize: 80, 
                color: '#667eea', 
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2))'
              }} 
            />
          </motion.div>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(55, 65, 81, 0.7)',
              mb: 4,
              maxWidth: 400,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {onAction && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={onAction}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    },
                  }}
                >
                  {actionText}
                </Button>
              </motion.div>
            )}

            {showRefresh && onRefresh && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Refresh />
                    </motion.div>
                  }
                  onClick={onRefresh}
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
                  Refresh
                </Button>
              </motion.div>
            )}
          </Box>

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '50%',
                top: `${20 + i * 12}%`,
                left: `${15 + i * 12}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default EmptyState;