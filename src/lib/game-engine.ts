import { GameState, Asset, Job, FoodItem, Property, Education, Sector, LifestyleItem, Mood, BusinessGrade, ManagerGrade, Business } from '@/types/game';

export const HUNGER_GAIN_PER_WEEK = 15;
export const HEALTH_DECAY_WHEN_STARVING = 10;
export const BANK_INTEREST_RATE = 0.001; // 0.1% per week
export const BANK_LOCK_PERIOD = 4; // 4 weeks lock per deposit

export const BUSINESS_GRADES: BusinessGrade[] = [
  { id: 'startup', name: 'Startup', setupCost: 50000000, baseWeeklyYield: 0.02 },
  { id: 'umkm', name: 'UMKM Mandiri', setupCost: 500000000, baseWeeklyYield: 0.03 },
  { id: 'corporate', name: 'Korporat Nasional', setupCost: 5000000000, baseWeeklyYield: 0.04 },
  { id: 'international', name: 'Ekspansi Internasional', setupCost: 50000000000, baseWeeklyYield: 0.05 },
];

export const MANAGER_GRADES: ManagerGrade[] = [
  { id: 'normal', name: 'Manajer Junior', weeklySalary: 2500000, successBoost: 0.05 },
  { id: 'specialist', name: 'Manajer Spesialis', weeklySalary: 15000000, successBoost: 0.15 },
  { id: 'expert', name: 'Manajer Ahli', weeklySalary: 75000000, successBoost: 0.35 },
];

export const HOUSING_POOL: LifestyleItem[] = [
  { id: 'h_kost_narrow', name: 'Kost Sempit', type: 'housing', cost: 0, weeklyCost: 350000, moodBoost: -2, description: 'Tempat tinggal seadanya.' },
  { id: 'h_kost_mid', name: 'Kost Sedang', type: 'housing', cost: 5000000, weeklyCost: 750000, moodBoost: -0.5, description: 'Lebih luas dengan kamar mandi dalam.' },
  { id: 'h_kost_pro', name: 'Kost Bagus', type: 'housing', cost: 15000000, weeklyCost: 1200000, moodBoost: 1, description: 'Fasilitas lengkap dan AC.' },
  { id: 'h_apart', name: 'Apartemen Studio', type: 'housing', cost: 50000000, weeklyCost: 1500000, moodBoost: 2, description: 'Nyaman untuk satu orang.' },
  { id: 'h_house', name: 'Rumah Kompleks', type: 'housing', cost: 500000000, weeklyCost: 4000000, moodBoost: 4, description: 'Hunian ideal keluarga.' },
  { id: 'h_mansion', name: 'Mansion Mewah', type: 'housing', cost: 5000000000, weeklyCost: 20000000, moodBoost: 8, description: 'Simbol kesuksesan sejati.' },
];

export const VEHICLE_POOL: LifestyleItem[] = [
  { id: 'v_none', name: 'Jalan Kaki / Umum', type: 'vehicle', cost: 0, weeklyCost: 18750, moodBoost: -1, description: 'Hemat tapi lelah.' },
  { id: 'v_motor', name: 'Motor Matic', type: 'vehicle', cost: 20000000, weeklyCost: 31250, moodBoost: 0.5, description: 'Lincah di kemacetan.' },
  { id: 'v_car_lcgc', name: 'Mobil LCGC', type: 'vehicle', cost: 150000000, weeklyCost: 150000, moodBoost: 2, description: 'Terlindung dari hujan.' },
  { id: 'v_car_luxury', name: 'Mobil Mewah', type: 'vehicle', cost: 1200000000, weeklyCost: 812500, moodBoost: 5, description: 'Gengsi di jalanan.' },
];

export const FOOD_ITEMS: FoodItem[] = [
  { id: 'indomie', name: 'Mie Instan', cost: 150000, hungerValue: 20, healthValue: -5 },
  { id: 'warteg', name: 'Katering Warteg', cost: 500000, hungerValue: 40, healthValue: 2 },
  { id: 'padang', name: 'Katering Nasi Padang', cost: 850000, hungerValue: 60, healthValue: 3 },
  { id: 'healthy_bowl', name: 'Paket Salad Sehat', cost: 1500000, hungerValue: 50, healthValue: 10 },
  { id: 'steak', name: 'Fine Dining Buffet', cost: 5000000, hungerValue: 80, healthValue: 5 },
];

