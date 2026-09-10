'use client';

import Link from 'next/link';
import { Button, Badge, Logo } from '@/components/ui';
import {
  BarChart3,
  Target,
  GraduationCap,
  Check,
  ArrowRight,
  Sparkles,
  Globe2,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  FileCheck2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-porcelain selection:bg-ocean/20">
      {/* Navigation Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-charcoal/15 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Logo href="/" size="md" subtitle="Admissions Fair" priority />

          <div className="flex items-center gap-4 sm:gap-8">
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-dim-grey">
              <a href="#how-it-works" className="hover:text-ocean transition-colors">How It Works</a>
              <a href="#features" className="hover:text-ocean transition-colors">Assessment Engine</a>
              <a href="#destinations" className="hover:text-ocean transition-colors">Destinations</a>
            </nav>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-carbon">
                  Sign In
                </Button>
              </Link>
              <Link href="/apply/profile">
                <Button variant="accent" size="sm" className="shadow-md font-bold">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-28">
        {/* Subtle Decorative Glow Backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-ocean/10 via-pale-sky/20 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-ocean/30 shadow-sm mb-6 sm:mb-8 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            <span className="text-xs font-bold text-carbon">
              Admissions Fair 2026 Registration Open
            </span>
            <span className="text-xs text-ocean font-bold flex items-center gap-0.5">
              Apply Now <ArrowRight size={12} />
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black tracking-tight leading-[1.12]">
            Find Out Where Your Academic Profile Can{' '}
            <span className="bg-gradient-to-r from-ocean via-[#2d7bc0] to-ocean-dark bg-clip-text text-transparent">
              Realistically
            </span>{' '}
            Take You{' '}
            <span className="animate-globe select-none cursor-default" title="Global Universities">
              🌍
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-xl text-dim-grey max-w-3xl mx-auto leading-relaxed font-normal">
            Join <span className="font-bold text-carbon">2,000+ Ethiopian students</span> for the Glory International Admissions Fair. Get assessed by our 100-point engine, matched to top global universities, and receive direct admission next-steps.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 sm:mt-10">
            <Link href="/apply/profile" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto text-base shadow-glow-gold">
                Start 4-Step Application <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base bg-white">
                Login to Student Portal
              </Button>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-10 sm:mt-12 text-xs sm:text-sm font-semibold text-carbon">
            <span className="inline-flex items-center gap-2 bg-white/80 border border-charcoal/15 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Check size={16} className="text-ocean stroke-[3]" /> 100-Point Scoring
            </span>
            <span className="inline-flex items-center gap-2 bg-white/80 border border-charcoal/15 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Check size={16} className="text-ocean stroke-[3]" /> University Matching
            </span>
            <span className="inline-flex items-center gap-2 bg-white/80 border border-charcoal/15 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Check size={16} className="text-ocean stroke-[3]" /> Telebirr & Bank Accepted
            </span>
            <span className="inline-flex items-center gap-2 bg-white/80 border border-charcoal/15 px-3.5 py-1.5 rounded-xl shadow-xs">
              <Check size={16} className="text-ocean stroke-[3]" /> Live Breakout Tracks
            </span>
          </div>
        </div>
      </section>

      {/* Trust & Impact Stats Grid */}
      <section className="bg-white border-y border-charcoal/15 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <p className="text-3xl sm:text-5xl font-black text-ocean tracking-tight">2,000+</p>
              <p className="text-xs sm:text-sm font-bold text-carbon mt-1">Ethiopian Students</p>
              <p className="text-xs text-dim-grey">Assessed & Placed</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl sm:text-5xl font-black text-gold-dark tracking-tight">50+</p>
              <p className="text-xs sm:text-sm font-bold text-carbon mt-1">Partner Institutions</p>
              <p className="text-xs text-dim-grey">USA, UK, Canada & Europe</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl sm:text-5xl font-black text-ocean tracking-tight">94%</p>
              <p className="text-xs sm:text-sm font-bold text-carbon mt-1">Match Accuracy</p>
              <p className="text-xs text-dim-grey">Based on verified GPA & Tests</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl sm:text-5xl font-black text-green tracking-tight">100-Pt</p>
              <p className="text-xs sm:text-sm font-bold text-carbon mt-1">Scientific Scoring</p>
              <p className="text-xs text-dim-grey">Green / Yellow / Red Decision</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Destinations */}
      <section className="py-14 sm:py-20 bg-porcelain" id="destinations">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <Badge variant="blue" className="mb-3 font-bold" dot>
              Global University Network
            </Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black">
              Top Destinations for Glory Scholars
            </h2>
            <p className="text-sm sm:text-base text-dim-grey mt-2">
              Connect directly with verified representatives across 6 key higher education hubs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {[
              { country: 'United States', flag: '🇺🇸', count: '25+ Universities', code: 'USA' },
              { country: 'Canada', flag: '🇨🇦', count: '15+ Universities', code: 'CAN' },
              { country: 'United Kingdom', flag: '🇬🇧', count: '12+ Universities', code: 'UK' },
              { country: 'Germany', flag: '🇩🇪', count: '8+ Universities', code: 'DEU' },
              { country: 'Australia', flag: '🇦🇺', count: '10+ Universities', code: 'AUS' },
              { country: 'Ireland', flag: '🇮🇪', count: '6+ Universities', code: 'IRL' },
            ].map((d) => (
              <div
                key={d.code}
                className="bg-white border border-charcoal/15 rounded-2xl p-4 text-center card-hoverable transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl mb-2">{d.flag}</div>
                <h4 className="font-bold text-sm text-carbon">{d.country}</h4>
                <p className="text-[11px] text-ocean font-medium mt-0.5">{d.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Engine Feature Cards */}
      <section className="bg-white py-16 sm:py-24 border-t border-charcoal/15" id="features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <Badge variant="yellow" className="mb-3 font-bold" dot>
              Advanced Evaluation
            </Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black">
              Built Specifically for Ethiopian Applicants
            </h2>
            <p className="text-sm sm:text-base text-dim-grey mt-2">
              Our platform bridges the gap between Ethiopian academic credentials and international university requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-porcelain/60 border border-charcoal/15 rounded-3xl p-6 sm:p-8 card-hoverable relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-ocean/10 border border-ocean/20 flex items-center justify-center mb-6 text-ocean group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-lg font-bold text-carbon mb-2.5">100-Point Scoring Engine</h3>
              <p className="text-sm text-dim-grey leading-relaxed">
                Objective GPA conversion, English test benchmarks (IELTS/TOEFL/Duolingo), and academic rigor weighting to determine admission viability.
              </p>
              <div className="mt-6 pt-4 border-t border-charcoal/10 flex items-center text-xs font-semibold text-ocean">
                <span>GPA & Test Rigor Scoring</span>
              </div>
            </div>

            <div className="bg-porcelain/60 border border-charcoal/15 rounded-3xl p-6 sm:p-8 card-hoverable relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-6 text-gold-dark group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-lg font-bold text-carbon mb-2.5">Intelligent University Matching</h3>
              <p className="text-sm text-dim-grey leading-relaxed">
                Matches your intended major, financial budget, and target degree level against verified minimum entry requirements and scholarship criteria.
              </p>
              <div className="mt-6 pt-4 border-t border-charcoal/10 flex items-center text-xs font-semibold text-gold-dark">
                <span>Primary & Secondary Match</span>
              </div>
            </div>

            <div className="bg-porcelain/60 border border-charcoal/15 rounded-3xl p-6 sm:p-8 card-hoverable relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center mb-6 text-green group-hover:scale-110 transition-transform">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-lg font-bold text-carbon mb-2.5">Green / Yellow / Red Results</h3>
              <p className="text-sm text-dim-grey leading-relaxed">
                Transparent decision reports. Green indicates direct application recommendation, Yellow outlines conditional criteria, Red suggests alternative pathways.
              </p>
              <div className="mt-6 pt-4 border-t border-charcoal/10 flex items-center text-xs font-semibold text-green">
                <span>Actionable Decision Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Journey Section */}
      <section className="bg-porcelain py-16 sm:py-24 border-t border-charcoal/15" id="how-it-works">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <Badge variant="blue" className="mb-3 font-bold" dot>
              Step-by-Step Workflow
            </Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black">
              Your Journey to Global Admissions
            </h2>
            <p className="text-sm sm:text-base text-dim-grey mt-2">
              From online registration to direct representative meetings in 6 simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Online Registration',
                desc: 'Create your applicant account in 2 minutes with basic personal contact information.',
                icon: <Users size={20} className="text-ocean" />,
              },
              {
                step: '02',
                title: 'Pass Payment',
                desc: 'Pay securely via Telebirr or direct Commercial Bank of Ethiopia transfer with receipt verification.',
                icon: <ShieldCheck size={20} className="text-gold-dark" />,
              },
              {
                step: '03',
                title: 'Profile & Credentials',
                desc: 'Enter your GPA, high school/university transcripts, English test status, and target majors.',
                icon: <FileCheck2 size={20} className="text-ocean" />,
              },
              {
                step: '04',
                title: 'Expert Assessment',
                desc: 'Glory evaluators review your file using the 100-point admissions scoring matrix.',
                icon: <Zap size={20} className="text-gold-dark" />,
              },
              {
                step: '05',
                title: 'Get Matched',
                desc: 'Receive official Green, Yellow, or Red match status along with institutional recommendations.',
                icon: <Compass size={20} className="text-ocean" />,
              },
              {
                step: '06',
                title: 'Attend Live Fair',
                desc: 'Join dedicated virtual Google Meet breakout rooms and meet university admissions officers.',
                icon: <Globe2 size={20} className="text-green" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-charcoal/15 rounded-2xl p-6 card-hoverable relative overflow-hidden transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-porcelain border border-charcoal/15 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-charcoal/20">{item.step}</span>
                </div>
                <h4 className="font-bold text-base text-carbon mb-1.5">{item.title}</h4>
                <p className="text-xs sm:text-sm text-dim-grey leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Converting CTA Banner */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-r from-carbon via-[#121211] to-black text-white border-t border-charcoal/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ocean/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge variant="yellow" className="mb-4 font-bold" dot>
            Seats Filling Quickly
          </Badge>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Ready to Discover Your University Matches?
          </h2>
          <p className="text-pale-sky text-sm sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Register today to secure your evaluation spot, upload your documents, and attend the Fair.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/apply/profile" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-glow-gold text-base font-bold">
                Register Now <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                Already Registered? Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0e] border-t border-charcoal/20 py-10 sm:py-14 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-charcoal/20">
            <Logo
              href="/"
              size="sm"
              subtitle="Educational Consultancy"
              inverted
            />
            <div className="flex items-center gap-6 text-xs text-dim-grey">
              <Link href="/login" className="hover:text-white transition-colors">Portal Login</Link>
              <Link href="/apply/profile" className="hover:text-white transition-colors">Student Registration</Link>
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dim-grey">
            <p>© 2026 Glory Educational Consultancy. All rights reserved.</p>
            <p>International Admissions Fair & Assessment System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
