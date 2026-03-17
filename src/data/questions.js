/**
 * Discovery session questions — drawn from the Emotional Question Framework
 * in wedin_ai_master_reference_v1.docx.
 *
 * Types:
 *   text       — open text area
 *   chips      — multiple-select option chips
 *   single     — single-select option chips
 *   scale      — horizontal scale (1–5 with labels)
 */

export const SECTIONS = [
  'Welcome',
  'Feeling & Atmosphere',
  'Music Identity',
  'Guest Experience',
  'Formality & Tradition',
  'The Moments',
]

export const questions = [
  // ── WELCOME ─────────────────────────────────────────────────────────────
  {
    id: 'welcome',
    section: 'Welcome',
    type: 'welcome',
    headline: 'Your music portrait starts here.',
    body: 'Answer honestly, not perfectly. There are no wrong answers \u2014 only yours. This takes about eight minutes.',
  },

  // ── FEELING & ATMOSPHERE ─────────────────────────────────────────────────
  {
    id: 'three_words',
    section: 'Feeling & Atmosphere',
    type: 'text',
    question: 'Describe your wedding in three words \u2014 not the aesthetic, but the feeling.',
    placeholder: 'Warm, intimate, alive...',
    followUp: (answer) =>
      answer
        ? `${answer} \u2014 that tells us a lot. Keep that in mind as you go.`
        : null,
  },
  {
    id: 'most_anticipated_moment',
    section: 'Feeling & Atmosphere',
    type: 'text',
    question: "What's the one moment of the day you've thought about most?",
    placeholder: 'The ceremony, first dance, late-night dancing...',
    hint: 'Not what you think you should say \u2014 what actually comes to mind.',
  },
  {
    id: 'guests_arrive_feeling',
    section: 'Feeling & Atmosphere',
    type: 'chips',
    question: 'When your guests arrive and settle in before the ceremony, what do you want them to feel?',
    options: [
      { id: 'calm',        label: 'Calm and held' },
      { id: 'excited',     label: 'Excited, buzzing' },
      { id: 'transported', label: "Like they've arrived somewhere special" },
      { id: 'comfortable', label: 'Comfortable and at home' },
      { id: 'curious',     label: "Curious \u2014 wondering what's coming" },
    ],
    multiSelect: true,
  },
  {
    id: 'driving_home',
    section: 'Feeling & Atmosphere',
    type: 'text',
    question: 'When the night ends and people are driving home, what do you want them to be saying?',
    placeholder: '"That was the best wedding I\'ve ever been to because..."',
  },

  // ── MUSIC IDENTITY ───────────────────────────────────────────────────────
  {
    id: 'relationship_song',
    section: 'Music Identity',
    type: 'text',
    question: 'What song would play over a highlight reel of your relationship so far?',
    placeholder: "Song name, artist \u2014 or describe the feeling if you can't name it",
    hint: 'It doesn\'t have to be "appropriate for a wedding." Just honest.',
  },
  {
    id: 'stop_and_look',
    section: 'Music Identity',
    type: 'text',
    question: 'Is there a song that, when it comes on, you both stop and look at each other?',
    placeholder: "The one that's yours...",
    skipLabel: 'Not yet \u2014 skip this',
  },
  {
    id: 'energy_lift',
    section: 'Music Identity',
    type: 'text',
    question: 'What music do you put on when you want the energy in a room to lift?',
    placeholder: 'Artist, playlist, genre, era...',
  },
  {
    id: 'guilty_pleasure',
    section: 'Music Identity',
    type: 'text',
    question: "Are there genres or artists you love that you'd be embarrassed to admit at a dinner party?",
    placeholder: 'This stays between us.',
    hint: "This is often the most useful answer you'll give us.",
  },
  {
    id: 'perfect_music_memory',
    section: 'Music Identity',
    type: 'text',
    question: 'Tell us about a wedding, concert, or event where the music was perfect. What made it that way?',
    placeholder: 'What did it feel like? What did it do to the room?',
    skipLabel: "Can't think of one \u2014 skip",
  },

  // ── GUEST EXPERIENCE ─────────────────────────────────────────────────────
  {
    id: 'dance_vs_talk',
    section: 'Guest Experience',
    type: 'single',
    question: 'Do you want your guests dancing, or do you want them talking?',
    options: [
      { id: 'dancing',  label: 'Dancing \u2014 I want the floor full' },
      { id: 'talking',  label: 'Talking \u2014 good conversations, great atmosphere' },
      { id: 'both',     label: 'Both \u2014 there\'s a time for each' },
      { id: 'unsure',   label: 'Honestly not sure yet' },
    ],
  },
  {
    id: 'familiar_vs_new',
    section: 'Guest Experience',
    type: 'single',
    question: 'How important is it that everyone knows the songs, versus being surprised by something new?',
    options: [
      { id: 'all_familiar',  label: 'Every song should be singable' },
      { id: 'mostly_known',  label: 'Mostly familiar, a few surprises' },
      { id: 'half',          label: 'A genuine mix \u2014 old and new' },
      { id: 'mostly_new',    label: 'I want them introduced to something' },
    ],
  },
  {
    id: 'age_range',
    section: 'Guest Experience',
    type: 'chips',
    question: "Who's coming? Select all the age groups that'll be on the dance floor.",
    options: [
      { id: 'under_20',  label: 'Under 20' },
      { id: '20s_30s',   label: '20s & 30s' },
      { id: '40s_50s',   label: '40s & 50s' },
      { id: '60s_plus',  label: '60s and over' },
    ],
    multiSelect: true,
  },

  // ── FORMALITY & TRADITION ─────────────────────────────────────────────────
  {
    id: 'ceremony_scale',
    section: 'Formality & Tradition',
    type: 'scale',
    question: 'On a scale from cathedral-and-choir to garden-party-and-acoustic-guitar \u2014 where does your ceremony sit?',
    lowLabel: 'Cathedral & choir',
    highLabel: 'Garden party & acoustic guitar',
  },
  {
    id: 'cultural_traditions',
    section: 'Formality & Tradition',
    type: 'text',
    question: 'Are there cultural or family traditions the music needs to honour?',
    placeholder: 'A particular song, genre, moment, or cultural element...',
    skipLabel: 'Nothing specific \u2014 skip',
  },
  {
    id: 'ceremony_structure',
    section: 'Formality & Tradition',
    type: 'text',
    question: 'Does your ceremony have a formal religious or cultural structure that the music needs to work within — or is it entirely your own design?',
    placeholder: 'e.g. Catholic mass, civil ceremony, traditional Zulu, entirely bespoke...',
    skipLabel: 'Not sure yet — skip',
  },
  {
    id: 'reception_style',
    section: 'Formality & Tradition',
    type: 'single',
    question: 'Is your reception a dinner party that turns into a dance floor \u2014 or a dance floor from the moment people arrive?',
    options: [
      { id: 'slow_build',     label: 'Dinner first, then we open the floor' },
      { id: 'from_the_start', label: 'Energy from the moment we walk in' },
      { id: 'mix',            label: 'Somewhere in between' },
      { id: 'unsure',         label: 'Not thought about it yet' },
    ],
  },

  // ── THE MOMENTS ───────────────────────────────────────────────────────────
  {
    id: 'ceremony_feeling',
    section: 'The Moments',
    type: 'chips',
    question: 'The ceremony is the moment everyone watches in silence. Should that silence feel sacred and still — or joyfully celebratory?',
    options: [
      { id: 'sacred',      label: 'Sacred and still' },
      { id: 'celebratory', label: 'Joyfully celebratory' },
      { id: 'in_between',  label: 'Somewhere in between' },
    ],
    multiSelect: false,
  },
  {
    id: 'processional',
    section: 'The Moments',
    type: 'text',
    question: 'The processional \u2014 have you thought about this song yet?',
    placeholder: 'The song that plays as you walk in...',
    hint: "It will make you cry. That's allowed.",
    skipLabel: 'Not decided yet \u2014 skip',
  },
  {
    id: 'first_dance',
    section: 'The Moments',
    type: 'text',
    question: 'First dance \u2014 have you chosen it?',
    placeholder: 'Song or artist, or describe what it should feel like',
    skipLabel: 'Still deciding \u2014 skip',
  },
  {
    id: 'pre_drinks',
    section: 'The Moments',
    type: 'single',
    question: 'Pre-drinks and cocktail hour \u2014 what\'s the plan?',
    options: [
      { id: 'live',      label: "Live music \u2014 something they'll notice" },
      { id: 'playlist',  label: 'A carefully chosen playlist' },
      { id: 'mix',       label: 'Live act to start, playlist to follow' },
      { id: 'undecided', label: "Haven't thought about it yet" },
    ],
    hint: 'Most couples discover pre-drinks live music becomes their favourite part of the day.',
  },
  {
    id: 'last_song',
    section: 'The Moments',
    type: 'text',
    question: 'The last song of the night \u2014 this is the lasting memory. Have you thought about what it should be?',
    placeholder: 'The song that sends everyone home...',
    skipLabel: 'Not yet \u2014 skip',
  },

  // ── YOUR WEDDING ─────────────────────────────────────────────────────────
  {
    id: 'guest_count',
    section: 'Your Wedding',
    type: 'single',
    question: 'Roughly how many guests are you expecting?',
    options: [
      { id: 'under_50', label: 'Under 50' },
      { id: '51_120',   label: '51 – 120' },
      { id: '121_220',  label: '121 – 220' },
      { id: '221_350',  label: '221 – 350' },
      { id: 'over_350', label: '350+' },
    ],
  },
  // ── COMPLETION ───────────────────────────────────────────────────────────
  {
    id: 'complete',
    section: 'Complete',
    type: 'complete',
  },
]

// Total answerable questions (excludes welcome + complete screens)
export const ANSWERABLE_COUNT = questions.filter(
  (q) => q.type !== 'welcome' && q.type !== 'complete'
).length
