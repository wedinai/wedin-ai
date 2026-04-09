import React from 'react'
import { Link } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    color: '#1C2B3A',
    padding: '48px 24px 80px',
  },
  inner: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  back: {
    display: 'inline-block',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#6B6560',
    textDecoration: 'none',
    marginBottom: '40px',
  },
  wordmark: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#1C2B3A',
    marginBottom: '40px',
    display: 'block',
  },
  h1: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '40px',
    fontWeight: 400,
    color: '#1C2B3A',
    margin: '0 0 8px',
    lineHeight: 1.2,
  },
  meta: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#6B6560',
    margin: '0 0 48px',
  },
  h2: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '24px',
    fontWeight: 400,
    color: '#1C2B3A',
    margin: '40px 0 12px',
    lineHeight: 1.3,
  },
  p: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#1C2B3A',
    margin: '0 0 16px',
  },
  ul: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#1C2B3A',
    margin: '0 0 16px',
    paddingLeft: '24px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(28,43,58,0.1)',
    margin: '48px 0',
  },
  footer: {
    marginTop: '64px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(28,43,58,0.1)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#6B6560',
    display: 'flex',
    gap: '16px',
  },
  footerLink: {
    color: '#6B6560',
    textDecoration: 'none',
  },
}

export default function PrivacyPage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <Link to="/" style={styles.back}>← Back</Link>

        <span style={styles.wordmark}>wedin.ai</span>

        <h1 style={styles.h1}>Privacy Policy</h1>
        <p style={styles.meta}>Tones of Note PTY (Ltd) · Last updated April 2026 · POPIA compliant</p>

        <hr style={styles.divider} />

        <h2 style={styles.h2}>1. Who we are</h2>
        <p style={styles.p}>
          This Privacy Policy applies to wedin.ai, operated by Tones of Note PTY (Ltd), a company
          registered in South Africa. For any privacy-related enquiries, contact us at{' '}
          <a href="mailto:hello@wedin.ai" style={{ color: '#1C2B3A' }}>hello@wedin.ai</a>.
        </p>

        <h2 style={styles.h2}>2. What data we collect</h2>
        <p style={styles.p}>When you use wedin.ai, we collect:</p>
        <ul style={styles.ul}>
          <li>Your email address — provided voluntarily after your music portrait is generated</li>
          <li>Your discovery session answers — music preferences, wedding details, guest count, venue type, and budget range</li>
          <li>Your moment deep-dive answers — moment-by-moment music preferences across up to nine wedding moments</li>
          <li>Your generated music portrait and brief — the AI-generated outputs from your session</li>
        </ul>
        <p style={styles.p}>
          We do not collect payment card details. Payment is handled entirely by our payment
          provider. We receive only a confirmation that payment was successful.
        </p>

        <h2 style={styles.h2}>3. Why we collect it</h2>
        <p style={styles.p}>We collect this data to:</p>
        <ul style={styles.ul}>
          <li>Generate your music portrait and wedding music brief</li>
          <li>Save your session progress so you can return and pick up where you left off</li>
          <li>Send your music portrait to your email address</li>
          <li>Improve the quality of our AI outputs over time</li>
        </ul>
        <p style={styles.p}>
          We do not use your data for advertising, profiling, or any purpose unrelated to your
          wedding music planning session.
        </p>

        <h2 style={styles.h2}>4. How it is stored</h2>
        <p style={styles.p}>
          Your session data is stored in Supabase, a cloud database provider. We use South African
          or nearest available regions where possible. Your session answers and generated outputs
          are stored against your email address and a unique session identifier.
        </p>
        <p style={styles.p}>
          Some session state is also stored locally in your browser (localStorage) to enable
          session continuity without requiring a login. This data lives on your device and is not
          transmitted to any third party.
        </p>

        <h2 style={styles.h2}>5. Who we share it with</h2>
        <p style={styles.p}>We share data only with the following service providers, strictly for the purpose of running wedin.ai:</p>
        <ul style={styles.ul}>
          <li><strong>Anthropic</strong> — your session answers are sent to Anthropic's Claude API to generate your music portrait and brief. Anthropic processes this data to produce the AI output and does not retain it for training without your consent.</li>
          <li><strong>Resend</strong> — your email address and music portrait are sent to Resend to deliver your portrait to your inbox. Resend does not use this data for any other purpose.</li>
          <li><strong>Supabase</strong> — your session data is stored in Supabase. Data is encrypted at rest and in transit.</li>
        </ul>
        <p style={styles.p}>
          We do not sell your data. We do not share your data with wedding planners, musicians,
          booking agents, or any other third party without your explicit consent.
        </p>

        <h2 style={styles.h2}>6. How long we keep it</h2>
        <p style={styles.p}>
          Your session data is retained for 12 months from the date of your last activity.
          After this period, your data is deleted from our systems. If you would like your data
          deleted sooner, see Section 7.
        </p>

        <h2 style={styles.h2}>7. Your rights under POPIA</h2>
        <p style={styles.p}>
          Under the Protection of Personal Information Act (POPIA), you have the right to:
        </p>
        <ul style={styles.ul}>
          <li>Know what personal information we hold about you</li>
          <li>Request a copy of your personal information</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to the processing of your personal information</li>
          <li>Lodge a complaint with the Information Regulator of South Africa</li>
        </ul>
        <p style={styles.p}>
          To exercise any of these rights, email us at{' '}
          <a href="mailto:hello@wedin.ai" style={{ color: '#1C2B3A' }}>hello@wedin.ai</a> with
          your request. We will respond within 30 days.
        </p>
        <p style={styles.p}>
          The Information Regulator of South Africa can be contacted at{' '}
          <a href="mailto:inforeg@justice.gov.za" style={{ color: '#1C2B3A' }}>inforeg@justice.gov.za</a>.
        </p>

        <h2 style={styles.h2}>8. Cookies and local storage</h2>
        <p style={styles.p}>
          wedin.ai uses browser localStorage to save your session progress between visits. This
          allows you to return to your session on the same device without losing your answers.
        </p>
        <p style={styles.p}>
          We do not use tracking cookies. We do not use advertising cookies. We do not use
          third-party analytics cookies. No cookie data is shared with advertising networks or
          data brokers.
        </p>
        <p style={styles.p}>
          The only session-related data stored in your browser is your wedin.ai session
          progress — nothing else.
        </p>

        <h2 style={styles.h2}>9. Changes to this policy</h2>
        <p style={styles.p}>
          We may update this policy from time to time. The current version will always be available
          at wedin.ai/privacy. We will notify you of material changes via the email address
          associated with your account if we have one.
        </p>

        <h2 style={styles.h2}>10. Contact</h2>
        <p style={styles.p}>
          For any privacy-related questions or requests, contact us at{' '}
          <a href="mailto:hello@wedin.ai" style={{ color: '#1C2B3A' }}>hello@wedin.ai</a>.
        </p>

        <div style={styles.footer}>
          <Link to="/terms" style={styles.footerLink}>Terms</Link>
          <span>·</span>
          <Link to="/privacy" style={styles.footerLink}>Privacy</Link>
        </div>
      </div>
    </div>
  )
}
