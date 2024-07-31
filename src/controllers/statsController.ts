import { Request, Response } from 'express';
import { StatisticsService } from '../services/stats.service';
// import { StatisticsService } from './statisticsService';

export async function getYearlyStats(req:Request, res:Response) {
  const sellerId  = (req as any).user.id;
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const stats = [];

  for (let month = startOfYear; month <= now; month.setMonth(month.getMonth() + 1)) {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const monthlyStats = await StatisticsService.calculateMonthlyStats(sellerId, startOfMonth, endOfMonth);
    stats.push(monthlyStats);
  }

  res.json(stats);
}