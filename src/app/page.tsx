import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/ui';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { Destinations } from '@/components/landing/Destinations';
import { RegisterForm } from '@/components/landing/RegisterForm';
import { destinations } from '@/lib/destinations';

const MOI_ANSWER =
  'MOI (Medium of Instruction) letters are accepted where the university allows it, so some students can apply without a separate English test. Requirements vary by university.';

const steps = [
  { title: 'Register in advance', text: 'Sign up online before the webinar. Every student can register.' },
  { title: 'Join the live webinar', text: 'Attend online from wherever you are, on your phone or computer.' },
  { title: 'Meet admissions teams', text: 'Hear directly from universities and ask your questions live.' },
  { title: 'Take your next step', text: 'Use your Veridan student portal to follow up on the universities that fit you.' },
];

const reasons = [
  { title: 'Registration in advance', text: 'Register before the webinar and you are ready to join when it starts.' },
  { title: 'No filtering and no screening', text: 'We do not screen students before they can register for a webinar.' },
  { title: 'MOI accepted where the university allows it', text: MOI_ANSWER },
];

const faqs = [
  { q: 'Who can register?', a: 'Every student can register. There is no filtering and no screening before you register for a webinar.' },
  { q: 'Is there a fee to register?', a: 'No. Registering for a webinar is free.' },
  { q: 'What is MOI, and do I need an English test?', a: MOI_ANSWER },
  { q: 'How do I join a webinar?', a: 'Webinars run live on Google Meet. After you register, room links appear in your student portal.' },
  { q: 'Does attending guarantee admission?', a: 'No. Each university makes its own admission decisions and sets its own requirements.' },
  { q: 'Which countries can I study in?', a: `We currently work with universities in ${destinations.length} destination countries. You can see them all on this page.` },
];

// Photo placeholders. Replace each with a real image of the same aspect ratio.
const gallery = [
  {
    // Image prompt: African university students in shirts with the Veridan Education logo, walking and talking on a sunny campus, candid, natural light, wide shot.
    alt: 'Students in Veridan Education shirts walking together on a university campus',
    label: 'Students on campus',
    className: 'sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto',
  },
  {
    // Image prompt: An African student in a Veridan Education shirt joining a university webinar on a laptop at home, smiling, shot from the side.
    alt: 'A student in a Veridan Education shirt joining a webinar on a laptop',
    label: 'Joining a webinar',
    className: 'aspect-[4/3]',
  },
  {
    // Image prompt: African students in Veridan Education shirts talking with a university representative at a campus event, friendly, natural light.
    alt: 'Students in Veridan Education shirts talking with a university representative at an event',
    label: 'At a university event',
    className: 'aspect-[4/3]',
  },
];

const sectionClass = 'scroll-mt-24 py-[clamp(64px,9vw,120px)]';
const headingClass = 'font-display font-bold text-3xl sm:text-4xl text-black tracking-tight max-w-2xl';

