
"use client"

import { useGameState } from "@/hooks/use-game-state";
import { MarketPanel } from "@/components/game/market-panel";
import { CasinoPanel } from "@/components/game/casino-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { 
  Heart, 
  Utensils, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  History,
  Newspaper,
  Loader2,
  RefreshCcw,
  User,
  Home as HomeIcon,
  Award,
  Wallet,
  Building,
  Target,
  Car,
  ArrowUp,
  ArrowDown,
  PiggyBank,
  CreditCard,
  Plus,
  Smile,
  Briefcase,
  Coffee,
  Plane,
  Camera,
  Trees,
  Rocket,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Zap,
  Trash2,
  GraduationCap,
  Filter,
  FileText,
  Dices,
  Play,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { FOOD_ITEMS, HOUSING_POOL, VEHICLE_POOL, BUSINESS_GRADES, MANAGER_GRADES, getTrustStatus } from "@/lib/game-engine";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Sector } from "@/types/game";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const REFRESHING_OPTIONS = [
  { id: 'park', name: 'Jalan ke Taman', cost: 0, moodGain: 5, icon: Trees },
  { id: 'movie', name: 'Nonton Bioskop', cost: 100000, moodGain: 15, icon: Camera },
  { id: 'spa', name: 'Relaksasi Spa', cost: 750000, moodGain: 35, icon: Coffee },
  { id: 'staycation', name: 'Staycation Hotel', cost: 2500000, moodGain: 60, icon: HomeIcon },
  { id: 'travel', name: 'Liburan Mewah', cost: 25000000, moodGain: 100, icon: Plane },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showCasino, setShowCasino] = useState(false);
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  
  const { 
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
    sellProperty,
    hireManager,
    fireManager,
    buyProperty,
    upgradeLifestyle,
    applyForJob, 
    resignJob,
    enrollCourse, 
    tradeAsset,
    bankAction,
    casinoAction,
    updateCasinoBalance,
    refreshMood,
    resetGame 
  } = useGameState();

  const [bankDepositInput, setBankDepositInput] = useState<number>(0);
  const [loanInput, setLoanInput] = useState<number>(0);
  const [bizName, setBizName] = useState("");
  const [bizSector, setBizSector] = useState<Sector>("Teknologi");
  const [bizAmounts, setBizAmounts] = useState<Record<string, number>>({});

  const [jobSectorFilter, setJobSectorFilter] = useState<string>("Semua");
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- Start Menu View ---
  if (state.isMenuOpen) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" />
        
        <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden relative z-10">
          <CardHeader className="pt-12 pb-8 text-center space-y-4">
            <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">CEO JOURNEY</h1>
              <p className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mt-1">Indonesian Simulation</p>
            </div>
          </CardHeader>
          <CardContent className="px-10 pb-12 space-y-3">
            <Button 
              onClick={() => { setCustomName(""); setIsNewGameDialogOpen(true); }}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              <Plus className="w-5 h-5" /> Permainan Baru
            </Button>
            
            <Button 
              disabled={!hasSave}
              onClick={continueGame}
              variant="outline"
              className="w-full h-14 rounded-2xl border-white/10 text-white hover:bg-white/10 font-bold text-lg flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5" /> Lanjutkan Game
            </Button>

            <Button 
              variant="ghost"
              className="w-full h-14 rounded-2xl text-neutral-400 hover:text-white hover:bg-white/5 font-bold text-lg flex items-center justify-center gap-3"
            >
              <SettingsIcon className="w-5 h-5" /> Setting
            </Button>

            <Button 
              onClick={() => alert("Sampai jumpa lagi!")}
              variant="ghost"
              className="w-full h-14 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/10 font-bold text-lg flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" /> Keluar Game
            </Button>
          </CardContent>
        </Card>

        {/* New Game Dialog */}
        <Dialog open={isNewGameDialogOpen} onOpenChange={setIsNewGameDialogOpen}>
          <DialogContent className="rounded-3xl bg-neutral-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic">SIAPA ANDA?</DialogTitle>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Nama CEO</label>
                <Input 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg font-bold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-neutral-500 italic">"Nama ini akan tertulis di gedung-gedung pencakar langit yang Anda bangun nanti."</p>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => { startNewGame(customName); setIsNewGameDialogOpen(false); }}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest"
              >
                MULAI PERJALANAN
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <footer className="absolute bottom-6 text-neutral-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          v1.2.0 • CEO JOURNEY ID
        </footer>
      </div>
    );
  }

  // --- Main Game View ---
  const currentYear = Math.floor(state.character.age / 52);
  const investmentValue = state.investments.portfolio.reduce((acc, p) => {
    const asset = state.investments.market.find(m => m.id === p.assetId);
    return acc + (asset?.price || 0) * p.quantity;
  }, 0);
  const propertyValue = state.investments.properties.reduce((acc, p) => acc + p.cost, 0);
  const totalWealth = state.character.cash + state.character.bankBalance + investmentValue + propertyValue + state.character.casinoBalance - state.character.loanAmount;

  const trustStatus = getTrustStatus(state.character.trustScore);

  const getHealthStatus = (health: number) => {
    if (health >= 100) return "Sehat Walafiat";
    if (health >= 80) return "Kelelahan Ringan";
    if (health >= 60) return "Masuk Angin / Demam";
    if (health >= 40) return "Pneumonia / Infeksi";
    if (health >= 20) return "Kritis / Penyakit Kronis";
    return "Ambang Kematian";
  };

  const getPropertyImage = (id: string) => {
    const placeholder = PlaceHolderImages.find(img => img.id === `prop_${id}`);
    return placeholder || PlaceHolderImages[0];
  };

  const hospitalTreatment = {
    cost: (100 - state.character.health) * 50000,
    gain: Math.ceil((100 - state.character.health) / 2)
  };

  const filteredJobs = state.career.availableJobs.filter(job => {
    const matchSector = jobSectorFilter === "Semua" || job.sector === jobSectorFilter;
    const matchSalary = job.salary >= minSalaryFilter;
    return matchSector && matchSalary;
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-foreground flex flex-col">
      {showCasino && (
        <CasinoPanel 
          balance={state.character.casinoBalance} 
          onUpdateBalance={updateCasinoBalance}
          onTransfer={casinoAction}
          onClose={() => setShowCasino(false)}
        />
      )}

      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={openMenu} className="rounded-xl mr-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="bg-primary p-2 rounded-xl text-white shadow-md shadow-primary/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">CEO Journey ID</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full border">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Minggu {state.week} (Tahun {currentYear})</span>
            </div>
            <Button 
              onClick={nextWeek} 
              disabled={isProcessing || state.isGameOver}
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-8 shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              Lanjut Minggu
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4">
            <Card className="border-none shadow-xl overflow-hidden rounded-3xl sticky top-24">
              <div className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold truncate max-w-[180px]">{state.character.name}</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-white/80 text-sm">{currentYear} Thn</p>
                      <Separator orientation="vertical" className="h-3 bg-white/30" />
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-[9px] bg-white/20 text-white border-none py-0 px-1">Trust Score: {Math.floor(state.character.trustScore)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-70">
                        <Heart className="w-3 h-3" /> Kesehatan
                      </div>
                      <span className="text-sm font-bold">{Math.floor(state.character.health)}%</span>
                    </div>
                    <Progress value={state.character.health} className="h-2 bg-white/20" indicatorClassName="bg-white" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-70">
                        <Smile className="w-3 h-3" /> Mood: {state.character.mood}
                      </div>
                      <span className="text-sm font-bold">{Math.floor(state.character.moodValue)}%</span>
                    </div>
                    <Progress value={state.character.moodValue} className="h-2 bg-white/20" indicatorClassName="bg-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-70">
                        <Utensils className="w-3 h-3" /> Kenyang
                      </div>
                      <span className="text-sm font-bold">{100 - Math.floor(state.character.hunger)}%</span>
                    </div>
                    <Progress value={100 - state.character.hunger} className="h-2 bg-white/20" indicatorClassName="bg-white" />
                  </div>
                </div>
              </div>

              <CardContent className="p-0 bg-white">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="finances" className="px-6 border-b">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 tracking-widest">
                        <Wallet className="w-3 h-3" /> Finansial
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-xs font-medium text-neutral-500">Tunai</span>
                          <span className="text-sm font-bold text-green-600">Rp {Math.floor(state.character.cash).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-xs font-medium text-neutral-500">Bank</span>
                          <span className="text-sm font-bold text-primary">Rp {Math.floor(state.character.bankBalance).toLocaleString('id-ID')}</span>
                        </div>
                        {state.character.casinoBalance > 0 && (
                          <div className="flex justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                            <span className="text-xs font-medium text-green-500">Kasino</span>
                            <span className="text-sm font-bold text-green-600">Rp {Math.floor(state.character.casinoBalance).toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        {state.character.loanAmount > 0 && (
                          <div className="flex justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                            <span className="text-xs font-medium text-red-500">Hutang</span>
                            <span className="text-sm font-bold text-red-600">Rp {Math.floor(state.character.loanAmount).toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        <div className="flex justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                          <span className="text-xs font-medium text-neutral-500">Kekayaan Bersih</span>
                          <span className="text-sm font-bold text-primary">Rp {Math.floor(totalWealth).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2 border-t mt-2">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase">Ringkasan Minggu Ini</p>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-500">Pemasukan</span>
                          <span className="text-green-600 font-bold">+Rp {Math.floor(state.financials.lastIncome).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-500">Pengeluaran</span>
                          <span className="text-red-600 font-bold">-Rp {Math.floor(state.financials.lastExpense).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="skills" className="px-6 border-b">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 tracking-widest">
                        <Target className="w-3 h-3" /> Keahlian & Gelar
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(state.character.skills).map(([sector, value]) => (
                          <div key={sector} className="p-2 bg-neutral-50 rounded-lg border border-neutral-100 flex flex-col">
                            <span className="text-[9px] font-bold text-neutral-500">{sector}</span>
                            <span className="text-sm font-bold text-primary">{Math.floor(value)}</span>
                          </div>
                        ))}
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase">Gelar & Sertifikasi</p>
                        {state.career.educationHistory.length === 0 ? (
                          <p className="text-[10px] text-neutral-400 italic">Belum ada gelar.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {state.career.educationHistory.map((edu, idx) => (
                              <Badge key={idx} variant="outline" className="text-[9px] bg-accent/5 border-accent/20">
                                <GraduationCap className="w-3 h-3 mr-1" /> {edu.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="lifestyle" className="px-6 border-b">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 tracking-widest">
                        <Smile className="w-3 h-3" /> Gaya Hidup
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 space-y-3">
                      <div className="p-3 bg-neutral-50 rounded-xl border space-y-1">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase">Tempat Tinggal</p>
                        <p className="text-sm font-bold">{state.lifestyle.housing.name}</p>
                        <p className="text-[10px] text-primary">Biaya: Rp {Math.floor(state.lifestyle.housing.weeklyCost).toLocaleString('id-ID')} / 4mg</p>
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl border space-y-1">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase">Kendaraan</p>
                        <p className="text-sm font-bold">{state.lifestyle.vehicle.name}</p>
                        <p className="text-[10px] text-primary">Biaya: Rp {Math.floor(state.lifestyle.vehicle.weeklyCost).toLocaleString('id-ID')} / mg</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="current_career" className="px-6 border-b">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 tracking-widest">
                        <Briefcase className="w-3 h-3" /> Karir & Edukasi
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 space-y-4">
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase">Pekerjaan Aktif</p>
                        {state.career.currentJob ? (
                          <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                            <p className="text-sm font-bold">{state.career.currentJob.title}</p>
                            <p className="text-[10px] text-neutral-500">{state.career.currentJob.company}</p>
                            <Button variant="ghost" className="h-6 text-[10px] text-red-500 mt-2 p-0 hover:bg-transparent" onClick={resignJob}>Resign</Button>
                          </div>
                        ) : (
                          <p className="text-[10px] text-neutral-400 italic">Menganggur</p>
                        )}
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase">Pendidikan Sedang Diambil</p>
                        {state.career.currentEducation ? (
                          <div className="p-3 bg-accent/5 rounded-xl border border-accent/20">
                            <p className="text-sm font-bold">{state.career.currentEducation.name}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-[9px] font-bold">
                                <span>Progress</span>
                                <span>{state.career.currentEducation.progressWeeks} / {state.career.currentEducation.durationWeeks} mg</span>
                              </div>
                              <Progress value={(state.career.currentEducation.progressWeeks / state.career.currentEducation.durationWeeks) * 100} className="h-1" />
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-neutral-400 italic">Tidak ada pendidikan aktif.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="my_properties" className="px-6 border-b">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 tracking-widest">
                        <HomeIcon className="w-3 h-3" /> Properti Saya
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      {state.investments.properties.length === 0 ? (
                        <p className="text-[10px] text-neutral-400 italic">Belum memiliki properti.</p>
                      ) : (
                        <div className="space-y-2">
                          {state.investments.properties.map((prop, idx) => (
                            <div key={idx} className="p-3 bg-neutral-50 rounded-xl border flex justify-between items-center">
                              <div>
                                <p className="text-sm font-bold">{prop.name}</p>
                                <p className="text-[9px] text-neutral-500 uppercase font-bold">Income: Rp {Math.floor(prop.weeklyIncome).toLocaleString('id-ID')}/mg</p>
                              </div>
                              <Button variant="ghost" size="sm" className="text-red-500 h-7 text-[10px]" onClick={() => sellProperty(prop.id)}>Jual</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="my_businesses" className="px-6 border-b">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 tracking-widest">
                        <Rocket className="w-3 h-3" /> Bisnis Saya
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      {state.businesses.length === 0 ? (
                        <p className="text-[10px] text-neutral-400 italic">Belum memiliki bisnis.</p>
                      ) : (
                        <div className="space-y-2">
                          {state.businesses.map(biz => (
                            <div key={biz.id} className="p-3 bg-neutral-50 rounded-xl border">
                              <p className="text-sm font-bold">{biz.name}</p>
                              <p className="text-[10px] text-neutral-500 uppercase font-bold">{biz.sector} (Grade {biz.grade.name})</p>
                              <p className={cn("text-[10px] font-bold mt-1", biz.lastWeeklyProfit >= 0 ? "text-green-600" : "text-red-600")}>
                                Profit: Rp {Math.floor(biz.lastWeeklyProfit).toLocaleString('id-ID')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="casino_access" className="px-6 border-b">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 tracking-widest">
                        <Dices className="w-3 h-3" /> Kasino & Hiburan
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <Button 
                        onClick={() => setShowCasino(true)}
                        className="w-full bg-[#00FF41] hover:bg-[#00FF41]/80 text-black font-black uppercase tracking-widest rounded-2xl h-12 shadow-lg shadow-[#00FF41]/20 flex items-center justify-center gap-3"
                      >
                        <Dices className="w-5 h-5" /> Kunjungi Kasino
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <div className="p-4 bg-neutral-50 border-t">
                 <Button variant="ghost" size="sm" onClick={resetGame} title="Reset Game" className="w-full text-[10px] font-bold uppercase text-red-400 hover:text-red-600 hover:bg-red-50">
                    <RefreshCcw className="w-3 h-3 mr-2" /> Reset Seluruh Data
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm h-14 rounded-2xl mb-8 p-1 border">
                <TabsTrigger value="dashboard" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Beranda</TabsTrigger>
                <TabsTrigger value="bank" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Bank</TabsTrigger>
                <TabsTrigger value="career" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Karir</TabsTrigger>
                <TabsTrigger value="bisnis" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Bisnis</TabsTrigger>
                <TabsTrigger value="invest" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Invest</TabsTrigger>
                <TabsTrigger value="shop" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Belanja</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-lg rounded-3xl h-[400px] flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <History className="w-5 h-5 text-primary" />
                        Aktivitas Terkini
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full pr-4">
                        <div className="space-y-3">
                          {state.logs.map((log, i) => (
                            <div key={i} className="text-sm border-l-4 border-primary/20 pl-4 py-2 bg-neutral-50 rounded-r-xl">
                              {log}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-lg rounded-3xl h-[400px] flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Newspaper className="w-5 h-5 text-primary" />
                        Kilas Berita
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full pr-4">
                        <div className="space-y-3">
                          {state.news.map((n, i) => (
                            <div key={i} className="text-sm p-4 bg-primary/5 rounded-2xl font-medium border border-primary/10">
                              {n}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-lg rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Smile className="w-5 h-5 text-accent" />
                        Waktunya Refreshing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {REFRESHING_OPTIONS.map((opt) => (
                          <div key={opt.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-3 group hover:border-accent/50 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-xl shadow-sm text-accent">
                                <opt.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-bold">{opt.name}</h4>
                                <p className="text-[10px] text-neutral-500">Mood: +{opt.moodGain}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary">{opt.cost === 0 ? "Gratis" : `Rp ${Math.floor(opt.cost).toLocaleString('id-ID')}`}</span>
                              <Button size="sm" variant="ghost" className="rounded-xl h-8 text-accent hover:bg-accent hover:text-white" onClick={() => refreshMood(opt)}>
                                Jalani
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg rounded-3xl border-t-4 border-red-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Heart className="w-5 h-5 text-red-500" />
                        Rumah Sakit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                        <p className="text-xs font-bold text-red-800 mb-1 uppercase tracking-tight">Kondisi Saat Ini</p>
                        <p className="text-sm font-medium text-red-600">"{getHealthStatus(state.character.health)}"</p>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl">
                        <div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase">Biaya Berobat</p>
                          <p className="text-lg font-black text-neutral-800">Rp {Math.floor(hospitalTreatment.cost).toLocaleString('id-ID')}</p>
                        </div>
                        <Button 
                          onClick={() => treatHealth(hospitalTreatment.cost, hospitalTreatment.gain)}
                          disabled={state.character.health >= 100 || state.character.cash < hospitalTreatment.cost}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                        >
                          Berobat (+{hospitalTreatment.gain}%)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-8">
                {state.character.loanAmount > 0 && (
                  <Card className="border-none shadow-lg rounded-3xl bg-red-50 border-2 border-red-200 overflow-hidden">
                    <div className="bg-red-600 p-4 text-white flex items-center gap-3">
                      <FileText className="w-6 h-6" />
                      <h3 className="text-lg font-black uppercase tracking-widest">Surat Hutang Terbit</h3>
                    </div>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-red-400 uppercase">Total Kewajiban</p>
                          <p className="text-3xl font-black text-red-700">Rp {Math.floor(state.character.loanAmount).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-red-400 uppercase">Bunga Berjalan</p>
                          <p className="text-3xl font-black text-red-700">{(trustStatus.interest * 100).toFixed(1)}% / mg</p>
                        </div>
                      </div>
                      <Separator className="bg-red-200" />
                      <div className="p-4 bg-white/50 rounded-2xl border border-red-100">
                        <p className="text-xs text-red-600 font-medium leading-relaxed italic">
                          "Berdasarkan Trust Score Anda ({trustStatus.label}), pinjaman ini akan terus bertambah setiap minggu jika tidak segera dilunasi. Seluruh akses pinjaman baru telah dibekukan sampai saldo hutang kembali ke nol."
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-none shadow-lg rounded-3xl p-8 bg-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" /> Sistem Trust Score
                      </h3>
                      <p className="text-sm text-neutral-500 max-w-md">Bank menilai kredibilitas Anda. Skor tinggi membuka akses pinjaman besar dengan bunga rendah.</p>
                    </div>
                    <div className="w-full md:w-64 space-y-2 p-4 bg-neutral-50 rounded-2xl border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-neutral-400 uppercase">Trust Level</span>
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full bg-white border", trustStatus.color)}>{trustStatus.label}</span>
                      </div>
                      <Progress value={state.character.trustScore} className="h-2" indicatorClassName={cn(trustStatus.color.replace('text-', 'bg-'))} />
                      <p className="text-[10px] text-center font-medium text-neutral-500">{Math.floor(state.character.trustScore)} / 100 Poin</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                        <h4 className="font-bold flex items-center gap-2"><PiggyBank className="w-4 h-4 text-primary" /> Tabungan (0.1% Bunga)</h4>
                        <Input 
                          type="number" 
                          placeholder="Jumlah Rupiah..." 
                          className="rounded-xl h-11"
                          value={bankDepositInput || ""}
                          onChange={(e) => setBankDepositInput(Number(e.target.value))}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Button onClick={() => { bankAction('deposit', bankDepositInput); setBankDepositInput(0); }} className="rounded-xl">Simpan</Button>
                          <Button onClick={() => { bankAction('withdraw', bankDepositInput); setBankDepositInput(0); }} variant="outline" className="rounded-xl" disabled={state.character.bankLockWeeks > 0}>Tarik</Button>
                        </div>
                        {state.character.bankLockWeeks > 0 && <p className="text-[10px] text-center text-red-500 font-bold italic">Terkunci: {state.character.bankLockWeeks} minggu lagi</p>}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Pengajuan Pinjaman</h4>
                          {state.character.loanAmount > 0 && <Badge variant="destructive" className="text-[8px]">Dibekukan</Badge>}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
                          <div className="space-y-1">
                            <p className="text-neutral-400 uppercase">Limit Tersedia</p>
                            <p className="text-neutral-800">Rp {Math.floor(trustStatus.limit).toLocaleString('id-ID')}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-neutral-400 uppercase">Bunga Mingguan</p>
                            <p className="text-primary">{(trustStatus.interest * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                        <Input 
                          type="number" 
                          placeholder="Jumlah Rupiah..." 
                          className="rounded-xl h-11"
                          value={loanInput || ""}
                          onChange={(e) => setLoanInput(Number(e.target.value))}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            onClick={() => { bankAction('loan', loanInput); setLoanInput(0); }} 
                            className="rounded-xl"
                            disabled={state.character.loanAmount > 0}
                          >
                            Ajukan
                          </Button>
                          <Button onClick={() => { bankAction('repay', loanInput); setLoanInput(0); }} variant="outline" className="rounded-xl" disabled={state.character.loanAmount <= 0}>Pelunasan</Button>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-red-50 border border-red-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-red-700 flex items-center gap-2"><Zap className="w-4 h-4" /> Pinjaman Darurat</h4>
                          <Badge variant="destructive" className="text-[8px]">Penalti Skor -15</Badge>
                        </div>
                        <p className="text-[10px] text-red-600">Bunga flat 10% per minggu. Hanya tersedia jika Trust Score {'>'} 0.</p>
                        <Button 
                          variant="destructive" 
                          className="w-full rounded-xl" 
                          onClick={() => bankAction('emergency', 10000000)}
                          disabled={state.character.trustScore === 0 || state.character.loanAmount > 0}
                        >
                          Ambil Rp 10.000.000
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="career" className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-3xl shadow-sm border mb-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-neutral-500">
                    <Filter className="w-4 h-4" /> Filter Kerja:
                  </div>
                  <select 
                    className="h-10 border rounded-xl px-4 text-xs bg-neutral-50"
                    value={jobSectorFilter}
                    onChange={(e) => setJobSectorFilter(e.target.value)}
                  >
                    <option value="Semua">Semua Sektor</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Finansial">Finansial</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Pemasaran">Pemasaran</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-bold uppercase">Gaji Min:</span>
                    <Input 
                      type="number" 
                      className="h-10 w-32 rounded-xl text-xs" 
                      placeholder="Rp..." 
                      value={minSalaryFilter || ""}
                      onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                      <Briefcase className="w-5 h-5 text-primary" /> Lowongan Kerja ({filteredJobs.length})
                    </h3>
                    <div className="space-y-4">
                      {filteredJobs.map((job) => (
                        <Card key={job.id} className="border-none shadow-md rounded-2xl hover:ring-2 hover:ring-primary/20 transition-all group">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-neutral-800">{job.title}</h4>
                                <p className="text-xs text-neutral-500">{job.company} • {job.sector}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Rp {Math.floor(job.salary).toLocaleString('id-ID')}</Badge>
                            </div>
                            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">{job.description}</p>
                            
                            <div className="mb-4 flex flex-wrap gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase">Syarat Pendidikan</p>
                                <Badge variant="outline" className={cn("text-[9px]", job.requirements.education === "Tidak Ada" ? "bg-neutral-50" : "bg-blue-50 text-blue-700 border-blue-200")}>
                                  <GraduationCap className="w-3 h-3 mr-1" /> {job.requirements.education}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase">Syarat Keahlian</p>
                                <div className="flex gap-1 flex-wrap">
                                  {Object.entries(job.requirements.skills).map(([s, v]) => (
                                    <Badge key={s} variant="outline" className="text-[9px] px-1 py-0">{s}: {v}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Separator className="mb-4" />
                            <div className="flex items-center justify-end">
                              <Button 
                                size="sm" 
                                className="rounded-xl"
                                onClick={() => applyForJob(job)}
                                disabled={state.career.currentJob?.id === job.id}
                              >
                                Lamar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                      <Award className="w-5 h-5 text-accent" /> Pendidikan & Kursus
                    </h3>
                    <div className="space-y-4">
                      {state.career.availableCourses.map((edu) => (
                        <Card key={edu.id} className="border-none shadow-md rounded-2xl">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-neutral-800 text-sm">{edu.name}</h4>
                                <Badge variant="secondary" className="text-[9px] h-4">{edu.type}</Badge>
                              </div>
                              <span className="text-sm font-bold text-accent">Rp {Math.floor(edu.cost).toLocaleString('id-ID')}</span>
                            </div>
                            
                            <div className="p-3 bg-neutral-50 rounded-xl mt-3 mb-4">
                              <p className="text-[9px] font-bold text-neutral-400 uppercase mb-1">Hadiah Skill</p>
                              <div className="flex gap-1 flex-wrap">
                                {Object.entries(edu.rewardSkills).map(([s, v]) => (
                                  <Badge key={s} variant="outline" className="text-[9px] bg-white text-accent border-accent/20">+{v} {s}</Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-[10px] text-neutral-500">
                                <p>Durasi: {edu.durationWeeks} minggu</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="rounded-xl border-accent text-accent hover:bg-accent hover:text-white"
                                onClick={() => enrollCourse(edu)}
                                disabled={!!state.career.currentEducation || state.career.educationHistory.some(h => h.name === edu.name)}
                              >
                                Daftar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bisnis" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="col-span-1 border-none shadow-lg rounded-3xl p-6 h-fit sticky top-24">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-primary" /> Dirikan Bisnis
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl mb-4">
                        <p className="text-[10px] text-yellow-800 font-bold leading-tight">
                          Info: Bisnis dimulai dengan anggaran mandiri sebesar 1/2 dari modal pendirian. Ada fase rugi 10% selama 8 minggu pertama.
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Nama Bisnis</label>
                        <Input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="CEO Corp..." className="rounded-xl mt-1" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Sektor</label>
                        <select className="w-full h-10 border rounded-xl px-3 text-sm mt-1" value={bizSector} onChange={e => setBizSector(e.target.value as Sector)}>
                          <option value="Teknologi">Teknologi</option>
                          <option value="Finansial">Finansial</option>
                          <option value="Manajemen">Manajemen</option>
                          <option value="Pemasaran">Pemasaran</option>
                          <option value="Pendidikan">Pendidikan</option>
                          <option value="Kesehatan">Kesehatan</option>
                          <option value="Entertainment">Entertainment</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-neutral-400">Grade & Modal</label>
                        {BUSINESS_GRADES.map(grade => (
                          <Button key={grade.id} variant="outline" className="w-full justify-between text-xs rounded-xl h-12" onClick={() => { createBusiness(bizName, bizSector, grade); setBizName(""); }}>
                            <span>{grade.name}</span>
                            <span className="font-bold">Rp {(Math.floor(grade.setupCost)/1000000).toLocaleString('id-ID')}jt</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <div className="md:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold px-2">Manajemen Operasional</h3>
                    {state.career.currentJob && (
                      <div className="mx-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <p className="text-[10px] text-red-700 font-bold leading-tight">
                          PERINGATAN: Anda sedang bekerja! Jika tidak menyewa Manajer, bisnis akan rugi 10% per minggu karena terbengkalai.
                        </p>
                      </div>
                    )}
                    {state.businesses.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed flex flex-col items-center">
                        <Building2 className="w-8 h-8 text-neutral-200 mb-2" />
                        <p className="text-neutral-400 italic text-sm">Anda belum memiliki bisnis.</p>
                      </div>
                    ) : (
                      state.businesses.map(biz => (
                        <Card key={biz.id} className="border-none shadow-md rounded-3xl overflow-hidden">
                          <div className="bg-neutral-100 px-6 py-4 flex justify-between items-center">
                            <div>
                              <h4 className="font-bold">{biz.name}</h4>
                              <p className="text-[10px] text-neutral-500 uppercase font-bold">{biz.sector} • {biz.grade.name}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge className={cn("mb-1", biz.weeksActive <= 8 ? "bg-orange-500" : "bg-primary")}>
                                {biz.weeksActive <= 8 ? `Startup mg ${biz.weeksActive}/8` : `Aktif ${biz.weeksActive} mg`}
                              </Badge>
                              <p className={cn("text-[10px] font-bold", biz.lastWeeklyProfit >= 0 ? "text-green-600" : "text-red-600")}>
                                Profit: Rp {Math.floor(biz.lastWeeklyProfit).toLocaleString('id-ID')}/mg
                              </p>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Anggaran Bisnis</p>
                                <p className="text-lg font-black text-primary">Rp {Math.floor(biz.budget).toLocaleString('id-ID')}</p>
                                
                                <div className="space-y-2 pt-2 border-t border-primary/10">
                                  <Input 
                                    type="number" 
                                    placeholder="Nominal..." 
                                    className="h-8 text-xs rounded-lg"
                                    value={bizAmounts[biz.id] || ""}
                                    onChange={(e) => setBizAmounts(prev => ({ ...prev, [biz.id]: Number(e.target.value) }))}
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg" onClick={() => { withdrawFromBusiness(biz.id, bizAmounts[biz.id] || 0); setBizAmounts(prev => ({ ...prev, [biz.id]: 0 })); }}>Tarik</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg" onClick={() => { depositToBusiness(biz.id, bizAmounts[biz.id] || 0); setBizAmounts(prev => ({ ...prev, [biz.id]: 0 })); }}>Setor</Button>
                                  </div>
                                  <Button size="sm" variant="ghost" className="w-full h-7 text-[10px] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => sellBusiness(biz.id)}>Jual Bisnis</Button>
                                </div>
                              </div>
                              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                                <div className="flex justify-between items-center mb-1">
                                  <p className="text-[10px] text-neutral-400 uppercase font-bold">Manajer</p>
                                  {biz.manager && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-5 w-5 text-red-400 hover:text-red-600"
                                      onClick={() => fireManager(biz.id)}
                                      title="Pecat Manajer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                                <p className="text-sm font-bold mb-2">{biz.manager?.name || "Posisi Kosong"}</p>
                                {!biz.manager ? (
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value="hire" className="border-none">
                                      <AccordionTrigger className="p-0 hover:no-underline text-[10px] text-primary font-bold">Pilih Manajer</AccordionTrigger>
                                      <AccordionContent className="pt-2 space-y-1">
                                        {MANAGER_GRADES.map(m => (
                                          <Button key={m.id} variant="secondary" size="sm" className="w-full justify-between h-7 text-[10px] rounded-md" onClick={() => hireManager(biz.id, m)}>
                                            <span>{m.name}</span>
                                            <span className="font-bold">Rp {Math.floor(m.weeklySalary).toLocaleString('id-ID')}/mg</span>
                                          </Button>
                                        ))}
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    <p className="text-[10px] text-green-600 font-bold">Boost: +{biz.manager.successBoost * 100}%</p>
                                    <p className="text-[8px] text-neutral-400">Kompensasi Pecat: Rp {(biz.manager.weeklySalary * 2).toLocaleString('id-ID')}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="pt-4 border-t flex justify-between items-center">
                              <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase">Efisiensi Sektor</p>
                                <p className="text-xs font-bold text-green-600">
                                  +{(state.character.skills[biz.sector] || 0).toFixed(1)}% Skill Bonus
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase">Beban Gaji</p>
                                <p className="text-xs font-bold text-red-600">Rp {Math.floor(biz.manager?.weeklySalary || 0).toLocaleString('id-ID')}/mg</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="invest" className="space-y-8">
                <MarketPanel 
                  market={state.investments.market} 
                  portfolio={state.investments.portfolio} 
                  onTrade={tradeAsset}
                />
              </TabsContent>

              <TabsContent value="shop" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                      <Utensils className="w-5 h-5 text-primary" /> Katering & Makanan
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {FOOD_ITEMS.map((food) => (
                        <div key={food.id} className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-100 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Utensils className="w-5 h-5 text-primary/50" />
                            <div>
                              <h4 className="font-bold text-sm">{food.name}</h4>
                              <p className="text-[10px] text-neutral-400">Nutrisi: +{food.healthValue} | Kenyang: +{food.hungerValue}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-primary">Rp {Math.floor(food.cost).toLocaleString('id-ID')}</span>
                            <Button size="sm" variant="ghost" className="rounded-xl h-8 w-8 p-0" onClick={() => buyFood(food)}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold flex items-center gap-2 px-2 pt-6">
                      <Car className="w-5 h-5 text-primary" /> Dealer Kendaraan
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {VEHICLE_POOL.map((v) => (
                        <Card key={v.id} className="border-none shadow-sm rounded-xl p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold">{v.name}</p>
                              <p className="text-[10px] text-neutral-400">Biaya: Rp {Math.floor(v.weeklyCost).toLocaleString('id-ID')}/mg</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-accent uppercase">Mood Boost</p>
                              <p className="text-xs font-bold text-accent">+{v.moodBoost}/mg</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full rounded-xl" 
                            disabled={state.lifestyle.vehicle.id === v.id}
                            onClick={() => upgradeLifestyle(v)}
                          >
                            Beli Rp {Math.floor(v.cost).toLocaleString('id-ID')}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                      <HomeIcon className="w-5 h-5 text-primary" /> Agen Properti
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {state.investments.propertyOffers.map((prop) => {
                        const imgData = getPropertyImage(prop.id);
                        return (
                          <Card key={prop.id} className="border-none shadow-md rounded-2xl overflow-hidden group">
                            <div className="relative h-40 w-full">
                              <Image 
                                src={imgData.imageUrl} 
                                alt={prop.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                data-ai-hint={imgData.imageHint}
                              />
                            </div>
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-neutral-800">{prop.name}</h4>
                                <span className="text-xs font-bold text-primary">Rp {Math.floor(prop.cost).toLocaleString('id-ID')}</span>
                              </div>
                              <p className="text-[10px] text-neutral-500 mb-4">{prop.description}</p>
                              <Button size="sm" className="w-full rounded-xl" onClick={() => buyProperty(prop)}>Beli Aset</Button>
                            </div>
                          </Card>
                        )
                      })}
                    </div>

                    <h3 className="text-lg font-bold flex items-center gap-2 px-2 pt-6">
                      <Building className="w-5 h-5 text-primary" /> Hunian Utama
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {HOUSING_POOL.map((h) => (
                        <Card key={h.id} className="border-none shadow-sm rounded-xl p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold">{h.name}</p>
                              <p className="text-[10px] text-neutral-400">Sewa/Cicilan: Rp {Math.floor(h.weeklyCost).toLocaleString('id-ID')} (Tiap 4 Minggu)</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-accent uppercase">Mood Boost</p>
                              <p className="text-xs font-bold text-accent">+{h.moodBoost}/mg</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full rounded-xl" 
                            disabled={state.lifestyle.housing.id === h.id}
                            onClick={() => upgradeLifestyle(h)}
                          >
                            Huni Rp {Math.floor(h.cost).toLocaleString('id-ID')}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <AlertDialog open={state.isGameOver}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader className="items-center text-center">
            <Heart className="w-10 h-10 text-destructive mb-4" />
            <AlertDialogTitle className="text-2xl font-black">Perjalanan Berhenti</AlertDialogTitle>
            <AlertDialogDescription>
              {state.gameOverReason}
              <br /><br />
              <span className="font-bold">
                Kekayaan Akhir: Rp {Math.floor(totalWealth).toLocaleString('id-ID')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame} className="w-full rounded-2xl">Mulai Baru</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
}
