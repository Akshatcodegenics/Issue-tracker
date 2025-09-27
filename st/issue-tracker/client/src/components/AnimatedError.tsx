import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Refresh as RefreshIcon, Error as ErrorIcon } from '@mui/icons-material';

interface AnimatedErrorProps {
  message: string;
  onRetry?: () => void;
}

const AnimatedError: React.FC<AnimatedErrorProps> = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
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
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                              radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Error Icon Animation */}
        <motion.div
          initial={{ rotate: 0, scale: 1 }}
          animate={{ 
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <ErrorIcon 
            sx={{ 
              fontSize: 60, 
              mb: 2, 
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }} 
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            {message}
          </Typography>

          {onRetry && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshIcon />
                  </motion.div>
                }
                onClick={onRetry}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </Paper>
    </motion.div>
  );
};

export default AnimatedError;