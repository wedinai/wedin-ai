import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import weddingMusicSA from '../content/wedding-music-south-africa.md?raw'

const ARTICLES = {
  'wedding-music-south-africa': {
    content: weddingMusicSA,
    title: 'Wedding Music Planning South Africa — Complete Guide 2026 | wedin.ai',
    description: 'Nine musical moments, full ZAR pricing, booking lead times, and brief-writing guidance. The most complete SA wedding music planning guide available.',
    articleSchema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'The Complete Guide to Wedding Music Planning in South Africa (2026)',
      description: 'Nine musical moments, full ZAR pricing, booking lead times, and the brief-writing framework for South African couples planning their wedding music.',
      author: {
        '@type': 'Person',
        name: 'Rus Nerwich',
        jobTitle: 'Founder, wedin.ai | Former Director, Tones of Note',
      },
      publisher: {
        '@type': 'Organization',
        name: 'wedin.ai',
        url: 'https://wedin.ai',
      },
      datePublished: '2026-04-19',
      dateModified: '2026-04-19',
      mainEntityOfPage: 'https://wedin.ai/guide/wedding-music-south-africa/',
    },
    faqSchema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much should I budget for wedding music in South Africa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For a mid-size South African wedding (80–150 guests) with live music at the ceremony, a live act at pre-drinks, and a DJ for the reception, a realistic total budget is R40,000–R75,000. This covers a string quartet for the ceremony (R12,000–R20,000), a jazz trio or marimba band for pre-drinks (R10,000–R18,000), and a DJ for the reception (R8,000–R22,000), plus PA hire where needed. Couples who want a live band for the reception should budget an additional R25,000–R80,000 depending on band size. The most common budgeting mistake is treating PA, travel, and generator costs as included — they frequently are not.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need a live band, or is a DJ enough for a South African wedding?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A DJ is enough — and for many weddings, a DJ is the better choice. A good DJ brings programming precision, a vast repertoire, and the flexibility to read a room in real time. A live band brings energy, visual spectacle, and an emotional charge that is genuinely different from a DJ. The question isn\'t which is objectively better — it\'s which is right for your wedding. Guest count, venue size, budget, and how central music is to your identity as a couple all factor in. Many South African couples use both: live acts for the ceremony and pre-drinks, DJ for the reception. This is often the best of both options and is frequently more cost-effective than a full live band for the entire evening.',
          },
        },
        {
          '@type': 'Question',
          name: 'How far in advance should I book wedding music acts in South Africa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'String quartets and established live bands should be booked 10–14 months before your wedding date for peak season (October–April). DJs: 6–8 months is generally comfortable, though popular DJs in Cape Town and the Winelands fill faster than that. Marimba bands and jazz ensembles: 6–8 months for peak season. If your date is in shoulder or off-peak season (May–September, excluding long weekends), you have more flexibility — but the best acts in every category have loyal client bases and book out regardless of season.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does load-shedding mean for wedding music in South Africa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Load-shedding is a real logistical consideration for every wedding with amplified music, a DJ, or any electronic equipment. Venues vary enormously in their generator capacity — some have full backup power, others have nothing. Confirm your venue\'s exact backup power capability before your venue contract is signed, not after. For outdoor venues and farm venues, assume no backup power unless explicitly confirmed in writing. Your DJ and any amplified act should have their own generator contingency plan or have confirmed that the venue\'s generator covers their equipment. Build this confirmation into the music brief.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I put in a music brief for my wedding DJ or band?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A useful music brief for a wedding act covers: the three-word feeling you want the day to have; a moment-by-moment breakdown of what you want from each part of the day and at what energy level; specific song references for key moments (processional, first dance, last song minimum); a must-play list with the reason behind each song; a do-not-play list with the reason behind each entry; information about your guests (oldest, youngest, cultural backgrounds, musical tastes if relevant); the logistical sequence of the day (timings, transitions, who they coordinate with); and the load-shedding contingency plan. wedin.ai\'s discovery session generates a complete brief from your answers — it takes about 20 minutes and produces a document your acts will actually know what to do with.',
          },
        },
      ],
    },
  },
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    color: '#1C2B3A',
    fontFamily: '"DM Sans", sans-serif',
  },
  header: {
    borderBottom: '1px solid rgba(28,43,58,0.08)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  wordmark: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '20px',
    fontWeight: 400,
    color: '#1C2B3A',
    textDecoration: 'none',
    letterSpacing: '0.02em',
  },
  backLink: {
    fontSize: '13px',
    color: '#6B6560',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  separator: {
    color: 'rgba(28,43,58,0.2)',
    fontSize: '13px',
  },
  article: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '56px 24px 96px',
  },
  footer: {
    padding: '32px 24px',
    borderTop: '1px solid rgba(28,43,58,0.08)',
    textAlign: 'center',
    fontSize: '13px',
    color: '#6B6560',
  },
}

