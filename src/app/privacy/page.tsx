import type { Metadata } from 'next';
import { ContactLink, LegalPage, LegalSection } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Veridan Education',
  description: 'How Veridan Education collects, uses and protects student information.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Veridan Education connects African students with universities abroad through live webinars. This policy explains what information we collect, why we collect it, who can see it and the choices you have."
    >
      <LegalSection title="Information we collect">
        <p>You give us this information when you apply or use your student portal:</p>
        <ul>
          <li><strong>Contact details:</strong> your name, email address, phone number and the country you live in.</li>
          <li><strong>Personal details:</strong> your date of birth and gender, if you choose to provide them.</li>
          <li><strong>Academic details:</strong> your education level, school, GPA, graduation year, program of interest, preferred destination and English test or Medium of Instruction details.</li>
          <li><strong>Documents:</strong> transcripts, certificates and other files you upload.</li>
          <li><strong>Activity:</strong> messages you send us, webinar sessions you are assigned to and your attendance.</li>
        </ul>
        <p>Our staff also add information to your record, such as university matches, internal assessment notes and the stage of your application. If you made a payment in the past, we keep the record of it.</p>
      </LegalSection>

      <LegalSection title="Signing in with Google">
        <p>If you choose Continue with Google, we receive your name and email address from Google and confirm that Google has verified the email. We use them only to create your account and sign you in. We do not receive your Google password, and we do not sell this information or use it for advertising.</p>
      </LegalSection>

      <LegalSection title="How we use your information">
        <ul>
          <li>To create and manage your account and application.</li>
          <li>To match you with universities and advise you on your options.</li>
          <li>To run webinars and share room links and schedules with you.</li>
          <li>To contact you about your application, webinars and your account.</li>
          <li>To keep the service secure, including keeping logs of activity and preventing misuse.</li>
        </ul>
        <p>Our internal assessments help staff advise you. They do not decide whether you can register, and each university makes its own admission decisions.</p>
      </LegalSection>

      <LegalSection title="Who can see your information">
        <p><strong>Veridan staff</strong> can see your record so they can support your application.</p>
        <p><strong>Partner universities:</strong> once our staff approve a match between you and a university, that university&apos;s representatives get read-only access to your details and documents in our portal. This includes your contact details, academic details and uploaded documents. They cannot change your information, and they do not see your date of birth or gender. Universities are responsible for how they handle anything they receive from you directly, for example when you apply to them.</p>
        <p><strong>Service providers</strong> process information for us so that the service can run:</p>
        <ul>
          <li>Cloudinary stores uploaded documents.</li>
          <li>Brevo sends our emails.</li>
          <li>Whereby provides webinar video rooms.</li>
          <li>Google provides sign-in, if you choose it.</li>
          <li>Vercel and Render host our website and application, and our database provider stores your record.</li>
        </ul>
        <p>We do not sell your personal information. We may share information if the law requires it or if it is needed to protect people&apos;s safety or our legal rights.</p>
      </LegalSection>

      <LegalSection title="Webinars">
        <p>Webinars take place in live video rooms, where other participants may see or hear you if you turn on your camera or microphone. Our platform does not record webinars by default. We will tell you before a session if it is going to be recorded.</p>
      </LegalSection>

      <LegalSection title="Storage on your device">
        <p>While you fill in an application without an account, your answers and files stay in your browser until you submit. When you sign in, your browser stores a login token so you stay signed in. We do not use advertising or analytics cookies.</p>
      </LegalSection>

      <LegalSection title="How long we keep your information">
        <p>We keep your information while your account is active. If you deactivate your account, you can no longer sign in, and we keep your information for up to two years in case you return or a question comes up about your application. After that we delete or anonymize it, unless the law requires us to keep it for longer.</p>
      </LegalSection>

      <LegalSection title="Your choices and rights">
        <ul>
          <li>You can view and correct most of your details in your student portal.</li>
          <li>You can deactivate your account in Account Settings.</li>
          <li>You can email us to ask for a copy of your information, to correct it, or to delete it sooner. We will respond within 30 days.</li>
        </ul>
        <p>Depending on where you live, you may have further rights, including the right to complain to your data protection authority.</p>
      </LegalSection>

      <LegalSection title="Security">
        <p>We protect passwords with hashing, limit who can see student records by role and limit repeated sign-in attempts. No online service is completely secure, so please use a strong password and tell us if you think your account has been accessed by someone else.</p>
      </LegalSection>

      <LegalSection title="International transfers">
        <p>Our service providers and partner universities may be in countries other than the one you live in, where data protection laws can differ. By applying to study abroad through Veridan, you understand that your information may be handled in those countries.</p>
      </LegalSection>

      <LegalSection title="Students under the age of majority">
        <p>If you are under the age of majority where you live, please make sure a parent or guardian agrees to you using our service before you register.</p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>If we change this policy, we will update the date at the top of this page. If the changes are significant, we will also tell you by email or in your student portal.</p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>For questions or requests about your privacy, email Veridan Education at <ContactLink />.</p>
      </LegalSection>
    </LegalPage>
  );
}
