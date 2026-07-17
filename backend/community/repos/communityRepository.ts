import { CommunityModel } from '../models/communityModelSchema';

export const communityRepository = {
  addNewLaunchProject: async (communityId: string, projectData: any) => {
    const community = await CommunityModel.findById(communityId);
    if (!community) throw new Error('Community not found');

    community.newLaunchProjects.push(projectData);
    await community.save({ validateModifiedOnly: true });

    return community;
  },
  async updateNewLaunchProject(communityId: string, projectSlug: string, updateData: any) {
    const community = await CommunityModel.findById(communityId);
    if (!community) throw new Error('Community not found');

    const project = community.newLaunchProjects.find((p: any) => p.slug === projectSlug);

    if (!project) throw new Error('Project not found');

    Object.assign(project, updateData);

    await community.save({ validateModifiedOnly: true });

    return project;
  },
};

export const fetchAllNewLaunchProjects = async (
  search: string | undefined,
  skip: number,
  limit: number,
  sortCriteria: any,
): Promise<{ totalCount: number; projects: any[] }> => {
  const match: any = { isDeleted: false };

  if (search && search.length > 0) {
    match['newLaunchProjects.heading'] = { $regex: search, $options: 'i' };
  }

  const pipeline: any[] = [{ $match: match }, { $unwind: '$newLaunchProjects' }];

  if (search && search.length > 0) {
    pipeline.push({
      $match: {
        'newLaunchProjects.heading': { $regex: search, $options: 'i' },
      },
    });
  }

  const totalCountResult = await CommunityModel.aggregate([...pipeline, { $count: 'count' }]);

  const totalCount = totalCountResult?.[0]?.count || 0;

  if (!totalCount) return { totalCount: 0, projects: [] };

  pipeline.push(
    {
      $sort: {
        [`newLaunchProjects.${Object.keys(sortCriteria)[0]}`]: Object.values(sortCriteria)[0],
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        slug: '$newLaunchProjects.slug',
        image: '$newLaunchProjects.image',
        bannerImage: '$newLaunchProjects.bannerImage',
        heading: '$newLaunchProjects.heading',
        description: '$newLaunchProjects.description',
        price: '$newLaunchProjects.price',
        bedrooms: '$newLaunchProjects.bedrooms',
        shortTitle: '$newLaunchProjects.shortTitle',
        brochure: '$newLaunchProjects.brochure',
        paymentPlan: '$newLaunchProjects.paymentPlan',
        highlightTitle: '$newLaunchProjects.highlightTitle',
        highlightDescription: '$newLaunchProjects.highlightDescription',
      },
    },
  );

  const projects = await CommunityModel.aggregate(pipeline);

  return { totalCount, projects };
};

export const fetchNewLaunchProjectBySlug = async (query: {
  communitySlug: string;
  slug: string;
}) => {
  const community = await CommunityModel.findOne({
    slug: query.communitySlug,
    isDeleted: false,
    'newLaunchProjects.slug': query.slug,
  })
    .select({
      newLaunchProjects: 1,
      title: 1,
      shortTitle: 1,
      slug: 1,
      _id: 0,
      timeBasedLocations: 1,
    })
    .lean<{
      title: string;
      shortTitle: string;
      slug: string;
      newLaunchProjects: any[];
      timeBasedLocations: any[];
    }>();

  if (!community) return null;

  const project = community.newLaunchProjects.find((p: any) => p.slug === query.slug);

  if (!project) return null;

  return {
    ...project,
    community: {
      title: community.title,
      shortTitle: community.shortTitle,
      slug: community.slug,
      timeBasedLocations: community.timeBasedLocations,
    },
  };
};