export const PROPERTY_POOL: Property[] = [
  { id: 'kost', name: 'Kamar Kost', cost: 250000000, weeklyIncome: 1250000, maintenance: 200000, description: 'Investasi properti pemula di area kampus.' },
  { id: 'ruko', name: 'Ruko Minimalis', cost: 1500000000, weeklyIncome: 8500000, maintenance: 1500000, description: 'Bagus untuk disewakan ke UMKM atau kafe.' },
  { id: 'apartment', name: 'Apartemen Mewah', cost: 4500000000, weeklyIncome: 25000000, maintenance: 5000000, description: 'Pendapatan pasif stabil di pusat kota.' },
  { id: 'office', name: 'Gedung Perkantoran', cost: 15000000000, weeklyIncome: 120000000, maintenance: 35000000, description: 'Langkah menjadi taipan real estate sejati.' },
];

export const JOBS_POOL: Job[] = [
  // --- UMUM ---
  { id: 'kuli_proyek', title: 'Kuli Proyek', company: 'Bangun Jaya', sector: 'Umum', description: 'Pekerjaan fisik kasar di lokasi konstruksi.', salary: 600000, requirements: { education: 'Tidak Ada', skills: { Umum: 0 } } },
  { id: 'staff_gudang', title: 'Staff Gudang', company: 'Logistik Cepat', sector: 'Umum', description: 'Mengelola arus keluar masuk barang.', salary: 1200000, requirements: { education: 'Tidak Ada', skills: { Umum: 15 } } },
  { id: 'supervisor_lapangan', title: 'Supervisor Lapangan', company: 'Harta Konstruksi', sector: 'Umum', description: 'Mengawasi jalannya proyek di lapangan.', salary: 2500000, requirements: { education: 'Tidak Ada', skills: { Umum: 40, Manajemen: 10 } } },
  { id: 'kepala_operasional', title: 'Kepala Operasional', company: 'Gudang Nasional', sector: 'Umum', description: 'Bertanggung jawab atas seluruh logistik wilayah.', salary: 5000000, requirements: { education: 'S1 Manajemen Bisnis', skills: { Umum: 80, Manajemen: 30 } } },

  // --- TEKNOLOGI ---
  { id: 'intern_tech', title: 'Magang IT', company: 'ByteCore', sector: 'Teknologi', description: 'Membantu dokumentasi dan testing dasar.', salary: 1500000, requirements: { education: 'Tidak Ada', skills: { Teknologi: 5 } } },
  { id: 'dev_jr', title: 'Junior Developer', company: 'TechNova', sector: 'Teknologi', description: 'Membangun aplikasi web menggunakan React.', salary: 5000000, requirements: { education: 'Tidak Ada', skills: { Teknologi: 30 } } },
  { id: 'dev_sr', title: 'Senior Developer', company: 'Global Soft', sector: 'Teknologi', description: 'Arsitek sistem dan mentor tim developer.', salary: 12000000, requirements: { education: 'S1 Ilmu Komputer', skills: { Teknologi: 70 } } },
  { id: 'cto', title: 'Chief Technology Officer', company: 'Unicorn ID', sector: 'Teknologi', description: 'Menentukan visi teknologi perusahaan.', salary: 35000000, requirements: { education: 'S1 Ilmu Komputer', skills: { Teknologi: 120, Manajemen: 50 } } },

  // --- FINANSIAL ---
  { id: 'kasir_jr', title: 'Admin Kasir', company: 'Retail Indo', sector: 'Finansial', description: 'Mengelola transaksi harian pelanggan.', salary: 1800000, requirements: { education: 'Tidak Ada', skills: { Finansial: 5 } } },
  { id: 'accountant_jr', title: 'Junior Accountant', company: 'Ledgerly', sector: 'Finansial', description: 'Mengerjakan pembukuan bulanan.', salary: 4500000, requirements: { education: 'Tidak Ada', skills: { Finansial: 25 } } },
  { id: 'analyst_sr', title: 'Senior Financial Analyst', company: 'Global Wealth', sector: 'Finansial', description: 'Menganalisis risiko dan peluang pasar.', salary: 15000000, requirements: { education: 'S1 Ekonomi & Bisnis', skills: { Finansial: 60 } } },
  { id: 'cfo', title: 'Chief Financial Officer', company: 'Mega Bank', sector: 'Finansial', description: 'Direktur keuangan grup perusahaan.', salary: 45000000, requirements: { education: 'S1 Ekonomi & Bisnis', skills: { Finansial: 110, Manajemen: 60 } } },

  // --- MANAJEMEN ---
  { id: 'resepsionis', title: 'Resepsionis', company: 'Grand Hotel', sector: 'Manajemen', description: 'Menyapa tamu dan mengelola janji temu.', salary: 2000000, requirements: { education: 'Tidak Ada', skills: { Manajemen: 5 } } },
  { id: 'admin_staff', title: 'Staff Administrasi', company: 'Office Pro', sector: 'Manajemen', description: 'Mengelola database dan operasional kantor.', salary: 4000000, requirements: { education: 'Tidak Ada', skills: { Manajemen: 20 } } },
  { id: 'manager_div', title: 'Manajer Divisi', company: 'Corporindo', sector: 'Manajemen', description: 'Memimpin satu departemen dalam perusahaan.', salary: 10000000, requirements: { education: 'S1 Manajemen Bisnis', skills: { Manajemen: 60 } } },
  { id: 'ceo_group', title: 'CEO Group', company: 'Legacy Group', sector: 'Manajemen', description: 'Pemimpin tertinggi seluruh grup perusahaan.', salary: 60000000, requirements: { education: 'S1 Manajemen Bisnis', skills: { Manajemen: 150, Finansial: 80 } } },

  // --- PEMASARAN ---
  { id: 'spg_spb', title: 'Sales Promotion', company: 'Event Master', sector: 'Pemasaran', description: 'Mempromosikan produk langsung ke konsumen.', salary: 1500000, requirements: { education: 'Tidak Ada', skills: { Pemasaran: 5 } } },
  { id: 'social_admin', title: 'Admin Sosial Media', company: 'ViralUp', sector: 'Pemasaran', description: 'Mengelola konten di berbagai platform.', salary: 3500000, requirements: { education: 'Tidak Ada', skills: { Pemasaran: 25 } } },
  { id: 'creative_lead', title: 'Creative Lead', company: 'Ad Agency', sector: 'Pemasaran', description: 'Memimpin kampanye kreatif brand besar.', salary: 9000000, requirements: { education: 'S1 Komunikasi Pemasaran', skills: { Pemasaran: 60 } } },
  { id: 'cmo', title: 'Chief Marketing Officer', company: 'RetailX', sector: 'Pemasaran', description: 'Arsitek strategi pemasaran global.', salary: 30000000, requirements: { education: 'S1 Komunikasi Pemasaran', skills: { Pemasaran: 120, Manajemen: 40 } } },

  // --- PENDIDIKAN ---
  { id: 'tutor_asst', title: 'Asisten Tutor', company: 'Bimbel Cerdas', sector: 'Pendidikan', description: 'Membantu persiapan materi ajar.', salary: 1200000, requirements: { education: 'Tidak Ada', skills: { Pendidikan: 5 } } },
  { id: 'tutor_honorer', title: 'Guru Honorer', company: 'Sekolah Kita', sector: 'Pendidikan', description: 'Mengajar kelas di sekolah dasar.', salary: 3000000, requirements: { education: 'Tidak Ada', skills: { Pendidikan: 30 } } },
  { id: 'dosen_tetap', title: 'Dosen Tetap', company: 'Univ Merdeka', sector: 'Pendidikan', description: 'Mengajar dan melakukan penelitian.', salary: 8000000, requirements: { education: 'S1 Pendidikan', skills: { Pendidikan: 70 } } },
  { id: 'rektor', title: 'Rektor Universitas', company: 'Univ Merdeka', sector: 'Pendidikan', description: 'Pemimpin operasional perguruan tinggi.', salary: 40000000, requirements: { education: 'S1 Pendidikan', skills: { Pendidikan: 140, Manajemen: 70 } } },

  // --- KESEHATAN ---
  { id: 'helper_klinik', title: 'Helper Klinik', company: 'Klinik Sehat', sector: 'Kesehatan', description: 'Membantu kebersihan dan alur pasien.', salary: 1500000, requirements: { education: 'Tidak Ada', skills: { Kesehatan: 5 } } },
  { id: 'nurse_sr', title: 'Perawat Senior', company: 'RS Medika', sector: 'Kesehatan', description: 'Bertanggung jawab atas perawatan pasien.', salary: 5000000, requirements: { education: 'S1 Keperawatan', skills: { Kesehatan: 40 } } },
  { id: 'doctor_gen', title: 'Dokter Umum', company: 'RS Medika', sector: 'Kesehatan', description: 'Menangani diagnosis pasien umum.', salary: 15000000, requirements: { education: 'S1 Kedokteran', skills: { Kesehatan: 90 } } },
  { id: 'doctor_spec', title: 'Dokter Spesialis', company: 'RS Medika', sector: 'Kesehatan', description: 'Ahli bedah atau spesialis organ.', salary: 50000000, requirements: { education: 'S1 Kedokteran', skills: { Kesehatan: 160, Pendidikan: 20 } } },

  // --- ENTERTAINMENT ---
  { id: 'figuran', title: 'Figuran Film', company: 'Casting ID', sector: 'Entertainment', description: 'Latar belakang di adegan film.', salary: 1000000, requirements: { education: 'Tidak Ada', skills: { Entertainment: 5 } } },
  { id: 'creator_master', title: 'Content Creator', company: 'Freelance', sector: 'Entertainment', description: 'Memproduksi konten digital mandiri.', salary: 4000000, requirements: { education: 'Tidak Ada', skills: { Entertainment: 30, Pemasaran: 10 } } },
  { id: 'artis_sr', title: 'Artis Terkenal', company: 'Global Pictures', sector: 'Entertainment', description: 'Bintang utama dalam produksi besar.', salary: 20000000, requirements: { education: 'Sertifikasi Seni Peran', skills: { Entertainment: 80, Pemasaran: 40 } } },
  { id: 'producer', title: 'Produser Film', company: 'Major Studio', sector: 'Entertainment', description: 'Mengelola pendanaan dan produksi film.', salary: 50000000, requirements: { education: 'Sertifikasi Seni Peran', skills: { Entertainment: 140, Manajemen: 60 } } },
];

