import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createCommunityUseCase,
  deleteCommunityUseCase,
  getAllCommunitiesUseCase,
  getCommunitiesCountUseCase,
  getCommunityBySlugUseCase,
  updateCommunityUseCase,
  addNewLaunchProjectUseCase,
  getAllNewLaunchProjectsUseCase,
  getNewLaunchProjectBySlugUseCase,
  updateNewLaunchProjectUseCase,
} from '../usecases/community';
import { Community } from '../../types/communityTypes';

// Create Community Controller
export const createCommunity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as Community;
  await createCommunityUseCase(data);

  res.status(200).json({
    success: true,
    message: 'Community created successfully',
    result: true,
  });
});

export const getAllCommunities = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 6 } = req.query;

    const communities = await getAllCommunitiesUseCase(Number(page), Number(limit));

    res.status(200).json({
      success: true,
      message: 'Communities fetched successfully',
      data: communities,
    });
  },
);

export const getCommunityBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const community = await getCommunityBySlugUseCase(slug);
    res.status(200).json({
      success: true,
      data: community,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Community not found',
    });
  }
});

export const updateCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCommunity = await updateCommunityUseCase(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Community updated successfully',
      data: updatedCommunity,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update community',
    });
  }
});

export const deleteCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteCommunityUseCase(id);

    res.status(200).json({
      success: true,
      message: 'Community deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete community',
    });
  }
});

export const getCommunitiesCountController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const count = await getCommunitiesCountUseCase();

    res.status(200).json({
      success: true,
      message: 'Community count fetched successfully',
      count: count,
    });
  },
);

export const addNewLaunchProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { communityId } = req.params;
    const projectData = req.body;

    const updatedCommunity = await addNewLaunchProjectUseCase(communityId, projectData);

    res.status(200).json({
      success: true,
      message: 'New Launch Project added successfully',
      community: updatedCommunity,
    });
  },
);

export const getAllCommunityProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await getAllNewLaunchProjectsUseCase(req.query);

    res.status(200).json({
      success: true,
      message: 'Fetched all New Launch Projects successfully',
      result,
    });
  },
);

export const getCommunityProjectBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { communitySlug, slug } = req.params;

    const project = await getNewLaunchProjectBySlugUseCase(communitySlug, slug);

    res.status(200).json({
      success: true,
      message: 'Fetched New Launch Project successfully',
      result: project,
    });
  },
);

export const updateNewLaunchProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { communityId, projectSlug } = req.params;
    const updateData = req.body;

    const updatedProject = await updateNewLaunchProjectUseCase(
      communityId,
      projectSlug,
      updateData,
    );

    res.status(200).json({
      success: true,
      message: 'Community Project updated successfully',
      result: updatedProject,
    });
  },
);
