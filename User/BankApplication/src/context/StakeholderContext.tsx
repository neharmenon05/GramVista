import React, { createContext, useContext, useState } from 'react';

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: 'homestayHost' | 'guide' | 'artisan' | 'performer';
  description: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  totalBookings: number;
  totalEarnings: number;
  impactScore: number;
  avatar: string;
}

interface Earnings {
  total: number;
  thisMonth: number;
  activeBookings: number;
}

interface Transaction {
  id: string;
  experience: string;
  date: string;
  amount: number;
  sharePercentage: number;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  blockchainHash: string;
}

interface StakeholderContextType {
  stakeholder: Stakeholder;
  earnings: Earnings;
  transactions: Transaction[];
  updateProfile: (data: Partial<Stakeholder>) => void;
}

const StakeholderContext = createContext<StakeholderContextType | undefined>(undefined);

export const StakeholderProvider = ({ children }: { children: React.ReactNode }) => {
  const [stakeholder, setStakeholder] = useState<Stakeholder>({
    id: 'st001',
    name: 'Lakshmi Devi',
    email: 'lakshmi@villagechain.com',
    phone: '+91 98765 43210',
    location: 'Kasol, Himachal Pradesh',
    type: 'homestayHost',
    description: 'Experienced homestay host offering authentic mountain experiences with traditional Himachali cuisine and culture.',
    skills: ['Traditional Cooking', 'Local History', 'Mountain Trekking', 'Hospitality'],
    rating: 4.8,
    reviewCount: 124,
    totalBookings: 89,
    totalEarnings: 125000,
    impactScore: 92,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  });

  const [earnings] = useState<Earnings>({
    total: 125000,
    thisMonth: 18500,
    activeBookings: 12,
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      experience: 'Himalayan Village Homestay',
      date: '2024-12-15',
      amount: 2500,
      sharePercentage: 40,
      status: 'completed',
      blockchainHash: '0xa1b2c3d4e5f6789abcdef01234567890abcdef01',
    },
    {
      id: 'TXN002',
      experience: 'Mountain Trekking Experience',
      date: '2024-12-14',
      amount: 1800,
      sharePercentage: 35,
      status: 'completed',
      blockchainHash: '0xb2c3d4e5f6789abcdef01234567890abcdef012',
    },
    {
      id: 'TXN003',
      experience: 'Cultural Cooking Class',
      date: '2024-12-13',
      amount: 1200,
      sharePercentage: 50,
      status: 'pending',
      blockchainHash: '0xc3d4e5f6789abcdef01234567890abcdef0123',
    },
    {
      id: 'TXN004',
      experience: 'Village Tour & Craft Workshop',
      date: '2024-12-12',
      amount: 2000,
      sharePercentage: 30,
      status: 'completed',
      blockchainHash: '0xd4e5f6789abcdef01234567890abcdef01234',
    },
    {
      id: 'TXN005',
      experience: 'Traditional Dance Performance',
      date: '2024-12-11',
      amount: 800,
      sharePercentage: 60,
      status: 'processing',
      blockchainHash: '0xe5f6789abcdef01234567890abcdef012345',
    },
  ]);

  const updateProfile = (data: Partial<Stakeholder>) => {
    setStakeholder(prev => ({ ...prev, ...data }));
  };

  return (
    <StakeholderContext.Provider value={{
      stakeholder,
      earnings,
      transactions,
      updateProfile,
    }}>
      {children}
    </StakeholderContext.Provider>
  );
};

export const useStakeholder = () => {
  const context = useContext(StakeholderContext);
  if (context === undefined) {
    throw new Error('useStakeholder must be used within a StakeholderProvider');
  }
  return context;
};