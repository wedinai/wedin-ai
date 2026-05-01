import ExcelJS from 'exceljs'

const DISCLAIMER =
  'These are market reference ranges based on SA wedding pricing as of early 2026. Every act quotes differently based on experience, lineup, travel, and availability. Use these as planning anchors, not booking commitments.'

const BUDGET_SYSTEM_PROMPT = `You are a South African wedding music planning specialist. Generate two planning sheets for a couple's wedding music budget document.

Return ONLY valid JSON — no markdown, no preamble:
{
  "bookingTimeline": [
    { "act": "...", "leadTime": "...", "targetDate": "" }
  ],
  "hiddenCosts": [
    { "item": "...", "illustrativeRange": "...", "confirmed": "", "notes": "" }
  ]
}

BOOKING TIMELINE: Based on the acts recommended in the moments below, generate one row per distinct act type. Use these SA market lead times: Choir/a cappella 10–12 weeks | String quartet 10–12 weeks | Classical ensemble 10–12 weeks | Live band 8–10 weeks | Jazz trio/quartet 6–8 weeks | DJ 4–6 weeks | Marimba ensemble 6–8 weeks | Solo musician 4–6 weeks | Acoustic duo 4–6 weeks. Leave targetDate blank — couple fills in.

HIDDEN COSTS: Include only items relevant to this couple's venue type and recommended acts. Always include VAT 15%. Include PA + sound engineer if any live acts recommended. Include generator only if venue_type is farm_bush, destination, or game_lodge. Include travel costs if destination wedding. Include stage hire if band recommended. Use realistic SA ranges.

IMPORTANT: Generating content for this specific couple based ONLY on answers provided. Do not invent details not present in the moment recommendations.`

function firstSentence(text) {
  if (!text) return ''
  const idx = text.search(/\.\s/)
  return idx !== -1 ? text.slice(0, idx + 1) : text
}

function navyFill() {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1C2B3A' } }
}

function goldFill() {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F0E8' } }
}

