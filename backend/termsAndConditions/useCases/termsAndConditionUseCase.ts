import {
  bulkInsertTermsAndConditions,
  createTermsAndCondition,
  deleteTermsAndConditionById,
  fetchAllTermsAndConditions,
  fetchAllTermsAndConditionsForAdmin,
  fetchTermsAndConditionById,
  fetchTermsAndConditionBySlug,
  fetchTermsAndConditionMetaBySlug,
  getTermsAndConditionsCount,
  updateTermsAndConditionById,
} from '../repos/termsAndConditionRepo';
import {
  ITermsAndConditionBody,
  ITermsAndConditionModel,
  IGetAllQuery,
} from '../../types/termsAndConditionTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import xml2js from 'xml2js';
import logger from '../../config/logger';

export const getAllTermsAndConditionsUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getTermsAndConditionsCount(query);

  if (!totalCount) return { totalCount: 0, termsAndConditions: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const termsAndConditions = await fetchAllTermsAndConditions(query, skip, parseInt(limit));
  return { totalCount, termsAndConditions };
};

export const getAllTermsAndConditionsForAdminUseCase = async (
  queryParams: IGetAllQuery,
): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getTermsAndConditionsCount(query);

  if (!totalCount) return { totalCount: 0, termsAndConditions: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const termsAndConditions = await fetchAllTermsAndConditionsForAdmin(query, skip, parseInt(limit));
  return { totalCount, termsAndConditions };
};

export const createTermsAndConditionUseCase = async (
  data: ITermsAndConditionBody,
): Promise<boolean> => {
  // check for  unique value duplications

  const termsAndCondition = await createTermsAndCondition(data);
  if (!termsAndCondition) {
    throw new AppError('Couldn\'t Create new TermsAndCondition. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const fetchTermsAndConditionFromXmlUseCase = async (
  files: Express.Multer.File[],
): Promise<boolean> => {
  for (const file of files) {
    if (!file.buffer) {
      logger.error('File buffer is undefined');
      throw new AppError('File buffer is undefined', HttpStatus.BAD_REQUEST);
    }
    logger.info('Processing  xml file');
    try {
      // Read the uploaded XML file from the buffer
      const xmlData = file.buffer.toString('utf8');

      // Parse the XML data
      xml2js.parseString(xmlData, async (parseErr, result) => {
        if (parseErr) {
          console.error('Error parsing XML:', parseErr);
          throw new AppError('Invalid XML format', HttpStatus.BAD_REQUEST);
        }

        // XML successfully parsed to JavaScript object
        // response = result.rss.channel[0].item[4];

        const termsAndConditionData = result.rss.channel[0].item;
        const newTermsAndConditions: ITermsAndConditionBody[] = termsAndConditionData
          .map((item: any) => {
            const categoryString =
              item.category && item.category.map((category: any) => category['_']).join(', ');

            const metaDescriptionExist = item['wp:postmeta'].filter(
              (meta: any) => meta['wp:meta_key'][0] === 'post_content',
            );
            const metaDescription =
              metaDescriptionExist && metaDescriptionExist.length > 0
                ? metaDescriptionExist[0]['wp:meta_value'][0]
                : '';

            const content = item['content:encoded'][0];
            if (content) {
              return {
                title: item.title[0],
                content,
                bannerImage: '/uploads/termsAndConditions/e12e16f8-5010-4754-b10d-76d432421977.png', // May provide a static banner image here...
                category: categoryString || 'General',
                metaTitle: item['wp:post_name'][0],
                metaDescription: metaDescription || 'sample description',
                createdAt: new Date(item.pubDate[0]),
                updatedAt: new Date(item.pubDate[0]),
              };
            }

            return null; // Return null explicitly if content is falsy
          })
          .filter((termsAndCondition: ITermsAndConditionBody | null) => termsAndCondition !== null); // Filter out null values
        logger.info('Processed xml file');

        await bulkInsertTermsAndConditions(newTermsAndConditions);
        logger.info('bulk inserted termsAndCondition data to db');
        // No need to delete files since they are in memory
      });
    } catch (err) {
      logger.error('Error processing file:', err);
      throw new AppError('Error processing file', HttpStatus.BAD_REQUEST);
    }
  }

  return true;
};

export const updateTermsAndConditionByIdUseCase = async (
  id: string,
  data: ITermsAndConditionBody,
): Promise<ITermsAndConditionModel> => {
  if (ObjectID(id)) {
    // const existingTermsAndCondition = await fetchTermsAndConditionById(id);
    // check for  unique value updations

    const termsAndCondition = await updateTermsAndConditionById(id, data);
    if (!termsAndCondition)
      throw new AppError('Couldn\'t update TermsAndCondition', HttpStatus.NOT_FOUND);
    return termsAndCondition;
  }
  throw new AppError('No TermsAndCondition Found', HttpStatus.NOT_FOUND);
};
export const deleteTermsAndConditionByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const termsAndCondition = await deleteTermsAndConditionById(id);
    // check for  unique value updations
    if (termsAndCondition) return true;
  }
  throw new AppError('No TermsAndCondition Found', HttpStatus.NOT_FOUND);
};

export const getTermsAndConditionByIdUseCase = async (query: {
  _id: string;
}): Promise<ITermsAndConditionModel> => {
  if (ObjectID(query._id)) {
    const termsAndCondition = await fetchTermsAndConditionById(query._id);
    if (termsAndCondition) return termsAndCondition;
  }
  throw new AppError('No TermsAndCondition Found', HttpStatus.NOT_FOUND);
};

export const getTermsAndConditionBySlugUseCase = async (
  slug: string,
): Promise<ITermsAndConditionModel> => {
  const termsAndCondition = await fetchTermsAndConditionBySlug({ slug, isDeleted: false });
  if (termsAndCondition) return termsAndCondition;

  throw new AppError('No TermsAndCondition Found', HttpStatus.NOT_FOUND);
};

export const getTermsAndConditionMetaBySlugUseCase = async (
  slug: string,
): Promise<ITermsAndConditionModel> => {
  const termsAndCondition = await fetchTermsAndConditionMetaBySlug({ slug, isDeleted: false });
  if (termsAndCondition) return termsAndCondition;

  throw new AppError('No TermsAndCondition Found', HttpStatus.NOT_FOUND);
};
