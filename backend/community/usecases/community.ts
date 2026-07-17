import mongoose from 'mongoose';
import { Community } from '../../types/communityTypes';
import { CommunityModel } from '../models/communityModelSchema';
import {
  communityRepository,
  fetchAllNewLaunchProjects,
  fetchNewLaunchProjectBySlug,
} from '../repos/communityRepository';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const createCommunityUseCase = async (data: Community): Promise<void> => {
  try {
    const community = new CommunityModel(data);
    await community.save();
  } catch (error: any) {
    console.error('Error creating community:', error.message);
    throw new Error(`Failed to create community: ${error.message}`);
  }
};

export const getAllCommunitiesUseCase = async (
  page = 1,
  limit = 6,
): Promise<{
  data: Partial<Community>[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> => {
  try {
    page = Number(page) || 1;
    limit = Number(limit) || 6;

    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    const total = await CommunityModel.countDocuments(filter);

    const communities = await CommunityModel.find(filter, {
      _id: 1,
      title: 1,
      shortTitle: 1,
      shortDescription: 1,
      developer: 1,
      bannerImage: 1,
      propertyImages: 1,
      bedrooms: 1,
      paymentPlan: 1,
      startingPrice: 1,
      slug: 1,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedData = communities.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return {
      data: formattedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error('Error fetching communities:', error.message);
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }
};

// export const getCommunityBySlugUseCase = async (slug: string): Promise<Community> => {
//   try {
//     const community = await CommunityModel.findOne({ slug }).lean().exec();

//     if (!community) {
//       throw new Error('Community not found');
//     }

//     // Convert _id to string
//     return {
//       ...community,
//       _id: (community as any)._id?.toString(),
//     } as Community;
//   } catch (error: any) {
//     console.error('Error fetching community by slug:', error.message);
//     throw new Error(`Failed to fetch community: ${error.message}`);
//   }
// };

// export const getCommunityBySlugUseCase = async (slug: string): Promise<Community> => {
//   try {
//     const community = await CommunityModel.findOne({ slug })
//       .lean<Community & { _id: mongoose.Types.ObjectId }>()
//       .exec();

//     if (!community) throw new Error('Community not found');

//     return community;
//   } catch (error: any) {
//     console.error('Error fetching community by slug:', error.message);
//     throw new Error(`Failed to fetch community: ${error.message}`);
//   }
// };

export const getCommunityBySlugUseCase = async (slug: string): Promise<Community> => {
  try {
    const community = await CommunityModel.findOne({ slug, isDeleted: false })
      .lean<Community & { _id: mongoose.Types.ObjectId }>()
      .exec();

    if (!community) throw new Error('Community not found');

    // Sort newLaunchProjects: latest first
    if (community.newLaunchProjects && community.newLaunchProjects.length > 0) {
      community.newLaunchProjects.sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : a._id
            ? new Date(a._id.toString()).getTime()
            : 0;

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : b._id
            ? new Date(b._id.toString()).getTime()
            : 0;

        return dateB - dateA; // newest first
      });
    }

    return community;
  } catch (error: any) {
    console.error('Error fetching community by slug:', error.message);
    throw new Error(`Failed to fetch community: ${error.message}`);
  }
};

// export const updateCommunityUseCase = async (
//   slug: string,
//   data: Partial<Community>,
// ): Promise<Community> => {
//   try {
//     const updatedCommunity = await CommunityModel.findOneAndUpdate(
//       { slug }, // 🔹 find by slug instead of id
//       { $set: data },
//       { new: true, lean: true }, // return the updated document
//     ).exec();

//     if (!updatedCommunity) {
//       throw new Error('Community not found');
//     }

//     return {
//       ...updatedCommunity,
//     } as Community;
//   } catch (error: any) {
//     console.error('Error updating community:', error.message);
//     throw new Error(`Failed to update community: ${error.message}`);
//   }
// };

export const updateCommunityUseCase = async (
  slug: string,
  data: Partial<Community>,
): Promise<Community> => {
  try {
    const updatedCommunity = await CommunityModel.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true, lean: true },
    ).exec();

    if (!updatedCommunity) {
      throw new Error('Community not found');
    }

    return updatedCommunity as unknown as Community;
  } catch (error: any) {
    console.error('Error updating community:', error.message);
    throw new Error(`Failed to update community: ${error.message}`);
  }
};

export const deleteCommunityUseCase = async (slug: string): Promise<void> => {
  try {
    // Find the community by slug and update isDeleted to true
    const updated = await CommunityModel.findOneAndUpdate(
      { slug },
      { isDeleted: true },
      { new: true },
    ).exec();

    if (!updated) {
      throw new Error('Community not found');
    }

    // console.log(`🗑️ Community with slug '${slug}' soft deleted successfully`);
  } catch (error: any) {
    console.error('Error soft deleting community:', error.message);
    throw new Error(`Failed to soft delete community: ${error.message}`);
  }
};

export const getCommunitiesCountUseCase = async (): Promise<number> => {
  try {
    const filter = { isDeleted: false };
    const total = await CommunityModel.countDocuments(filter);
    return total;
  } catch (error: any) {
    console.error('Error counting communities:', error.message);
    throw new Error(`Failed to count communities: ${error.message}`);
  }
};

export const addNewLaunchProjectUseCase = async (communityId: string, projectData: any) => {
  try {
    const updatedCommunity = await communityRepository.addNewLaunchProject(
      communityId,
      projectData,
    );
    return updatedCommunity;
  } catch (error: any) {
    console.error('Error adding new launch project:', error.message);
    throw new Error(`Failed to add new launch project: ${error.message}`);
  }
};

export const getAllNewLaunchProjectsUseCase = async (queryParams: any): Promise<any> => {
  const { page = '1', search, sortBy, order = 'desc' } = queryParams;
  const { limit = '10' } = queryParams;

  const sortCriteria: Record<string, 1 | -1> = {};
  sortCriteria[sortBy || 'updatedAt'] = order === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const { totalCount, projects } = await fetchAllNewLaunchProjects(
    search,
    skip,
    parseInt(limit),
    sortCriteria,
  );

  return {
    totalCount,
    newLaunchProjects: projects,
  };
};

export const getNewLaunchProjectBySlugUseCase = async (communitySlug: string, slug: string) => {
  const project = await fetchNewLaunchProjectBySlug({ communitySlug, slug });

  if (!project) {
    throw new AppError('No New Launch Project Found', HttpStatus.NOT_FOUND);
  }

  return project;
};

export const updateNewLaunchProjectUseCase = async (
  communityId: string,
  projectSlug: string,
  updateData: any,
) => {
  try {
    const updatedProject = await communityRepository.updateNewLaunchProject(
      communityId,
      projectSlug,
      updateData,
    );

    return updatedProject;
  } catch (error: any) {
    console.error('Error updating launch project:', error.message);
    throw new Error(`Failed to update launch project: ${error.message}`);
  }
};
