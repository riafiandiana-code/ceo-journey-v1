"use client"

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Dices, 
  Coins, 
  Repeat, 
  RotateCw, 
  Wallet,
  Trophy,
  ArrowRightLeft,
  X,
  TrendingUp,
  LayoutGrid,
  History,
  Sparkles,
  Zap,
  Target,
  Undo2,
  Trash2
} from "lucide-react";

interface CasinoPanelProps {
  balance: number;
  onUpdateBalance: (amount: number) => void;
  onTransfer: (type: 'deposit' | 'withdraw', amount: number) => void;
  onClose: () => void;
}

type CasinoGame = 'coin-flip' | 'high-low' | 'roulette' | 'slots' | 'blackjack' | 'lobby';

// Card Constants for Blackjack
const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = [
  { label: '2', val: 2 }, { label: '3', val: 3 }, { label: '4', val: 4 },
  { label: '5', val: 5 }, { label: '6', val: 6 }, { label: '7', val: 7 },
  { label: '8', val: 8 }, { label: '9', val: 9 }, { label: '10', val: 10 },
  { label: 'J', val: 10 }, { label: 'Q', val: 10 }, { label: 'K', val: 10 },
  { label: 'A', val: 11 }
];

interface BlackjackCard {
  label: string;
  val: number;
  suit: string;
}

interface RouletteBet {
  type: 'color' | 'number' | 'dozen' | 'column' | 'range' | 'parity';
  value: any;
  amount: number;
}

