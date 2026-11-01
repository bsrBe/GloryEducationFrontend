import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink, LegalPage, LegalSection } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service | Veridan Education',
  description: 'The terms for using the Veridan Education website, student portal and webinars.',
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms apply when you use the Veridan Education website, student portal and webinars. By creating an account or using the service, you agree to them."
    >
      <LegalSection title="What we provide">
        <p>Veridan Education connects students with universities abroad. We run live webinars where you can meet universities and admissions teams, and we provide a portal to manage your application.</p>
      </LegalSection>

      <LegalSection title="No guarantee of admission">
        <p>We do not guarantee admission, scholarships, visas or any other outcome. Each university makes its own decisions and sets its own requirements, including whether it accepts a Medium of Instruction letter in place of an English test. Requirements can change, so please confirm them with the university.</p>
      </LegalSection>

      <LegalSection title="Registration and fees">
        <p>Registering for a webinar through Veridan is free. Universities, testing bodies and governments may charge their own fees, such as application or visa fees. Those fees are between you and them.</p>
      </LegalSection>

      <LegalSection title="Your account">
        <ul>
          <li>Keep your sign-in details private. You are responsible for activity on your account.</li>
          <li>Tell us straight away if you think someone else has accessed your account.</li>
          <li>If you are under the age of majority where you live, you need the agreement of a parent or guardian.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Accurate information">
        <p>The details and documents you provide must be true, complete and your own. Providing false or altered documents can lead to us closing your account and can affect your applications to universities.</p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>access another person&apos;s account or information, or try to get around our security;</li>
          <li>disrupt webinars or harass other participants, staff or university representatives;</li>
          <li>record webinars or share room links without permission;</li>
          <li>upload anything unlawful or harmful, or anything you don&apos;t have the right to share;</li>
          <li>use the service in a way that could damage it or interfere with other users.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Your content">
        <p>Your documents remain yours. You allow us to store and use them, and to share them with universities as described in our <Link href="/privacy" className="text-ocean underline">Privacy Policy</Link>, so we can provide the service.</p>
      </LegalSection>

      <LegalSection title="Our content">
        <p>The Veridan name, logo and website content belong to Veridan Education. You may not copy or reuse them without our permission. Information about countries and universities is general guidance, and we can&apos;t promise that it is always complete or up to date.</p>
      </LegalSection>

      <LegalSection title="Availability and changes">
        <p>We work to keep the service running, but we can&apos;t promise it will always be available or free of errors. Webinars may be rescheduled or cancelled, and university participation can change. We may change or stop parts of the service.</p>
      </LegalSection>

      <LegalSection title="Closing your account">
        <p>You can deactivate your account at any time in Account Settings. We may suspend or close an account that breaks these terms. Our <Link href="/privacy" className="text-ocean underline">Privacy Policy</Link> explains what happens to your information afterwards.</p>
      </LegalSection>

      <LegalSection title="Liability">
        <p>The service is provided as it is. To the extent the law allows, Veridan Education is not responsible for university decisions, for visa outcomes, or for indirect losses arising from your use of the service. Nothing in these terms limits rights that you have by law and that cannot be excluded.</p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>These terms are governed by the laws of the country where Veridan Education is registered, unless the law where you live gives you the right to rely on its rules or its courts.</p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>If we change these terms, we will update the date at the top of this page. If the changes are significant, we will also tell you by email or in your student portal. Continuing to use the service after that means you accept the new terms.</p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>For questions about these terms, email Veridan Education at <ContactLink />.</p>
      </LegalSection>
    </LegalPage>
  );
}
