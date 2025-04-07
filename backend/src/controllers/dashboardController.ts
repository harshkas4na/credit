import { Request, Response } from 'express';
import LoanApplication from '../models/LoanApplication';
import User from '../models/User';

// Define interface for authenticated request if needed
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'verifier' | 'admin';
  };
}

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get loan statistics
    const totalLoans = await LoanApplication.countDocuments();
    const pendingLoans = await LoanApplication.countDocuments({ status: 'pending' });
    const verifiedLoans = await LoanApplication.countDocuments({ status: 'verified' });
    const approvedLoans = await LoanApplication.countDocuments({ status: 'approved' });
    const rejectedLoans = await LoanApplication.countDocuments({ status: 'rejected' });

    // Get total loan amount
    const loanAmounts = await LoanApplication.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          approvedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    const totalAmount = loanAmounts.length > 0 ? loanAmounts[0].totalAmount : 0;
    const approvedAmount = loanAmounts.length > 0 ? loanAmounts[0].approvedAmount : 0;

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const verifierUsers = await User.countDocuments({ role: 'verifier' });

    // Get recent loans
    const recentLoans = await LoanApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'username');

    // Return the stats
    res.status(200).json({
      loanStats: {
        total: totalLoans,
        pending: pendingLoans,
        verified: verifiedLoans,
        approved: approvedLoans,
        rejected: rejectedLoans
      },
      financialStats: {
        totalAmount,
        approvedAmount
      },
      userStats: {
        total: totalUsers,
        admins: adminUsers,
        verifiers: verifierUsers
      },
      recentLoans
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics', error });
  }
};

// Additional dashboard endpoints for specific data visualization
export const getLoansByMonth = async (req: Request, res: Response) => {
  try {
    const loansByMonth = await LoanApplication.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json(loansByMonth);
  } catch (error) {
    console.error('Error fetching loans by month:', error);
    res.status(500).json({ message: 'Error fetching loans by month', error });
  }
};

export const getLoansByStatus = async (req: Request, res: Response) => {
  try {
    const loansByStatus = await LoanApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json(loansByStatus);
  } catch (error) {
    console.error('Error fetching loans by status:', error);
    res.status(500).json({ message: 'Error fetching loans by status', error });
  }
};