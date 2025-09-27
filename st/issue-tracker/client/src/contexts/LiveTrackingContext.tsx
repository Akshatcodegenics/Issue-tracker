import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Issue } from '../services/api';

// Types
interface LiveUpdate {
  id: string;
  type: 'issue-created' | 'issue-updated' | 'issue-deleted' | 'status-changed' | 'priority-changed';
  issue: Issue;
  timestamp: string;
  changes?: {
    field: string;
    from: any;
    to: any;
  }[];
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  issueId?: string;
}

interface LiveTrackingState {
  isConnected: boolean;
  recentUpdates: LiveUpdate[];
  notifications: Notification[];
  activeIssues: Set<string>;
  connectionAttempts: number;
}

// Actions
type LiveTrackingAction =
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'ADD_UPDATE'; payload: LiveUpdate }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'ADD_ACTIVE_ISSUE'; payload: string }
  | { type: 'REMOVE_ACTIVE_ISSUE'; payload: string }
  | { type: 'INCREMENT_CONNECTION_ATTEMPTS' }
  | { type: 'RESET_CONNECTION_ATTEMPTS' };

// Initial State
const initialState: LiveTrackingState = {
  isConnected: false,
  recentUpdates: [],
  notifications: [],
  activeIssues: new Set(),
  connectionAttempts: 0,
};

// Reducer
function liveTrackingReducer(state: LiveTrackingState, action: LiveTrackingAction): LiveTrackingState {
  switch (action.type) {
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    
    case 'ADD_UPDATE':
      return {
        ...state,
        recentUpdates: [action.payload, ...state.recentUpdates].slice(0, 50) // Keep last 50 updates
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 100) // Keep last 100 notifications
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => 
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    
    case 'ADD_ACTIVE_ISSUE':
      return {
        ...state,
        activeIssues: new Set([...state.activeIssues, action.payload])
      };
    
    case 'REMOVE_ACTIVE_ISSUE':
      const newActiveIssues = new Set(state.activeIssues);
      newActiveIssues.delete(action.payload);
      return {
        ...state,
        activeIssues: newActiveIssues
      };
    
    case 'INCREMENT_CONNECTION_ATTEMPTS':
      return {
        ...state,
        connectionAttempts: state.connectionAttempts + 1
      };
    
    case 'RESET_CONNECTION_ATTEMPTS':
      return {
        ...state,
        connectionAttempts: 0
      };
    
    default:
      return state;
  }
}

// Context
interface LiveTrackingContextType {
  state: LiveTrackingState;
  dispatch: React.Dispatch<LiveTrackingAction>;
  trackIssue: (issueId: string) => void;
  untrackIssue: (issueId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
}

const LiveTrackingContext = createContext<LiveTrackingContextType | undefined>(undefined);

// Provider
interface LiveTrackingProviderProps {
  children: ReactNode;
}

export const LiveTrackingProvider: React.FC<LiveTrackingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(liveTrackingReducer, initialState);

  // Helper functions
  const trackIssue = (issueId: string) => {
    dispatch({ type: 'ADD_ACTIVE_ISSUE', payload: issueId });
  };

  const untrackIssue = (issueId: string) => {
    dispatch({ type: 'REMOVE_ACTIVE_ISSUE', payload: issueId });
  };

  const markNotificationRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const getUnreadCount = () => {
    return state.notifications.filter(n => !n.read).length;
  };

  // Simulate live updates for demo purposes (replace with real WebSocket/SSE connection)
  useEffect(() => {
    const simulateLiveUpdates = () => {
      const sampleUpdates: Omit<LiveUpdate, 'id' | 'timestamp'>[] = [
        {
          type: 'status-changed',
          issue: {
            _id: 'sample-1',
            title: 'Welcome to Issue Tracker Pro!',
            description: 'This is a sample issue to get you started.',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'Demo User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          changes: [{ field: 'status', from: 'open', to: 'in-progress' }]
        },
        {
          type: 'issue-created',
          issue: {
            _id: 'new-issue-' + Date.now(),
            title: 'New Issue Created',
            description: 'A new issue has been created in the system.',
            status: 'open',
            priority: 'high',
            assignee: 'Team Lead',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        },
        {
          type: 'priority-changed',
          issue: {
            _id: 'sample-2',
            title: 'Set up your first real project',
            description: 'Create your first issue by clicking the Create Issue button.',
            status: 'in-progress',
            priority: 'critical',
            assignee: 'Project Manager',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          changes: [{ field: 'priority', from: 'high', to: 'critical' }]
        }
      ];

      const randomUpdate = sampleUpdates[Math.floor(Math.random() * sampleUpdates.length)];
      const liveUpdate: LiveUpdate = {
        ...randomUpdate,
        id: `update-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_UPDATE', payload: liveUpdate });

      // Create notification
      const notification: Notification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        type: liveUpdate.type === 'issue-created' ? 'success' : 
              liveUpdate.type === 'status-changed' ? 'info' :
              liveUpdate.type === 'priority-changed' ? 'warning' : 'info',
        title: getNotificationTitle(liveUpdate.type),
        message: getNotificationMessage(liveUpdate),
        timestamp: new Date().toISOString(),
        read: false,
        issueId: liveUpdate.issue._id,
      };

      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    };

    // Simulate connection
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
    
    // Simulate periodic updates
    const interval = setInterval(simulateLiveUpdates, 15000); // Every 15 seconds

    return () => {
      clearInterval(interval);
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
    };
  }, []);

  const getNotificationTitle = (type: LiveUpdate['type']): string => {
    switch (type) {
      case 'issue-created': return '🆕 New Issue Created';
      case 'issue-updated': return '📝 Issue Updated';
      case 'status-changed': return '🔄 Status Changed';
      case 'priority-changed': return '⚡ Priority Changed';
      case 'issue-deleted': return '🗑️ Issue Deleted';
      default: return '📢 Issue Activity';
    }
  };

  const getNotificationMessage = (update: LiveUpdate): string => {
    switch (update.type) {
      case 'issue-created':
        return `"${update.issue.title}" has been created`;
      case 'status-changed':
        const statusChange = update.changes?.find(c => c.field === 'status');
        return `"${update.issue.title}" status changed from ${statusChange?.from} to ${statusChange?.to}`;
      case 'priority-changed':
        const priorityChange = update.changes?.find(c => c.field === 'priority');
        return `"${update.issue.title}" priority changed from ${priorityChange?.from} to ${priorityChange?.to}`;
      default:
        return `"${update.issue.title}" has been updated`;
    }
  };

  const value: LiveTrackingContextType = {
    state,
    dispatch,
    trackIssue,
    untrackIssue,
    markNotificationRead,
    clearNotifications,
    getUnreadCount,
  };

  return (
    <LiveTrackingContext.Provider value={value}>
      {children}
    </LiveTrackingContext.Provider>
  );
};

// Hook
export const useLiveTracking = (): LiveTrackingContextType => {
  const context = useContext(LiveTrackingContext);
  if (!context) {
    throw new Error('useLiveTracking must be used within a LiveTrackingProvider');
  }
  return context;
};

export default LiveTrackingContext;