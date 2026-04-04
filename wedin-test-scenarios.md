# wedin.ai — MIL Test Scenario Seed Scripts

Paste any script into browser DevTools console on the live app. Each script clears existing wedin.ai localStorage, injects the scenario, and reloads.

After reload: app opens at the Moment Map with all 9 moments showing **Complete**. Click **"Generate brief"** → PostBriefScreen → **"Build my music plan"** → MILIntakeScreen. Answer the two intake questions (budget + bookings), then wait ~30 seconds for generation.

**Two localStorage keys control this:**
- `wedin_completed_moments` — array of moment IDs (controls the Complete chip on each card)
- `wedin_moment_confirmed` — object of `{ momentId: true }` entries (controls the MIL CTA unlock in PostBriefScreen)

Both must be set correctly. All five scripts below set both.

---

## RESET SCRIPT

Clears all wedin.ai localStorage keys and reloads to a blank state.

```javascript
Object.keys(localStorage)
  .filter(k => k.startsWith('wedin_'))
  .forEach(k => localStorage.removeItem(k))
console.log('wedin.ai localStorage cleared')
location.reload()
```

---

## SCENARIO 1 — Sophie & Liam
**Test: ENTRANCE LIVE ACT RULE**
- Budget: R60k–R100k | Venue: Hotel ballroom | Guests: 121–220
- entrance_live_musicians = "Yes — this appeals to us" BUT dinner = DJ/recorded only
- **Expected:** Entrance recommendation must be PA, not live. Model must cross-reference its own dinner recommendation and apply the rule.

```javascript
// SCENARIO 1 — Sophie & Liam — Entrance Live Act Rule
Object.keys(localStorage).filter(k => k.startsWith('wedin_')).forEach(k => localStorage.removeItem(k))

localStorage.setItem('wedin_session_id', 'test-scenario-1-sophie-liam')
localStorage.setItem('wedin_couple_name', 'Sophie & Liam')
localStorage.setItem('wedin_is_paid', 'true')

localStorage.setItem('wedin_session_answers', JSON.stringify({
  three_words: 'Intimate, warm, joyful',
  driving_home: 'Feeling like themselves, just married, with everyone they love around them',
  home_listening: 'Norah Jones, Jack Johnson, Ben Harper, John Mayer',
  guilty_pleasure: 'Taylor Swift — all eras',
  musical_confidence: 'confident',
  crowd_vs_taste: 'Lean toward our taste — our friends will go with it',
  live_vs_recorded: 'Mix of live and recorded depending on the moment',
  guest_count: '121_220',
  venue_type: 'hotel_venue',
}))

localStorage.setItem('wedin_moment_answers', JSON.stringify({
  guestArrivals: {
    arrivals_attention: 'Something warm and welcoming — not too formal, not background noise',
    arrivals_style: 'Acoustic guitar, coffeehouse feel, like a Sunday morning',
    arrivals_logistics: 'Indoor hotel foyer, about 60 minutes before ceremony',
    song_question: "Jack Johnson — Better Together, Ben Harper — Steal My Kisses, John Mayer — Your Body Is A Wonderland, Norah Jones — Come Away With Me",
  },
  ceremony: {
    ceremony_structure: 'Non-religious civil ceremony',
    ceremony_faith: 'None',
    processional_song: "Norah Jones — Come Away With Me",
    processional_tone: 'Emotional and intimate — I want it to feel like the room holds its breath',
    signing_music: "Ben Harper — Forever",
    recessional_song: 'Something upbeat that says we did it',
    ceremony_format: 'Live musicians — it matters to us for this moment',
    song_question: "Norah Jones — Come Away With Me, Ben Harper — Forever, Eva Cassidy — Fields of Gold",
  },
  predrinks: {
    predrinks_impact: "Something they'll notice and talk about",
    predrinks_energy_shift: 'Yes — we want a shift or surprise moment midway',
    predrinks_cultural: 'No — keeping it consistent throughout',
    song_question: "Jack Johnson, John Mayer, Brett Dennen — anything in that warm acoustic world",
  },
  entrance: {
    entrance_style: 'Grand and announced — we want a moment',
    entrance_transition: 'Yes — guests move from outdoor terrace to ballroom',
    entrance_live_musicians: 'Yes — this appeals to us',
    song_question: "Mark Ronson — Uptown Funk, or something with that energy and build",
  },
  dinner: {
    dinner_atmosphere: 'Warm and conversational — music clearly in the background',
    dinner_style: 'Light acoustic or easy jazz — nothing demanding attention',
    dinner_live_or_recorded: 'Recorded — DJ or curated playlist is completely fine',
    dinner_energy_shift: 'Gradual build toward speeches, not a sharp shift',
    song_question: "Norah Jones, Corinne Bailey Rae, Jack Johnson, low-key Diana Krall",
  },
  speeches: {
    speeches_count: '4 speeches — best man, maid of honour, two parents',
    speeches_intro_songs: "No specific intro songs — DJ's call",
    speeches_between: 'Keep it very quiet between speakers',
    speeches_outro: 'Build from last speech directly into first dance',
  },
  firstDance: {
    firstdance_song: "Ben Harper — Steal My Kisses",
    firstdance_room_feeling: 'Warm and joyful — we want people smiling and swaying, not crying',
    firstdance_live_or_recorded: 'Recorded is fine — we want the original',
    firstdance_additional: 'No additional dances',
    firstdance_transition: 'Straight into dancing after — no gap',
    song_question: "Ben Harper — Steal My Kisses, Jack Johnson — Better Together, John Mayer — Gravity",
  },
  dancing: {
    dancing_energy_arc: 'Build steadily through the night — not too early a peak',
    dancing_guest_mix: 'Mix of ages — mostly 30s but parents and older family on the floor matters',
    dancing_avoid: 'Nothing too heavy or aggressive — no hard EDM',
    dancing_peak_moment: 'Around midnight, when the older guests have left',
    dancing_wind_down: 'Yes — end on something slower and meaningful',
    song_question: "Mark Ronson, Pharrell, some 80s classics, Taylor Swift — Shake It Off, Justin Timberlake",
  },
  lastSong: {
    lastsong_song: 'Something everyone knows — an anthem that ends on a high',
    lastsong_energy: 'End big, not a slow fade — we want everyone on the floor',
    lastsong_instruction: 'Tell the DJ we want the last song announced so people know to get up',
    song_question: "Don't Stop Believin, Mr Brightside, Livin on a Prayer — something anthemic",
  },
}))

localStorage.setItem('wedin_completed_moments', JSON.stringify([
  'arrivals', 'ceremony', 'predrinks', 'entrance', 'dinner',
  'speeches', 'firstdance', 'dancing', 'lastsong',
]))

localStorage.setItem('wedin_moment_confirmed', JSON.stringify({
  arrivals: true, ceremony: true, predrinks: true, entrance: true, dinner: true,
  speeches: true, firstdance: true, dancing: true, lastsong: true,
}))

localStorage.setItem('wedin_portrait', "Sophie and Liam have a clear musical identity — warm, acoustic, emotionally honest. Their listening world is Norah Jones, Jack Johnson, Ben Harper: music that feels like a Sunday morning with people you love. They want guests to feel at home from the moment they arrive, and they want the day to build organically toward joy rather than spectacle. Liam is the more musically opinionated of the two; Sophie trusts his instincts but wants the dancing to feel inclusive for everyone.")

location.reload()
```