export const COURSES_POOL: Education[] = [
  // FREE COURSES
  { id: 'free_tech', name: 'Web Dev Fundamentals', type: 'Kursus Online', cost: 0, durationWeeks: 4, completed: false, progressWeeks: 0, rewardSkills: { Teknologi: 5 } },
  { id: 'free_fin', name: 'Personal Finance 101', type: 'Kursus Online', cost: 0, durationWeeks: 4, completed: false, progressWeeks: 0, rewardSkills: { Finansial: 5 } },
  { id: 'free_mgmt', name: 'Basic Management', type: 'Kursus Online', cost: 0, durationWeeks: 4, completed: false, progressWeeks: 0, rewardSkills: { Manajemen: 5 } },
  
  // DEGREE PROGRAMS
  { id: 'uni_tech', name: 'S1 Ilmu Komputer', type: 'Gelar', cost: 95000000, durationWeeks: 156, completed: false, progressWeeks: 0, rewardSkills: { Teknologi: 50, Manajemen: 10 } },
  { id: 'uni_fin', name: 'S1 Ekonomi & Bisnis', type: 'Gelar', cost: 85000000, durationWeeks: 156, completed: false, progressWeeks: 0, rewardSkills: { Finansial: 45, Manajemen: 15 } },
  { id: 'uni_mkt', name: 'S1 Komunikasi Pemasaran', type: 'Gelar', cost: 75000000, durationWeeks: 156, completed: false, progressWeeks: 0, rewardSkills: { Pemasaran: 40, Manajemen: 10 } },
  { id: 'uni_s1', name: 'S1 Manajemen Bisnis', type: 'Gelar', cost: 85000000, durationWeeks: 156, completed: false, progressWeeks: 0, rewardSkills: { Manajemen: 45, Finansial: 15 } },
  { id: 'uni_edu', name: 'S1 Pendidikan', type: 'Gelar', cost: 65000000, durationWeeks: 156, completed: false, progressWeeks: 0, rewardSkills: { Pendidikan: 55, Manajemen: 10 } },
  { id: 'uni_nurse', name: 'S1 Keperawatan', type: 'Gelar', cost: 65000000, durationWeeks: 156, completed: false, progressWeeks: 0, rewardSkills: { Kesehatan: 55, Manajemen: 5 } },
  { id: 'uni_med', name: 'S1 Kedokteran', type: 'Gelar', cost: 150000000, durationWeeks: 208, completed: false, progressWeeks: 0, rewardSkills: { Kesehatan: 70, Pendidikan: 15 } },
  
  // CERTIFICATIONS
  { id: 'ent_cert', name: 'Sertifikasi Seni Peran', type: 'Kursus Offline', cost: 25000000, durationWeeks: 48, completed: false, progressWeeks: 0, rewardSkills: { Entertainment: 60, Pemasaran: 20 } },
  { id: 'ent_online', name: 'Content Creator Masterclass', type: 'Kursus Online', cost: 3500000, durationWeeks: 8, completed: false, progressWeeks: 0, rewardSkills: { Entertainment: 20, Pemasaran: 10 } },
];