export default function LandingPage() {
  return (
    <div className="landing min-h-screen bg-porcelain text-carbon">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface lg:min-h-[620px] xl:min-h-[660px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:flex lg:items-center lg:min-h-[620px] xl:min-h-[660px]">
            <div className="relative z-10 py-12 lg:py-16 lg:w-[44%] xl:w-[46%] animate-fade-in">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl xl:text-6xl text-black tracking-tight leading-[1.08]">
                Talk to universities abroad from wherever you are.
              </h1>
              <p className="mt-6 text-lg text-dim-grey leading-relaxed max-w-xl">
                Veridan Education runs live webinars that connect African students with university admissions teams.
                Register in advance. Every student can join.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:items-center lg:items-stretch xl:items-center gap-4">
                <a href="#register" className="btn-accent px-7 py-3.5 text-base font-semibold">
                  Register for the next webinar
                </a>
                <a href="#how-it-works" className="btn-secondary px-7 py-3.5 text-base">
                  See how it works
                </a>
              </div>
            </div>
          </div>
          <div className="hero-photo-frame aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto">
            <Image
              src="/images/webinar-classroom.jpg"
              alt="Students watching a presenter explain university requirements at a Veridan session"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="hero-photo"
            />
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Veridan in numbers" className="bg-navy text-on-navy">
          <dl className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-8">
            {[
              { value: '100,000+', label: 'African students reached' },
              { value: '2015', label: 'The year we started' },
              { value: String(destinations.length), label: 'Destination countries' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-on-navy-muted mt-1">{stat.label}</dt>
                <dd className="font-display font-bold text-4xl sm:text-5xl tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* How it works */}
        <section id="how-it-works" className={sectionClass}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className={headingClass}>How the webinar model works</h2>
            <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {steps.map((step, index) => (
                <li key={step.title} className="border-t-2 border-gold pt-5">
                  <span className="font-display font-bold text-gold-dark" aria-hidden="true">{index + 1}</span>
                  <h3 className="font-display font-semibold text-xl text-black mt-2">{step.title}</h3>
                  <p className="text-dim-grey mt-2 leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why Veridan */}
        <section id="why-veridan" className={`${sectionClass} bg-surface`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className={headingClass}>A place in the room for every student</h2>
              <p className="mt-5 text-lg text-dim-grey leading-relaxed max-w-xl">
                Since 2015 we have reached over 100,000 African students. We keep registration open so more students can
                hear from universities directly.
              </p>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {reasons.map((reason) => (
                <li key={reason.title} className="py-6">
                  <h3 className="font-display font-semibold text-xl text-black">{reason.title}</h3>
                  <p className="text-dim-grey mt-2 leading-relaxed">{reason.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Destinations */}
        <section id="destinations" className={sectionClass}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className={headingClass}>Where you could study</h2>
            <p className="mt-4 text-lg text-dim-grey max-w-2xl">
              Meet universities from {destinations.length} countries. Filter by region to find what suits you.
            </p>
            <Destinations />
          </div>
        </section>

        {/* Gallery */}
        <section aria-labelledby="gallery-heading" className={`${sectionClass} bg-surface`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 id="gallery-heading" className={headingClass}>Students at Veridan</h2>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {gallery.map((photo) => (
                <div
                  key={photo.label}
                  role="img"
                  aria-label={photo.alt}
                  className={`flex items-end p-5 rounded-lg border-2 border-dashed border-charcoal/40 bg-porcelain ${photo.className}`}
                >
                  <p className="text-sm text-dim-grey">Photo placeholder: {photo.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration */}
        <section id="register" className={sectionClass}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16">
            <div>
              <h2 className={headingClass}>Register for the next webinar</h2>
              <p className="mt-4 text-lg text-dim-grey leading-relaxed">
                It takes a few minutes and it&apos;s free. Already registered?{' '}
                <Link href="/login" className="text-ocean font-medium underline">Sign in</Link>.
              </p>
            </div>
            <RegisterForm />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={`${sectionClass} bg-surface`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className={headingClass}>Questions students ask</h2>
            <div className="mt-8 border-t border-line">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border-b border-line">
                  <summary className="py-5 cursor-pointer font-display font-semibold text-lg text-black">{faq.q}</summary>
                  <p className="pb-5 text-dim-grey leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy text-on-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <Logo href="/" size="sm" subtitle="Your goals. Our guidance. Global opportunities." inverted />
          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-sm text-on-navy-muted">
            <a href="#destinations" className="hover:text-on-navy">Destinations</a>
            <a href="#register" className="hover:text-on-navy">Register</a>
            <Link href="/login" className="hover:text-on-navy">Student portal</Link>
            <Link href="/privacy" className="hover:text-on-navy">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-on-navy">Terms of Service</Link>
          </nav>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 flex flex-col sm:flex-row justify-between gap-2 text-sm text-on-navy-muted">
          <p>© 2026 Veridan Education. Established 2015.</p>
          <p>Images on this site are illustrative.</p>
        </div>
      </footer>
    </div>
  );
}
