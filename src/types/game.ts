export type Mood = 'Senang' | 'Netral' | 'Lelah' | 'Stres' | 'Depresi';
export type Sector = 'Teknologi' | 'Finansial' | 'Manajemen' | 'Pemasaran' | 'Pendidikan' | 'Kesehatan' | 'Entertainment' | 'Umum';

export interface Asset {
  id: string;
  name: string;
  type: 'saham' | 'kripto' | 'komoditas';
  price: number;
  history: number[];
  volatility: number;
}

export interface PortfolioItem {
  assetId: string;
  quantity: number;
  averageBuyPrice: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: number;
  sector: Sector;
  description: string;
  requirements: {
    education: string;
    skills: Partial<Record<Sector, number>>;
  };
}

export interface Education {
  id: string;
  name: string;
  type: 'Gelar' | 'Kursus Online' | 'Kursus Offline';
  cost: number;
  durationWeeks: number;
  completed: boolean;
  progressWeeks: number;
  rewardSkills: Partial<Record<Sector, number>>;
}

export interface FoodItem {
  id: string;
  name: string;
  cost: number;
  hungerValue: number;
  healthValue: number;
}

export interface Property {
  id: string;
  name: string;
  cost: number;
  weeklyIncome: number;
  maintenance: number;
  description: string;
}

export interface ManagerGrade {
  id: 'normal' | 'specialist' | 'expert';
  name: string;
  weeklySalary: number;
  successBoost: number;
}

export interface BusinessGrade {
  id: 'startup' | 'umkm' | 'corporate' | 'international';
  name: string;
  setupCost: number;
  baseWeeklyYield: number; // percentage of setupCost
}

export interface Business {
  id: string;
  name: string;
  sector: Sector;
  grade: BusinessGrade;
  manager: ManagerGrade | null;
  isActive: boolean;
  weeksActive: number;
  budget: number; // Anggaran operasional mandiri bisnis
  lastWeeklyProfit: number; // Keuntungan/Kerugian minggu terakhir
}

export interface LifestyleItem {
  id: string;
  name: string;
  type: 'housing' | 'vehicle';
  cost: number;
  weeklyCost: number;
  moodBoost: number; // Nilai pengaruh ke mood mingguan
  description: string;
}

export interface GameState {
  week: number;
  isGameOver: boolean;
  isMenuOpen: boolean; // Tracking if start menu is showing
  gameOverReason: string;
  character: {
    name: string;
    age: number; // in weeks
    mood: Mood;
    moodValue: number; // 0-100
    health: number; // 0-100
    hunger: number; // 0-100
    cash: number;
    bankBalance: number;
    bankLockWeeks: number;
    loanAmount: number;
    trustScore: number;
    skills: Record<Sector, number>;
    casinoBalance: number; // Tambahan saldo kasino
  };
  lifestyle: {
    housing: LifestyleItem;
    vehicle: LifestyleItem;
  };
  career: {
    currentJob: Job | null;
    educationHistory: Education[];
    currentEducation: Education | null;
    availableJobs: Job[];
    availableCourses: Education[];
  };
  businesses: Business[];
  investments: {
    portfolio: PortfolioItem[];
    market: Asset[];
    properties: Property[];
    propertyOffers: Property[];
  };
  financials: {
    lastIncome: number;
    lastExpense: number;
  };
  news: string[];
  logs: string[];
}
