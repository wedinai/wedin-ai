/**
 * Band classification — maps guest count to Band 1–5.
 * Bands 2 and 3 are the primary target segments (70–75% of weddings).
 */
export function classifyBand(guestCount) {
  switch (guestCount) {
    case 'under_50':  return { band: 1, actSize: '2–3 musicians',  musicBudget: 'R14,000 – R27,000' }
    case '51_120':    return { band: 2, actSize: '4–6 musicians',  musicBudget: 'R30,000 – R63,000' }
    case '121_220':   return { band: 3, actSize: '6–10 musicians', musicBudget: 'R63,000 – R108,000' }
    case '221_350':   return { band: 4, actSize: '10–14 musicians', musicBudget: 'R144,000 – R270,000' }
    case 'over_350':  return { band: 5, actSize: '14+ musicians',  musicBudget: 'R180,000 – R900,000+' }
    default:          return { band: 3, actSize: '6–10 musicians', musicBudget: 'R63,000 – R108,000' }
  }
}

/**
 * Human-readable guest count label for display.
 */
export function guestCountLabel(guestCount) {
  const map = {
    under_50: 'Under 50 guests',
    '51_120':  '51 – 120 guests',
    '121_220': '121 – 220 guests',
    '221_350': '221 – 350 guests',
    over_350:  '350+ guests',
  }
  return map[guestCount] ?? 'Guest count not specified'
}
