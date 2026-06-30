export interface Startup {
  _id?: string;
  id?: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  founder: string;
  founderImage?: string;
  industry: string;
  fundingGoal: number;
  amountRaised: number;
  daysLeft: number;
  minInvestment: number;
  expectedEquity: number; // in percentage per minInvestment or general equity pool
  location: string;
  teamSize?: number;
  monthlyRevenue?: number;
  customers?: number | string;
  story?: string;
  backers: number;
  category?: string;
  founderId?: string;
  website?: string;
  pitchDeck?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  growthMetrics?: {
    revenueGrowth?: number;
    userGrowth?: number;
  };
  fundingTimeline?: {
    month: string;
    amount: number;
  }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
  type: 'investor' | 'founder';
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  coverImage: string;
}

export interface PlatformStats {
  raised: string;
  investors: string;
  fundedStartups: string;
  successRate: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'investor' | 'founder' | 'admin';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = User['role'];
export type StartupStatus = 'draft' | 'active' | 'funded' | 'closed';

export interface Investment {
  _id: string;
  userId: string | User;
  startupId: string | Startup;
  amount: number;
  equity: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignInvestment {
  _id: string;
  investorName: string;
  amount: number;
  equity: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt?: string;
}

export interface CampaignInvestmentSummary {
  count: number;
  totalAmount: number;
  totalEquity: number;
}
