import React from 'react'
import { Link } from 'react-router-dom'

const articles = [
  {
    slug: 'wedding-music-south-africa',
    title: 'The Complete Guide to Wedding Music Planning in South Africa (2026)',
    description: 'Nine musical moments, full ZAR pricing, booking lead times, and the brief-writing framework every SA couple needs.',
  },
]

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    color: '#1C2B3A',
    fontFamily: '"DM Sans", sans-serif',
  },
  header: {
    borderBottom: '1px solid rgba(28,43,58,0.08)',
    padding: '24px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '20px',
    fontWeight: 400,
    color: '#1C2B3A',
    textDecoration: 'none',
    letterSpacing: '0.02em',
  },
  inner: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '64px 24px 80px',
  },
  eyebrow: {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#C4922A',
    marginBottom: '16px',
  },
  heading: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '36px',
    fontWeight: 400,
    lineHeight: 1.2,
    color: '#1C2B3A',
    marginBottom: '16px',
  },
  subheading: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#6B6560',
    marginBottom: '48px',
    maxWidth: '540px',
  },
  divider: {
    borderTop: '1px solid rgba(28,43,58,0.1)',
    marginBottom: '40px',
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(28,43,58,0.06)',
    borderLeft: '3px solid #C4922A',
    borderRadius: '0 8px 8px 0',
    padding: '24px 28px',
    marginBottom: '16px',
    textDecoration: 'none',
    display: 'block',
    transition: 'box-shadow 0.15s ease',
  },
  articleTitle: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '22px',
    fontWeight: 400,
    color: '#1C2B3A',
    marginBottom: '8px',
    lineHeight: 1.3,
  },
  articleDesc: {
    fontSize: '15px',
    color: '#6B6560',
    lineHeight: 1.5,
  },
  footer: {
    padding: '32px 24px',
    borderTop: '1px solid rgba(28,43,58,0.08)',
    textAlign: 'center',
    fontSize: '13px',
    color: '#6B6560',
  },
}

export default function GuidePage() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.wordmark}>wedin.ai</Link>
      </header>

      <main style={styles.inner}>
        <p style={styles.eyebrow}>Guides</p>
        <h1 style={styles.heading}>Wedding Music Planning</h1>
        <p style={styles.subheading}>
          Practical guides for South African couples planning their wedding music — from act types and pricing to booking timelines and brief writing.
        </p>

        <div style={styles.divider} />

        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/guide/${article.slug}/`}
            style={styles.articleCard}
          >
            <div style={styles.articleTitle}>{article.title}</div>
            <div style={styles.articleDesc}>{article.description}</div>
          </Link>
        ))}
      </main>

      <footer style={styles.footer}>
        <Link to="/" style={{ color: '#6B6560', textDecoration: 'none' }}>wedin.ai</Link>
        {' · '}
        <Link to="/terms" style={{ color: '#6B6560', textDecoration: 'none' }}>Terms</Link>
        {' · '}
        <Link to="/privacy" style={{ color: '#6B6560', textDecoration: 'none' }}>Privacy</Link>
      </footer>
    </div>
  )
}
