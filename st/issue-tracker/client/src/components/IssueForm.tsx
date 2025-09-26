import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { issueApi, Issue, CreateIssueData, UpdateIssueData } from '../services/api';

interface IssueFormProps {
  open: boolean;
  issue?: Issue | null;
  onClose: () => void;
  onSuccess: () => void;
}

const IssueForm: React.FC<IssueFormProps> = ({
  open,
  issue,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignees, setAssignees] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignee: 'Unassigned',
  });

  const isEditing = !!issue;

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        assignee: issue.assignee,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium',
        assignee: 'Unassigned',
      });
    }
    setError(null);
  }, [issue, open]);

  useEffect(() => {
    if (open) {
      fetchAssignees();
    }
  }, [open]);

  const fetchAssignees = async () => {
    try {
      const response = await issueApi.getAssignees();
      setAssignees(response.data);
    } catch (err) {
      console.error('Failed to fetch assignees:', err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing && issue) {
        const updateData: UpdateIssueData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: formData.status,
          priority: formData.priority,
          assignee: formData.assignee,
        };
        await issueApi.updateIssue(issue._id, updateData);
      } else {
        const createData: CreateIssueData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: formData.status,
          priority: formData.priority,
          assignee: formData.assignee,
        };
        await issueApi.createIssue(createData);
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? 'Edit Issue' : 'Create New Issue'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              required
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
            />
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={loading}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => handleChange('priority', e.target.value)}
                disabled={loading}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={formData.assignee}
                label="Assignee"
                onChange={(e) => handleChange('assignee', e.target.value)}
                disabled={loading}
              >
                <MenuItem value="Unassigned">Unassigned</MenuItem>
                {assignees.map((assignee) => (
                  <MenuItem key={assignee} value={assignee}>
                    {assignee}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Issue' : 'Create Issue'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IssueForm;