export const INITIAL_MARKET: Asset[] = [
  { id: 'btc', name: 'Bitcoin', type: 'kripto', price: 1500000000, volatility: 0.08, history: Array(20).fill(1500000000) },
  { id: 'eth', name: 'Ethereum', type: 'kripto', price: 45000000, volatility: 0.1, history: Array(20).fill(45000000) },
  { id: 'sol', name: 'Solana', type: 'kripto', price: 2500000, volatility: 0.15, history: Array(20).fill(2500000) },
  { id: 'ada', name: 'Cardano', type: 'kripto', price: 15000, volatility: 0.12, history: Array(20).fill(15000) },
  { id: 'dot', name: 'Polkadot', type: 'kripto', price: 120000, volatility: 0.14, history: Array(20).fill(120000) },
  { id: 'xrp', name: 'Ripple', type: 'kripto', price: 9000, volatility: 0.11, history: Array(20).fill(9000) },
  { id: 'doge', name: 'Dogecoin', type: 'kripto', price: 2500, volatility: 0.25, history: Array(20).fill(2500) },
  { id: 'link', name: 'Chainlink', type: 'kripto', price: 350000, volatility: 0.13, history: Array(20).fill(350000) },
  { id: 'matic', name: 'Polygon', type: 'kripto', price: 12000, volatility: 0.16, history: Array(20).fill(12000) },
  { id: 'trx', name: 'Tron', type: 'kripto', price: 2000, volatility: 0.09, history: Array(20).fill(2000) },
  { id: 'bbca', name: 'Bank BCA', type: 'saham', price: 10200, volatility: 0.015, history: Array(20).fill(10200) },
  { id: 'bbri', name: 'Bank BRI', type: 'saham', price: 4800, volatility: 0.02, history: Array(20).fill(4800) },
  { id: 'tlkm', name: 'Telkom Indo', type: 'saham', price: 3200, volatility: 0.025, history: Array(20).fill(3200) },
  { id: 'asii', name: 'Astra Intl', type: 'saham', price: 5100, volatility: 0.03, history: Array(20).fill(5100) },
  { id: 'unvr', name: 'Unilever', type: 'saham', price: 2500, volatility: 0.02, history: Array(20).fill(2500) },
  { id: 'goto', name: 'GOTO Tech', type: 'saham', price: 65, volatility: 0.08, history: Array(20).fill(65) },
  { id: 'icbp', name: 'Indofood CBP', type: 'saham', price: 11000, volatility: 0.018, history: Array(20).fill(11000) },
  { id: 'bmri', name: 'Bank Mandiri', type: 'saham', price: 6800, volatility: 0.02, history: Array(20).fill(6800) },
  { id: 'antm', name: 'Aneka Tambang', type: 'saham', price: 1500, volatility: 0.045, history: Array(20).fill(1500) },
  { id: 'tpia', name: 'Chandra Asri', type: 'saham', price: 8500, volatility: 0.05, history: Array(20).fill(8500) },
  { id: 'gold', name: 'Emas (Gram)', type: 'komoditas', price: 1450000, volatility: 0.01, history: Array(20).fill(1450000) },
  { id: 'silver', name: 'Perak (Ons)', type: 'komoditas', price: 450000, volatility: 0.025, history: Array(20).fill(450000) },
  { id: 'oil', name: 'Minyak Mentah', type: 'komoditas', price: 1150000, volatility: 0.05, history: Array(20).fill(1150000) },
  { id: 'gas', name: 'Gas Alam', type: 'komoditas', price: 45000, volatility: 0.08, history: Array(20).fill(45000) },
  { id: 'copper', name: 'Tembaga', type: 'komoditas', price: 155000, volatility: 0.035, history: Array(20).fill(155000) },
  { id: 'wheat', name: 'Gandum', type: 'komoditas', price: 85000, volatility: 0.04, history: Array(20).fill(85000) },
  { id: 'coffee', name: 'Kopi Arabika', type: 'komoditas', price: 35000, volatility: 0.06, history: Array(20).fill(35000) },
  { id: 'sugar', name: 'Gula Putih', type: 'komoditas', price: 18000, volatility: 0.03, history: Array(20).fill(18000) },
  { id: 'corn', name: 'Jagung', type: 'komoditas', price: 25000, volatility: 0.05, history: Array(20).fill(25000) },
  { id: 'nickel', name: 'Nikel LME', type: 'komoditas', price: 275000, volatility: 0.07, history: Array(20).fill(275000) },
];

