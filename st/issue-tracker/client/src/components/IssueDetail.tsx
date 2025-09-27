import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { issueApi, Issue } from '../services/api';
import IssueForm from './IssueForm';

const STATUS_COLORS = {
  open: 'primary' as const,
  'in-progress': 'warning' as const,
  closed: 'success' as const,
};

const PRIORITY_COLORS = {
  low: 'default' as const,
  medium: 'primary' as const,
  high: 'warning' as const,
  critical: 'error' as const,
};

const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchIssue = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await issueApi.getIssue(id);
      setIssue(response.data);
    } catch (err: any) {
      setError('Failed to fetch issue: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]); // fetchIssue is stable

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditClose = () => {
    setShowEditForm(false);
  };

  const handleEditSuccess = () => {
    fetchIssue(); // Refresh the issue data
    setShowEditForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !issue) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Issues
        </Button>
        <Typography color="error" variant="h6">
          {error || 'Issue not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back to Issues
          </Button>
          <Typography variant="h4" component="h1">
            Issue Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEdit}
        >
          Edit Issue
        </Button>
      </Box>

      {/* Issue Content */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h5" gutterBottom>
              {issue.title}
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <Chip
                label={issue.status}
                color={STATUS_COLORS[issue.status]}
                size="medium"
              />
              <Chip
                label={issue.priority}
                color={PRIORITY_COLORS[issue.priority]}
                size="medium"
              />
            </Box>
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
              {issue.description}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* Metadata */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6" gutterBottom>
              Issue Information
            </Typography>
            <Box sx={{ '& > div': { mb: 1 } }}>
              <Box>
                <Typography variant="subtitle2" display="inline">
                  ID: 
                </Typography>
                <Typography variant="body2" display="inline" sx={{ ml: 1 }}>
                  {issue._id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" display="inline">
                  Assignee: 
                </Typography>
                <Typography variant="body2" display="inline" sx={{ ml: 1 }}>
                  {issue.assignee}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" display="inline">
                  Created: 
                </Typography>
                <Typography variant="body2" display="inline" sx={{ ml: 1 }}>
                  {formatDate(issue.createdAt)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" display="inline">
                  Last Updated: 
                </Typography>
                <Typography variant="body2" display="inline" sx={{ ml: 1 }}>
                  {formatDate(issue.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Raw JSON */}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Raw JSON Data
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                backgroundColor: '#f5f5f5',
                maxHeight: '400px',
                overflow: 'auto'
              }}
            >
              <pre style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
                {JSON.stringify(issue, null, 2)}
              </pre>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Form Dialog */}
      {showEditForm && (
        <IssueForm
          open={showEditForm}
          issue={issue}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
    </Box>
  );
};

export default IssueDetail;