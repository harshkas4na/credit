import mongoose, { Document, Schema } from 'mongoose';

export interface ILoanApplication extends Document {
  fullName: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'verified' | 'rejected' | 'approved';
  createdBy: mongoose.Types.ObjectId;
}

const LoanApplicationSchema: Schema = new Schema<ILoanApplication>(
  {
    fullName: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'approved'],
      default: 'pending',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const LoanApplication = mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);
export default LoanApplication;