---

## SCENARIO 2 — Emma & Tom
**Test: OUTDOOR AMPLIFICATION RULE**
- Budget: R30k–R60k | Venue: Farm/bush outdoor | Guests: 51–120
- venue_type = farm_bush — triggers mandatory PA confirmation sentence
- **Expected:** Guest Arrivals, Ceremony, and Pre-drinks instruction fields must each contain: "Confirm the act has their own PA — acoustic music without amplification will not carry to all guests outdoors above 40 people."

```javascript
// SCENARIO 2 — Emma & Tom — Outdoor Amplification Rule
Object.keys(localStorage).filter(k => k.startsWith('wedin_')).forEach(k => localStorage.removeItem(k))

localStorage.setItem('wedin_session_id', 'test-scenario-2-emma-tom')
localStorage.setItem('wedin_couple_name', 'Emma & Tom')
localStorage.setItem('wedin_is_paid', 'true')

localStorage.setItem('wedin_session_answers', JSON.stringify({
  three_words: 'Natural, relaxed, real',
  driving_home: 'Like the best, most grounded version of themselves',
  home_listening: 'Mumford & Sons, The Lumineers, Fleet Foxes, Bon Iver, Iron & Wine',
  guilty_pleasure: 'ABBA — full commitment, no shame',
  musical_confidence: 'moderate — we know what we like but not the technical terms',
  crowd_vs_taste: 'Balance of both — our friends will follow our lead',
  live_vs_recorded: 'Strongly prefer live — it feels more like us',
  guest_count: '51_120',
  venue_type: 'farm_bush',
}))

localStorage.setItem('wedin_moment_answers', JSON.stringify({
  guestArrivals: {
    arrivals_attention: 'Something acoustic and natural — like it grew from the landscape',
    arrivals_style: 'Folk acoustic, guitar-led, warm and unhurried',
    arrivals_logistics: 'Outdoor under mature trees on the farm, 75 minutes arrival window',
    song_question: "Mumford & Sons — After The Storm, The Lumineers — Ho Hey, Iron & Wine — Flightless Bird, Fleet Foxes — Helplessness Blues",
  },
  ceremony: {
    ceremony_structure: 'Non-religious civil ceremony',
    ceremony_faith: 'None',
    processional_song: "Fleet Foxes — White Winter Hymnal",
    processional_tone: 'Natural, understated, moving — not theatrical',
    signing_music: 'Something quiet and instrumental',
    recessional_song: "Upbeat — Mumford & Sons energy, celebratory",
    ceremony_format: 'Live musicians — it matters to us for this moment',
    song_question: "Fleet Foxes — White Winter Hymnal, Mumford & Sons — The Cave, Bon Iver — Holocene",
  },
  predrinks: {
    predrinks_impact: 'Atmosphere — present but not demanding attention',
    predrinks_energy_shift: 'No — consistent energy throughout, let the landscape do the work',
    predrinks_cultural: 'No — keeping it consistent throughout',
    song_question: "The Lumineers, Bon Iver, Iron & Wine, Novo Amor — anything in that folk-acoustic world",
  },
  entrance: {
    entrance_style: 'Intimate and surprising — not announced, just present',
    entrance_transition: 'Yes — guests move from outdoor ceremony to barn reception',
    entrance_live_musicians: 'No — we want recorded music for this',
    song_question: "The Lumineers — Stubborn Love",
  },
  dinner: {
    dinner_atmosphere: 'Relaxed, rustic, like a long dinner with close friends',
    dinner_style: 'Folk acoustic or fingerstyle guitar — warm background',
    dinner_live_or_recorded: 'Live musicians — it matters to us',
    dinner_energy_shift: 'Stay consistent and warm through dinner',
    song_question: "Bon Iver, Sufjan Stevens, Fleet Foxes, Iron & Wine",
  },
  speeches: {
    speeches_count: '3 speeches — best man and two parents',
    speeches_intro_songs: "No — just start them directly",
    speeches_between: 'Brief silence is fine — let the emotion sit',
    speeches_outro: 'Build gently into first dance',
  },
  firstDance: {
    firstdance_song: "The Cinematic Orchestra — To Build A Home",
    firstdance_room_feeling: 'Intimate — just the two of us for a moment, room goes quiet',
    firstdance_live_or_recorded: 'Recorded — the original recording only',
    firstdance_additional: 'No additional dances',
    firstdance_transition: 'Open the floor after — let it breathe first',
    song_question: "The Cinematic Orchestra — To Build A Home, Bon Iver — Skinny Love, Iron & Wine — Naked As We Came, Novo Amor — Anchor",
  },
  dancing: {
    dancing_energy_arc: 'Start gentle, build through the night — no rush',
    dancing_guest_mix: 'Mostly our age — late 20s early 30s, a few older family',
    dancing_avoid: 'Nothing cheesy or forced — no Cha Cha Slide',
    dancing_peak_moment: 'Natural peak when the crowd dictates — not a scheduled moment',
    dancing_wind_down: 'Yes — end on something meaningful, not just loud',
    song_question: "Mumford & Sons — Little Lion Man, The Killers — Mr Brightside, LCD Soundsystem, some 90s throwbacks, Oasis",
  },
  lastSong: {
    lastsong_song: 'Something we all know — a song everyone has a memory attached to',
    lastsong_energy: 'Big sing-along ending — everyone together',
    lastsong_instruction: "Make sure everyone knows it's the last one",
    song_question: "Don't Look Back In Anger, Mr Brightside, Closing Time",
  },
}))

localStorage.setItem('wedin_completed_moments', JSON.stringify([
  'arrivals', 'ceremony', 'predrinks', 'entrance', 'dinner',
  'speeches', 'firstdance', 'dancing', 'lastsong',
]))

localStorage.setItem('wedin_moment_confirmed', JSON.stringify({
  arrivals: true, ceremony: true, predrinks: true, entrance: true, dinner: true,
  speeches: true, firstdance: true, dancing: true, lastsong: true,
}))

localStorage.setItem('wedin_portrait', "Emma and Tom know exactly who they are. Their music lives in the folk-acoustic world — Mumford, Fleet Foxes, Bon Iver — and their farm venue is an extension of that identity. They want the day to feel like it emerged naturally from the landscape rather than was imposed upon it. Tom is practical and relaxed about music; Emma has strong instincts about feeling and atmosphere even if she doesn't always have the words. The outdoor setting is central to their vision — and a significant practical consideration for everything acoustic.")

location.reload()
```

