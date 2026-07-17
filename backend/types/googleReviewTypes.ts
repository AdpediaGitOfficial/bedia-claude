import { Document } from 'mongoose';

/**
 * MongoDB document interface
 */
export interface IGoogleReviewModel extends Document {
  placeId: string;
  reviewId: string;
  authorName: string;
  rating: number;
  text?: string;
  profilePhotoUrl?: string;
  reviewTime: number;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  media?: {
    videos?: string[];
    images?: string[];
  };
  source: 'google' | 'manual';
}

/**
 * Payload used internally (Google → Backend → DB)
 */
export interface IGoogleReviewBody {
  placeId: string;
  reviewId: string;
  authorName: string;
  rating: number;
  text?: string;
  profilePhotoUrl?: string;
  reviewTime: number;
  isActive?: boolean;
  media?: {
    videos?: string[];
    images?: string[];
  };
  source?: 'google' | 'manual';
}

/**
 * Query params for listing reviews
 */
export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
