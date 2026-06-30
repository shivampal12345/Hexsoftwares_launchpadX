import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Startup from '../src/models/Startup';
import Investment from '../src/models/Investment';
import { startups } from '../src/constants/dummyData';

dotenv.config({ path: '.env.local' });

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Please add your MONGODB_URI to .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Startup.deleteMany({});
    await Investment.deleteMany({});
    console.log('Existing data cleared');

    // Create test users
    const users = [
      { name: process.env.ADMIN_NAME || 'Admin User', email: process.env.ADMIN_EMAIL || 'admin@example.com', password: process.env.ADMIN_PASSWORD || 'admin123', role: 'admin' },
      { name: 'Sophia Varga', email: 'sophia@example.com', password: 'password123', role: 'founder' },
      { name: 'Marcus Vance', email: 'marcus@example.com', password: 'password123', role: 'founder' },
      { name: 'Dr. Helen Chen', email: 'helen@example.com', password: 'password123', role: 'founder' },
      { name: 'Liam Gallagher', email: 'liam@example.com', password: 'password123', role: 'founder' },
      { name: 'Maya Patel', email: 'maya@example.com', password: 'password123', role: 'founder' },
      { name: 'Oliver Sterling', email: 'oliver@example.com', password: 'password123', role: 'founder' },
      { name: 'David Kross', email: 'david@example.com', password: 'password123', role: 'investor' },
      { name: 'Amina Al-Mansoor', email: 'amina@example.com', password: 'password123', role: 'investor' },
      { name: 'Sarah Jenkins', email: 'sarah@example.com', password: 'password123', role: 'investor' },
      { name: 'Kenji Takahashi', email: 'kenji@example.com', password: 'password123', role: 'investor' },
    ];

    const createdUsers = await User.create(users);
    console.log('Test users created:', createdUsers.length);

    // Create startups
    const startupData = startups.map((startup, index) => {
      const founderUser = createdUsers[index];
      return {
        name: startup.name,
        tagline: startup.tagline,
        description: startup.description,
        coverImage: startup.coverImage,
        logo: startup.logo,
        industry: startup.industry,
        location: startup.location,
        founder: startup.founder,
        founderId: founderUser._id,
        fundingGoal: startup.fundingGoal,
        amountRaised: startup.amountRaised,
        minInvestment: startup.minInvestment,
        expectedEquity: startup.expectedEquity,
        backers: startup.backers,
        daysLeft: startup.daysLeft,
        status: 'active',
      };
    });

    const createdStartups = await Startup.create(startupData);
    console.log('Startups created:', createdStartups.length);

    // Create some sample investments
    const investments = [];
    for (let i = 0; i < 20; i++) {
      const randomStartup = createdStartups[Math.floor(Math.random() * createdStartups.length)];
      const randomInvestor = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomAmount = Math.floor(Math.random() * 10000) + 500;

      investments.push({
        userId: randomInvestor._id,
        startupId: randomStartup._id,
        amount: randomAmount,
        equity: (randomAmount / randomStartup.fundingGoal) * randomStartup.expectedEquity,
        status: 'completed',
      });
    }

    await Investment.create(investments);
    console.log('Investments created:', investments.length);

    console.log('✅ Seed data successfully added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
