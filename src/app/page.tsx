'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  BarChart3,
  Target,
  GraduationCap,
  Check,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-charcoal/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🎓</span>
            <span className="font-display font-bold text-base sm:text-lg text-carbon">GLORY</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm text-dim-grey">
              <a href="#about" className="hover:text-carbon transition-colors">About</a>
              <a href="#faq" className="hover:text-carbon transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-carbon transition-colors">Contact</a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/apply/profile">
                <Button variant="accent" size="sm">Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-porcelain py-12 sm:py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Find Out Where Your Academic Profile Can{' '}
            <span className="text-ocean">Realistically</span> Take You 🌍
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-dim-grey leading-relaxed">
            Join 2,000+ Ethiopian students for the Glory International Admissions Fair.
            Get assessed, matched to universities worldwide, and receive personalized results.
          </p>
          <Link href="/apply/profile">
            <Button variant="accent" size="lg" className="mt-6 sm:mt-8">
              Register Now — 500 ETB
            </Button>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-dim-grey">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-ocean" /> Profile Assessment
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-ocean" /> University Matching
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-ocean" /> Expert Review
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-ocean" /> Live Event Access
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12 sm:py-20" id="about">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-carbon mb-8 sm:mb-12">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ocean-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={26} className="text-ocean" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-carbon mb-2">Profile Assessment</h3>
              <p className="text-sm text-dim-grey">
                Complete your academic profile. Our scoring engine evaluates your GPA, English
                proficiency, program fit, and more.
              </p>
            </div>
            <div className="text-center p-4 sm:p-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={26} className="text-gold" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-carbon mb-2">University Matching</h3>
              <p className="text-sm text-dim-grey">
                Get matched to universities worldwide that fit your academic profile, budget,
                and career goals.
              </p>
            </div>
            <div className="text-center p-4 sm:p-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ocean-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={26} className="text-ocean" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-carbon mb-2">Results & Next Steps</h3>
              <p className="text-sm text-dim-grey">
                Receive your personalized result — Green, Yellow, or Red — with clear next
                steps for your application journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-porcelain py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-carbon mb-8 sm:mb-12">
            Your Journey in 6 Steps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: '1', title: 'Register', desc: 'Create your account in 2 minutes' },
              { step: '2', title: 'Pay 500 ETB', desc: 'Secure payment via Telebirr or bank' },
              { step: '3', title: 'Complete Profile', desc: 'Fill in your academic details' },
              { step: '4', title: 'Assessment', desc: 'Get scored by our evaluation engine' },
              { step: '5', title: 'Get Matched', desc: 'Receive university recommendations' },
              { step: '6', title: 'Attend Fair', desc: 'Join the live admissions event' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ocean text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-carbon">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-dim-grey">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ocean py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-pale-sky text-sm sm:text-base mb-6 sm:mb-8">
            Registration is open for the Glory International Admissions Fair 2026
          </p>
          <Link href="/apply/profile">
            <Button variant="accent" size="lg">
              Register Now <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-carbon py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white font-medium text-sm">Glory Educational Consultancy</p>
          <p className="text-dim-grey text-xs mt-1">© 2026 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
