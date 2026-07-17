import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createPartnerUseCase,
  deletePartnerByIdUseCase,
  getAllPartnersForAdminUseCase,
  getAllPartnersUseCase,
  getPartnerByIdUseCase,
  updatePartnerByIdUseCase,
} from '../useCases/partnerUseCase';
import { IPartnerBody } from '../../types/partnerTypes';

export const getAllPartners = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const partners = await getAllPartnersUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Partners successfully',
    result: partners,
  });
});

export const getAllPartnersForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const partners = await getAllPartnersForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Partners successfully',
      result: partners,
    });
  },
);

export const createPartner = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IPartnerBody;
  await createPartnerUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Partner successfully',
    result: true,
  });
});
export const updatePartnerById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IPartnerBody;
    await updatePartnerByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated Partner successfully',
      result: true,
    });
  },
);

export const deletePartnerById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deletePartnerByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted Partner successfully',
      result: true,
    });
  },
);
export const getPartnerById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const partner = await getPartnerByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Partner successfully',
    result: partner,
  });
});
