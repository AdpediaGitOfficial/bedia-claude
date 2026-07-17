import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createCustomLead,
  getAllCustomLeads,
  getCustomLeadCount,
} from '../usecases/createCustomleadUseCase';

// POST /leads/:type
export const createLeadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { type } = req.params;

    const data = req.body;

    const newLead = await createCustomLead(type, data);

    res.status(201).json({
      success: true,
      message: `Lead created successfully at ${type}`,
      data: newLead,
    });
  },
);

export const getLeadsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { type } = req.params; // lead type from URL params
    const page = parseInt(req.query.page as string) || 1; // page number from query
    const limit = parseInt(req.query.limit as string) || 10; // limit from query

    if (!type) {
      res.status(400);
      throw new Error('Lead type is required');
    }

    const leads = await getAllCustomLeads(type, page, limit);

    res.status(200).json({
      success: true,
      message: `Leads fetched successfully for ${type}`,
      data: leads.data,
      total: leads.total,
      page,
      limit,
    });
  },
);

// Get COUNT

export const getLeadCountController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // optional

    const count = await getCustomLeadCount();

    res.status(200).json({
      success: true,
      count: count,
      message: 'Lead counts for all types fetched successfully',
    });
  },
);
