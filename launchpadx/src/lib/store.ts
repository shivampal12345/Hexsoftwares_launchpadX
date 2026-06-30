import {
  startups as seedStartups,
} from '@/constants/dummyData';
import { PlatformStats, Startup } from '@/types';

export interface CampaignInput {
  name: string;
  tagline: string;
  industry: string;
  location: string;
  fundingGoal: number;
  minInvestment: number;
  expectedEquity: number;
  story: string;
}

export interface InvestmentRecord {
  investmentId: string;
  startupId: string;
  startupName: string;
  amount: number;
  shares: number;
  settlementBlock: string;
  status: string;
  submittedAt: string;
}

interface StoreState {
  startups: Startup[];
  investments: InvestmentRecord[];
  newsletterEmails: string[];
  campaignCount: number;
}

const DEFAULT_IMAGES = {
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80',
  cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  founder: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
};

const globalForStore = globalThis as typeof globalThis & {
  launchpadxStore?: StoreState;
};

function createInitialStore(): StoreState {
  return {
    startups: structuredClone(seedStartups),
    investments: [],
    newsletterEmails: [],
    campaignCount: 0,
  };
}

function getStoreState(): StoreState {
  if (!globalForStore.launchpadxStore) {
    globalForStore.launchpadxStore = createInitialStore();
  }
  return globalForStore.launchpadxStore;
}

function formatRaisedTotal(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B+`;
  }
  if (amount >= 1_000_000) {
    return `$${Math.round(amount / 1_000_000)}M+`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)}K+`;
  }
  return `$${amount.toLocaleString()}`;
}

function createSettlementBlock(startupId: string, amount: number) {
  const seed = `${startupId}-${amount}`;
  const hash = seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  return `LPX-SEC-${String(10000 + (hash % 90000)).padStart(5, '0')}`;
}

function createCampaignReference(name: string) {
  const normalized = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  return `LPX-CMP-${normalized || 'DRAFT'}-${Date.now().toString(36).toUpperCase()}`;
}

export function getStartups(): Startup[] {
  return getStoreState().startups;
}

export function getStartupById(id: string): Startup | undefined {
  return getStoreState().startups.find((item) => item.id === id || item._id === id);
}

export function getPlatformStats(): PlatformStats {
  const { startups } = getStoreState();
  const totalRaised = startups.reduce((sum, startup) => sum + startup.amountRaised, 0);
  const totalBackers = startups.reduce((sum, startup) => sum + startup.backers, 0);
  const fundedCount = startups.filter(
    (startup) => startup.amountRaised >= startup.fundingGoal
  ).length;

  return {
    raised: formatRaisedTotal(totalRaised),
    investors: totalBackers >= 1000 ? `${Math.round(totalBackers / 1000)}K+` : `${totalBackers}+`,
    fundedStartups: `${startups.length}+`,
    successRate: fundedCount > 0 ? `${Math.min(99, Math.round((fundedCount / startups.length) * 100))}%` : '98%',
  };
}

export function recordInvestment(startupId: string, amount: number): InvestmentRecord {
  const store = getStoreState();
  const startup = store.startups.find((item) => item.id === startupId || item._id === startupId);

  if (!startup) {
    throw new Error('Startup campaign was not found.');
  }

  if (amount < startup.minInvestment) {
    throw new Error(`Minimum investment is $${startup.minInvestment}.`);
  }

  const shares =
    startup.fundingGoal > 0
      ? (amount / startup.fundingGoal) * (startup.expectedEquity * 100)
      : 0;

  startup.amountRaised += amount;
  startup.backers += 1;

  if (startup.fundingTimeline?.length) {
    const lastPoint = startup.fundingTimeline[startup.fundingTimeline.length - 1];
    lastPoint.amount = startup.amountRaised;
  }

  const startupIdentifier = startup.id || startup._id || '';

  const investment: InvestmentRecord = {
    investmentId: createSettlementBlock(startupIdentifier, amount),
    startupId: startupIdentifier,
    startupName: startup.name,
    amount,
    shares,
    settlementBlock: createSettlementBlock(startupIdentifier, amount),
    status: 'allocation_secured',
    submittedAt: new Date().toISOString(),
  };

  store.investments.unshift(investment);
  return investment;
}

export function createCampaign(input: CampaignInput) {
  const store = getStoreState();
  store.campaignCount += 1;

  const id = `s${Date.now().toString(36)}`;
  const reference = createCampaignReference(input.name);

  const startup: Startup = {
    id,
    name: input.name,
    tagline: input.tagline,
    description: input.story,
    logo: DEFAULT_IMAGES.logo,
    coverImage: DEFAULT_IMAGES.cover,
    founder: 'Pending Founder Review',
    founderImage: DEFAULT_IMAGES.founder,
    industry: input.industry,
    fundingGoal: input.fundingGoal,
    amountRaised: 0,
    daysLeft: 90,
    minInvestment: input.minInvestment,
    expectedEquity: input.expectedEquity / 100,
    location: input.location,
    teamSize: 1,
    monthlyRevenue: 0,
    customers: 0,
    story: input.story,
    backers: 0,
    category: input.industry,
    fundingTimeline: [{ month: 'Now', amount: 0 }],
  };

  store.startups.unshift(startup);

  return {
    reference,
    startupId: id,
    startupName: input.name,
    status: 'queued_for_review',
    submittedAt: new Date().toISOString(),
    nextSteps: [
      'Reg CF compliance audit',
      'KYC and AML review',
      'Pitch material review',
    ],
  };
}

export function subscribeNewsletter(email: string) {
  const store = getStoreState();
  const normalized = email.trim().toLowerCase();

  if (store.newsletterEmails.includes(normalized)) {
    return { email: normalized, alreadySubscribed: true };
  }

  store.newsletterEmails.push(normalized);
  return { email: normalized, alreadySubscribed: false };
}

export function getDashboardSummary() {
  const store = getStoreState();
  const draftCampaigns = store.startups.filter((startup) => startup.amountRaised === 0).length;
  const awaitingReview = Math.max(1, store.campaignCount);
  const readyToLaunch = store.startups.filter(
    (startup) => startup.amountRaised > 0 && startup.amountRaised < startup.fundingGoal * 0.25
  ).length;

  return {
    draftCampaigns: Math.max(draftCampaigns, 2),
    awaitingReview,
    readyToLaunch: Math.max(readyToLaunch, 4),
  };
}
