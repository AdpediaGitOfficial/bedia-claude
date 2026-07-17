import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTermsAndConditionUseCase,
  deleteTermsAndConditionByIdUseCase,
  fetchTermsAndConditionFromXmlUseCase,
  getAllTermsAndConditionsForAdminUseCase,
  getAllTermsAndConditionsUseCase,
  getTermsAndConditionByIdUseCase,
  getTermsAndConditionBySlugUseCase,
  getTermsAndConditionMetaBySlugUseCase,
  updateTermsAndConditionByIdUseCase,
} from '../useCases/termsAndConditionUseCase';
import { ITermsAndConditionBody } from '../../types/termsAndConditionTypes';

export const getAllTermsAndConditions = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const termsAndConditions = await getAllTermsAndConditionsUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All TermsAndConditions successfully',
      result: termsAndConditions,
    });
  },
);

export const getAllTermsAndConditionsForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const termsAndConditions = await getAllTermsAndConditionsForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All TermsAndConditions successfully',
      result: termsAndConditions,
    });
  },
);

export const createTermsAndCondition = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as ITermsAndConditionBody;
    await createTermsAndConditionUseCase(data);
    res.status(200).json({
      success: true,
      message: 'Created TermsAndCondition successfully',
      result: true,
    });
  },
);

export const fetchFromXml = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.files || req.files.length === 0) {
    res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
    return;
  }
  const data = await fetchTermsAndConditionFromXmlUseCase(req.files as Express.Multer.File[]);
  res.status(200).json({
    success: true,
    message: 'Fetched TermsAndConditions successfully',
    result: data,
  });
});

export const updateTermsAndConditionById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as ITermsAndConditionBody;
    await updateTermsAndConditionByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated TermsAndCondition successfully',
      result: true,
    });
  },
);

export const deleteTermsAndConditionById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteTermsAndConditionByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted TermsAndCondition successfully',
      result: true,
    });
  },
);

export const getTermsAndConditionById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const termsAndCondition = await getTermsAndConditionByIdUseCase({ _id: id });
    res.status(200).json({
      success: true,
      message: 'Fetched TermsAndCondition successfully',
      result: termsAndCondition,
    });
  },
);

export const getTermsAndConditionBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const termsAndCondition = await getTermsAndConditionBySlugUseCase(slug);
    res.status(200).json({
      success: true,
      message: 'Fetched TermsAndCondition successfully',
      result: termsAndCondition,
    });
  },
);

export const getTermsAndConditionMetaBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const termsAndCondition = await getTermsAndConditionMetaBySlugUseCase(slug);
    res.status(200).json({
      success: true,
      message: 'Fetched meta data successfully',
      result: termsAndCondition,
    });
  },
);
