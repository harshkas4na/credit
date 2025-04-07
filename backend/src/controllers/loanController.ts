import { Request, Response } from 'express';
import LoanApplication from '../models/LoanApplication';

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'verifier' | 'admin';
  };
}

export const createLoanApplication = async (req: AuthenticatedRequest, res: Response) => {
  const { fullName, amount, purpose } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const loan = new LoanApplication({
      fullName,
      amount,
      purpose,
      createdBy: userId,
    });

    await loan.save();
    res.status(201).json({ message: 'Loan application submitted successfully', loan });
  } catch (error) {
    console.error('Error creating loan application:', error);
    res.status(500).json({ message: 'Error creating loan application', error });
  }
};

export const getAllLoanApplications = async (req: Request, res: Response) => {
  try {
    const loans = await LoanApplication.find().populate('createdBy', 'username email');
    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    res.status(500).json({ message: 'Error fetching loan applications', error });
  }
};

export const updateLoanStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;
  const userRole = req.user?.role;

  // Validate if the status change is allowed for the user's role
  if (userRole === 'verifier' && status === 'approved') {
    return res.status(403).json({ message: 'Verifiers cannot approve loans' });
  }

  try {
    const loan = await LoanApplication.findById(id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Verify proper status flow
    if (userRole === 'verifier' && loan.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending loans can be verified' });
    }

    if (userRole === 'admin' && loan.status !== 'verified' && status === 'approved') {
      return res.status(400).json({ message: 'Only verified loans can be approved' });
    }

    const updatedLoan = await LoanApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({ message: 'Loan status updated', loan: updatedLoan });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ message: 'Error updating loan status', error });
  }
};

// Add a method to get loans for a specific user
export const getUserLoanApplications = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const loans = await LoanApplication.find({ createdBy: userId });
    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching user loan applications:', error);
    res.status(500).json({ message: 'Error fetching user loan applications', error });
  }
};