// Roulette Constants
const ROULETTE_NUMBERS = [
  { n: 0, c: 'green' }, { n: 32, c: 'red' }, { n: 15, c: 'black' }, { n: 19, c: 'red' }, { n: 4, c: 'black' },
  { n: 21, c: 'red' }, { n: 2, c: 'black' }, { n: 25, c: 'red' }, { n: 17, c: 'black' }, { n: 34, c: 'red' },
  { n: 6, c: 'black' }, { n: 27, c: 'red' }, { n: 13, c: 'black' }, { n: 36, c: 'red' }, { n: 11, c: 'black' },
  { n: 30, c: 'red' }, { n: 8, c: 'black' }, { n: 23, c: 'red' }, { n: 10, c: 'black' }, { n: 5, c: 'red' },
  { n: 24, c: 'black' }, { n: 16, c: 'red' }, { n: 33, c: 'black' }, { n: 1, c: 'red' }, { n: 20, c: 'black' },
  { n: 14, c: 'red' }, { n: 31, c: 'black' }, { n: 9, c: 'red' }, { n: 22, c: 'black' }, { n: 18, c: 'red' },
  { n: 29, c: 'black' }, { n: 7, c: 'red' }, { n: 28, c: 'black' }, { n: 12, c: 'red' }, { n: 35, c: 'black' },
  { n: 3, c: 'red' }, { n: 26, c: 'black' }
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// Betting Options
const BET_OPTIONS = [400, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];

export function CasinoPanel({ balance, onUpdateBalance, onTransfer, onClose }: CasinoPanelProps) {
  const { toast } = useToast();
  const [activeGame, setActiveGame] = useState<CasinoGame>('lobby');
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(100000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameResult, setGameResult] = useState<{ win: boolean; amount: number; push?: boolean } | null>(null);
  
  // Game-specific visual states
  const [flipResult, setFlipResult] = useState<'heads' | 'tails' | null>(null);
  const [slotValues, setSlotValues] = useState<number[]>([4, 4, 4]);
  const [highLowCard, setHighLowCard] = useState<number>(7);

  // Roulette specific states
  const [rouletteBets, setRouletteBets] = useState<RouletteBet[]>([]);
  const [rouletteSpinResult, setRouletteSpinResult] = useState<typeof ROULETTE_NUMBERS[0] | null>(null);
  const [rouletteHistory, setRouletteHistory] = useState<typeof ROULETTE_NUMBERS>([]);

  // Blackjack specific states
  const [blackjackPhase, setBlackjackPhase] = useState<'betting' | 'dealing' | 'player' | 'dealer' | 'ended'>('betting');
  const [playerCards, setPlayerCards] = useState<BlackjackCard[]>([]);
  const [dealerCards, setDealerCards] = useState<BlackjackCard[]>([]);

  // Helpers
  const getRandomCard = () => {
    const v = VALUES[Math.floor(Math.random() * VALUES.length)];
    const s = SUITS[Math.floor(Math.random() * SUITS.length)];
    return { ...v, suit: s };
  };

  const calculateScore = (cards: BlackjackCard[]) => {
    let score = cards.reduce((acc, c) => acc + c.val, 0);
    let aces = cards.filter(c => c.label === 'A').length;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  const handleBet = async (logic: () => { win: boolean, multiplier: number }, delay: number = 1500) => {
    if (balance < betAmount) {
      toast({ title: "Saldo Kasino Habis!", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setGameResult(null);

    await new Promise(resolve => setTimeout(resolve, delay));

    const { win, multiplier } = logic();
    const resultAmount = win ? betAmount * (multiplier - 1) : -betAmount;
    
    onUpdateBalance(resultAmount);
    setGameResult({ win, amount: Math.abs(win ? betAmount * multiplier : betAmount) });
    setIsProcessing(false);
  };

  // --- GAMES LOGIC ---

  const playCoinFlip = (choice: 'heads' | 'tails') => {
    handleBet(() => {
      const isHeads = Math.random() > 0.5;
      setFlipResult(isHeads ? 'heads' : 'tails');
      const win = (choice === 'heads' && isHeads) || (choice === 'tails' && !isHeads);
      return { win, multiplier: 2 };
    });
  };

  const playHighLow = (guess: 'high' | 'low') => {
    handleBet(() => {
      const nextNum = Math.floor(Math.random() * 13) + 1;
      const win = (guess === 'high' && nextNum > highLowCard) || (guess === 'low' && nextNum < highLowCard);
      setHighLowCard(nextNum);
      return { win, multiplier: 1.9 };
    });
  };

  const addRouletteBet = (type: RouletteBet['type'], value: any) => {
    if (isProcessing) return;
    setRouletteBets(prev => [...prev, { type, value, amount: betAmount }]);
  };

  const undoRouletteBet = () => {
    if (isProcessing) return;
    setRouletteBets(prev => prev.slice(0, -1));
  };

  const clearRouletteBets = () => {
    if (isProcessing) return;
    setRouletteBets([]);
  };

  const totalRouletteBet = rouletteBets.reduce((acc, b) => acc + b.amount, 0);

  const checkRouletteWin = (bet: RouletteBet, result: typeof ROULETTE_NUMBERS[0]): number => {
    if (bet.type === 'number' && result.n === bet.value) return 36;
    if (bet.type === 'color' && result.c === bet.value) return 2;
    if (bet.type === 'dozen') {
      if (bet.value === 1 && result.n >= 1 && result.n <= 12) return 3;
      if (bet.value === 2 && result.n >= 13 && result.n <= 24) return 3;
      if (bet.value === 3 && result.n >= 25 && result.n <= 36) return 3;
    }
    if (bet.type === 'column') {
      if (bet.value === 1 && (result.n - 1) % 3 === 0 && result.n !== 0) return 3;
      if (bet.value === 2 && (result.n - 2) % 3 === 0 && result.n !== 0) return 3;
      if (bet.value === 3 && result.n % 3 === 0 && result.n !== 0) return 3;
    }
    if (bet.type === 'range') {
      if (bet.value === 'low' && result.n >= 1 && result.n <= 18) return 2;
      if (bet.value === 'high' && result.n >= 19 && result.n <= 36) return 2;
    }
    if (bet.type === 'parity') {
      if (result.n !== 0) {
        if (bet.value === 'even' && result.n % 2 === 0) return 2;
        if (bet.value === 'odd' && result.n % 2 !== 0) return 2;
      }
    }
    return 0;
  };

  const playRoulette = async () => {
    if (rouletteBets.length === 0) return;
    if (balance < totalRouletteBet) {
      toast({ title: "Saldo Kasino Habis!", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setGameResult(null);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const resultIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
    const result = ROULETTE_NUMBERS[resultIndex];
    setRouletteSpinResult(result);
    setRouletteHistory(prev => [result, ...prev].slice(0, 10));
    
    let totalWin = 0;
    rouletteBets.forEach(bet => {
      const multiplier = checkRouletteWin(bet, result);
      if (multiplier > 0) {
        totalWin += bet.amount * multiplier;
      }
    });

    const profitLoss = totalWin - totalRouletteBet;
    onUpdateBalance(profitLoss);

    const win = totalWin > 0;
    setGameResult({ 
      win, 
      amount: Math.abs(win ? totalWin : totalRouletteBet)
    });
    setIsProcessing(false);
  };

  const playSlots = async () => {
    if (balance < betAmount) {
      toast({ title: "Saldo Kasino Habis!", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setGameResult(null);

    // Reel spin animation
    const spinInterval = setInterval(() => {
      setSlotValues([
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 5)
      ]);
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 2000));
    clearInterval(spinInterval);

    const finalSlots = [
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5)
    ];
    setSlotValues(finalSlots);
    
    const win = finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2];
    const multiplier = win ? 25 : 0;
    const resultAmount = win ? betAmount * (multiplier - 1) : -betAmount;
    
    onUpdateBalance(resultAmount);
    setGameResult({ 
      win, 
      amount: Math.abs(win ? betAmount * multiplier : betAmount)
    });
    setIsProcessing(false);
  };

  // --- BLACKJACK LOGIC ---

  const startBlackjack = async () => {
    if (balance < betAmount) {
      toast({ title: "Saldo Kasino Habis!", variant: "destructive" });
      return;
    }

    onUpdateBalance(-betAmount);
    setBlackjackPhase('dealing');
    setGameResult(null);
    setPlayerCards([]);
    setDealerCards([]);

    const p1 = getRandomCard();
    const d1 = getRandomCard();
    const p2 = getRandomCard();
    const d2 = getRandomCard();

    await new Promise(r => setTimeout(r, 400));
    setPlayerCards([p1]);
    await new Promise(r => setTimeout(r, 400));
    setDealerCards([d1]);
    await new Promise(r => setTimeout(r, 400));
    setPlayerCards([p1, p2]);
    await new Promise(r => setTimeout(r, 400));
    setDealerCards([d1, d2]);
    
    const pScore = calculateScore([p1, p2]);
    if (pScore === 21) {
      standBlackjack([p1, p2], [d1, d2]);
    } else {
      setBlackjackPhase('player');
    }
  };

  const hitBlackjack = () => {
    const newCard = getRandomCard();
    const nextCards = [...playerCards, newCard];
    setPlayerCards(nextCards);
    
    if (calculateScore(nextCards) > 21) {
      endBlackjack('lose', nextCards, dealerCards);
    }
  };

  const standBlackjack = async (finalPlayerCards = playerCards, initialDealerCards = dealerCards) => {
    setBlackjackPhase('dealer');
    let currentDealerCards = [...initialDealerCards];
    
    while (calculateScore(currentDealerCards) < 17) {
      await new Promise(r => setTimeout(r, 800));
      currentDealerCards = [...currentDealerCards, getRandomCard()];
      setDealerCards(currentDealerCards);
    }
    
    const pScore = calculateScore(finalPlayerCards);
    const dScore = calculateScore(currentDealerCards);
    
    if (dScore > 21) {
      endBlackjack('win', finalPlayerCards, currentDealerCards);
    } else if (pScore > dScore) {
      endBlackjack('win', finalPlayerCards, currentDealerCards);
    } else if (pScore < dScore) {
      endBlackjack('lose', finalPlayerCards, currentDealerCards);
    } else {
      endBlackjack('push', finalPlayerCards, currentDealerCards);
    }
  };

  const endBlackjack = (result: 'win' | 'lose' | 'push', pFinal: BlackjackCard[], dFinal: BlackjackCard[]) => {
    setBlackjackPhase('ended');
    const pScore = calculateScore(pFinal);
    const isBlackjack = pScore === 21 && pFinal.length === 2;
    
    let multiplier = 0;
    if (result === 'win') multiplier = isBlackjack ? 2.5 : 2;
    else if (result === 'push') multiplier = 1;
    
    if (multiplier > 0) {
      onUpdateBalance(betAmount * multiplier);
    }
    
    setGameResult({ 
      win: result === 'win', 
      push: result === 'push',
      amount: Math.abs(result === 'win' ? betAmount * multiplier : (result === 'push' ? betAmount : betAmount))
    });
  };

  // Card UI Component
  const PlayingCard = ({ card, hidden }: { card?: BlackjackCard, hidden?: boolean }) => (
    <div className={cn(
      "w-16 h-24 md:w-20 md:h-28 rounded-xl flex flex-col items-center justify-center text-xl md:text-2xl font-black transition-all shadow-xl border-2",
      hidden ? "bg-amber-600 border-amber-500 animate-pulse" : "bg-white border-white text-black",
      card?.suit === '♥' || card?.suit === '♦' ? "text-red-600" : "text-black"
    )}>
      {hidden ? (
        <Sparkles className="w-8 h-8 text-amber-300 opacity-50" />
      ) : (
        <>
          <span className="text-sm self-start pl-2 -mt-2">{card?.label}</span>
          <span className="text-3xl">{card?.suit}</span>
          <span className="text-sm self-end pr-2 -mb-2 rotate-180">{card?.label}</span>
        </>
      )}
    </div>
  );

  const getBetCountFor = (type: string, value: any) => {
    return rouletteBets.filter(b => b.type === type && b.value === value).length;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] text-white font-body overflow-hidden flex flex-col">
      <header className="h-20 border-b border-amber-500/20 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic text-amber-400">GRAND ELITE</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-500/60 font-bold">VIP Private Club</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Saldo Kasino</span>
            <div className="flex items-center gap-2 text-amber-400 font-black text-xl">
              <Sparkles className="w-4 h-4" />
              Rp {Math.floor(balance).toLocaleString('id-ID')}
            </div>
          </div>
          <Button variant="ghost" className="rounded-full h-10 w-10 text-neutral-400 hover:text-white hover:bg-white/5" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-20 md:w-64 border-r border-white/5 bg-[#080808] flex flex-col py-6 shrink-0">
          <div className="px-4 mb-4 hidden md:block">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Pilih Meja</p>
          </div>
          <div className="space-y-1 px-2">
            {[
              { id: 'lobby', label: 'Lobby', icon: LayoutGrid },
              { id: 'coin-flip', label: 'Coin Flip', icon: Coins },
              { id: 'high-low', label: 'High-Low', icon: Repeat },
              { id: 'roulette', label: 'Roulette', icon: RotateCw },
              { id: 'slots', label: 'Slots', icon: Dices },
              { id: 'blackjack', label: 'Blackjack', icon: ArrowRightLeft },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveGame(item.id as CasinoGame); setGameResult(null); setBlackjackPhase('betting'); setRouletteBets([]); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  activeGame === item.id 
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeGame === item.id ? "animate-pulse" : "")} />
                <span className="hidden md:block font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto px-4 py-6 border-t border-white/5 hidden md:block">
            <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
              <p className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest mb-2">Pilih Chip</p>
              <div className="grid grid-cols-2 gap-2">
                {BET_OPTIONS.map(v => (
                  <Button 
                    key={v}
                    size="sm"
                    variant="ghost"
                    onClick={() => setBetAmount(v)}
                    disabled={(activeGame === 'blackjack' && blackjackPhase !== 'betting' && blackjackPhase !== 'ended') || isProcessing}
                    className={cn(
                      "h-8 text-[9px] px-1 rounded-lg font-black",
                      betAmount === v ? "bg-amber-500 text-black" : "text-neutral-500 hover:text-white"
                    )}
                  >
                    Rp {v >= 1000000 ? `${(v/1000000)}M` : v >= 1000 ? `${(v/1000)}K` : v}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8">
          {activeGame === 'lobby' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="relative h-64 rounded-[2rem] overflow-hidden bg-gradient-to-r from-amber-600 to-amber-900 flex items-center px-12 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="relative z-10 space-y-4">
                  <Badge className="bg-black/50 text-amber-400 border-none font-bold">PREMIUM ACCESS</Badge>
                  <h2 className="text-4xl font-black italic">SELAMAT DATANG,<br />HIGH ROLLER</h2>
                  <p className="text-white/60 text-sm max-w-sm">Siapkan strategi Anda, keberuntungan berpihak pada mereka yang berani mengambil risiko.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-amber-400">
                    <Wallet className="w-5 h-5" /> Manajemen Dompet
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2 block">Jumlah Transfer</label>
                      <Input 
                        type="number"
                        placeholder="Rp 0"
                        className="bg-white/5 border-white/10 h-12 rounded-xl text-amber-400 font-bold outline-none focus:ring-1 focus:ring-amber-500/50"
                        value={transferAmount || ""}
                        onChange={(e) => setTransferAmount(Number(e.target.value))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={() => onTransfer('deposit', transferAmount)} className="bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl h-12 transition-transform active:scale-95">DEPOSIT</Button>
                      <Button onClick={() => onTransfer('withdraw', transferAmount)} variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black rounded-xl h-12 transition-transform active:scale-95">WITHDRAW</Button>
                    </div>
                  </div>
                </Card>

                <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-4">
                  <History className="w-12 h-12 text-neutral-800" />
                  <div>
                    <h4 className="font-bold text-neutral-400">Statistik Global</h4>
                    <p className="text-xs text-neutral-600">Leaderboard eksklusif segera hadir.</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeGame !== 'lobby' && (
            <div className="max-w-5xl mx-auto">
              <Card className="bg-[#0a0a0a] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-white/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/5 rounded-2xl">
                      <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight text-amber-400">{activeGame.replace('-', ' ')}</h2>
                      {activeGame === 'roulette' ? (
                        <p className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                          TOTAL TARUHAN: Rp {totalRouletteBet.toLocaleString('id-ID')}
                        </p>
                      ) : (
                        <p className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Bermain dengan Rp {betAmount.toLocaleString('id-ID')}</p>
                      )}
                    </div>
                  </div>
                  {activeGame === 'roulette' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={undoRouletteBet} disabled={isProcessing || rouletteBets.length === 0} className="border-white/10 text-xs rounded-xl h-9">
                        <Undo2 className="w-4 h-4 mr-2" /> Undo
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearRouletteBets} disabled={isProcessing || rouletteBets.length === 0} className="text-red-400 hover:bg-red-500/10 text-xs rounded-xl h-9">
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus Semua
                      </Button>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 md:p-8">
                  <div className="relative min-h-[400px] flex flex-col items-center justify-center space-y-8">
                    
                    {/* Visual Game Area */}
                    <div className={cn(
                      "w-full transition-all duration-700 transform",
                      (isProcessing || blackjackPhase === 'dealing') ? "scale-105 opacity-70 blur-sm" : "scale-100 opacity-100 blur-0"
                    )}>
                      {activeGame === 'coin-flip' && (
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-4 border-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.3)]",
                            isProcessing && "animate-spin"
                          )}>
                            <span className="text-black font-black text-2xl uppercase">
                              {isProcessing ? "?" : (flipResult || "COIN")}
                            </span>
                          </div>
                        </div>
                      )}

                      {activeGame === 'high-low' && (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-32 h-44 bg-neutral-900 border-2 border-amber-500/20 rounded-2xl flex items-center justify-center text-6xl font-black text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                            {isProcessing ? "..." : highLowCard}
                          </div>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Kartu Saat Ini</p>
                        </div>
                      )}

                      {activeGame === 'roulette' && (
                        <div className="flex flex-col items-center gap-6 w-full">
                          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                              <div className={cn(
                                "absolute inset-0 rounded-full border-4 border-neutral-800 bg-[#081a0e] shadow-[0_0_50px_rgba(34,197,94,0.1)]",
                                isProcessing && "animate-[spin_1s_linear_infinite]"
                              )}>
                                {ROULETTE_NUMBERS.slice(0, 12).map((r, i) => (
                                  <div 
                                    key={i} 
                                    className="absolute w-1 h-2 top-0 left-1/2 -translate-x-1/2 origin-[center_64px]"
                                    style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
                                  >
                                    <div className={cn("w-full h-full rounded-full", r.c === 'red' ? 'bg-red-500' : r.c === 'black' ? 'bg-neutral-900' : 'bg-green-500')} />
                                  </div>
                                ))}
                              </div>
                              <div className="relative z-10 w-16 h-16 bg-black rounded-full border-2 border-amber-500/20 flex flex-col items-center justify-center">
                                {isProcessing ? (
                                  <div className="text-amber-400 animate-pulse font-black">...</div>
                                ) : (
                                  <span className={cn("text-xl font-black", rouletteSpinResult?.c === 'red' ? 'text-red-500' : rouletteSpinResult?.c === 'black' ? 'text-white' : 'text-green-500')}>
                                    {rouletteSpinResult?.n ?? "?"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center md:text-left">HASIL TERAKHIR</p>
                                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                                    {rouletteHistory.length === 0 ? (
                                        <p className="text-[10px] text-neutral-700 italic">Belum ada data</p>
                                    ) : (
                                        rouletteHistory.map((h, i) => (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border border-white/10",
                                                    h.c === 'red' ? 'bg-red-600 text-white' : h.c === 'black' ? 'bg-neutral-800 text-white' : 'bg-green-600 text-white'
                                                )}
                                            >
                                                {h.n}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                          </div>

                          <div className="w-full overflow-x-auto scrollbar-hide py-4">
                            <div className="min-w-fit flex gap-1 items-stretch">
                                {/* 0 Button */}
                                <button 
                                  onClick={() => addRouletteBet('number', 0)}
                                  className={cn(
                                    "w-12 bg-green-600 border border-white/10 rounded-l-lg flex items-center justify-center font-black text-lg hover:bg-green-500 transition-all relative text-white",
                                    getBetCountFor('number', 0) > 0 && "ring-2 ring-amber-400 ring-inset bg-green-400"
                                  )}
                                >
                                  0
                                  {getBetCountFor('number', 0) > 0 && (
                                    <Badge className="absolute -top-1 -right-1 bg-amber-500 text-black border-none h-4 w-4 p-0 flex items-center justify-center rounded-full text-[8px] font-bold">
                                      {getBetCountFor('number', 0)}
                                    </Badge>
                                  )}
                                </button>

                                {/* Numbers 1-36 Horizontal Grid (3 Rows x 12 Cols) */}
                                <div className="grid grid-rows-3 grid-flow-col gap-1">
                                  {[...Array(36)].map((_, i) => {
                                    const num = i + 1;
                                    const isRed = RED_NUMBERS.includes(num);
                                    const betCount = getBetCountFor('number', num);
                                    return (
                                      <button 
                                        key={num}
                                        onClick={() => addRouletteBet('number', num)}
                                        className={cn(
                                          "w-10 h-10 border border-white/5 flex items-center justify-center font-bold text-xs hover:scale-105 transition-all relative text-white rounded-md",
                                          isRed ? "bg-red-600" : "bg-neutral-900",
                                          betCount > 0 && "ring-2 ring-amber-400 ring-inset"
                                        )}
                                      >
                                        {num}
                                        {betCount > 0 && (
                                          <Badge className="absolute -top-1 -right-1 bg-amber-500 text-black border-none h-3.5 w-3.5 p-0 flex items-center justify-center rounded-full text-[7px] font-bold">
                                            {betCount}
                                          </Badge>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="flex flex-col gap-1 ml-1">
                                    <div className="flex gap-1 h-full">
                                        {[1, 2, 3].map(col => (
                                          <button key={col} onClick={() => addRouletteBet('column', col)} className={cn("w-12 h-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-[8px] font-black hover:bg-neutral-700 transition-all relative text-white rounded-md", getBetCountFor('column', col) > 0 && "ring-2 ring-amber-400 bg-neutral-700")}>
                                            2to1
                                            {getBetCountFor('column', col) > 0 && <Badge className="absolute -top-1 -right-1 bg-amber-500 text-black border-none h-3 w-3.5 p-0 flex items-center justify-center rounded-full text-[7px] font-bold">{getBetCountFor('column', col)}</Badge>}
                                          </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        {[1, 2, 3].map(d => (
                                          <button key={d} onClick={() => addRouletteBet('dozen', d)} className={cn("h-8 bg-neutral-800/50 border border-white/5 font-black text-[9px] relative text-white rounded-md", getBetCountFor('dozen', d) > 0 && "ring-2 ring-amber-400 bg-neutral-700")}>
                                            {d === 1 ? '1st 12' : d === 2 ? '2nd 12' : '3rd 12'}
                                            {getBetCountFor('dozen', d) > 0 && <Badge className="absolute -top-1 -right-1 bg-amber-500 text-black border-none h-3 w-3.5 p-0 flex items-center justify-center rounded-full text-[7px] font-bold">{getBetCountFor('dozen', d)}</Badge>}
                                          </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-6 gap-1">
                                        <button onClick={() => addRouletteBet('range', 'low')} className={cn("h-8 bg-neutral-800/50 border border-white/5 font-black text-[8px] relative text-white rounded-md", getBetCountFor('range', 'low') > 0 && "ring-2 ring-amber-400 bg-neutral-700")}>1-18</button>
                                        <button onClick={() => addRouletteBet('parity', 'even')} className={cn("h-8 bg-neutral-800/50 border border-white/5 font-black text-[8px] relative text-white rounded-md", getBetCountFor('parity', 'even') > 0 && "ring-2 ring-amber-400 bg-neutral-700")}>EVEN</button>
                                        <button onClick={() => addRouletteBet('color', 'red')} className={cn("h-8 bg-red-600/80 border border-white/10 flex items-center justify-center relative rounded-md", getBetCountFor('color', 'red') > 0 && "ring-2 ring-amber-400 bg-red-600")}>
                                            <div className="w-3 h-3 bg-red-600 border border-white rotate-45" />
                                        </button>
                                        <button onClick={() => addRouletteBet('color', 'black')} className={cn("h-8 bg-neutral-900 border border-white/10 flex items-center justify-center relative rounded-md", getBetCountFor('color', 'black') > 0 && "ring-2 ring-amber-400 bg-black")}>
                                            <div className="w-3 h-3 bg-black border border-white rotate-45" />
                                        </button>
                                        <button onClick={() => addRouletteBet('parity', 'odd')} className={cn("h-8 bg-neutral-800/50 border border-white/5 font-black text-[8px] relative text-white rounded-md", getBetCountFor('parity', 'odd') > 0 && "ring-2 ring-amber-400 bg-neutral-700")}>ODD</button>
                                        <button onClick={() => addRouletteBet('range', 'high')} className={cn("h-8 bg-neutral-800/50 border border-white/5 font-black text-[8px] relative text-white rounded-md", getBetCountFor('range', 'high') > 0 && "ring-2 ring-amber-400 bg-neutral-700")}>19-36</button>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeGame === 'slots' && (
                        <div className="flex gap-4 justify-center">
                          {slotValues.map((v, i) => (
                            <div key={i} className={cn(
                              "w-20 h-28 bg-neutral-900 border-2 border-white/5 rounded-2xl flex items-center justify-center text-4xl font-black transition-all shadow-inner relative overflow-hidden",
                              isProcessing && "animate-pulse"
                            )}>
                              <div className={cn(
                                "flex flex-col items-center transition-transform duration-100 text-white",
                                isProcessing && "animate-[bounce_0.2s_infinite]"
                              )}>
                                {v === 0 ? "🍒" : v === 1 ? "🍋" : v === 2 ? "💎" : v === 3 ? "🔔" : "7"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeGame === 'blackjack' && blackjackPhase !== 'betting' && (
                        <div className="space-y-12 w-full">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                              <Badge variant="outline" className="border-amber-500/20 text-neutral-500">DEALER</Badge>
                              {blackjackPhase !== 'player' && blackjackPhase !== 'dealing' && (
                                <span className="text-xl font-black text-amber-500">{calculateScore(dealerCards)}</span>
                              )}
                            </div>
                            <div className="flex gap-3 justify-center">
                              {dealerCards.map((card, idx) => (
                                <PlayingCard 
                                  key={idx} 
                                  card={card} 
                                  hidden={idx === 1 && (blackjackPhase === 'player' || blackjackPhase === 'dealing')} 
                                />
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex gap-3 justify-center">
                              {playerCards.map((card, idx) => (
                                <PlayingCard key={idx} card={card} />
                              ))}
                            </div>
                            <div className="flex justify-between items-center px-4">
                              <Badge className="bg-amber-500 text-black border-none font-bold">PLAYER</Badge>
                              <span className="text-2xl font-black text-white">{calculateScore(playerCards)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {gameResult && (
                      <div className={cn(
                        "text-center p-4 rounded-2xl animate-in fade-in zoom-in duration-500 shadow-xl inline-block px-8",
                        gameResult.push 
                          ? "bg-neutral-500/10 border border-neutral-500/30"
                          : gameResult.win 
                            ? "bg-green-500/10 border border-green-500/30 shadow-green-500/10" 
                            : "bg-red-500/10 border border-red-500/30 shadow-red-500/10"
                      )}>
                        <p className={cn("text-2xl font-black", gameResult.win ? "text-green-500" : (gameResult.push ? "text-neutral-400" : "text-red-500"))}>
                          {gameResult.push ? "±" : gameResult.win ? "+" : "-"} Rp {gameResult.amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}

                    <div className="w-full flex justify-center gap-4">
                      {activeGame === 'coin-flip' && (
                        <>
                          <button onClick={() => playCoinFlip('heads')} disabled={isProcessing} className="flex-1 h-16 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-transform active:scale-95 disabled:opacity-50">HEADS</button>
                          <button onClick={() => playCoinFlip('tails')} disabled={isProcessing} className="flex-1 h-16 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-transform active:scale-95 disabled:opacity-50">TAILS</button>
                        </>
                      )}
                      {activeGame === 'high-low' && (
                        <>
                          <button onClick={() => playHighLow('high')} disabled={isProcessing} className="flex-1 h-16 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-transform active:scale-95 disabled:opacity-50">HIGHER</button>
                          <button onClick={() => playHighLow('low')} disabled={isProcessing} className="flex-1 h-16 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-transform active:scale-95 disabled:opacity-50">LOWER</button>
                        </>
                      )}
                      {activeGame === 'roulette' && (
                        <button 
                          onClick={playRoulette} 
                          disabled={isProcessing || rouletteBets.length === 0} 
                          className="w-full h-16 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all active:scale-95 disabled:opacity-30 disabled:scale-100"
                        >
                          {isProcessing ? "BOLA BERPUTAR..." : rouletteBets.length === 0 ? "PASANG TARUHAN DI MEJA" : `BET Rp ${totalRouletteBet.toLocaleString('id-ID')} & SPIN`}
                        </button>
                      )}
                      {activeGame === 'slots' && (
                        <button onClick={playSlots} disabled={isProcessing} className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-transform active:scale-95 disabled:opacity-50">PULL LEVER</button>
                      )}
                      {activeGame === 'blackjack' && (
                        <div className="w-full space-y-4">
                          {blackjackPhase === 'betting' || blackjackPhase === 'ended' ? (
                            <button 
                              onClick={startBlackjack} 
                              disabled={isProcessing} 
                              className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-transform active:scale-95 disabled:opacity-50"
                            >
                              DEAL CARDS
                            </button>
                          ) : blackjackPhase === 'player' ? (
                            <div className="flex gap-4">
                              <button 
                                onClick={hitBlackjack} 
                                className="flex-1 h-16 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border border-white/10"
                              >
                                HIT
                              </button>
                              <button 
                                onClick={() => standBlackjack()} 
                                className="flex-1 h-16 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl"
                              >
                                STAND
                              </button>
                            </div>
                          ) : (
                            <button disabled className="w-full h-16 bg-white/5 text-neutral-500 rounded-2xl border border-white/5 cursor-wait">
                              DEALER TURN...
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
