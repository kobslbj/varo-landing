import Link from "next/link";

import { LegalPage, Section } from "@/components/landing/legal-page";
import { siteConfig } from "@/config/site";

export const meta = {
  title: "Support | VARO",
  description: "Frequently asked questions and how to reach the VARO team.",
};

const email = siteConfig.contactEmail;

export default function SupportEn() {
  return (
    <LegalPage
      eyebrow="SUPPORT"
      intro={
        <>
          <p>
            Hit a problem or have an idea? The fastest way is to report it in
            the app, or just email us.
          </p>
          <a
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-lime px-6 text-[16px] font-semibold text-ink transition-colors hover:bg-lime-deep"
            href={`mailto:${email}?subject=${encodeURIComponent("VARO support")}`}
          >
            Email {email}
          </a>
        </>
      }
      path="/support"
      title="Need a hand?"
    >
      <Section title="Report a problem or send feedback in the app">
        <p>
          Go to <strong>Me → Settings</strong> and choose “Feedback” or “Report
          a Problem”. The app attaches version info so we can find the cause
          faster.
        </p>
      </Section>

      <Section title="How do I sign in?">
        <p>
          VARO uses Sign in with Apple. You can choose to hide your email, in
          which case we only receive Apple’s relay address.
        </p>
      </Section>

      <Section title="Can other people see my logs?">
        <p>
          By default, only you can. Photos are kept in private storage, videos
          stay on your phone, and others only see what you choose to share. See
          the <Link href="/en/privacy">Privacy Policy</Link> for details.
        </p>
      </Section>

      <Section title="Where are my videos? Will I lose them on a new phone?">
        <p>
          Videos stay on your phone and are never uploaded; VARO only keeps a
          thumbnail and details such as length. If you delete the app, the
          videos can no longer be played. When you move to a new phone with an
          iCloud backup or Quick Start, they usually come along. Cloud backup is
          planned.
        </p>
      </Section>

      <Section title="A photo failed to upload">
        <p>
          Routes with a failed upload show a red retry badge; tap it to upload
          again. Files are kept on your phone first, so uploads also resume
          automatically once you’re back online or signed in again.
        </p>
      </Section>

      <Section title="I can’t find my gym">
        <p>
          If your gym doesn’t show up in search, you can add it as a private
          location that only you can see. You’re also welcome to email us the
          gym’s name and address, and we’ll add it as soon as we can.
        </p>
      </Section>

      <Section title="How do I delete my account?">
        <p>
          In the app, go to <strong>Me → Settings → Delete Account</strong>.
          Your profile, logs, photos and the videos VARO keeps on this phone are
          permanently deleted and cannot be recovered, and VARO’s Sign in with
          Apple authorization is revoked. If you can’t sign in, email{" "}
          <a href={`mailto:${email}`}>{email}</a> and we’ll take care of it.
        </p>
      </Section>

      <Section title="Gym partnerships">
        <p>
          Run a climbing gym and want to talk about route info or working
          together? Email us at <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
