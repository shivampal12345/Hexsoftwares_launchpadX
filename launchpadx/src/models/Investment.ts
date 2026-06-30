import { Schema, model, models } from 'mongoose';

const InvestmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startupId: {
      type: Schema.Types.ObjectId,
      ref: 'Startup',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an investment amount'],
    },
    equity: {
      type: Number,
      required: [true, 'Please add equity percentage'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const Investment = models.Investment || model('Investment', InvestmentSchema);

export default Investment;
