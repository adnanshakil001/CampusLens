'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  GraduationCap, 
  Sparkles, 
  Search, 
  GitCompare, 
  Landmark, 
  MessageSquare, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Building2 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/colleges');
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/colleges?search=${encodeURIComponent(tag)}`);
  };

  const popularTags = ['IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'Computer Science', 'JEE Main Cutoff'];

  const featureLinks = [
    { 
      href: '/colleges', 
      label: 'Explore Directory', 
      description: 'Search and filter 85+ colleges by locations, NIRF ratings, cutoff ranks, and tuition fees.', 
      icon: Landmark, 
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' 
    },
    { 
      href: '/compare', 
      label: 'Side-by-Side Compare', 
      description: 'Select 2 or 3 colleges to instantly map out side-by-side matrices highlighting best values.', 
      icon: GitCompare, 
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' 
    },
    { 
      href: '/predictor', 
      label: 'Rank Predictor Tool', 
      description: 'Calculate eligible seat cutoffs based on caste category, state quotas, and entrance rank scores.', 
      icon: GraduationCap, 
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
    },
    { 
      href: '/discussions', 
      label: 'Community Q&A Board', 
      description: 'Connect directly with verified students and alumni to clarify admission and hostel questions.', 
      icon: MessageSquare, 
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
    },
  ];

  const featuredColleges = [
    {
      id: 'iit-bombay',
      name: 'Indian Institute of Technology (IIT Bombay)',
      location: 'Mumbai, Maharashtra',
      type: 'Public / Govt',
      nirf: 'NIRF #3 Overall',
      naac: 'NAAC A++',
      rating: 4.9,
      reviewsCount: 520,
      avgPackage: '₹23.5 LPA',
      highestPackage: '₹1.6 Cr',
      annualFee: '₹2.2L / yr',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
      category: 'Engineering',
    },
    {
      id: 'bits-pilani',
      name: 'BITS Pilani (Main Campus)',
      location: 'Pilani, Rajasthan',
      type: 'Deemed Private',
      nirf: 'NIRF #25 Overall',
      naac: 'NAAC A',
      rating: 4.8,
      reviewsCount: 380,
      avgPackage: '₹20.8 LPA',
      highestPackage: '₹1.3 Cr',
      annualFee: '₹5.4L / yr',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      category: 'Engineering',
    },
    {
      id: 'nit-trichy',
      name: 'National Institute of Technology (NIT Trichy)',
      location: 'Tiruchirappalli, Tamil Nadu',
      type: 'Public / Govt',
      nirf: 'NIRF #9 Engineering',
      naac: 'NAAC A+',
      rating: 4.7,
      reviewsCount: 310,
      avgPackage: '₹15.2 LPA',
      highestPackage: '₹52.0 LPA',
      annualFee: '₹1.5L / yr',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      category: 'Government',
    },
  ];

  const filteredColleges = selectedCategory === 'All' 
    ? featuredColleges 
    : featuredColleges.filter(c => c.category === selectedCategory || (selectedCategory === 'Government' && c.type.includes('Govt')));

  return (
    <div className="flex-grow flex flex-col bg-[#faf9f8] text-foreground min-h-screen font-sans selection:bg-orange-500/20 selection:text-orange-900">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION WITH APPLE-GRADE FROSTED GLASS & GRADIENT H1  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative bg-gradient-to-b from-[#000533] via-[#050b42] to-[#000666] text-white overflow-hidden py-24 sm:py-36 flex flex-col items-center">
        
        {/* Background Mesh Glow Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(164,61,7,0.25),transparent_50%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/20 to-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')] bg-cover bg-center opacity-[0.06] mix-blend-overlay" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8 z-10">
          
          {/* Frosted Glass Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-xs font-bold tracking-wide text-orange-300 transition-all duration-200 hover:bg-white/15 active:scale-[0.98]">
            <Sparkles size={14} className="text-orange-400 animate-pulse" />
            <span>CampusLens 2.0 • Data-Driven College Matching</span>
          </div>

          {/* Optical Display Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-4xl">
            Discover Your Perfect <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              University Campus
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/80 max-w-2xl font-normal leading-relaxed tracking-tight">
            Compare verified placement statistics, tuition fee structures, and seat cutoff ranks across top engineering & management institutions in India.
          </p>

          {/* Floating Glassmorphic Search Console */}
          <div className="w-full max-w-2xl mt-4">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-2 border border-white/40 focus-within:ring-4 focus-within:ring-orange-500/30 focus-within:border-orange-500/50 transition-all duration-200 active:scale-[0.995]"
            >
              <div className="pl-4 text-gray-400 shrink-0">
                <Search size={22} className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by college name, course (e.g. IIT Bombay, CSE)..."
                className="flex-grow pl-3 pr-4 py-3.5 bg-transparent text-sm sm:text-base font-medium text-gray-900 placeholder:text-gray-400 outline-none border-none"
              />
              <Button 
                variant="secondary" 
                type="submit" 
                size="lg"
                className="shrink-0 rounded-xl px-6 font-bold shadow-md hover:shadow-orange-500/25 active:scale-[0.97] transition-all duration-150"
              >
                <span>Find Colleges</span>
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </form>

            {/* Quick Search Tag Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-white/60 font-medium">Popular Searches:</span>
              {popularTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 font-medium border border-white/10 backdrop-blur-xs transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. OVERLAPPING KEY METRICS DASHBOARD CARD                      */}
      {/* ------------------------------------------------------------- */}
      <section className="relative -mt-12 sm:-mt-16 z-30 max-w-6xl mx-auto w-full px-4 sm:px-6">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] py-8 px-6 sm:px-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-x-0 sm:divide-x divide-gray-100">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-1.5 text-primary">
              <Building2 size={20} className="text-blue-600" />
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">85+</p>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">NIRF Rated Colleges</p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 sm:border-l sm:border-gray-100">
            <div className="flex items-center gap-1.5 text-orange-600">
              <TrendingUp size={20} className="text-orange-600" />
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">₹1.6 Cr</p>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">Top CTC Verified</p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 sm:border-l sm:border-gray-100">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">98.4%</p>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">Predictor Accuracy</p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 sm:border-l sm:border-gray-100">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Users size={20} className="text-indigo-600" />
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">100%</p>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">Free Decision Engine</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. INTERACTIVE DECISION TOOLS GRID                             */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-12 w-full">
        
        <div className="text-center flex flex-col items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-700 text-xs font-extrabold uppercase tracking-widest border border-orange-500/20">
            Decision Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Interactive College Discovery Tools
          </h2>
          <p className="text-base text-gray-600 max-w-xl font-normal leading-relaxed">
            Leverage custom calculators, matching algorithms, side-by-side matrices, and student Q&A boards to guide your higher education decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureLinks.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                className="bg-white border-gray-200/80 p-6 rounded-2xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group active:scale-[0.98] cursor-pointer"
              >
                <div className="flex flex-col gap-5">
                  <div className={`p-3.5 rounded-xl border w-fit ${feat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {feat.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <Link 
                  href={feat.href} 
                  className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <span>Launch Tool</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </Card>
            );
          })}
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FEATURED COLLEGES SPOTLIGHT PREVIEW CARDS                  */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 border-t border-b border-gray-200/60 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Curated Directory</span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">Featured Colleges Spotlight</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 bg-gray-200/60 p-1 rounded-xl w-fit">
              {['All', 'Engineering', 'Government'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 ${
                    selectedCategory === cat
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Colleges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredColleges.map((college) => (
              <div 
                key={college.id} 
                className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={college.image} 
                      alt={college.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-extrabold rounded-lg border border-white/20">
                        {college.nirf}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        <MapPin size={14} className="text-orange-400" />
                        {college.location}
                      </span>
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-xs font-bold">
                        {college.naac}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        {college.type}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star size={14} fill="currentColor" />
                        <span>{college.rating} ({college.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                      {college.name}
                    </h3>

                    {/* Stats Metrics */}
                    <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 font-medium block">Average CTC</span>
                        <span className="font-extrabold text-gray-900">{college.avgPackage}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block">Highest CTC</span>
                        <span className="font-extrabold text-emerald-700">{college.highestPackage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
                  <Link 
                    href={`/colleges/${college.id}`} 
                    className="w-full"
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full font-bold justify-between active:scale-[0.97]"
                    >
                      <span>Explore Overview</span>
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>

              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link href="/colleges">
              <Button variant="primary" size="lg" className="px-8 font-bold shadow-lg hover:shadow-indigo-900/20 active:scale-[0.97]">
                <span>Browse All 85+ Colleges</span>
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. PLATFORM TRUST & VERIFIED DATA GRID                          */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-6 bg-gray-50/70 border border-gray-200/60 rounded-2xl">
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600 shrink-0">
              <Award size={26} />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Official NIRF Ratings</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1.5">
                Catalog data contains engineering cutoff scores mapped directly against the official National Institutional Ranking Framework.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gray-50/70 border border-gray-200/60 rounded-2xl">
            <div className="p-3 bg-orange-600/10 rounded-xl text-orange-600 shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Verified Placement CTC</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1.5">
                Placement packages, highest salary offers, and recruiter lists are cross-verified with institutional annual reports.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gray-50/70 border border-gray-200/60 rounded-2xl">
            <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-600 shrink-0">
              <Users size={26} />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">Active Student Community</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1.5">
                Ask specific questions about home-state quotas, category cutoffs, hostel facilities, and campus culture on our public board.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

