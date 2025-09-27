import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Chip,
  Typography,
  Grid,
  IconButton,
  TableSortLabel,
  styled,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { issueApi, Issue, IssueFilters } from '../services/api';
import IssueForm from './IssueForm';
import AnimatedLoader from './AnimatedLoader';
import AnimatedError from './AnimatedError';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Components
const GradientPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
}));

const AnimatedTableRow = styled(motion.create(TableRow))(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    transform: 'scale(1.01)',
  },
}));

const EmojiContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  pointerEvents: 'none',
  zIndex: 9999,
}));

const STATUS_COLORS = {
  open: 'info' as const,
  'in-progress': 'warning' as const,
  closed: 'success' as const,
};

const PRIORITY_COLORS = {
  low: 'success' as const,
  medium: 'info' as const,
  high: 'warning' as const,
  critical: 'error' as const,
};

// Emoji arrays for celebrations
const START_EMOJIS = ['🚀', '⭐', '💫', '✨', '🌟', '💥', '🎯', '🔥'];
const FINISH_EMOJIS = ['🎉', '🎊', '🥳', '🏆', '👏', '💯', '✅', '🙌'];

interface CelebrationEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  delay: number;
}

const IssuesList: React.FC = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [celebrationEmojis, setCelebrationEmojis] = useState<CelebrationEmoji[]>([]);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [filters, setFilters] = useState<IssueFilters>({
    search: '',
    status: '',
    priority: '',
    assignee: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  // Celebration functions
  const triggerCelebration = useCallback((type: 'start' | 'finish') => {
    const emojis = type === 'start' ? START_EMOJIS : FINISH_EMOJIS;
    const newEmojis: CelebrationEmoji[] = [];
    
    for (let i = 0; i < 8; i++) {
      newEmojis.push({
        id: `${Date.now()}-${i}`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: i * 0.1,
      });
    }
    
    setCelebrationEmojis(prev => [...prev, ...newEmojis]);
    
    // Remove emojis after animation
    setTimeout(() => {
      setCelebrationEmojis(prev => 
        prev.filter(emoji => !newEmojis.some(newEmoji => newEmoji.id === emoji.id))
      );
    }, 3000);
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await issueApi.getIssues({
        ...filters,
        page: page + 1, // API uses 1-based pagination
        pageSize: rowsPerPage,
      });
      
      const newIssues = response.data.issues;
      
      // Check for status changes to trigger celebrations
      if (issues.length > 0) {
        newIssues.forEach(newIssue => {
          const oldIssue = issues.find(issue => issue._id === newIssue._id);
          if (oldIssue) {
            // Issue started (open -> in-progress)
            if (oldIssue.status === 'open' && newIssue.status === 'in-progress') {
              triggerCelebration('start');
            }
            // Issue finished (in-progress -> closed)
            if (oldIssue.status === 'in-progress' && newIssue.status === 'closed') {
              triggerCelebration('finish');
            }
          }
        });
      }
      
      setIssues(newIssues);
      setTotalCount(response.data.pagination.total);
    } catch (err: any) {
      setError('Failed to fetch issues: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async () => {
    try {
      const response = await issueApi.getAssignees();
      setAssignees(response.data);
    } catch (err) {
      console.error('Failed to fetch assignees:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchIssues();
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchAssignees();
  }, []);

  const handleFilterChange = (field: keyof IssueFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const handleSort = (sortBy: string) => {
    const isAsc = filters.sortBy === sortBy && filters.sortOrder === 'asc';
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: isAsc ? 'desc' : 'asc',
    }));
  };

  const handleRowClick = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  const handleCreateIssue = () => {
    setEditingIssue(null);
    setShowForm(true);
  };

  const handleEditIssue = (e: React.MouseEvent, issue: Issue) => {
    e.stopPropagation(); // Prevent row click
    setEditingIssue(issue);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingIssue(null);
  };

  const handleFormSuccess = () => {
    // If creating a new issue (not editing), trigger start celebration
    if (!editingIssue) {
      triggerCelebration('start');
    }
    fetchIssues();
    handleFormClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (error) {
    return (
      <AnimatedError 
        message={error} 
        onRetry={() => {
          setError(null);
          fetchIssues();
        }} 
      />
    );
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          📝 Issues Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateIssue}
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 10px 4px rgba(102, 126, 234, .3)',
            }
          }}
        >
          ✨ Create Issue
        </Button>
      </Box>

      {/* Filters */}
      <GradientPaper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Search by title"
              variant="outlined"
              size="small"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority || ''}
                label="Priority"
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Assignee</InputLabel>
              <Select
                value={filters.assignee || ''}
                label="Assignee"
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Unassigned">Unassigned</MenuItem>
                {assignees.map((assignee) => (
                  <MenuItem key={assignee} value={assignee}>
                    {assignee}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </GradientPaper>

      {/* Issues Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
        }}
      >
        <Table>
          <TableHead sx={{ background: 'linear-gradient(45deg, #f8f9ff 30%, #e8f2ff 90%)' }}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === '_id'}
                  direction={filters.sortBy === '_id' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('_id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'title'}
                  direction={filters.sortBy === 'title' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'assignee'}
                  direction={filters.sortBy === 'assignee' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('assignee')}
                >
                  Assignee
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'updatedAt'}
                  direction={filters.sortBy === 'updatedAt' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('updatedAt')}
                >
                  Updated At
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
                  <AnimatedLoader />
                </TableCell>
              </TableRow>
            ) : issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No issues found
                </TableCell>
              </TableRow>
            ) : (
              issues.map((issue, index) => (
                <AnimatedTableRow
                  key={issue._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                  }}
                  onClick={() => handleRowClick(issue._id)}
                >
                  <TableCell>{issue._id.slice(-8)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap title={issue.title}>
                      {issue.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={issue.status}
                      color={STATUS_COLORS[issue.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={issue.priority}
                      color={PRIORITY_COLORS[issue.priority]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{issue.assignee}</TableCell>
                  <TableCell>{formatDate(issue.updatedAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditIssue(e, issue)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </AnimatedTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Issue Form Dialog */}
      {showForm && (
        <IssueForm
          open={showForm}
          issue={editingIssue}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </Box>
    </motion.div>
    
    {/* Emoji Celebration Overlay */}
    <EmojiContainer>
      <AnimatePresence>
        {celebrationEmojis.map(emoji => (
          <motion.div
            key={emoji.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: emoji.x,
              y: emoji.y,
              rotate: 0
            }}
            animate={{ 
              opacity: 1, 
              scale: [0, 1.5, 1],
              y: emoji.y - 100,
              rotate: 360
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              y: emoji.y - 200
            }}
            transition={{
              duration: 2,
              delay: emoji.delay,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              fontSize: '2rem',
              userSelect: 'none'
            }}
          >
            {emoji.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </EmojiContainer>
    </>
  );
};

export default IssuesList;