---

## SCENARIO 3 — Charlotte & James
**Test: CLASSICAL ACT CAVEAT**
- Budget: R100k–R150k | Venue: Wine estate | Guests: 51–120
- Strong taste for contemporary classical — will trigger string quartet / classical act recommendation
- **Expected:** Every moment where a classical act is recommended, the instruction field must contain: "Confirm repertoire range before booking — ask specifically whether they can perform [named song or style] and request a sample recording of that piece."

```javascript
// SCENARIO 3 — Charlotte & James — Classical Act Caveat
Object.keys(localStorage).filter(k => k.startsWith('wedin_')).forEach(k => localStorage.removeItem(k))

localStorage.setItem('wedin_session_id', 'test-scenario-3-charlotte-james')
localStorage.setItem('wedin_couple_name', 'Charlotte & James')
localStorage.setItem('wedin_is_paid', 'true')

localStorage.setItem('wedin_session_answers', JSON.stringify({
  three_words: 'Elegant, timeless, personal',
  driving_home: 'Moved by the music — slightly overwhelmed in the best possible way',
  home_listening: 'Max Richter, Ludovico Einaudi, Radiohead, Nick Cave, Nils Frahm',
  guilty_pleasure: '90s pop — Spice Girls, Backstreet Boys, full commitment',
  musical_confidence: 'very confident — music is central to our lives',
  crowd_vs_taste: 'Our taste drives everything — guests will come with us',
  live_vs_recorded: 'Strongly prefer live — we want the imperfection and presence',
  guest_count: '51_120',
  venue_type: 'wine_estate',
}))

localStorage.setItem('wedin_moment_answers', JSON.stringify({
  guestArrivals: {
    arrivals_attention: 'Something that makes the venue feel like more than a venue — an arrival experience',
    arrivals_style: 'String quartet or classical piano — contemporary classical not traditional wedding music',
    arrivals_logistics: 'Indoor estate chapel entrance hall, about 60 minutes',
    song_question: "Max Richter — On The Nature Of Daylight, Einaudi — Experience, Radiohead — Creep arranged for strings, Nils Frahm — Says",
  },
  ceremony: {
    ceremony_structure: 'Non-religious civil ceremony',
    ceremony_faith: 'None',
    processional_song: "Max Richter — On The Nature Of Daylight",
    processional_tone: 'Moving and cinematic — I want it to feel like a film score moment',
    signing_music: "Einaudi — Experience",
    recessional_song: 'Something with joy and release — still classical but with lift',
    ceremony_format: 'Live musicians — specifically strings, this is non-negotiable',
    song_question: "Max Richter — On The Nature Of Daylight, Einaudi — Experience, Arvo Pärt — Spiegel im Spiegel, Ólafur Arnalds — Near Light",
  },
  predrinks: {
    predrinks_impact: "Something they'll notice and talk about — a deliberate shift from ceremony strings",
    predrinks_energy_shift: 'Yes — shift from ceremony intimacy to something more alive and contemporary',
    predrinks_cultural: 'No — keeping it consistent',
    song_question: "Nick Cave — Into My Arms, Radiohead — High and Dry, Sufjan Stevens — Mystery of Love, The National — Bloodbuzz Ohio",
  },
  entrance: {
    entrance_style: 'Grand and announced — cinematic, like a scene change',
    entrance_transition: 'No — everyone is already seated in the reception room',
    entrance_live_musicians: 'Interesting — tell me more in the brief',
    song_question: "Hans Zimmer — Time, or something cinematic with build and release",
  },
  dinner: {
    dinner_atmosphere: 'Intimate and sophisticated — conversation and music at the same level',
    dinner_style: 'Contemporary classical crossover or jazz — Einaudi world meets Bill Evans',
    dinner_live_or_recorded: 'Live musicians — all of dinner',
    dinner_energy_shift: 'Gradual and organic build',
    song_question: "Einaudi, Max Richter, Nils Frahm, GoGo Penguin",
  },
  speeches: {
    speeches_count: '5 speeches',
    speeches_intro_songs: 'No specific songs — quiet is fine',
    speeches_between: 'Very quiet — let the speeches breathe completely',
    speeches_outro: 'First dance follows immediately after final speech',
  },
  firstDance: {
    firstdance_song: "Nick Cave — Into My Arms",
    firstdance_room_feeling: 'Emotional and still — everyone stops, room holds its breath',
    firstdance_live_or_recorded: 'Recorded — the original Nick Cave recording only, no cover',
    firstdance_additional: 'No additional dances',
    firstdance_transition: 'Open floor after with a sharp energy shift — no slow fade into dancing',
    song_question: "Nick Cave — Into My Arms",
  },
  dancing: {
    dancing_energy_arc: 'Sharp shift from first dance — straight to high energy, sustained',
    dancing_guest_mix: 'Our friends are the dancers — family will watch from the sides, that is fine',
    dancing_avoid: 'No cheesy party music whatsoever — no DJ Ötzi, no Macarena, no exceptions',
    dancing_peak_moment: 'Sustained peak for at least an hour — we want the floor never empty',
    dancing_wind_down: 'Hard stop — no wind-down, end at full energy',
    song_question: "Radiohead — Karma Police, The National — Bloodbuzz Ohio, LCD Soundsystem — All My Friends, Arcade Fire — Wake Up, some 90s anthems for the guilty pleasure — Backstreet Boys, Spice Girls",
  },
  lastSong: {
    lastsong_song: 'Something that rewards the people who stayed until the end',
    lastsong_energy: 'End on a moment, not just a song — it should feel like a declaration',
    lastsong_instruction: 'Announce the last song before it starts so people can gather',
    song_question: "Arcade Fire — Wake Up, Radiohead — Karma Police, LCD Soundsystem — All My Friends",
  },
}))

localStorage.setItem('wedin_completed_moments', JSON.stringify([
  'arrivals', 'ceremony', 'predrinks', 'entrance', 'dinner',
  'speeches', 'firstdance', 'dancing', 'lastsong',
]))

localStorage.setItem('wedin_moment_confirmed', JSON.stringify({
  arrivals: true, ceremony: true, predrinks: true, entrance: true, dinner: true,
  speeches: true, firstdance: true, dancing: true, lastsong: true,
}))

localStorage.setItem('wedin_portrait', "Charlotte and James are the most musically opinionated couple in this test set. Their listening world — Max Richter, Einaudi, Radiohead, Nick Cave — tells a clear story: they want music that operates at the level of fine art, not entertainment. They have strong opinions about originals vs covers, and they will notice if a recommendation is generic. The guilty pleasure (90s pop) is a meaningful signal — it says the dancefloor should eventually earn something more fun. The string quartet and classical act recommendations are likely across multiple moments, making the classical caveat rule the primary test here.")

location.reload()
```

