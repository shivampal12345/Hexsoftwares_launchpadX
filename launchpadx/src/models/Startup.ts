import { Schema, model, models } from 'mongoose';

const StartupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    tagline: {
      type: String,
      required: [true, 'Please add a tagline'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    coverImage: {
      type: String,
      required: [true, 'Please add a cover image'],
    },
    logo: {
      type: String,
      required: [true, 'Please add a logo'],
    },
    industry: {
      type: String,
      required: [true, 'Please add an industry'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    founder: {
      type: String,
      required: [true, 'Please add a founder'],
    },
    founderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fundingGoal: {
      type: Number,
      required: [true, 'Please add a funding goal'],
    },
    amountRaised: {
      type: Number,
      default: 0,
    },
    minInvestment: {
      type: Number,
      required: [true, 'Please add a minimum investment'],
    },
    expectedEquity: {
      type: Number,
      required: [true, 'Please add expected equity'],
    },
    backers: {
      type: Number,
      default: 0,
    },
    daysLeft: {
      type: Number,
      required: [true, 'Please add days left'],
    },
    website: {
      type: String,
    },
    pitchDeck: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'funded', 'closed'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

const Startup = models.Startup || model('Startup', StartupSchema);

export default Startup;
