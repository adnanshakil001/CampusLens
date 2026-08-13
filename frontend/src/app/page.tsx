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
  const [mousePos, setMousePos] = React.useState({ x: 600, y: 300 });

  // AUTOMATED PHOTO CAROUSEL SLIDES FOR RIGHT SHOWCASE CARD
  const campusSlides = [
    {
      name: 'IIT Bombay Main Campus',
      location: 'Mumbai, Maharashtra',
      nirf: 'NIRF #3 Overall',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80',
    },
    {
      name: 'BITS Pilani Main Campus',
      location: 'Pilani, Rajasthan',
      nirf: 'NIRF #25 Overall',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    },
    {
      name: 'NIT Trichy Campus',
      location: 'Tiruchirappalli, Tamil Nadu',
      nirf: 'NIRF #9 Engineering',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
    },
    {
      name: 'IIT Delhi Campus',
      location: 'Hauz Khas, New Delhi',
      nirf: 'NIRF #2 Engineering',
      image: 'https://images.unsplash.com/photo-1592285850223-874906045d62?w=1200&q=80',
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isSlidePaused, setIsSlidePaused] = React.useState(false);

  // AUTO-ROTATION CAROUSEL TIMER (EVERY 4 SECONDS)
  React.useEffect(() => {
    if (isSlidePaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % campusSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isSlidePaused, campusSlides.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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
      {/* 1. UNIVERSITY PORTAL HERO SECTION (INSPIRATION FORMAT)        */}
      {/* ------------------------------------------------------------- */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative bg-[#f8f6f2] text-gray-900 overflow-hidden border-b border-gray-200/80 min-h-[580px] lg:min-h-[640px] flex items-center select-none"
      >
        
        {/* INTERACTIVE CURSOR SPOTLIGHT BEAM */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 127, 72, 0.12), rgba(83, 58, 253, 0.06) 45%, transparent 75%)`,
          }}
        />

        {/* Geometric Islamic/Architectural Pattern Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e1d8_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
          
          {/* LEFT CONTENT & ACTION GRID COLUMN (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-7 pr-0 lg:pr-6">
            
            {/* Teal Eyebrow Tagline */}
            <div className="inline-flex items-center gap-2 text-teal-700 font-extrabold text-sm sm:text-base tracking-wide">
              <Sparkles size={16} className="text-teal-600 animate-pulse" />
              <span>Combine Data with Opportunity</span>
            </div>

            {/* Bold Clean University Display Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.08] font-sans">
              CampusLens <br />
              University Portal.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl font-medium leading-relaxed">
              Compare verified placement statistics, annual tuition fees, and JEE/NEET seat cutoff ranks across premier institutions in India.
            </p>

            {/* Search Console */}
            <div className="w-full max-w-xl mt-1 flex flex-col gap-2.5">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center bg-white rounded-2xl shadow-md border border-gray-200 p-2 focus-within:ring-3 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all"
              >
                <div className="pl-3.5 text-gray-400 shrink-0">
                  <Search size={20} className="text-orange-600" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search college, course (e.g. IIT Bombay, CSE)..."
                  className="flex-grow pl-3 pr-4 py-2 bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none border-none"
                />
                <button 
                  type="submit" 
                  className="shrink-0 rounded-xl px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* POPULAR SEARCHES TAG ROW */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500 font-bold text-[11px] uppercase tracking-wider">Popular:</span>
                {popularTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 rounded-lg bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-bold border border-gray-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <span className="text-orange-500 font-extrabold">#</span>
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2x2 FEATURE BUTTONS GRID (MATCHING REFERENCE IMAGE FORMAT) */}
            <div className="w-full max-w-xl grid grid-cols-2 gap-3.5 mt-2">
              
              {/* Box 1 (Active Orange Accent with Arrow ↗) */}
              <Link
                href="/colleges"
                className="flex items-center justify-between p-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Landmark size={18} />
                  <span>Admission & Colleges</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Box 2 (White Card) */}
              <Link
                href="/compare"
                className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-extrabold text-sm border border-gray-200/90 shadow-2xs transition-all active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GitCompare size={18} className="text-indigo-600" />
                  <span>Compare Matrix</span>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Box 3 (White Card) */}
              <Link
                href="/predictor"
                className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-extrabold text-sm border border-gray-200/90 shadow-2xs transition-all active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={18} className="text-emerald-600" />
                  <span>Cutoff Predictor</span>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Box 4 (White Card) */}
              <Link
                href="/discussions"
                className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-extrabold text-sm border border-gray-200/90 shadow-2xs transition-all active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={18} className="text-blue-600" />
                  <span>Student Q&A</span>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Bottom Location & Verified Affordance */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-2">
              <MapPin size={14} className="text-orange-600" />
              <span>85+ Verified Indian Campuses • NIRF 2025 Data</span>
            </div>

          </div>

          {/* RIGHT COLUMN: CAMPUS PHOTOGRAPHY SHOWCASE (5 COLS) WITH AUTOMATED CAROUSEL */}
          <div 
            onMouseEnter={() => setIsSlidePaused(true)}
            onMouseLeave={() => setIsSlidePaused(false)}
            className="lg:col-span-5 relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60 group select-none"
          >
            {/* Campus Architectural Showcase Images with Crossfade */}
            {campusSlides.map((slide, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
                  idx === currentSlideIndex 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-20 pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-extrabold text-gray-900 shadow-md z-30 transition-all duration-300">
              <Building2 size={14} className="text-orange-600 animate-pulse" />
              <span>{campusSlides[currentSlideIndex].name}</span>
            </div>

            {/* Bottom Info & Slide Dots */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white z-30">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  {campusSlides[currentSlideIndex].nirf}
                </p>
                <p className="text-base font-extrabold text-white">
                  {campusSlides[currentSlideIndex].location}
                </p>
              </div>

              {/* Slide Indicator Dots (Clickable) */}
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
                {campusSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentSlideIndex 
                        ? 'h-2 w-5 bg-orange-500 shadow-xs' 
                        : 'h-2 w-2 bg-white/60 hover:bg-white'
                    }`}
                    title={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>
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

