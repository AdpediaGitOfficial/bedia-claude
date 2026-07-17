import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { HttpStatus } from '../../common/httpStatus';
import {
  getDashboardStatsUseCase,
  getDailyNewUsersChartUseCase,
} from '../useCases/dashboardUseCase';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const result = await getDashboardStatsUseCase();
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Dashboard stats fetched successfully',
    result,
  });
});

export const getDailyNewUsersChart = asyncHandler(async (req: Request, res: Response) => {
  const result = await getDailyNewUsersChartUseCase();
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Chart data fetched successfully',
    result,
  });
});