const NEWS_TEMPLATES: Record<string, string[]> = {
  up: [
    "Investor beralih ke {name} untuk mengamankan aset karena ketidakpastian ekonomi.",
    "Harga {name} melonjak tajam menyusul optimisme pasar global.",
    "Sentimen positif mendorong kenaikan nilai {name} minggu ini.",
    "Analisis menunjukkan {name} menjadi primadona baru para investor."
  ],
  down: [
    "Kekhawatiran inflasi membuat harga {name} terkoreksi cukup dalam.",
    "Aksi ambil untung masif menyebabkan penurunan pada {name}.",
    "Regulasi baru yang ketat menekan performa pasar {name} secara global.",
    "Sentimen negatif menyeret turun nilai {name} ke titik terendahnya minggu ini."
  ]
};

export function getRandomItems<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function processMarket(market: Asset[]): { assets: Asset[], news: string[] } {
  const news: string[] = [];
  const assets = market.map(asset => {
    const change = (Math.random() - 0.5) * 2 * asset.volatility;
    const newPrice = Math.max(1, asset.price * (1 + change));
    
    if (Math.abs(change) > asset.volatility * 0.4) {
      const dir = change > 0 ? 'up' : 'down';
      const template = NEWS_TEMPLATES[dir][Math.floor(Math.random() * NEWS_TEMPLATES[dir].length)];
      news.push(template.replace('{name}', asset.name));
    }

    return {
      ...asset,
      price: newPrice,
      history: [...asset.history.slice(-19), newPrice]
    };
  });
  return { assets, news };
}

