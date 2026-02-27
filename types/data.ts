/**
 * Premium content data structure
 * Represents a workout or training video available to premium members
 */
export interface PremiumContent {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

/**
 * Upgrade request data structure
 * Tracks user requests to upgrade from member to premium role
 */
export interface UpgradeRequest {
  userId: string;
  email: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}