async function buildExcel(moments, bookingTimeline, hiddenCosts, coupleName) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'wedin.ai'

  // ── Sheet 1 — Music Budget ─────────────────────────────────────────────────
  const ws1 = wb.addWorksheet('Music Budget')

  ws1.columns = [
    { key: 'moment', width: 28 },
    { key: 'act', width: 40 },
    { key: 'range', width: 22 },
    { key: 'quote', width: 18 },
    { key: 'variance', width: 18 },
  ]

  // Row 1 — disclaimer
  const discRow = ws1.addRow([DISCLAIMER, '', '', '', ''])
  ws1.mergeCells('A1:E1')
  discRow.getCell(1).font = { bold: true, size: 10, name: 'Arial' }
  discRow.getCell(1).alignment = { wrapText: true, vertical: 'top' }
  discRow.getCell(1).fill = goldFill()
  discRow.height = 52

  // Row 2 — headers
  const headers = ['Moment', 'Act Recommended', 'Illustrative Range', 'Your Quote', 'Variance']
  const hdrRow = ws1.addRow(headers)
  hdrRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFAF7F2' }, size: 10, name: 'Arial' }
    cell.fill = navyFill()
    cell.alignment = { vertical: 'middle', wrapText: true }
  })
  hdrRow.height = 22

  // Data rows
  const dataStartRow = 3
  moments.forEach(m => {
    const row = ws1.addRow([
      m.name,
      firstSentence(m.recommendation),
      m.cost || '',
      '',
      '',
    ])
    row.eachCell(cell => {
      cell.font = { size: 10, name: 'Arial' }
      cell.alignment = { wrapText: true, vertical: 'top' }
    })
    row.height = 32
  })

  // Total row
  const lastDataRow = dataStartRow + moments.length - 1
  const totalRow = ws1.addRow(['Total (indicative)', '', '', `=SUM(D${dataStartRow}:D${lastDataRow})`, ''])
  totalRow.getCell(1).font = { bold: true, size: 10, name: 'Arial' }
  totalRow.getCell(4).font = { bold: true, size: 10, name: 'Arial' }
  totalRow.getCell(4).numFmt = 'R#,##0'
  totalRow.height = 22

  // ── Sheet 2 — Booking Timeline ─────────────────────────────────────────────
  const ws2 = wb.addWorksheet('Booking Timeline')
  ws2.columns = [
    { key: 'act', width: 30 },
    { key: 'leadTime', width: 28 },
    { key: 'targetDate', width: 22 },
  ]

  const tHdr = ws2.addRow(['Act', 'Recommended Lead Time', 'Your Target Date'])
  tHdr.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFAF7F2' }, size: 10, name: 'Arial' }
    cell.fill = navyFill()
    cell.alignment = { vertical: 'middle' }
  })
  tHdr.height = 22

  bookingTimeline.forEach(item => {
    const row = ws2.addRow([item.act || '', item.leadTime || '', ''])
    row.eachCell(cell => {
      cell.font = { size: 10, name: 'Arial' }
      cell.alignment = { wrapText: true, vertical: 'top' }
    })
    row.height = 22
  })

  // ── Sheet 3 — Hidden Costs ─────────────────────────────────────────────────
  const ws3 = wb.addWorksheet('Hidden Costs')
  ws3.columns = [
    { key: 'item', width: 30 },
    { key: 'range', width: 22 },
    { key: 'confirmed', width: 18 },
    { key: 'notes', width: 32 },
  ]

  const cHdr = ws3.addRow(['Item', 'Illustrative Range', 'Confirmed?', 'Notes'])
  cHdr.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFAF7F2' }, size: 10, name: 'Arial' }
    cell.fill = navyFill()
    cell.alignment = { vertical: 'middle' }
  })
  cHdr.height = 22

  hiddenCosts.forEach(item => {
    const row = ws3.addRow([item.item || '', item.illustrativeRange || '', '', item.notes || ''])
    row.eachCell(cell => {
      cell.font = { size: 10, name: 'Arial' }
      cell.alignment = { wrapText: true, vertical: 'top' }
    })
    row.height = 22
  })

  return wb
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const {
    coupleName = 'Your Wedding',
    milRecommendations = {},
    sessionAnswers = {},
    milAnswers = {},
  } = body

  // Filter out the overview entry — only moment rows go in the spreadsheet
  const moments = (milRecommendations.moments || []).filter(
    m => m.name && m.name !== 'Your Wedding'
  )

  if (!moments.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No moment data provided' }) }
  }

  const milBudget = milAnswers.mil_budget || sessionAnswers.total_budget || 'not_sure'
  const venueType = sessionAnswers.venue_type || 'not provided'
  const guestCount = sessionAnswers.guest_count || 'not provided'

  const momentsSummary = moments
    .map(m => `${m.name}: ${m.recommendation || ''}`)
    .join('\n')

  // ── Claude Haiku call for Sheets 2 & 3 ─────────────────────────────────────
  let bookingTimeline = []
  let hiddenCosts = []

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: BUDGET_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Generate the booking timeline and hidden costs for:\n\nCouple: ${coupleName}\nBudget tier: ${milBudget}\nVenue type: ${venueType}\nGuest count: ${guestCount}\n\nMoments and recommendations:\n${momentsSummary}`,
        }],
      }),
    })

    if (aiRes.ok) {
      const aiData = await aiRes.json()
      const raw = aiData.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('')
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const start = clean.indexOf('{')
      const end = clean.lastIndexOf('}')
      if (start !== -1 && end !== -1) {
        try {
          const parsed = JSON.parse(clean.slice(start, end + 1))
          bookingTimeline = parsed.bookingTimeline || []
          hiddenCosts = parsed.hiddenCosts || []
        } catch (parseErr) {
          console.error('generate-budget: AI JSON parse failed', parseErr.message)
        }
      }
    } else {
      console.error('generate-budget: AI call failed', aiRes.status)
    }
  } catch (aiErr) {
    console.error('generate-budget: AI request threw', aiErr.message)
  }

  // ── Build Excel ────────────────────────────────────────────────────────────
  try {
    const wb = await buildExcel(moments, bookingTimeline, hiddenCosts, coupleName)
    const buffer = await wb.xlsx.writeBuffer()
    const base64 = buffer.toString('base64')
    const filename = `${coupleName.replace(/\s+/g, '-')}-music-budget.xlsx`

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, data: base64 }),
    }
  } catch (excelErr) {
    console.error('generate-budget: Excel build failed', excelErr.message)
    return { statusCode: 500, body: JSON.stringify({ error: 'Excel generation failed' }) }
  }
}