---

## SCENARIO 4 — Aisha & Marcus
**Test: PHYSICAL CONSTRAINTS OVERRIDE EMOTIONAL SIGNALS (Reasoning Sequence)**
- Budget: Under R30k | Venue: Large function hall | Guests: 221–350
- Emotional signals all point to intimate acoustic and solo musicians
- **Expected:** Physical constraints (large crowd + tiny budget) must override emotional signals. Model must recommend DJ-only or scaled appropriately, flag that solo acoustic cannot carry 280 guests, and not pretend the budget supports live acts. REASONING SEQUENCE must fire in the correct order.

```javascript
// SCENARIO 4 — Aisha & Marcus — Physical Constraints Override Emotional Signals
Object.keys(localStorage).filter(k => k.startsWith('wedin_')).forEach(k => localStorage.removeItem(k))

localStorage.setItem('wedin_session_id', 'test-scenario-4-aisha-marcus')
localStorage.setItem('wedin_couple_name', 'Aisha & Marcus')
localStorage.setItem('wedin_is_paid', 'true')

localStorage.setItem('wedin_session_answers', JSON.stringify({
  three_words: 'Intimate, warm, quiet',
  driving_home: 'Feeling like the music truly understood them — not just played at them',
  home_listening: 'Bon Iver, Nick Drake, Sufjan Stevens, Grouper',
  guilty_pleasure: 'Beyoncé — the full catalogue, no apologies',
  musical_confidence: 'moderate — we know the feeling, not always the name',
  crowd_vs_taste: 'Our taste — it is important that the music reflects us even if guests are surprised',
  live_vs_recorded: 'Strongly prefer live — recorded music feels impersonal to us',
  guest_count: '221_350',
  venue_type: 'function_venue',
}))

localStorage.setItem('wedin_moment_answers', JSON.stringify({
  guestArrivals: {
    arrivals_attention: 'Something acoustic and intimate — like a house concert, not a wedding',
    arrivals_style: 'Solo acoustic guitar or solo piano — quiet, understated, personal',
    arrivals_logistics: 'Large function hall, 280 guests expected, 75-minute arrival window',
    song_question: "Bon Iver — Skinny Love, Nick Drake — Pink Moon, Sufjan Stevens — Death With Dignity, Grouper — Headache",
  },
  ceremony: {
    ceremony_structure: 'Non-religious civil ceremony',
    ceremony_faith: 'None',
    processional_song: "Bon Iver — Skinny Love",
    processional_tone: 'Quiet and moving — just us, even with 280 people watching',
    signing_music: "Sufjan Stevens — Death With Dignity",
    recessional_song: 'Something with quiet joy — acoustic, not triumphant',
    ceremony_format: 'Live musicians — it matters deeply to us',
    song_question: "Bon Iver — Skinny Love, Sufjan Stevens — Death With Dignity, Nick Drake — Northern Sky",
  },
  predrinks: {
    predrinks_impact: "Something they'll notice — a live act, intimate, unexpected",
    predrinks_energy_shift: 'No — consistent intimate energy throughout',
    predrinks_cultural: 'No',
    song_question: "Nick Drake, Bon Iver, Fleet Foxes, Grouper — anything in that quiet world",
  },
  entrance: {
    entrance_style: 'Intimate and surprising — not announced, just present',
    entrance_transition: 'No — everyone already in one space',
    entrance_live_musicians: 'Yes — this appeals to us, something minimal',
    song_question: "Sufjan Stevens — Mystery of Love",
  },
  dinner: {
    dinner_atmosphere: 'Very quiet, intimate — like a dinner party for twenty, not two hundred and eighty',
    dinner_style: 'Solo acoustic guitar or piano — the quieter the better',
    dinner_live_or_recorded: 'Live musicians — it matters to us',
    dinner_energy_shift: 'Stay very quiet through dinner — we do not want energy building',
    song_question: "Nick Drake, Bon Iver, Grouper — ambient and quiet",
  },
  speeches: {
    speeches_count: '4 speeches',
    speeches_intro_songs: 'No specific songs',
    speeches_between: 'Silence — we want the emotion to sit',
    speeches_outro: 'Into first dance',
  },
  firstDance: {
    firstdance_song: "Bon Iver — Skinny Love",
    firstdance_room_feeling: 'Like we are completely alone even in a room of three hundred',
    firstdance_live_or_recorded: 'Recorded — the original Justin Vernon recording only',
    firstdance_additional: 'No additional dances',
    firstdance_transition: 'Open floor — but gently, not a sudden shift',
    song_question: "Bon Iver — Skinny Love, Nick Drake — From The Morning",
  },
  dancing: {
    dancing_energy_arc: 'Slow build — maybe never gets too loud or too big',
    dancing_guest_mix: 'Mix of ages — older family guests on the floor matters to us',
    dancing_avoid: 'Nothing too loud, nothing aggressive, nothing that feels like a club',
    dancing_peak_moment: 'A modest, warm peak — not a rave',
    dancing_wind_down: 'Yes — gentle, meaningful close',
    song_question: "Beyoncé — Halo, some 80s classics, Fleetwood Mac — The Chain, Earth Wind & Fire",
  },
  lastSong: {
    lastsong_song: 'Something quiet that feels like a true goodbye — everyone humming it home',
    lastsong_energy: 'Slow, intimate, warm — not a bang',
    lastsong_instruction: 'Something everyone can carry with them on the drive home',
    song_question: "Fleetwood Mac — The Chain, Beyoncé — Halo, or something from our world",
  },
}))

localStorage.setItem('wedin_completed_moments', JSON.stringify([
  'arrivals', 'ceremony', 'predrinks', 'entrance', 'dinner',
  'speeches', 'firstdance', 'dancing', 'lastsong',
]))

localStorage.setItem('wedin_moment_confirmed', JSON.stringify({
  arrivals: true, ceremony: true, predrinks: true, entrance: true, dinner: true,
  speeches: true, firstdance: true, dancing: true, lastsong: true,
}))

localStorage.setItem('wedin_portrait', "Aisha and Marcus present the sharpest tension in this test set: their taste is intimate, quiet, and deeply personal — Bon Iver, Nick Drake, Sufjan Stevens — but they have 280 guests in a large function hall on a budget under R30,000. This is a direct physical vs emotional mismatch. The REASONING SEQUENCE rule requires the model to evaluate physical constraints first (guest count and venue) then budget, before it touches emotional signals. The correct output flags that solo acoustic cannot carry a room of this size, that their budget supports DJ-only, and that emotional fidelity is achievable through a precise brief rather than a solo musician who will be invisible.")

location.reload()
```

