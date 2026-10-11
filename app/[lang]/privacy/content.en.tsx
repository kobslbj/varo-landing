import { LegalPage, Section } from "@/components/landing/legal-page";
import { siteConfig } from "@/config/site";

export const meta = {
  title: "Privacy Policy | VARO",
  description:
    "What data VARO collects, how it’s used and protected, and how you can delete it.",
};

const email = siteConfig.contactEmail;

export default function PrivacyEn() {
  return (
    <LegalPage
      eyebrow="PRIVACY"
      intro={
        <p>
          VARO is a bouldering log app. We only collect the data the app needs
          to work.{" "}
          <strong>No ads, no tracking, and we never sell your data.</strong>{" "}
          This policy explains what we collect, why, where it’s stored, and how
          you can delete it.
        </p>
      }
      path="/privacy"
      title="Privacy Policy"
      updated="2026.10.11"
    >
      <Section title="1. Data we collect">
        <ul>
          <li>
            <strong>Account data:</strong> when you use Sign in with Apple, the
            user identifier and email address Apple provides (if you choose Hide
            My Email, we only receive Apple’s relay address), and the name Apple
            shares the first time you sign in (if you share it), which we use to
            prefill your nickname. We never receive your Apple password.
          </li>
          <li>
            <strong>Profile:</strong> your nickname, a system-generated
            username, the profile photo you upload, and the home gym you choose
            to add.
          </li>
          <li>
            <strong>Body measurements (optional):</strong> the height and reach
            you choose to enter, used to work out your ape index. Only you can
            see them.
          </li>
          <li>
            <strong>Onboarding questions:</strong> your climbing experience,
            what you want to use VARO for, and how you heard about it. We use
            these to tailor the app to you and to understand how people find
            VARO.
          </li>
          <li>
            <strong>Climbing logs:</strong> the sessions and routes you create
            (grade, hold color, wall angle, attempts, result, notes), your
            projects and saved gyms, and private locations you add.
          </li>
          <li>
            <strong>Photos and videos:</strong> only files you pick from your
            library to add to a log or set as your profile photo are uploaded.
            VARO never reads or uploads anything else in your library.
          </li>
          <li>
            <strong>Feedback:</strong> feedback and bug reports you send in the
            app, along with the app version, platform and OS version at the
            time, so we can track down issues.
          </li>
        </ul>
        <p>
          We <strong>do not</strong> collect your location, contacts,
          advertising identifier or browsing history, and the app contains no
          third-party analytics or advertising tools.
        </p>
      </Section>

      <Section title="2. How we use your data">
        <ul>
          <li>
            To provide the app’s core features: signing in, saving and syncing
            your logs, and showing your stats and progress.
          </li>
          <li>
            To handle the feedback and bug reports you send, and to improve the
            app.
          </li>
          <li>To keep the service secure, for example by preventing abuse.</li>
        </ul>
        <p>
          We never use your data for advertising, and we never sell or rent it
          to anyone.
        </p>
      </Section>

      <Section title="3. Who can see your data">
        <p>
          Your logs, photos and videos are{" "}
          <strong>visible only to you by default</strong>. Photos and videos are
          kept in private storage and can only be read through short-lived
          signed links. Your profile photo and nickname may be visible to other
          users.
        </p>
        <p>
          When you use the share feature, the image is sent through your
          device’s share sheet, so you decide where it goes and who sees it.
        </p>
      </Section>

      <Section title="4. Storage and third-party services">
        <p>
          We run VARO on the following services, which process data only on our
          instructions:
        </p>
        <ul>
          <li>
            <strong>Supabase:</strong> authentication, database and file
            storage. Data is stored on Supabase’s cloud servers, which may be
            located outside Taiwan.
          </li>
          <li>
            <strong>Apple:</strong> Sign in with Apple and app distribution.
          </li>
        </ul>
        <p>
          All data is encrypted in transit (HTTPS), and database access rules
          ensure each user can only read and write their own data.
        </p>
      </Section>

      <Section title="5. Retention and account deletion">
        <p>
          We keep your data for as long as your account exists. You can
          permanently delete your account at any time in the app under{" "}
          <strong>Me → Settings → Delete Account</strong>. Your profile, logs,
          photos and videos are deleted along with it and cannot be recovered,
          and we revoke VARO’s Sign in with Apple authorization. Feedback you
          sent is kept, but is no longer linked to your account.
        </p>
        <p>
          If you can’t sign in to the app, email{" "}
          <a href={`mailto:${email}`}>{email}</a> and we’ll delete it for you.
        </p>
      </Section>

      <Section title="6. Your rights">
        <p>
          Under Taiwan’s Personal Data Protection Act, you may request to
          access, review, or receive a copy of your personal data, to supplement
          or correct it, to stop its collection, processing or use, or to have
          it deleted. Email <a href={`mailto:${email}`}>{email}</a> and we’ll
          reply as soon as we can.
        </p>
      </Section>

      <Section title="7. Children">
        <p>
          VARO is not designed for children under 13, and we do not knowingly
          collect personal data from children. If you believe this has happened,
          please contact us and we will delete the data.
        </p>
      </Section>

      <Section title="8. Changes to this policy">
        <p>
          If we make significant changes to this policy, we’ll update the “Last
          updated” date on this page and, where appropriate, let you know in the
          app.
        </p>
      </Section>

      <Section title="9. Contact us">
        <p>
          Questions about privacy? Email us at{" "}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
