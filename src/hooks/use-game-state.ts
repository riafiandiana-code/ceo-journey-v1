"use client"

import { useState, useEffect, useCallback } from 'react';
import { GameState, Job, Education, FoodItem, Property, Sector, LifestyleItem, BusinessGrade, ManagerGrade, Business } from '@/types/game';
import { INITIAL_MARKET, processWeek, getRandomItems, COURSES_POOL, PROPERTY_POOL, HOUSING_POOL, VEHICLE_POOL, BANK_LOCK_PERIOD, getTrustStatus, JOBS_POOL } from '@/lib/game-engine';
import { useToast } from './use-toast';

const STORAGE_KEY = 'ceo_journey_save_v12';

const INITIAL_STATE: GameState = {
  week: 1,
  isGameOver: false,
  isMenuOpen: true,
  gameOverReason: '',
  character: {
    name: 'Calon CEO',
    age: 18 * 52,
    mood: 'Netral',
    moodValue: 70,
    health: 100,
    hunger: 20,
    cash: 5000000,
    bankBalance: 2000000,
    bankLockWeeks: 0,
    loanAmount: 0,
    trustScore: 5,
    casinoBalance: 0,
    skills: {
      Teknologi: 0,
      Finansial: 0,
      Manajemen: 0,
      Pemasaran: 0,
      Pendidikan: 0,
      Kesehatan: 0,
      Entertainment: 0,
      Umum: 0,
    },
  },
  lifestyle: {
    housing: HOUSING_POOL[0],
    vehicle: VEHICLE_POOL[0],
  },
  career: {
    currentJob: null,
    educationHistory: [],
    currentEducation: null,
    availableJobs: getRandomItems(JOBS_POOL, 6),
    availableCourses: getRandomItems(COURSES_POOL, 5),
  },
  businesses: [],
  investments: {
    portfolio: [],
    market: INITIAL_MARKET,
    properties: [],
    propertyOffers: getRandomItems(PROPERTY_POOL, 2),
  },
  financials: {
    lastIncome: 0,
    lastExpense: 0,
  },
  news: ["Selamat datang di CEO Journey Indonesia."],
  logs: ["Permainan dimulai. Rp 5.000.000 tunai tersedia."],
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHasSave(true);
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  const save = useCallback((newState: GameState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const startNewGame = (name: string) => {
    const newState = {
      ...INITIAL_STATE,
      isMenuOpen: false,
      character: {
        ...INITIAL_STATE.character,
        name: name || 'CEO Baru'
      }
    };
    setState(newState);
    save(newState);
    setHasSave(true);
    toast({ title: "Permainan Dimulai!", description: `Selamat berjuang, CEO ${name}!` });
  };

  const continueGame = () => {
    setState(prev => ({ ...prev, isMenuOpen: false }));
    toast({ title: "Permainan Dilanjutkan" });
  };

  const openMenu = () => {
    setState(prev => ({ ...prev, isMenuOpen: true }));
  };

  const nextWeek = () => {
    if (state.isGameOver) return;
    setIsProcessing(true);
    const newState = processWeek(state);
    setState(newState);
    save(newState);
    setIsProcessing(false);
    
    if (newState.isGameOver) {
      toast({
        title: "Permainan Berakhir",
        description: newState.gameOverReason,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Minggu Berakhir",
        description: `Masuk Minggu ke-${newState.week}.`,
      });
    }
  };

  const buyFood = (food: FoodItem) => {
    if (state.character.cash >= food.cost) {
      setState(prev => {
        const next = {
          ...prev,
          character: {
            ...prev.character,
            cash: prev.character.cash - food.cost,
            hunger: Math.max(0, prev.character.hunger - food.hungerValue),
            health: Math.min(100, prev.character.health + food.healthValue),
            moodValue: Math.min(100, prev.character.moodValue + 5)
          },
          financials: {
            ...prev.financials,
            lastExpense: prev.financials.lastExpense + food.cost
          },
          logs: [`Beli ${food.name} seharga Rp ${Math.floor(food.cost).toLocaleString('id-ID')}`, ...prev.logs]
        };
        save(next);
        return next;
      });
      toast({ title: "Kenyang!", description: `Membeli ${food.name}.` });
    } else {
      toast({ title: "Uang tidak cukup", variant: "destructive" });
    }
  };

  const treatHealth = (cost: number, gain: number) => {
    if (state.character.cash < cost) {
      toast({ title: "Uang tidak cukup", variant: "destructive" });
      return;
    }
    setState(prev => {
      const next = {
        ...prev,
        character: {
          ...prev.character,
          cash: prev.character.cash - cost,
          health: Math.min(100, prev.character.health + gain)
        },
        financials: {
          ...prev.financials,
          lastExpense: prev.financials.lastExpense + cost
        },
        logs: [`Berobat ke Rumah Sakit. Kesehatan +${gain}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Pengobatan Berhasil" });
  };

  const createBusiness = (name: string, sector: Sector, grade: BusinessGrade) => {
    if (state.character.cash < grade.setupCost) {
      toast({ title: "Modal tidak cukup", variant: "destructive" });
      return;
    }
    setState(prev => {
      const newBiz: Business = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || `${sector} Corp`,
        sector,
        grade,
        manager: null,
        isActive: true,
        weeksActive: 0,
        budget: grade.setupCost / 2,
        lastWeeklyProfit: 0
      };
      const next = {
        ...prev,
        character: { ...prev.character, cash: prev.character.cash - grade.setupCost },
        businesses: [...prev.businesses, newBiz],
        logs: [`Membangun bisnis ${newBiz.name} (${grade.name})`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Bisnis Didirikan!", description: `Anggaran awal disiapkan.` });
  };

  const withdrawFromBusiness = (businessId: string, amount: number) => {
    const biz = state.businesses.find(b => b.id === businessId);
    if (!biz || biz.budget < amount) {
      toast({ title: "Anggaran bisnis tidak cukup", variant: "destructive" });
      return;
    }

    setState(prev => {
      const bizIdx = prev.businesses.findIndex(b => b.id === businessId);
      const newBusinesses = [...prev.businesses];
      newBusinesses[bizIdx] = { ...newBusinesses[bizIdx], budget: newBusinesses[bizIdx].budget - amount };
      
      const next = {
        ...prev,
        character: { ...prev.character, cash: prev.character.cash + amount },
        businesses: newBusinesses,
        logs: [`Tarik Rp ${Math.floor(amount).toLocaleString('id-ID')} dari ${newBusinesses[bizIdx].name}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Dana Ditarik" });
  };

  const depositToBusiness = (businessId: string, amount: number) => {
    if (state.character.cash < amount) {
      toast({ title: "Uang tidak cukup", variant: "destructive" });
      return;
    }
    setState(prev => {
      const businesses = prev.businesses.map(b => 
        b.id === businessId ? { ...b, budget: b.budget + amount } : b
      );
      const next = {
        ...prev,
        character: { ...prev.character, cash: prev.character.cash - amount },
        businesses,
        logs: [`Setor Rp ${Math.floor(amount).toLocaleString('id-ID')} ke bisnis`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Dana Disetor" });
  };

  const sellBusiness = (businessId: string) => {
    setState(prev => {
      const biz = prev.businesses.find(b => b.id === businessId);
      if (!biz) return prev;
      
      const sellPrice = (biz.grade.setupCost * 0.8) + biz.budget;
      const next = {
        ...prev,
        character: { ...prev.character, cash: prev.character.cash + sellPrice },
        businesses: prev.businesses.filter(b => b.id !== businessId),
        logs: [`Menjual ${biz.name} seharga Rp ${Math.floor(sellPrice).toLocaleString('id-ID')}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Bisnis Terjual" });
  };

  const hireManager = (businessId: string, manager: ManagerGrade) => {
    setState(prev => {
      const businesses = prev.businesses.map(b => 
        b.id === businessId ? { ...b, manager } : b
      );
      const next = { ...prev, businesses };
      save(next);
      return next;
    });
    toast({ title: "Manajer Disewa" });
  };

  const fireManager = (businessId: string) => {
    const biz = state.businesses.find(b => b.id === businessId);
    if (!biz || !biz.manager) return;
    
    const compensation = biz.manager.weeklySalary * 2;
    if (state.character.cash < compensation) {
      toast({ title: "Kas tidak cukup untuk kompensasi pecat", variant: "destructive" });
      return;
    }

    setState(prev => {
      const businesses = prev.businesses.map(b => 
        b.id === businessId ? { ...b, manager: null } : b
      );
      const next = {
        ...prev,
        character: { ...prev.character, cash: prev.character.cash - compensation },
        businesses,
        logs: [`Memecat manajer ${biz.manager?.name}. Bayar kompensasi Rp ${Math.floor(compensation).toLocaleString('id-ID')}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Manajer Dipecat", description: "Membayar kompensasi 2x gaji." });
  };

  const refreshMood = (option: { name: string, cost: number, moodGain: number }) => {
    if (state.character.cash >= option.cost) {
      setState(prev => {
        const next = {
          ...prev,
          character: {
            ...prev.character,
            cash: prev.character.cash - option.cost,
            moodValue: Math.min(100, prev.character.moodValue + option.moodGain)
          },
          financials: {
            ...prev.financials,
            lastExpense: prev.financials.lastExpense + option.cost
          },
          logs: [`Refreshing: ${option.name}`, ...prev.logs]
        };
        save(next);
        return next;
      });
      toast({ title: "Pikiran Segar!" });
    } else {
      toast({ title: "Uang tidak cukup", variant: "destructive" });
    }
  };

  const buyProperty = (property: Property) => {
    if (state.character.cash >= property.cost) {
      setState(prev => {
        const next = {
          ...prev,
          character: { ...prev.character, cash: prev.character.cash - property.cost },
          investments: {
            ...prev.investments,
            properties: [...prev.investments.properties, property],
            propertyOffers: prev.investments.propertyOffers.filter(p => p.id !== property.id)
          },
          logs: [`Beli properti: ${property.name}`, ...prev.logs]
        };
        save(next);
        return next;
      });
      toast({ title: "Aset Dibeli!" });
    } else {
      toast({ title: "Uang tidak cukup", variant: "destructive" });
    }
  };

  const sellProperty = (propertyId: string) => {
    setState(prev => {
      const prop = prev.investments.properties.find(p => p.id === propertyId);
      if (!prop) return prev;
      
      const sellPrice = prop.cost * 0.9;
      const next = {
        ...prev,
        character: { ...prev.character, cash: prev.character.cash + sellPrice },
        investments: {
          ...prev.investments,
          properties: prev.investments.properties.filter(p => p.id !== propertyId)
        },
        logs: [`Jual properti: ${prop.name} seharga Rp ${Math.floor(sellPrice).toLocaleString('id-ID')}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Properti Terjual" });
  };

  const upgradeLifestyle = (item: LifestyleItem) => {
    if (state.character.cash >= item.cost) {
      setState(prev => {
        const next = {
          ...prev,
          character: { ...prev.character, cash: prev.character.cash - item.cost },
          lifestyle: {
            ...prev.lifestyle,
            [item.type]: item
          },
          logs: [`Upgrade: ${item.name}`, ...prev.logs]
        };
        save(next);
        return next;
      });
      toast({ title: "Gaya Hidup Diperbarui" });
    } else {
      toast({ title: "Uang tidak cukup", variant: "destructive" });
    }
  };

  const applyForJob = (job: Job) => {
    let metSkills = true;
    Object.entries(job.requirements.skills).forEach(([sector, reqValue]) => {
      const s = sector as Sector;
      if ((state.character.skills[s] || 0) < (reqValue as number)) metSkills = false;
    });

    if (!metSkills) {
      toast({ title: "Keahlian belum mencukupi.", variant: "destructive" });
      return;
    }

    if (job.requirements.education !== 'Tidak Ada') {
      const hasDegree = state.career.educationHistory.some(e => e.name === job.requirements.education);
      if (!hasDegree) {
        toast({ title: `Perlu gelar ${job.requirements.education}.`, variant: "destructive" });
        return;
      }
    }

    setState(prev => {
      const next = {
        ...prev,
        career: { ...prev.career, currentJob: job },
        logs: [`Bekerja di ${job.company} sebagai ${job.title}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Diterima Kerja!" });
  };

  const resignJob = () => {
    setState(prev => {
      if (!prev.career.currentJob) return prev;
      const next = {
        ...prev,
        career: { ...prev.career, currentJob: null },
        logs: [`Berhenti bekerja dari ${prev.career.currentJob.company}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Resign Berhasil", description: "Anda sekarang menganggur." });
  };

  const enrollCourse = (edu: Education) => {
    if (state.career.currentEducation) {
      toast({ title: "Selesaikan pendidikan saat ini dulu.", variant: "destructive" });
      return;
    }
    if (state.career.educationHistory.some(h => h.name === edu.name)) {
      toast({ title: "Anda sudah memiliki gelar ini.", variant: "destructive" });
      return;
    }
    if (state.character.cash < edu.cost) {
      toast({ title: "Uang tidak cukup", variant: "destructive" });
      return;
    }
    setState(prev => {
      const next = {
        ...prev,
        character: { ...prev.character, cash: prev.character.cash - edu.cost },
        career: { ...prev.career, currentEducation: { ...edu, progressWeeks: 0 } },
        logs: [`Mengambil ${edu.name}`, ...prev.logs]
      };
      save(next);
      return next;
    });
    toast({ title: "Terdaftar!" });
  };

  const tradeAsset = (assetId: string, amount: number) => {
    const asset = state.investments.market.find(a => a.id === assetId);
    if (!asset || amount === 0) return;
    const totalValue = asset.price * Math.abs(amount);

    if (amount > 0) {
      if (state.character.cash < totalValue) {
        toast({ title: "Uang tidak cukup", variant: "destructive" });
        return;
      }
      setState(prev => {
        const portfolio = [...prev.investments.portfolio];
        const existingIdx = portfolio.findIndex(p => p.assetId === assetId);
        
        if (existingIdx !== -1) {
          const existing = portfolio[existingIdx];
          const newQuantity = existing.quantity + amount;
          const newTotalCost = (existing.averageBuyPrice * existing.quantity) + totalValue;
          portfolio[existingIdx] = {
            ...existing,
            quantity: newQuantity,
            averageBuyPrice: newTotalCost / newQuantity
          };
        } else {
          portfolio.push({ assetId, quantity: amount, averageBuyPrice: asset.price });
        }
        
        const next = {
          ...prev,
          character: { ...prev.character, cash: prev.character.cash - totalValue },
          investments: { ...prev.investments, portfolio },
          logs: [`Beli ${amount} unit ${asset.name}`, ...prev.logs]
        };
        save(next);
        return next;
      });
    } else {
      const unitsToSell = Math.abs(amount);
      const existingIdx = state.investments.portfolio.findIndex(p => p.assetId === assetId);
      if (existingIdx === -1 || state.investments.portfolio[existingIdx].quantity < unitsToSell) {
        toast({ title: "Aset tidak mencukupi", variant: "destructive" });
        return;
      }
      setState(prev => {
        const portfolio = prev.investments.portfolio.map((p, idx) => 
          idx === existingIdx ? { ...p, quantity: p.quantity - unitsToSell } : p
        ).filter(p => p.quantity > 0);
        
        const next = {
          ...prev,
          character: { ...prev.character, cash: prev.character.cash + totalValue },
          investments: { ...prev.investments, portfolio },
          logs: [`Jual ${unitsToSell} unit ${asset.name}`, ...prev.logs]
        };
        save(next);
        return next;
      });
    }
  };

  const bankAction = (type: 'deposit' | 'withdraw' | 'loan' | 'emergency' | 'repay', amount: number) => {
    const status = getTrustStatus(state.character.trustScore);

    // Validation
    if (type === 'deposit' && state.character.cash < amount) {
      toast({ title: "Uang tunai tidak cukup", variant: "destructive" });
      return;
    }
    if (type === 'withdraw') {
      if (state.character.bankBalance < amount) {
        toast({ title: "Saldo bank tidak cukup", variant: "destructive" });
        return;
      }
      if (state.character.bankLockWeeks > 0) {
        toast({ title: `Terkunci ${state.character.bankLockWeeks} minggu`, variant: "destructive" });
        return;
      }
    }
    if (type === 'loan') {
      if (state.character.loanAmount > 0) {
        toast({ title: `Hutang belum lunas!`, description: "Lunasi hutang sebelum meminjam lagi.", variant: "destructive" });
        return;
      }
      if (amount > status.limit) {
        toast({ title: `Limit pinjaman tercapai`, description: `Limit Anda adalah Rp ${status.limit.toLocaleString('id-ID')}`, variant: "destructive" });
        return;
      }
    }
    if (type === 'emergency') {
      if (state.character.loanAmount > 0) {
        toast({ title: `Hutang belum lunas!`, description: "Lunasi hutang sebelum meminjam lagi.", variant: "destructive" });
        return;
      }
      if (state.character.trustScore === 0) {
        toast({ title: "Trust Score 0, pinjaman darurat ditolak.", variant: "destructive" });
        return;
      }
    }

    setState(prev => {
      const nextCharacter = { ...prev.character };
      const nextLogs = [...prev.logs];
      let bankLockWeeks = prev.character.bankLockWeeks;
      let trustScore = prev.character.trustScore;

      if (type === 'deposit') {
        nextCharacter.cash -= amount;
        nextCharacter.bankBalance += amount;
        bankLockWeeks = BANK_LOCK_PERIOD;
        nextLogs.unshift(`Deposito: Rp ${Math.floor(amount).toLocaleString('id-ID')}`);
      } else if (type === 'withdraw') {
        nextCharacter.bankBalance -= amount;
        nextCharacter.cash += amount;
        nextLogs.unshift(`Tarik tabungan: Rp ${Math.floor(amount).toLocaleString('id-ID')}`);
      } else if (type === 'loan') {
        nextCharacter.loanAmount += amount;
        nextCharacter.cash += amount;
        nextLogs.unshift(`Pinjam Bank: Rp ${Math.floor(amount).toLocaleString('id-ID')}`);
      } else if (type === 'emergency') {
        nextCharacter.loanAmount += amount;
        nextCharacter.cash += amount;
        trustScore = Math.max(0, trustScore - 15);
        nextLogs.unshift(`DARURAT: Rp ${Math.floor(amount).toLocaleString('id-ID')} (Penalti -15 Trust)`);
      } else if (type === 'repay') {
        const repayAmount = Math.min(amount, prev.character.loanAmount, prev.character.cash);
        nextCharacter.cash -= repayAmount;
        nextCharacter.loanAmount -= repayAmount;
        nextLogs.unshift(`Bayar hutang: Rp ${Math.floor(repayAmount).toLocaleString('id-ID')}`);
      }

      const nextState: GameState = {
        ...prev,
        character: { ...nextCharacter, bankLockWeeks, trustScore },
        logs: nextLogs
      };
      save(nextState);
      return nextState;
    });
  };

  const casinoAction = (type: 'deposit' | 'withdraw', amount: number) => {
    if (type === 'deposit' && state.character.cash < amount) {
      toast({ title: "Kas tidak cukup", variant: "destructive" });
      return;
    }
    if (type === 'withdraw' && state.character.casinoBalance < amount) {
      toast({ title: "Saldo kasino tidak cukup", variant: "destructive" });
      return;
    }

    setState(prev => {
      const nextChar = { ...prev.character };
      if (type === 'deposit') {
        nextChar.cash -= amount;
        nextChar.casinoBalance += amount;
      } else {
        nextChar.casinoBalance -= amount;
        nextChar.cash += amount;
      }
      const next = { ...prev, character: nextChar };
      save(next);
      return next;
    });
  };

  const updateCasinoBalance = (amount: number) => {
    setState(prev => {
      const nextChar = { ...prev.character, casinoBalance: prev.character.casinoBalance + amount };
      const next = { ...prev, character: nextChar };
      save(next);
      return next;
    });
  };

  const resetGame = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
    setHasSave(false);
    toast({ title: "Game Direset" });
  };

  return {
    state,
    isProcessing,
    hasSave,
    startNewGame,
    continueGame,
    openMenu,
    nextWeek,
    buyFood,
    treatHealth,
    createBusiness,
    withdrawFromBusiness,
    depositToBusiness,
    sellBusiness,
    hireManager,
    fireManager,
    buyProperty,
    sellProperty,
    upgradeLifestyle,
    applyForJob,
    resignJob,
    enrollCourse,
    tradeAsset,
    bankAction,
    casinoAction,
    updateCasinoBalance,
    refreshMood,
    resetGame,
  };
}