---

## SCENARIO 5 — Naledi & David
**Test: PRODUCTION CHECK COHERENCE**
- Budget: Over R150k | Venue: Wine estate | Guests: 121–220
- Multiple live acts expected across all 9 moments — marimba, choir, jazz band, cover band, DJ
- **Expected:** productionCheck.totalEstimate in mil-b must account for acts across ALL 9 moments (including moments 1–5 generated by mil-a). Must not reflect only the 4 moments in mil-b's own batch. Also tests cultural moment handling and the two-act architecture at top budget.

```javascript
// SCENARIO 5 — Naledi & David — Production Check Coherence
Object.keys(localStorage).filter(k => k.startsWith('wedin_')).forEach(k => localStorage.removeItem(k))

localStorage.setItem('wedin_session_id', 'test-scenario-5-naledi-david')
localStorage.setItem('wedin_couple_name', 'Naledi & David')
localStorage.setItem('wedin_is_paid', 'true')

localStorage.setItem('wedin_session_answers', JSON.stringify({
  three_words: 'Opulent, joyful, African',
  driving_home: 'Feeling like royalty, surrounded by everyone they love — deeply South African',
  home_listening: 'Freshlyground, Asa, Hugh Masekela, Miriam Makeba, Black Coffee, Nomcebo Zikode',
  guilty_pleasure: 'Early 2000s Britney Spears and Destiny\'s Child — the full works',
  musical_confidence: 'very confident — music is central to who we are',
  crowd_vs_taste: 'Balance — our taste anchors it, but we want every generation on the floor',
  live_vs_recorded: 'All live if we can — we want living breathing music all day',
  guest_count: '121_220',
  venue_type: 'wine_estate',
}))

localStorage.setItem('wedin_moment_answers', JSON.stringify({
  guestArrivals: {
    arrivals_attention: 'Live marimba or African percussion ensemble — we want it to feel distinctly South African from the first second',
    arrivals_style: 'Marimba or mbira ensemble — joyful, welcoming, unmistakably African',
    arrivals_logistics: 'Outdoor estate terrace, 150 guests, 90-minute arrival window in summer',
    song_question: "Miriam Makeba — Pata Pata, Freshlyground — Nomvula, Hugh Masekela — Stimela, Ladysmith Black Mambazo — Homeless",
  },
  ceremony: {
    ceremony_structure: 'Cultural and traditional elements alongside civil ceremony',
    ceremony_faith: 'African traditional — lobola was paid, family rituals observed',
    processional_song: "A live choir processional — we want something overwhelming",
    processional_tone: 'Joyful and celebratory — not solemn, not Western formal',
    signing_music: "Asa — Beautiful Imperfection",
    recessional_song: 'Full choir recessional — exit to something that makes people cry happy tears',
    ceremony_format: 'All live — choir, marimba, everything',
    song_question: "Asa — Beautiful Imperfection, Miriam Makeba — Pata Pata, a traditional Zulu wedding song, Ladysmith Black Mambazo",
  },
  predrinks: {
    predrinks_impact: "Something they will talk about for years — a live act that becomes part of the story",
    predrinks_energy_shift: 'Yes — build from ceremony atmosphere to reception energy',
    predrinks_cultural: 'Yes — this matters deeply, we want international guests to experience something genuinely South African',
    song_question: "Hugh Masekela — Grazing in the Grass, Freshlyground — I\'d Like, Fela Kuti — Lady, Simphiwe Dana — Ndiredi",
  },
  entrance: {
    entrance_style: 'Grand and announced — a major production moment, not subtle',
    entrance_transition: 'Yes — guests move from outdoor terrace into the estate hall',
    entrance_live_musicians: 'Yes — live percussion leading us in, drummers moving through the crowd',
    song_question: "Something Afrobeats with a live drum build, Black Coffee — Drive, or a live drum ensemble original",
  },
  dinner: {
    dinner_atmosphere: 'Celebratory and sophisticated — high energy table conversation, not quiet background',
    dinner_style: 'Live jazz with SA and African influences — Freshlyground world meets Hugh Masekela',
    dinner_live_or_recorded: 'Live musicians — all of dinner, sustained set',
    dinner_energy_shift: 'Build confidently toward speeches — not a background volume, a performance',
    song_question: "Asa — Be My Man, Freshlyground, Simphiwe Dana, Somi — I Dream Electric, Hailey Kilgour",
  },
  speeches: {
    speeches_count: '6 speeches — both sets of parents, best man, maid of honour, two personal tributes',
    speeches_intro_songs: "Yes — each speaker will have their own intro song, couple will confirm list with DJ in advance",
    speeches_between: 'DJ manages all transitions — brief music between each speaker',
    speeches_outro: 'Build directly into first dance after final speech',
  },
  firstDance: {
    firstdance_song: "Asa — Be My Man",
    firstdance_room_feeling: 'Everyone stops and watches — it should be a full room moment, not just for us',
    firstdance_live_or_recorded: 'Live — we want the jazz band to play it',
    firstdance_additional: 'Yes — parents dances for both sets of parents immediately after',
    firstdance_transition: 'Band continues directly into first dancing set after parent dances',
    song_question: "Asa — Be My Man, Freshlyground — Pot of Gold",
  },
  dancing: {
    dancing_energy_arc: 'Band plays first 60–90 minutes live, DJ takes over for the rest of the night',
    dancing_guest_mix: 'Everyone on the floor — older family, younger guests, international guests — the floor must never be empty',
    dancing_avoid: 'No Afrikaans music whatsoever',
    dancing_peak_moment: 'The DJ takeover from the band — that transition should feel like an event in itself',
    dancing_wind_down: 'No wind-down — end at full energy, hard stop',
    song_question: "Beyoncé — Crazy in Love, Rihanna — We Found Love, Drake — Hotline Bling, Ami Faku — Into You, Black Coffee — Superman, Amapiano set closing the night",
  },
  lastSong: {
    lastsong_song: "Something that ends on South African pride — a song everyone in that room knows and claims",
    lastsong_energy: 'Full energy — everyone on the floor, no one sitting down for the last song',
    lastsong_instruction: 'DJ announces the last song, gives people 30 seconds to gather before it drops',
    song_question: "Black Coffee — Superman, Nomcebo Zikode — Xola Moya Wam, DJ Maphorisa & Kabza De Small — Izolo, or a surprise SA anthem closer",
  },
}))

localStorage.setItem('wedin_completed_moments', JSON.stringify([
  'arrivals', 'ceremony', 'predrinks', 'entrance', 'dinner',
  'speeches', 'firstdance', 'dancing', 'lastsong',
]))

localStorage.setItem('wedin_moment_confirmed', JSON.stringify({
  arrivals: true, ceremony: true, predrinks: true, entrance: true, dinner: true,
  speeches: true, firstdance: true, dancing: true, lastsong: true,
}))

localStorage.setItem('wedin_portrait', "Naledi and David are the maximum-expression test case: full budget, full ambition, deeply South African identity, and a guest list that spans generations and cultures. Their vision is genuinely complex — marimba arrivals, choir ceremony, jazz dinner, live band into DJ. The production check coherence test is the primary target: mil-b must estimate total costs that account for all live acts across all 9 moments, including the substantial acts in moments 1–5 that mil-a generates. A totalEstimate that only reflects the dancing band and DJ would be a failure. The PRODUCTION CHECK COHERENCE rule exists specifically for this scenario.")

location.reload()
```

