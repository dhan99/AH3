import useStore from '@/store/useStore';
import useSubmissionStore from '@/store/useSubmissionStore';
import useEligibilityStore from '@/store/useEligibilityStore';
import useLossHistoryStore from '@/store/useLossHistoryStore';

/**
 * Handles the sign-off process by resetting all Zustand stores
 * and clearing session state
 */
export const handleSignoff = () => {
  // Reset all Zustand stores to their initial values
  useStore.getState().setAuthenticated(false);
  useStore.getState().setUser(null);
  
  // Reset submission process stores
  useSubmissionStore.getState().reset();
  useEligibilityStore.getState().reset();
  useLossHistoryStore.getState().reset();
  
  // Navigate to landing page happens in the component
  // that calls this function
};