export function calculateMood(currentMood: number, lifestyle: { housing: LifestyleItem, vehicle: LifestyleItem }): { value: number, label: Mood } {
  let change = -1.5; 
  change += lifestyle.housing.moodBoost;
  change += lifestyle.vehicle.moodBoost;

  const newValue = Math.min(100, Math.max(0, currentMood + change));
  
  let label: Mood = 'Netral';
  if (newValue > 80) label = 'Senang';
  else if (newValue > 60) label = 'Netral';
  else if (newValue > 40) label = 'Lelah';
  else if (newValue > 20) label = 'Stres';
  else label = 'Depresi';

  return { value: newValue, label };
}

export function getTrustStatus(score: number): { label: string, color: string, interest: number, limit: number } {
  // Formula: 1 poin Trust Level = Rp 1.000.000 limit pinjaman
  const calculatedLimit = Math.floor(score) * 1000000;
  
  if (score > 75) return { label: 'Sangat Baik', color: 'text-green-600', interest: 0.005, limit: calculatedLimit };
  if (score > 50) return { label: 'Baik', color: 'text-primary', interest: 0.01, limit: calculatedLimit };
  if (score > 25) return { label: 'Cukup', color: 'text-orange-500', interest: 0.02, limit: calculatedLimit };
  return { label: 'Buruk', color: 'text-red-600', interest: 0.05, limit: calculatedLimit };
}