---

## Rule Verification Checklist

After running each scenario through MIL (set MIL answers in the intake screen — budget and bookings — then wait for generation), check the following:

### Scenario 1 — Entrance Rule
- [ ] `entrance.instruction` begins with **Tell your...** and recommends PA, NOT live musicians
- [ ] No live act recommended for entrance as a standalone
- [ ] Model explicitly references dinner recommendation as the reason

### Scenario 2 — Amplification Rule
- [ ] `guestArrivals.instruction` contains: *"Confirm the act has their own PA — acoustic music without amplification will not carry to all guests outdoors above 40 people."*
- [ ] `ceremony.instruction` contains the same sentence
- [ ] `predrinks.instruction` contains the same sentence
- [ ] Sentence does NOT appear only in productionCheck

### Scenario 3 — Classical Act Caveat
- [ ] Every moment where a string quartet or classical act is recommended: `instruction` contains *"Confirm repertoire range before booking — ask specifically whether they can perform [song] and request a sample recording of that piece."*
- [ ] Sentence does NOT appear only in productionCheck

### Scenario 4 — Physical Constraints Override
- [ ] Guest Arrivals does NOT recommend solo acoustic as primary carrier for 280 guests
- [ ] Budget guidance reflects under-R30k correctly (DJ only or ceremony musician + DJ)
- [ ] Model explicitly flags the tension between emotional preference and physical constraints
- [ ] SOLO MUSICIAN CEILING rule also fires: solo not recommended as primary for large dinner

### Scenario 5 — Production Check Coherence
- [ ] `productionCheck.totalEstimate` is a high-end number reflecting ALL 9 moments
- [ ] `productionCheck.totalEstimate` explicitly accounts for marimba, choir, jazz band, live first dance, cover band, DJ — not just the 4 moments in mil-b's batch
- [ ] `productionCheck.hiddenCosts` surfaces PA, stage hire, generator (outdoor estate), travel
- [ ] `productionCheck.bookFirst` reflects the right priority (choir and string/choir acts need longest lead time)
