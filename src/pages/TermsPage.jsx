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

export default function TermsPage() {
  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <Link to="/" style={styles.back}>← Back</Link>

        <span style={styles.wordmark}>wedin.ai</span>

        <h1 style={styles.h1}>Terms and Conditions</h1>
        <p style={styles.meta}>Tones of Note PTY (Ltd) · Last updated April 2026</p>

        <hr style={styles.divider} />

        <h2 style={styles.h2}>1. Who we are</h2>
        <p style={styles.p}>
          wedin.ai is a service operated by Tones of Note PTY (Ltd), a company registered in South Africa.
          You can reach us at <a href="mailto:hello@wedin.ai" style={{ color: '#1C2B3A' }}>hello@wedin.ai</a>.
        </p>

        <h2 style={styles.h2}>2. What this service is</h2>
        <p style={styles.p}>
          wedin.ai is an AI-powered wedding music planning tool. It runs a guided discovery session,
          generates a music portrait of your preferences, and assembles a detailed music brief for
          your wedding planner and performers.
        </p>
        <p style={styles.p}>
          wedin.ai is a planning tool only. We are not a booking agency, talent agent, or event
          management service. We do not source, vet, book, or guarantee the availability or quality
          of any musician, DJ, or performer. Any act recommendations are directional guidance — not
          endorsements or bookings.
        </p>

        <h2 style={styles.h2}>3. Payment</h2>
        <p style={styles.p}>
          Access to the full Moment Map and music brief costs R699 (South African Rand), charged as
          a one-time fee. Payment is processed securely through our payment provider.
        </p>
        <p style={styles.p}>
          This fee is non-refundable once your music brief has been generated. If you experience a
          technical issue that prevents brief generation, contact us at hello@wedin.ai and we will
          resolve it.
        </p>

        <h2 style={styles.h2}>4. Your responsibilities</h2>
        <p style={styles.p}>
          The quality of your music brief depends directly on the accuracy and completeness of the
          answers you provide during the discovery session. You are responsible for providing
          truthful and accurate information about your preferences, guest count, venue, and budget.
          We cannot be held responsible for outputs based on inaccurate inputs.
        </p>

        <h2 style={styles.h2}>5. Intellectual property</h2>
        <p style={styles.p}>
          wedin.ai owns the platform, technology, prompts, design, and all associated intellectual
          property. The music brief generated from your session is yours — you may share it with
          your wedding planner, performers, or any party involved in your event.
        </p>
        <p style={styles.p}>
          You may not reproduce, resell, or commercialise the wedin.ai platform or its outputs
          without written permission from Tones of Note PTY (Ltd).
        </p>

        <h2 style={styles.h2}>6. Pricing guidance</h2>
        <p style={styles.p}>
          Any act pricing included in your brief is indicative only, based on current South African
          market data at the time of generation. Actual costs will vary based on availability,
          travel, production requirements, and negotiation. wedin.ai accepts no liability for
          pricing discrepancies between our guidance and quotes you receive from performers.
        </p>

        <h2 style={styles.h2}>7. Limitation of liability</h2>
        <p style={styles.p}>
          wedin.ai is a planning tool. To the fullest extent permitted by South African law, Tones
          of Note PTY (Ltd) is not liable for any loss or damage arising from your use of this
          service, including but not limited to decisions made based on act recommendations,
          pricing guidance, or brief content.
        </p>
        <p style={styles.p}>
          Our total liability to you in any circumstances shall not exceed the amount you paid for
          the service (R699).
        </p>

        <h2 style={styles.h2}>8. Governing law</h2>
        <p style={styles.p}>
          These terms are governed by the laws of the Republic of South Africa. Any disputes will
          be subject to the jurisdiction of the South African courts.
        </p>

        <h2 style={styles.h2}>9. Changes to these terms</h2>
        <p style={styles.p}>
          We may update these terms from time to time. The current version will always be available
          at wedin.ai/terms. Continued use of the service after changes are posted constitutes
          acceptance of the updated terms.
        </p>

        <h2 style={styles.h2}>10. Contact</h2>
        <p style={styles.p}>
          Questions about these terms? Email us at{' '}
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