export function processWeek(state: GameState): GameState {
  if (state.isGameOver) return state;

  const nextState: GameState = JSON.parse(JSON.stringify(state));
  
  const oldYear = Math.floor(state.character.age / 52);
  nextState.week += 1;
  nextState.character.age += 1;
  const newYear = Math.floor(nextState.character.age / 52);
  
  if (newYear > oldYear) {
    nextState.logs = [`Ulang tahun! Anda sekarang berusia ${newYear} tahun.`];
  }

  if (nextState.character.bankLockWeeks > 0) {
    nextState.character.bankLockWeeks -= 1;
  }

  nextState.character.hunger = Math.min(100, nextState.character.hunger + HUNGER_GAIN_PER_WEEK);
  if (nextState.character.hunger >= 90) {
    nextState.character.health = Math.max(0, nextState.character.health - HEALTH_DECAY_WHEN_STARVING);
    nextState.logs.unshift("Anda sangat kelaparan! Kesehatan menurun drastis.");
  }

  if (newYear > 30) {
    if (nextState.lifestyle.vehicle.id === 'v_none' || nextState.lifestyle.vehicle.id === 'v_motor') {
      nextState.character.health = Math.max(0, nextState.character.health - 1);
      nextState.logs.unshift("Usia bertambah, terlalu sering terpapar polusi jalanan menurunkan kesehatan.");
    }
  }
  if (newYear > 45) {
    nextState.character.health = Math.max(0, nextState.character.health - 1);
  }

  const moodResult = calculateMood(nextState.character.moodValue, nextState.lifestyle);
  nextState.character.moodValue = moodResult.value;
  nextState.character.mood = moodResult.label;

  if (nextState.character.health <= 0) {
    nextState.isGameOver = true;
    nextState.gameOverReason = "Anda mengalami penurunan kesehatan dan meninggal karena kelelahan ekstrim.";
    nextState.logs.unshift("GAME OVER: Anda telah meninggal dunia.");
    return nextState;
  }

  const trustStatus = getTrustStatus(nextState.character.trustScore);
  
  // Salary calculation influenced by mood percentage
  const baseSalary = nextState.career.currentJob?.salary || 0;
  const moodMultiplier = nextState.character.moodValue / 100;
  const salary = baseSalary * moodMultiplier;

  if (baseSalary > 0) {
    const penaltyPct = 100 - Math.floor(nextState.character.moodValue);
    if (penaltyPct > 0) {
      nextState.logs.unshift(`Gaji dipotong ${penaltyPct}% karena mood kurang stabil.`);
    }
  }

  let propertyIncome = 0;
  let propertyMaintenance = 0;
  nextState.investments.properties.forEach((p: Property) => {
    propertyIncome += p.weeklyIncome;
    propertyMaintenance += p.maintenance;
  });

  // Business logic
  nextState.businesses.forEach((biz: Business) => {
    biz.weeksActive += 1;
    let profitLoss = 0;

    if (biz.weeksActive <= 8) {
      profitLoss = -(biz.budget * 0.10);
      nextState.logs.unshift(`Bisnis ${biz.name} dalam tahap startup. Rugi operasional 10% (startup).`);
    } else if (nextState.career.currentJob && !biz.manager) {
      profitLoss = -(biz.budget * 0.10);
      nextState.logs.unshift(`Bisnis ${biz.name} terbengkalai tanpa manajer! Rugi 10%.`);
    } else {
      const sectorSkill = nextState.character.skills[biz.sector] || 0;
      const managerBoost = biz.manager?.successBoost || 0;
      const baseMultiplier = (sectorSkill / 100) + managerBoost;
      const randomFactor = 0.8 + (Math.random() * 0.4);
      const skillPenalty = (sectorSkill < 10 && !biz.manager) ? 0.4 : 1.0;
      const performanceMultiplier = (baseMultiplier < 0.2 ? 0.5 : 1.0) * randomFactor * skillPenalty;
      const revenue = biz.grade.setupCost * biz.grade.baseWeeklyYield * performanceMultiplier;
      const operationCost = biz.manager?.weeklySalary || 0;
      profitLoss = revenue - operationCost;
    }

    biz.budget = Math.max(0, biz.budget + profitLoss);
    biz.lastWeeklyProfit = profitLoss;
  });

  const bankInterest = nextState.character.bankBalance * BANK_INTEREST_RATE;
  nextState.character.bankBalance += bankInterest;

  // Loan Interest - Debt grows instead of direct cash deduction
  const loanInterestAmount = nextState.character.loanAmount * trustStatus.interest;
  if (loanInterestAmount > 0) {
    nextState.character.loanAmount += loanInterestAmount;
    nextState.logs.unshift(`Bunga hutang mingguan: Rp ${Math.floor(loanInterestAmount).toLocaleString('id-ID')} (Ditambahkan ke saldo hutang)`);
  }
  
  const housingCost = (nextState.week % 4 === 0) ? nextState.lifestyle.housing.weeklyCost : 0;
  if (housingCost > 0) {
    nextState.logs.unshift(`Bayar Sewa/Cicilan Rumah: Rp ${Math.floor(housingCost).toLocaleString('id-ID')}`);
  }
  
  const vehicleCost = nextState.lifestyle.vehicle.weeklyCost;
  const totalIncome = salary + propertyIncome; 
  const totalExpense = housingCost + vehicleCost + propertyMaintenance;

  nextState.financials.lastIncome = totalIncome + bankInterest;
  nextState.financials.lastExpense = totalExpense;
  nextState.character.cash += (totalIncome - totalExpense);

  if (totalIncome > totalExpense) nextState.character.trustScore = Math.min(100, nextState.character.trustScore + 0.5);
  else nextState.character.trustScore = Math.max(0, nextState.character.trustScore - 1);

  if (nextState.character.cash < 0) {
    nextState.character.trustScore = Math.max(0, nextState.character.trustScore - 5);
    nextState.logs.unshift("PERINGATAN: Saldo tunai negatif! Trust Score menurun.");
  }

  if (nextState.career.currentJob) {
    const sector = nextState.career.currentJob.sector;
    nextState.character.skills[sector] = (nextState.character.skills[sector] || 0) + 0.5;
  }

  if (nextState.career.currentEducation) {
    nextState.career.currentEducation.progressWeeks += 1;
    if (nextState.career.currentEducation.progressWeeks >= nextState.career.currentEducation.durationWeeks) {
      const edu = nextState.career.currentEducation;
      edu.completed = true;
      Object.entries(edu.rewardSkills).forEach(([sector, value]) => {
        const s = sector as Sector;
        nextState.character.skills[s] = (nextState.character.skills[s] || 0) + (value as number);
      });
      
      const alreadyHas = nextState.career.educationHistory.some(h => h.name === edu.name);
      if (!alreadyHas) {
        nextState.career.educationHistory.push(edu);
      }
      
      nextState.logs.unshift(`Selesai: ${edu.name}.`);
      nextState.career.currentEducation = null;
    }
  }

  const marketResult = processMarket(nextState.investments.market);
  nextState.investments.market = marketResult.assets;
  nextState.news = marketResult.news.length > 0 ? marketResult.news : ["Pasar stabil minggu ini."];

  nextState.career.availableJobs = getRandomItems(JOBS_POOL, 6);
  nextState.career.availableCourses = getRandomItems(COURSES_POOL, 5);
  nextState.investments.propertyOffers = getRandomItems(PROPERTY_POOL, 2);

  return nextState;
}