const mdComponents = {
  h1: ({ children }) => (
    <h1 style={{
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 'clamp(28px, 5vw, 40px)',
      fontWeight: 400,
      lineHeight: 1.2,
      color: '#1C2B3A',
      marginBottom: '24px',
      marginTop: 0,
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 'clamp(22px, 4vw, 30px)',
      fontWeight: 400,
      lineHeight: 1.3,
      color: '#1C2B3A',
      marginTop: '56px',
      marginBottom: '16px',
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 'clamp(18px, 3vw, 22px)',
      fontWeight: 400,
      lineHeight: 1.3,
      color: '#1C2B3A',
      marginTop: '32px',
      marginBottom: '12px',
    }}>{children}</h3>
  ),
  p: ({ children }) => (
    <p style={{
      fontSize: '18px',
      lineHeight: 1.75,
      color: '#1C2B3A',
      marginBottom: '20px',
      marginTop: 0,
    }}>{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      style={{ color: '#C4922A', textDecoration: 'underline', textUnderlineOffset: '3px' }}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >{children}</a>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 500, color: '#1C2B3A' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: 'italic', color: '#1C2B3A' }}>{children}</em>
  ),
  hr: () => (
    <hr style={{
      border: 'none',
      borderTop: '1px solid rgba(28,43,58,0.12)',
      margin: '48px 0',
    }} />
  ),
  ul: ({ children }) => (
    <ul style={{
      paddingLeft: '24px',
      marginBottom: '20px',
      lineHeight: 1.75,
    }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      paddingLeft: '24px',
      marginBottom: '20px',
      lineHeight: 1.75,
    }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{
      fontSize: '18px',
      lineHeight: 1.75,
      color: '#1C2B3A',
      marginBottom: '8px',
    }}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '3px solid #C4922A',
      backgroundColor: 'rgba(196,146,42,0.06)',
      margin: '24px 0',
      padding: '16px 20px',
      borderRadius: '0 8px 8px 0',
      fontStyle: 'italic',
      fontSize: '17px',
      lineHeight: 1.65,
      color: '#1C2B3A',
    }}>{children}</blockquote>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '15px',
        lineHeight: 1.5,
      }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ backgroundColor: 'rgba(28,43,58,0.04)' }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th style={{
      padding: '10px 16px',
      textAlign: 'left',
      fontWeight: 500,
      fontSize: '13px',
      letterSpacing: '0.04em',
      color: '#6B6560',
      borderBottom: '1px solid rgba(28,43,58,0.1)',
      whiteSpace: 'nowrap',
    }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{
      padding: '10px 16px',
      borderBottom: '1px solid rgba(28,43,58,0.07)',
      color: '#1C2B3A',
      verticalAlign: 'top',
    }}>{children}</td>
  ),
}

export default function GuideArticlePage({ article }) {
  const data = ARTICLES[article]

  useEffect(() => {
    if (!data) return

    document.title = data.title

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = data.description

    // Article schema
    const articleScript = document.createElement('script')
    articleScript.type = 'application/ld+json'
    articleScript.id = 'guide-article-schema'
    articleScript.text = JSON.stringify(data.articleSchema)
    document.head.appendChild(articleScript)

    // FAQ schema
    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.id = 'guide-faq-schema'
    faqScript.text = JSON.stringify(data.faqSchema)
    document.head.appendChild(faqScript)

    return () => {
      document.title = 'wedin.ai — Wedding Music Planning, Start with the Music'
      const prevDesc = document.querySelector('meta[name="description"]')
      if (prevDesc) prevDesc.content = 'AI-powered wedding music planning for South African couples. Discover your music portrait, plan every moment, get a complete brief. R699 one-time fee.'
      document.getElementById('guide-article-schema')?.remove()
      document.getElementById('guide-faq-schema')?.remove()
    }
  }, [article, data])

  if (!data) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <Link to="/" style={styles.wordmark}>wedin.ai</Link>
        </header>
        <div style={{ ...styles.article, textAlign: 'center', paddingTop: '80px' }}>
          <p style={{ fontSize: '18px', color: '#6B6560' }}>Article not found.</p>
          <Link to="/guide/" style={{ color: '#C4922A' }}>Back to guides</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.wordmark}>wedin.ai</Link>
        <span style={styles.separator}>·</span>
        <Link to="/guide/" style={styles.backLink}>Guides</Link>
      </header>

      <article style={styles.article}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={mdComponents}
        >
          {data.content}
        </ReactMarkdown>
      </article>

      <footer style={styles.footer}>
        <Link to="/" style={{ color: '#6B6560', textDecoration: 'none' }}>wedin.ai</Link>
        {' · '}
        <Link to="/guide/" style={{ color: '#6B6560', textDecoration: 'none' }}>Guides</Link>
        {' · '}
        <Link to="/terms" style={{ color: '#6B6560', textDecoration: 'none' }}>Terms</Link>
        {' · '}
        <Link to="/privacy" style={{ color: '#6B6560', textDecoration: 'none' }}>Privacy</Link>
      </footer>
    </div>
  )
}
