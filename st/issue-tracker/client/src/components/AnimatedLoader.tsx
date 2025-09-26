import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedLoader: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 4,
        p: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '20px',
          height: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '15px',
          height: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
        }}
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Loading Animation */}
      <motion.div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h6"
          color="white"
          textAlign="center"
          sx={{
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            mb: 1,
          }}
        >
          Loading Issues...
        </Typography>
        <motion.div
          style={{
            width: '100px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, white, transparent)',
            margin: '0 auto',
          }}
          animate={{
            x: [-100, 100, -100],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Pulsing Ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 0,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </Box>
  );
};

export default AnimatedLoader;