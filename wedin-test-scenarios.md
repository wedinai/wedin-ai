# wedin.ai — MIL Test Scenario Seed Scripts
## Updated April 29, 2026 — 19 Scenarios

Paste any script into browser DevTools console on the live app. Type `allow pasting` first if Chrome blocks. Each script clears existing wedin.ai localStorage, injects the scenario, and reloads automatically.

After reload: Moment Map shows all 9 moments Complete. Click **Build my wedding soundtrack →** → WeddingSoundtrackScreen → **Build my music plan →** → MILIntakeScreen. Select budget, bookings, and coordinator profile chips — then wait ~30 seconds for the Music Plan to generate. The coordinator_profile value is now pre-set in the seed script — select the matching chip in the UI when prompted.

**Coordinator profile assignments per scenario:**
- Scenario 13 (Marco & Isabella) → **professional**
- Scenario 17 (Jason & Caitlin) → **volunteer**
- All other scenarios → **venue** (default)

---

## RESET SCRIPT

```javascript
Object.keys(localStorage)
  .filter(k => k.startsWith('wedin_'))
  .forEach(k => localStorage.removeItem(k))
console.log('wedin.ai localStorage cleared')
location.reload()
```

---

## RULE VERIFICATION SCENARIOS (1–5)

---

## SCENARIO 1 — Sophie & Liam
**Test: ENTRANCE LIVE ACT RULE**
entrance_live_musicians = yes BUT dinner = playlist only → Expected: PA for entrance

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s1-sophie-liam')
localStorage.setItem('wedin_couple_name','Sophie & Liam')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Intimate, warm, joyful',driving_home:'Feeling like themselves, just married, with everyone they love',home_listening:'Norah Jones, Jack Johnson, Ben Harper, John Mayer',guilty_pleasure:'Taylor Swift — all eras',musical_confidence:'confident',crowd_vs_taste:'Lean toward our taste — our friends will go with it',live_vs_recorded:'Mix of live and recorded depending on the moment',guest_count:'121_220',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Something warm and welcoming — not too formal',arrivals_style:'Acoustic guitar, coffeehouse feel',arrivals_logistics:'Indoor hotel foyer, about 60 minutes',song_question:'Jack Johnson — Better Together, Ben Harper — Steal My Kisses, John Mayer — Your Body Is A Wonderland, Norah Jones — Come Away With Me'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Norah Jones — Come Away With Me',processional_tone:'Emotional and intimate',signing_music:'Ben Harper — Forever',recessional_song:'Something upbeat that says we did it',ceremony_format:'Live musicians — it matters to us',song_question:'Norah Jones — Come Away With Me, Ben Harper — Forever, Eva Cassidy — Fields of Gold'},predrinks:{predrinks_impact:"Something they'll notice and talk about",predrinks_energy_shift:'Yes — we want a shift midway',predrinks_cultural:'No',song_question:'Jack Johnson, John Mayer, Brett Dennen — warm acoustic world'},entrance:{entrance_style:'Grand and announced — we want a moment',entrance_transition:'Yes — guests move from terrace to ballroom',entrance_live_musicians:'Yes — this appeals to us',song_question:'Mark Ronson — Uptown Funk energy'},dinner:{dinner_atmosphere:'Warm and conversational — background only',dinner_style:'Light acoustic or easy jazz',dinner_live_or_recorded:'Recorded — DJ or curated playlist is completely fine',dinner_energy_shift:'Gradual build toward speeches',song_question:'Norah Jones, Corinne Bailey Rae, Jack Johnson, Diana Krall'},speeches:{speeches_count:'4 speeches',speeches_intro_songs:"No specific intro songs",speeches_between:'Very quiet between speakers',speeches_outro:'Build from last speech into first dance'},firstDance:{firstdance_song:'Ben Harper — Steal My Kisses',firstdance_room_feeling:'Warm and joyful — smiling and swaying',firstdance_live_or_recorded:'Recorded — we want the original',firstdance_additional:'No additional dances',firstdance_transition:'Straight into dancing after',song_question:'Ben Harper — Steal My Kisses, Jack Johnson — Better Together'},dancing:{dancing_energy_arc:'Build steadily — not too early a peak',dancing_guest_mix:'Mix of ages — mostly 30s but parents matter',dancing_avoid:'Nothing too heavy or aggressive',dancing_peak_moment:'Around midnight when older guests have left',dancing_wind_down:'Yes — end on something meaningful',song_question:'Mark Ronson, Pharrell, 80s classics, Taylor Swift — Shake It Off'},lastSong:{lastsong_song:'Something everyone knows — an anthem',lastsong_energy:'End big — everyone on the floor',lastsong_instruction:'Announce the last song so people know to get up',song_question:"Don't Stop Believin, Mr Brightside, Livin on a Prayer"}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Sophie and Liam have a clear musical identity — warm, acoustic, emotionally honest. Their listening world is Norah Jones, Jack Johnson, Ben Harper. They want guests to feel at home from the moment they arrive and the day to build organically toward joy.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 2 — Emma & Tom
**Test: OUTDOOR AMPLIFICATION RULE**
venue_type = farm_bush → Expected: PA sentence in Guest Arrivals, Ceremony, Pre-drinks ONLY. Not in Speeches or Dancing.

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s2-emma-tom')
localStorage.setItem('wedin_couple_name','Emma & Tom')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Natural, relaxed, real',driving_home:'Like the best, most grounded version of themselves',home_listening:'Mumford & Sons, The Lumineers, Fleet Foxes, Bon Iver, Iron & Wine',guilty_pleasure:'ABBA — full commitment',musical_confidence:'moderate',crowd_vs_taste:'Balance — our friends will follow',live_vs_recorded:'Strongly prefer live',guest_count:'51_120',venue_type:'farm_bush'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Something acoustic and natural — like it grew from the landscape',arrivals_style:'Folk acoustic, guitar-led, warm and unhurried',arrivals_logistics:'Outdoor under mature trees, 75 minutes',song_question:'Mumford & Sons — After The Storm, The Lumineers — Ho Hey, Iron & Wine — Flightless Bird, Fleet Foxes — Helplessness Blues'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Fleet Foxes — White Winter Hymnal',processional_tone:'Natural, understated, moving',signing_music:'Something quiet and instrumental',recessional_song:'Upbeat — Mumford & Sons energy',ceremony_format:'Live musicians — it matters to us',song_question:'Fleet Foxes — White Winter Hymnal, Mumford & Sons — The Cave, Bon Iver — Holocene'},predrinks:{predrinks_impact:'Atmosphere — present but not demanding attention',predrinks_energy_shift:'No — consistent energy',predrinks_cultural:'No',song_question:'The Lumineers, Bon Iver, Iron & Wine, Novo Amor'},entrance:{entrance_style:'Intimate and surprising — not announced',entrance_transition:'Yes — outdoor to barn',entrance_live_musicians:'No — recorded music',song_question:'The Lumineers — Stubborn Love'},dinner:{dinner_atmosphere:'Relaxed, rustic, long dinner with close friends',dinner_style:'Folk acoustic or fingerstyle guitar',dinner_live_or_recorded:'Live musicians — it matters to us',dinner_energy_shift:'Stay consistent and warm',song_question:'Bon Iver, Sufjan Stevens, Fleet Foxes, Iron & Wine'},speeches:{speeches_count:'3 speeches',speeches_intro_songs:'No — just start them directly',speeches_between:'Brief silence — let the emotion sit',speeches_outro:'Build gently into first dance'},firstDance:{firstdance_song:'Iron & Wine — Flightless Bird, American Mouth',firstdance_room_feeling:'Intimate — room goes quiet',firstdance_live_or_recorded:'Recorded — the original only',firstdance_additional:'No',firstdance_transition:'Open the floor after — let it breathe',song_question:'Iron & Wine — Flightless Bird, Bon Iver — Skinny Love'},dancing:{dancing_energy_arc:'Start gentle, build through the night',dancing_guest_mix:'Mostly late 20s early 30s',dancing_avoid:'Nothing cheesy — no Cha Cha Slide',dancing_peak_moment:'Natural peak when crowd dictates',dancing_wind_down:'Yes — end meaningful not just loud',song_question:"Mumford & Sons — Little Lion Man, The Killers — Mr Brightside, LCD Soundsystem, Oasis"},lastSong:{lastsong_song:'Something everyone has a memory attached to',lastsong_energy:'Big sing-along ending',lastsong_instruction:"Make sure everyone knows it's the last one",song_question:"Don't Look Back In Anger, Mr Brightside, Closing Time"}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Emma and Tom know exactly who they are. Their music lives in the folk-acoustic world — Mumford, Fleet Foxes, Bon Iver — and their farm venue is an extension of that identity. The outdoor setting is central to their vision and a significant practical consideration for everything acoustic.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 3 — Charlotte & James
**Test: CLASSICAL ACT CAVEAT**
Contemporary classical taste → Expected: Repertoire confirmation sentence in every classical act instruction field.

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s3-charlotte-james')
localStorage.setItem('wedin_couple_name','Charlotte & James')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Elegant, timeless, personal',driving_home:'Moved by the music — slightly overwhelmed in the best possible way',home_listening:'Max Richter, Ludovico Einaudi, Radiohead, Nick Cave, Nils Frahm',guilty_pleasure:'90s pop — Spice Girls, Backstreet Boys',musical_confidence:'very confident — music is central to our lives',crowd_vs_taste:'Our taste drives everything',live_vs_recorded:'Strongly prefer live — imperfection and presence',guest_count:'51_120',venue_type:'wine_estate'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'An arrival experience — not just background',arrivals_style:'String quartet or classical piano — contemporary not traditional',arrivals_logistics:'Indoor estate chapel entrance, about 60 minutes',song_question:'Max Richter — On The Nature Of Daylight, Einaudi — Experience, Radiohead — Creep arranged for strings, Nils Frahm — Says'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Max Richter — On The Nature Of Daylight',processional_tone:'Cinematic, emotional, not theatrical',signing_music:'Einaudi — Experience',recessional_song:'Ólafur Arnalds — Near Light, joyful',ceremony_format:'Live — string ensemble',song_question:'Max Richter — On The Nature Of Daylight, Einaudi — Experience, Ólafur Arnalds — Near Light'},predrinks:{predrinks_impact:'Deliberate shift from ceremony — something more alive',predrinks_energy_shift:'Yes — from ceremony intimacy to contemporary energy',predrinks_cultural:'No',song_question:'Nick Cave, Radiohead, Sufjan Stevens, The National'},entrance:{entrance_style:'Grand and announced — a scene change',entrance_transition:'No — everyone already seated',entrance_live_musicians:'Tell me what works',song_question:'Hans Zimmer — Time'},dinner:{dinner_atmosphere:'Sophisticated and warm — centrepiece of the evening',dinner_style:'Jazz standards or contemporary classical',dinner_live_or_recorded:'Live musicians',dinner_energy_shift:'Stay elegant — speeches feel like part of the evening',song_question:'Nick Cave — Into My Arms, Radiohead — The Bends, Sufjan Stevens — Death With Dignity'},speeches:{speeches_count:'2 speeches',speeches_intro_songs:'No — keep it formal',speeches_between:'Silence — let it breathe',speeches_outro:'Transition to first dance'},firstDance:{firstdance_song:'Nick Cave — Into My Arms',firstdance_room_feeling:'Romantic and intimate — whole room holds its breath',firstdance_live_or_recorded:'Recorded — original only',firstdance_additional:'No',firstdance_transition:'Open the floor with a DJ takeover',song_question:'Nick Cave — Into My Arms'},dancing:{dancing_energy_arc:'Sophisticated build — never loses refined feel',dancing_guest_mix:'Friends in 30s and 40s, some older family',dancing_avoid:'Nothing commercial or current pop',dancing_peak_moment:'Radiohead or Arcade Fire as peak',dancing_wind_down:'No wind-down — end at energy',song_question:'Radiohead — Karma Police, LCD Soundsystem — All My Friends, Arcade Fire — Wake Up'},lastSong:{lastsong_song:'Arcade Fire — Wake Up',lastsong_energy:'Full room — a declaration not a goodbye',lastsong_instruction:'Announce it by name before it drops',song_question:'Arcade Fire — Wake Up, Radiohead — Karma Police, LCD Soundsystem — All My Friends'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Charlotte and James have exacting taste — contemporary classical, post-rock, and the kind of refinement that only comes from genuinely loving the music. Their wedding needs to feel like a piece of music itself: structured, considered, building to something.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r100_150k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 4 — Thabo & Priya
**Test: PHYSICAL CONSTRAINTS OVERRIDE EMOTIONAL SIGNALS**
280 guests + under R30k budget + intimate acoustic taste → Expected: Ensemble sized for room, not taste. Solo acoustic flagged as insufficient.

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s4-thabo-priya')
localStorage.setItem('wedin_couple_name','Thabo & Priya')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Intimate, soulful, ours',driving_home:'Like they witnessed something true and beautiful',home_listening:'Bon Iver, Nick Drake, Sufjan Stevens, Iron & Wine',guilty_pleasure:'Destiny\'s Child — full choreography in the kitchen',musical_confidence:'moderate — we feel it more than we can name it',crowd_vs_taste:'Our taste first — guests will trust us',live_vs_recorded:'Live always if possible',guest_count:'221_300',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Something gentle and intimate — like a soft welcome',arrivals_style:'Solo acoustic guitar or piano — nothing too big',arrivals_logistics:'Large hotel ballroom, 280 guests, 45 minutes',song_question:'Bon Iver — Skinny Love, Nick Drake — Pink Moon, Sufjan Stevens — Death With Dignity, Iron & Wine — Naked As We Came'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Bon Iver — Skinny Love',processional_tone:'Raw and intimate — like a held breath',signing_music:'Nick Drake — Pink Moon instrumental',recessional_song:'Something gentle but with lift',ceremony_format:'Prefer live',song_question:'Bon Iver — Skinny Love, Nick Drake — Pink Moon, Sufjan Stevens — Casimir Pulaski Day'},predrinks:{predrinks_impact:'Soft and present — not demanding',predrinks_energy_shift:'No — keep it consistent',predrinks_cultural:'Priya has some Hindu family — respectful of that',song_question:'Iron & Wine, Bon Iver, Novo Amor, Gregory Alan Isakov'},entrance:{entrance_style:'Quiet — not theatrical',entrance_transition:'No transition needed',entrance_live_musicians:'Not specifically',song_question:'Sufjan Stevens — Mystery of Love'},dinner:{dinner_atmosphere:'Intimate and conversational — like a dinner party',dinner_style:'Solo acoustic or minimal folk',dinner_live_or_recorded:'Live if possible',dinner_energy_shift:'Gentle lift toward speeches',song_question:'Gregory Alan Isakov, Fleet Foxes, The Paper Kites, Novo Amor'},speeches:{speeches_count:'3 speeches',speeches_intro_songs:'No',speeches_between:'Silence is fine',speeches_outro:'Gentle into first dance'},firstDance:{firstdance_song:'Bon Iver — Skinny Love',firstdance_room_feeling:'Private in public — the room disappears',firstdance_live_or_recorded:'Recorded — we want that version',firstdance_additional:'No',firstdance_transition:'Open floor quietly',song_question:'Bon Iver — Skinny Love'},dancing:{dancing_energy_arc:'Slow build — never forced',dancing_guest_mix:'Very mixed — Indian family, South African friends, 20s through 70s',dancing_avoid:'Nothing aggressive or electronic',dancing_peak_moment:'Whatever feels natural',dancing_wind_down:'Yes — something meaningful to close',song_question:"Destiny's Child — Survivor, Beyoncé — Crazy in Love, Bon Iver, Fleet Foxes"},lastSong:{lastsong_song:'Something that brings everyone together',lastsong_energy:'Full room but not frantic',lastsong_instruction:'Announce it',song_question:'Bon Iver — Holocene, Fleet Foxes — White Winter Hymnal'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Thabo and Priya have deeply personal, intimate taste — but their guest count and venue create a real tension the MIL must surface honestly. A solo acoustic guitarist cannot hold a hotel ballroom with 280 people. The MIL's job here is to honour their taste while being honest about what the room requires.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'under_r30k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 5 — Naledi & David
**Test: PRODUCTION CHECK COHERENCE**
Full day of live acts across all 9 moments → Expected: Production check total accounts for ALL acts not just mil-b moments.
**Coordinator profile: venue** (complex production — venue coordinator realistic)

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s5-naledi-david')
localStorage.setItem('wedin_couple_name','Naledi & David')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Opulent, joyful, African',driving_home:'Feeling like royalty surrounded by everyone they love — deeply South African',home_listening:'Freshlyground, Asa, Hugh Masekela, Miriam Makeba, Black Coffee, Nomcebo Zikode',guilty_pleasure:"Early 2000s Britney and Destiny's Child — the full works",musical_confidence:'very confident — music is central to who we are',crowd_vs_taste:'Balance — our taste anchors it but every generation on the floor',live_vs_recorded:'All live if we can',guest_count:'121_220',venue_type:'wine_estate'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Live marimba or African percussion — distinctly South African from the first second',arrivals_style:'Marimba or mbira ensemble — joyful, welcoming',arrivals_logistics:'Outdoor estate terrace, 150 guests, 90-minute arrival',song_question:'Miriam Makeba — Pata Pata, Freshlyground — Nomvula, Hugh Masekela — Stimela, Ladysmith Black Mambazo — Homeless'},ceremony:{ceremony_structure:'Cultural and traditional elements alongside civil ceremony',ceremony_faith:'African traditional — lobola paid, family rituals observed',processional_song:'A live choir processional — overwhelming',processional_tone:'Joyful and celebratory — not solemn',signing_music:'Asa — Beautiful Imperfection',recessional_song:'Full choir recessional — happy tears',ceremony_format:'All live — choir, marimba, everything',song_question:'Asa — Beautiful Imperfection, Miriam Makeba — Pata Pata, traditional Zulu wedding song, Ladysmith Black Mambazo'},predrinks:{predrinks_impact:'Something they will talk about for years',predrinks_energy_shift:'Yes — ceremony atmosphere to reception energy',predrinks_cultural:'Yes — international guests must experience something genuinely South African',song_question:'Hugh Masekela — Grazing in the Grass, Freshlyground, Fela Kuti, Simphiwe Dana'},entrance:{entrance_style:'Grand — a major production moment',entrance_transition:'Yes — outdoor to estate hall',entrance_live_musicians:'Yes — live percussion leading us in, drummers through the crowd',song_question:'Black Coffee — Drive, live drum ensemble build'},dinner:{dinner_atmosphere:'Celebratory and sophisticated — high energy, not quiet background',dinner_style:'Live jazz with SA and African influences',dinner_live_or_recorded:'Live musicians — all of dinner',dinner_energy_shift:'Build confidently toward speeches — a performance not background',song_question:'Asa — Be My Man, Freshlyground, Simphiwe Dana, Somi'},speeches:{speeches_count:'6 speeches',speeches_intro_songs:'Yes — each speaker has their own intro song',speeches_between:'DJ manages transitions',speeches_outro:'Build directly into first dance'},firstDance:{firstdance_song:'Asa — Be My Man',firstdance_room_feeling:'Everyone stops and watches — full room moment',firstdance_live_or_recorded:'Live — jazz band plays it',firstdance_additional:'Yes — parent dances immediately after',firstdance_transition:'Band continues into first dancing set',song_question:'Asa — Be My Man, Freshlyground — Pot of Gold'},dancing:{dancing_energy_arc:'Band 60–90 min live then DJ takeover',dancing_guest_mix:'Everyone on the floor — floor must never be empty',dancing_avoid:'No Afrikaans music whatsoever',dancing_peak_moment:'DJ takeover from band — feels like an event',dancing_wind_down:'No wind-down — end at full energy hard stop',song_question:"Beyoncé — Crazy in Love, Rihanna — We Found Love, Black Coffee — Superman, Ami Faku — Into You, Amapiano closer"},lastSong:{lastsong_song:'South African pride — a song everyone in the room knows and claims',lastsong_energy:'Full energy — no one sitting for the last song',lastsong_instruction:'DJ announces 30 seconds before it drops',song_question:'Black Coffee — Superman, Nomcebo Zikode — Xola Moya Wam, DJ Maphorisa — Izolo'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Naledi and David are the maximum-expression test case: full budget, full ambition, deeply South African identity, multigenerational and multicultural guest list. Their vision is genuinely complex — marimba arrivals, choir ceremony, jazz dinner, live band into DJ. The production check coherence test is the primary target.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r150k_plus',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## RELIGIOUS CEREMONY SCENARIOS (6–14)

---

## SCENARIO 6 — Michael & Sarah
**Test: ANGLICAN CEREMONY**
Formal Anglican church wedding — traditional hymns, organ, choir

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s6-michael-sarah')
localStorage.setItem('wedin_couple_name','Michael & Sarah')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Traditional, joyful, family',driving_home:'Like they were part of something timeless and meaningful',home_listening:'Classical, hymns, Michael Bublé, Frank Sinatra, light jazz',guilty_pleasure:'80s pop — Wham, George Michael, Duran Duran',musical_confidence:'moderate — we know what feels right',crowd_vs_taste:'Crowd first — we want everyone comfortable',live_vs_recorded:'Live for ceremony, recorded is fine after',guest_count:'121_220',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Something warm and familiar — guests should feel welcomed',arrivals_style:'Piano or light jazz — nothing too modern',arrivals_logistics:'Hotel ballroom, 150 guests, 45 minutes',song_question:'Frank Sinatra — The Way You Look Tonight, Michael Bublé — Feeling Good, Nat King Cole — Unforgettable, Dean Martin — That\'s Amore'},ceremony:{ceremony_structure:'Anglican Church — formal service with hymns',ceremony_faith:'Anglican',processional_song:'Jerusalem or Guide Me O Thou Great Redeemer',processional_tone:'Formal and reverent — traditional church atmosphere',signing_music:'Ave Maria or something classical',recessional_song:'Ode to Joy or similar celebratory classical',ceremony_format:'Church organ and choir — traditional',song_question:'Jerusalem, Guide Me O Thou Great Redeemer, Ave Maria, Ode to Joy'},predrinks:{predrinks_impact:'Warm and social — guests catching up',predrinks_energy_shift:'Gentle shift toward the reception',predrinks_cultural:'No specific requirements',song_question:'Michael Bublé, Frank Sinatra, Rat Pack era, light swing'},entrance:{entrance_style:'Announced and celebrated — a proper moment',entrance_transition:'Yes — from pre-drinks to dinner',entrance_live_musicians:'Not essential — recorded is fine',song_question:'Something celebratory — Sinatra era'},dinner:{dinner_atmosphere:'Warm and social — table conversation is the point',dinner_style:'Jazz standards, big band light — background warmth',dinner_live_or_recorded:'Recorded is fine — curated playlist',dinner_energy_shift:'Build toward speeches',song_question:'Tony Bennett, Norah Jones, Diana Krall, Michael Bublé — Something'},speeches:{speeches_count:'5 speeches',speeches_intro_songs:'No — keep it traditional',speeches_between:'Background music very quietly',speeches_outro:'Smooth into first dance'},firstDance:{firstdance_song:'Frank Sinatra — The Way You Look Tonight',firstdance_room_feeling:'Classic and romantic — everyone watching warmly',firstdance_live_or_recorded:'Recorded — the original',firstdance_additional:'Yes — father daughter dance after',firstdance_transition:'Open floor with energy after parent dances',song_question:'Frank Sinatra — The Way You Look Tonight'},dancing:{dancing_energy_arc:'Build from swing and classics into more contemporary as night goes on',dancing_guest_mix:'Very mixed — grandparents through 20s',dancing_avoid:'Nothing offensive or aggressive',dancing_peak_moment:'80s classics when the older guests have settled',dancing_wind_down:'End on something everyone knows',song_question:"George Michael — Careless Whisper, Wham — Wake Me Up, Journey — Don't Stop Believin, Queen — Don't Stop Me Now"},lastSong:{lastsong_song:"Don't Stop Me Now — Queen",lastsong_energy:'Full room sing-along',lastsong_instruction:'Announce it as the last song',song_question:"Queen — Don't Stop Me Now, Journey — Don't Stop Believin"}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Michael and Sarah are traditional in the best sense — they want a wedding that honours the ceremony, makes older family feel included, and builds toward genuine celebration. The Anglican ceremony structure is important to them and to their families.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 7 — Daniel & Rebecca
**Test: JEWISH CEREMONY**
Jewish wedding with traditional elements — hora, klezmer expectations

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s7-daniel-rebecca')
localStorage.setItem('wedin_couple_name','Daniel & Rebecca')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Joyful, connected, alive',driving_home:'Like they danced all night with everyone they love',home_listening:'Ben Folds, Counting Crows, Alanis Morissette, 90s alternative, some jazz',guilty_pleasure:'Backstreet Boys and NSYNC — no apologies',musical_confidence:'confident — we have strong opinions',crowd_vs_taste:'Both equally — family tradition matters and so does our taste',live_vs_recorded:'Mix — live for ceremony and hora, DJ for dancing',guest_count:'121_220',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Warm and welcoming — guests arriving from different places',arrivals_style:'Piano or light jazz — familiar and comforting',arrivals_logistics:'Hotel, 150 guests, 45 minutes',song_question:'Ben Folds — The Luckiest, Norah Jones — Come Away With Me, Diana Krall, Michael Bublé'},ceremony:{ceremony_structure:'Jewish ceremony — traditional with rabbi, chuppah, seven blessings',ceremony_faith:'Jewish — Conservative tradition',processional_song:'Traditional — Erev Shel Shoshanim or similar',processional_tone:'Meaningful and connected to tradition — family expects this',signing_music:'Something instrumental and warm under the ketubah signing',recessional_song:'Siman Tov Umazal Tov — joyful and traditional',ceremony_format:'Cantor or live musician who knows Jewish liturgy',song_question:'Erev Shel Shoshanim, Siman Tov Umazal Tov, Dodi Li'},predrinks:{predrinks_impact:'The hora — this is non-negotiable, it needs to happen here',predrinks_energy_shift:'Yes — ceremony reverence into full joy',predrinks_cultural:'The hora must happen and be properly supported',song_question:'Hava Nagila, Siman Tov Umazal Tov, Am Yisrael Chai'},entrance:{entrance_style:'Big and announced — this is a celebration',entrance_transition:'Into the dining room for dinner',entrance_live_musicians:'Yes — the hora energy carries into entrance',song_question:"Something that says we're married and we're celebrating"},dinner:{dinner_atmosphere:'Warm and celebratory — still social energy from hora',dinner_style:'Contemporary — our taste, not traditional anymore',dinner_live_or_recorded:'Recorded — DJ with good taste',dinner_energy_shift:'Natural build toward speeches',song_question:'Ben Folds — Still Fighting It, Counting Crows — A Long December, Alanis Morissette — Head Over Feet'},speeches:{speeches_count:'4 speeches',speeches_intro_songs:'Funny intro songs for each speaker',speeches_between:'Background music between',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Ben Folds — The Luckiest',firstdance_room_feeling:'Intimate and emotional — this one is just for us',firstdance_live_or_recorded:'Recorded — we want that specific recording',firstdance_additional:'No',firstdance_transition:'Open the floor with energy',song_question:'Ben Folds — The Luckiest'},dancing:{dancing_energy_arc:'High energy from the start — hora already warmed everyone up',dancing_guest_mix:'Mixed — Jewish family through contemporary friends',dancing_avoid:'Nothing that would make grandparents uncomfortable',dancing_peak_moment:'90s alternative and pop anthems',dancing_wind_down:'End on a high not a slow',song_question:"Counting Crows, Alanis, Backstreet Boys, NSYNC, Journey — Don't Stop Believin"},lastSong:{lastsong_song:'Something universally known and anthemic',lastsong_energy:'Full room finale',lastsong_instruction:'Announce it',song_question:"Don't Stop Believin — Journey, Sweet Caroline, Mr Brightside"}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Daniel and Rebecca are joyful and culturally connected. The hora is non-negotiable and the ceremony must honour Jewish tradition — but their personal taste is firmly contemporary. The MIL must navigate tradition and personal expression without making either feel like a compromise.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 8 — Ahmed & Fatima
**Test: MUSLIM NIKAH**
Islamic wedding — no music during nikah, gender considerations, halal entertainment

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s8-ahmed-fatima')
localStorage.setItem('wedin_couple_name','Ahmed & Fatima')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Blessed, joyful, family',driving_home:'Grateful and celebrated — surrounded by everyone who matters',home_listening:'Nasheed, Arabic music, some R&B and Afrobeats, Sami Yusuf',guilty_pleasure:'Rihanna and Beyoncé — quietly, at home',musical_confidence:'moderate — we want guidance that respects our values',crowd_vs_taste:'Family and community first — we are part of a larger celebration',live_vs_recorded:'Recorded — family has preferences about mixed-gender live performance',guest_count:'121_220',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Welcoming and celebratory — guests should feel honoured',arrivals_style:'Nasheeds or Arabic background music — something that feels Islamic and joyful',arrivals_logistics:'Hotel, 150 guests, 60 minutes',song_question:'Sami Yusuf — The Gift, Maher Zain — Insha Allah, Mesut Kurtis — Salawat, traditional nasheeds'},ceremony:{ceremony_structure:'Islamic nikah — formal religious ceremony with imam',ceremony_faith:'Muslim — Sunni tradition',processional_song:'No music during the nikah itself — this is a religious requirement',processional_tone:'Reverent and sacred — the ceremony is not a performance',signing_music:'No music — the signing is part of the religious ceremony',recessional_song:'Joyful nasheeds after the ceremony is complete',ceremony_format:'No live music during nikah — nasheeds after',song_question:'Maher Zain — For the Rest of My Life, Sami Yusuf — My Ummah'},predrinks:{predrinks_impact:'The walimah celebration begins here — joyful',predrinks_energy_shift:'Energy builds from nikah reverence into walimah celebration',predrinks_cultural:'Gender separation may be observed — check with couple',song_question:'Maher Zain, upbeat nasheeds, some Afrobeats instrumental'},entrance:{entrance_style:'Announced and celebrated',entrance_transition:'Into the walimah dining',entrance_live_musicians:'Female musicians only if live performance — otherwise recorded',song_question:'Joyful nasheeds or instrumental Afrobeats'},dinner:{dinner_atmosphere:'Celebratory family gathering',dinner_style:'Background music that is halal — no explicit content',dinner_live_or_recorded:'Recorded curated playlist',dinner_energy_shift:'Build toward speeches',song_question:'Instrumental Afrobeats, clean R&B, Afropop'},speeches:{speeches_count:'4 speeches — both families represented',speeches_intro_songs:'No intro songs — respectful transitions',speeches_between:'Very quiet background',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Maher Zain — For the Rest of My Life',firstdance_room_feeling:'A shared moment — meaningful to both families',firstdance_live_or_recorded:'Recorded',firstdance_additional:'No',firstdance_transition:'Open the floor to family dancing',song_question:'Maher Zain — For the Rest of My Life'},dancing:{dancing_energy_arc:'Build from family-friendly into more energy',dancing_guest_mix:'All ages, conservative family present',dancing_avoid:'No explicit content, no alcohol references in lyrics',dancing_peak_moment:'When the younger crowd takes the floor',dancing_wind_down:'End on something meaningful',song_question:'Clean Afrobeats, Afropop, instrumental versions of contemporary songs'},lastSong:{lastsong_song:'Something joyful and final',lastsong_energy:'Celebratory close',lastsong_instruction:'End the night on gratitude',song_question:'Maher Zain — Number One For Me, Afropop closer'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Ahmed and Fatima are planning a walimah that honours Islamic values while celebrating with genuine joy. The nikah has specific religious requirements around music. The MIL must navigate this with cultural intelligence — not generic wedding logic.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 9 — Raj & Meera
**Test: HINDU WEDDING**
Multi-day Hindu wedding with traditional elements, Bollywood expectations

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s9-raj-meera')
localStorage.setItem('wedin_couple_name','Raj & Meera')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Vibrant, spiritual, family',driving_home:'Connected to their culture and ready to celebrate for days',home_listening:'Bollywood classics and new, A.R. Rahman, some Western pop, Arijit Singh',guilty_pleasure:'90s Bollywood — full dramatic commitment',musical_confidence:'confident — Bollywood is in our blood',crowd_vs_taste:'Family tradition carries equal weight to personal taste',live_vs_recorded:'Mix — live dhol for ceremony, DJ for evening',guest_count:'221_300',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Dhol players or Indian classical — guests should know immediately this is a Hindu wedding',arrivals_style:'Dhol and shehnai or Indian classical instrumental',arrivals_logistics:'Large hotel ballroom, 250 guests, 60 minutes',song_question:'Tujh Mein Rab Dikhta Hai, Teri Meri Prem Kahani, A.R. Rahman — Vande Mataram, classical ragas'},ceremony:{ceremony_structure:'Hindu ceremony — full saat phere, multiple rituals',ceremony_faith:'Hindu — North Indian tradition',processional_song:'Shehnai processional — traditional, no Western music',processional_tone:'Sacred and traditional — family expects full rituals',signing_music:'Traditional Sanskrit mantras and shehnai throughout',recessional_song:'Celebratory — dhol and shehnai, joyful',ceremony_format:'Live shehnai and dhol — traditional musicians only',song_question:'Traditional shehnai pieces, Jai Ho, celebratory folk songs'},predrinks:{predrinks_impact:'Cocktail hour Bollywood and bhangra energy',predrinks_energy_shift:'Yes — from sacred to celebration',predrinks_cultural:'Bollywood is non-negotiable here',song_question:'Gallan Goodiyaan, Balam Pichkari, Desi Beat, Nachle'},entrance:{entrance_style:'Baraat energy — dhol leading them in',entrance_transition:'Into the main reception hall',entrance_live_musicians:'Yes — dhol players leading the entrance',song_question:'Dhol dhol — baraat songs, Aaj Mera Jee Karda'},dinner:{dinner_atmosphere:'Celebratory Indian hospitality — loud and warm',dinner_style:'Bollywood background and contemporary Bollywood',dinner_live_or_recorded:'Recorded — DJ Bollywood set',dinner_energy_shift:'Build toward sangeet dancing',song_question:'Arijit Singh — Tum Hi Ho, Raabta, Kabira, Ae Dil Hai Mushkil'},speeches:{speeches_count:'3 speeches — both families',speeches_intro_songs:'Bollywood intro songs — funny and personal',speeches_between:'Background Bollywood',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Tum Hi Ho — Arijit Singh',firstdance_room_feeling:'Romantic and watched — the whole family is here',firstdance_live_or_recorded:'Recorded — the film version',firstdance_additional:'No',firstdance_transition:'Sangeet — everyone dancing',song_question:'Tum Hi Ho — Arijit Singh'},dancing:{dancing_energy_arc:'Bollywood first, then Bhangra, then contemporary',dancing_guest_mix:'All ages — grandparents through 20s, must work for everyone',dancing_avoid:'No Western music until later in the night',dancing_peak_moment:'Full Bhangra floor moment',dancing_wind_down:'End on a known Bollywood anthem',song_question:'Gallan Goodiyaan, Desi Beat, Rang De Basanti, Kajra Re, Badtameez Dil'},lastSong:{lastsong_song:'Jai Ho or similar — South Asian pride anthem',lastsong_energy:'Full floor — everyone together',lastsong_instruction:'Announce it as the final song',song_question:'Jai Ho, Gallan Goodiyaan, Desi Girl'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Raj and Meera are planning a full Hindu celebration — the ceremony is sacred and the party is exuberant. The MIL must understand the difference between the two and not recommend Western music for moments that require traditional Indian content.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r100_150k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 10 — Sibusiso & Zanele
**Test: ZULU TRADITIONAL WEDDING**
Umabo or umembeso elements, traditional music, cultural pride

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s10-sibusiso-zanele')
localStorage.setItem('wedin_couple_name','Sibusiso & Zanele')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Ubuntu, joyful, ancestral',driving_home:'Connected to their ancestors and to each other — deeply Zulu, deeply South African',home_listening:'Ladysmith Black Mambazo, Miriam Makeba, Brenda Fassie, Freshlyground, Amapiano',guilty_pleasure:'Cardi B and Nicki Minaj — privately',musical_confidence:'very confident — music is culture for us',crowd_vs_taste:'Culture first — this is a community celebration not just ours',live_vs_recorded:'Live for cultural moments — recorded for dancing',guest_count:'121_220',venue_type:'farm_bush'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Traditional Zulu women singing — isicathamiya or maskanda',arrivals_style:'Live traditional Zulu music — not a playlist, real musicians',arrivals_logistics:'Outdoor farm, 150 guests, 60 minutes',song_question:'Ladysmith Black Mambazo — Homeless, Miriam Makeba — Pata Pata, Brenda Fassie — Vuli Ndlela, traditional Zulu songs'},ceremony:{ceremony_structure:'Zulu traditional ceremony combined with civil ceremony',ceremony_faith:'Zulu Traditional — ancestors honoured, lobola complete',processional_song:'Traditional Zulu women leading processional with song',processional_tone:'Ancestral and joyful — this is Ubuntu',signing_music:'Isicathamiya during signing',recessional_song:'Full community celebration song — everyone joins',ceremony_format:'Live traditional Zulu musicians — this is non-negotiable',song_question:'Traditional Zulu ceremony songs, Ladysmith Black Mambazo, isicathamiya'},predrinks:{predrinks_impact:'Community celebration — people should be dancing already',predrinks_energy_shift:'Already at celebration energy from ceremony',predrinks_cultural:'Highly cultural — this IS the culture',song_question:'Freshlyground, Brenda Fassie, Hugh Masekela — joyful SA classics'},entrance:{entrance_style:'Community procession — the couple enters with the family',entrance_transition:'Into the main celebration',entrance_live_musicians:'Yes — traditional musicians leading',song_question:'Vuli Ndlela — Brenda Fassie, traditional ululation'},dinner:{dinner_atmosphere:'Community feast — Ubuntu — everyone is family',dinner_style:'Contemporary SA — Amapiano, Afropop background',dinner_live_or_recorded:'Recorded — Amapiano DJ set at conversation volume',dinner_energy_shift:'Build toward speeches and dancing',song_question:'Ami Faku — Into You, Nomcebo Zikode, Black Coffee, DBN Gogo'},speeches:{speeches_count:'Family representatives — could be many',speeches_intro_songs:'Traditional praise songs for elders',speeches_between:'Traditional music between speakers',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Freshlyground — I\'d Like',firstdance_room_feeling:'Community watching — joyful not private',firstdance_live_or_recorded:'Recorded',firstdance_additional:'Yes — community dancing immediately after',firstdance_transition:'Full floor — everyone dances',song_question:'Freshlyground — I\'d Like'},dancing:{dancing_energy_arc:'Already high — build into full Amapiano',dancing_guest_mix:'All ages — gogo through 20s must all be on the floor',dancing_avoid:'Nothing that excludes older family',dancing_peak_moment:'Full Amapiano floor moment — collective',dancing_wind_down:'End on SA pride anthem',song_question:'Amapiano set, Black Coffee, DBN Gogo, Ami Faku, Nomcebo Zikode'},lastSong:{lastsong_song:'Xola Moya Wam — Nomcebo Zikode or similar SA anthem',lastsong_energy:'Full community together',lastsong_instruction:'Everyone knows this song — no announcement needed',song_question:'Nomcebo Zikode — Xola Moya Wam, Vuli Ndlela'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Sibusiso and Zanele are planning a celebration rooted in Zulu culture and Ubuntu. The ceremony is ancestral and requires traditional musicians. The MIL must understand the difference between cultural ceremony requirements and contemporary reception preferences.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 11 — Pieter & Marié
**Test: AFRIKANER NG KERK WEDDING**
NG Kerk church wedding, traditional Afrikaner expectations, boer-rock to contemporary

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s11-pieter-marie')
localStorage.setItem('wedin_couple_name','Pieter & Marié')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Gesin, liefde, viering',driving_home:'Dat dit een regte Afrikaner troue was — warm, eerlik en vol liefde',home_listening:'Bok van Blerk, Steve Hofmeyr classics, Die Heuwels Fantasties, some contemporary English pop',guilty_pleasure:'ABBA and Modern Talking — secretly love them',musical_confidence:'moderate — we know what feels right for our community',crowd_vs_taste:'Community and family first — this is a braai not a concert',live_vs_recorded:'Mix — NG Kerk organ for ceremony, live band for dancing',guest_count:'121_220',venue_type:'farm_bush'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Warm and welcoming — guests should feel at home immediately',arrivals_style:'Something traditional South African — not too modern',arrivals_logistics:'Farm outdoor, 150 guests, 45 minutes',song_question:'Bok van Blerk, Koos Kombuis, Jeremy Loops, early Steve Hofmeyr'},ceremony:{ceremony_structure:'NG Kerk — formal Dutch Reformed Church service',ceremony_faith:'Dutch Reformed — NG Kerk',processional_song:'Lied 201 or similar NG Kerk hymn — traditional',processional_tone:'Reverent and churchlike — the familie expects this',signing_music:'Organ music — traditional NG Kerk',recessional_song:'Joyful hymn — still in church tradition',ceremony_format:'Church organ and choir — NG Kerk tradition',song_question:'Traditional NG Kerk hymns — Lied 201, Lied 305'},predrinks:{predrinks_impact:'Braai atmosphere — relaxed and social',predrinks_energy_shift:'From church formality to farm warmth',predrinks_cultural:'Afrikaner braai culture — relaxed',song_question:'Jeremy Loops, Gangs of Ballet, Die Heuwels Fantasties, Van Coke Kartel'},entrance:{entrance_style:'Celebrated and warm — not theatrical',entrance_transition:'Into the dinner tent',entrance_live_musicians:'Not essential',song_question:'Something Afrikaans and joyful'},dinner:{dinner_atmosphere:'Braai dinner — warm, loud, family',dinner_style:'Background Afrikaans and contemporary SA',dinner_live_or_recorded:'Recorded — good playlist',dinner_energy_shift:'Build toward speeches',song_question:'Bok van Blerk, Die Heuwels Fantasties, Jeremy Loops, Goldfish'},speeches:{speeches_count:'4 speeches — both families',speeches_intro_songs:'Funny intro songs — Afrikaans preferred',speeches_between:'Background music',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Bok van Blerk — Afrikaner',firstdance_room_feeling:'Warm and celebrated — everyone clapping',firstdance_live_or_recorded:'Recorded',firstdance_additional:'Yes — father daughter dance',firstdance_transition:'Open floor with braai-party energy',song_question:'Bok van Blerk — Afrikaner'},dancing:{dancing_energy_arc:'Start Afrikaans, build to contemporary, mix throughout',dancing_guest_mix:'Oupa through 20s — all must enjoy',dancing_avoid:'Nothing offensive or too modern for elders',dancing_peak_moment:'When the whole family is on the floor',dancing_wind_down:'End on a known Afrikaans anthem',song_question:"Bok van Blerk — De la Rey, Raka — Kgomotso, Die Heuwels Fantasties, Jeremy Loops — Down South"},lastSong:{lastsong_song:'De la Rey or similar Afrikaner anthem',lastsong_energy:'Full floor — community together',lastsong_instruction:'Everyone knows this song',song_question:'Bok van Blerk — De la Rey, Van Coke Kartel'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Pieter and Marié are rooted in Afrikaner culture — the NG Kerk ceremony is important to their families and the reception is a farm celebration. The MIL must respect the church tradition and understand the Afrikaner braai-party culture that follows.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## MUSICAL CONFIDENCE EDGE CASES (12–19)

---

## SCENARIO 12 — James & Kate
**Test: NO MUSICAL CONFIDENCE — HIGH DIRECTION NEEDED**
Couple has no opinions, sparse data, needs maximum MIL direction

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s12-james-kate')
localStorage.setItem('wedin_couple_name','James & Kate')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Happy, nice, good',driving_home:'Had a really great time',home_listening:'Whatever is on the radio — we are not really music people',guilty_pleasure:'We genuinely do not have one',musical_confidence:'We have no idea — please just tell us what to do',crowd_vs_taste:'Whatever makes guests happy',live_vs_recorded:'No preference — whatever is normal',guest_count:'51_120',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Normal wedding music',arrivals_style:'Whatever is appropriate',arrivals_logistics:'Hotel, 80 guests, 45 minutes',song_question:''},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Something nice — the usual kind of thing',processional_tone:'Normal wedding ceremony feel',signing_music:'Something quiet',recessional_song:'Something a bit more upbeat',ceremony_format:'Whatever is standard',song_question:''},predrinks:{predrinks_impact:'Background music that is appropriate',predrinks_energy_shift:'Whatever is normal',predrinks_cultural:'No',song_question:''},entrance:{entrance_style:'Normal announced entrance',entrance_transition:'Into dinner',entrance_live_musicians:'No preference',song_question:''},dinner:{dinner_atmosphere:'Nice background music',dinner_style:'Whatever people usually have',dinner_live_or_recorded:'Whatever is cheaper — we are on a budget',dinner_energy_shift:'Normal progression',song_question:''},speeches:{speeches_count:'3 speeches',speeches_intro_songs:'No',speeches_between:'Background music',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Ed Sheeran — Perfect',firstdance_room_feeling:'Normal first dance',firstdance_live_or_recorded:'Recorded',firstdance_additional:'No',firstdance_transition:'Open the floor',song_question:'Ed Sheeran — Perfect'},dancing:{dancing_energy_arc:'Normal dance floor progression',dancing_guest_mix:'Mix of ages',dancing_avoid:'Nothing too explicit',dancing_peak_moment:'Whenever it happens',dancing_wind_down:'End at a reasonable time',song_question:''},lastSong:{lastsong_song:'Whatever the DJ thinks is right',lastsong_energy:'Finish the night',lastsong_instruction:'Just end normally',song_question:''}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"James and Kate are the sparse-data challenge. They have no strong musical opinions and minimal input. The MIL must work with what it has — one named song (Perfect by Ed Sheeran) — and build a coherent, appropriate recommendation without inventing taste signals that were never there.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'under_r30k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 13 — Marco & Isabella
**Test: STRONG OPINIONS, VERY SPECIFIC TASTE — MINIMAL DIRECTION NEEDED**
Couple knows exactly what they want, every moment answered with specific songs
**Coordinator profile: professional** — select 'We have a professional coordinator' when the chip appears

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s13-marco-isabella')
localStorage.setItem('wedin_couple_name','Marco & Isabella')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Cinematic, Italian, timeless',driving_home:'Like they had watched a beautiful film about people they love',home_listening:'Nino Rota, Ennio Morricone, Ludovico Einaudi, Andrea Bocelli, old school Italian pop',guilty_pleasure:'Absolutely nothing — our taste is impeccable and we stand by it',musical_confidence:'We know exactly what we want for every single moment',crowd_vs_taste:'Our taste entirely — guests will thank us later',live_vs_recorded:'Live for ceremony and first dance — recorded for everything else',guest_count:'51_120',venue_type:'wine_estate'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Nino Rota playing — guests should feel like they have walked onto a film set',arrivals_style:'String quartet playing Nino Rota — specifically from The Godfather and Amarcord',arrivals_logistics:'Wine estate, 80 guests, 60 minutes',song_question:'Nino Rota — The Godfather Theme, Ennio Morricone — Cinema Paradiso, Ludovico Einaudi — Una Mattina, Nino Rota — Amarcord'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Einaudi — Experience — specifically the string arrangement',processional_tone:'Cinematic and emotional — like the opening of a beautiful film',signing_music:'Ennio Morricone — Deborah\'s Theme from Once Upon a Time in America',recessional_song:'Nino Rota — The Godfather Love Theme — joyful arrangement',ceremony_format:'Live string quartet — non-negotiable',song_question:'Einaudi — Experience, Ennio Morricone — Cinema Paradiso, Nino Rota — The Godfather Love Theme'},predrinks:{predrinks_impact:'Andrea Bocelli and old Italian pop — warm and unmistakably Italian',predrinks_energy_shift:'Subtle shift from cinematic ceremony to warm Italian hospitality',predrinks_cultural:'Italian culture is the entire point',song_question:'Andrea Bocelli — Con Te Partirò, Lucio Battisti, Franco Battiato — La Cura, Fabrizio De André'},entrance:{entrance_style:'The Godfather — stately, announced, cinematic',entrance_transition:'Into the dining room',entrance_live_musicians:'String quartet plays The Godfather theme as we walk in',song_question:'Nino Rota — The Godfather Theme'},dinner:{dinner_atmosphere:'Italian dinner — warm, long, full of wine and conversation',dinner_style:'Italian pop and light jazz — Pino Daniele, Fabrizio De André, Italian standards',dinner_live_or_recorded:'Recorded — curated Italian playlist',dinner_energy_shift:'Gradual build toward dancing energy',song_question:'Pino Daniele — Napul\'è, Fabrizio De André — La Canzone di Marinella, Franco Battiato'},speeches:{speeches_count:'3 speeches',speeches_intro_songs:'Italian pop intro songs — humorous',speeches_between:'Italian background',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Andrea Bocelli — Con Te Partirò — the original',firstdance_room_feeling:'Cinematic — the room disappears',firstdance_live_or_recorded:'Recorded — the original recording only',firstdance_additional:'No',firstdance_transition:'Italian dancing energy',song_question:'Andrea Bocelli — Con Te Partirò'},dancing:{dancing_energy_arc:'Start Italian, build to contemporary, end on Italian pride',dancing_guest_mix:'Mostly Italian — older family and younger friends',dancing_avoid:'Nothing too contemporary or British-American',dancing_peak_moment:'When the whole Italian family is on the floor together',dancing_wind_down:'End on Italian',song_question:'Jovanotti — Baciami Ancora, Zucchero — Senza Una Donna, Eros Ramazzotti, Italian DJ set'},lastSong:{lastsong_song:'Volare — Dean Martin or Gipsy Kings version',lastsong_energy:'Everyone singing in Italian',lastsong_instruction:'This is the one — make sure everyone is on the floor',song_question:'Volare, O Sole Mio, Con Te Partirò reprise'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Marco and Isabella have a complete, coherent vision for every moment. The MIL's job is to validate and execute their vision, not to redirect it. Every recommendation should reference the specific songs and artists they named.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r100_150k',mil_existing_bookings:'nothing_booked',coordinator_profile:'professional'}))
location.reload()
```

---

## SCENARIO 14 — David & Mark
**Test: SAME-SEX COUPLE, CONTEMPORARY TASTE**
Gay wedding, inclusive, contemporary — no assumed gender roles

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s14-david-mark')
localStorage.setItem('wedin_couple_name','David & Mark')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Joyful, authentic, us',driving_home:'Like they had fully been themselves for the first time in public — proud and happy',home_listening:'Troye Sivan, Years & Years, Hozier, Sam Smith, Lorde, Christine and the Queens',guilty_pleasure:'Kylie Minogue — specifically the 90s era, no shame whatsoever',musical_confidence:'Very confident — we have talked about this for years',crowd_vs_taste:'Our taste entirely — our friends will be here for it',live_vs_recorded:'Mix — live for ceremony and pre-drinks, DJ for dancing',guest_count:'51_120',venue_type:'wine_estate'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Something that feels like us immediately — warm and contemporary',arrivals_style:'Acoustic versions of contemporary pop — the Hozier and Sam Smith world',arrivals_logistics:'Wine estate, 80 guests, 60 minutes',song_question:'Hozier — Take Me To Church acoustic, Sam Smith — Stay With Me acoustic, Troye Sivan — Bloom acoustic, Years & Years — King'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Hozier — Cherry Wine — the acoustic version',processional_tone:'Emotional and us — not a standard wedding',signing_music:'Sam Smith — Stay With Me instrumental',recessional_song:'Years & Years — Shine — we want it to feel like a celebration',ceremony_format:'Live acoustic musician — guitarist with voice',song_question:'Hozier — Cherry Wine, Sam Smith — Stay With Me, Years & Years — Shine, Troye Sivan — Heaven'},predrinks:{predrinks_impact:'Something with warmth and edge — not generic wedding background',predrinks_energy_shift:'Yes — build toward the party',predrinks_cultural:'No',song_question:'Christine and the Queens, Lorde, Perfume Genius, Sufjan Stevens'},entrance:{entrance_style:'Camp and joyful — this is our moment',entrance_transition:'Into the dining room',entrance_live_musicians:'No — recorded, something with energy',song_question:'Kylie Minogue — Can\'t Get You Out of My Head'},dinner:{dinner_atmosphere:'Warm dinner party — queer joy at the table',dinner_style:'Contemporary and eclectic — our world',dinner_live_or_recorded:'Recorded — curated playlist',dinner_energy_shift:'Build toward dancing',song_question:'Sam Smith, Years & Years, Troye Sivan, Christine and the Queens, Lorde'},speeches:{speeches_count:'3 speeches',speeches_intro_songs:'Camp intro songs — yes please',speeches_between:'Background contemporary',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Hozier — Like Real People Do',firstdance_room_feeling:'Intimate and proud — the room witnesses something real',firstdance_live_or_recorded:'Recorded — the original',firstdance_additional:'No',firstdance_transition:'Open the floor with full energy',song_question:'Hozier — Like Real People Do'},dancing:{dancing_energy_arc:'Build from emotional to full queer joy energy',dancing_guest_mix:'Mostly our community — 20s through 40s, inclusive',dancing_avoid:'Nothing homophobic obviously — nothing that centres straight relationships',dancing_peak_moment:'Kylie, Robyn, Kylie again',dancing_wind_down:'End on something meaningful',song_question:'Kylie Minogue, Robyn — Dancing On My Own, Years & Years, Sam Smith — Unholy, Charli XCX'},lastSong:{lastsong_song:'Robyn — Dancing On My Own — everyone knows why',lastsong_energy:'Full room — emotional and joyful',lastsong_instruction:'This one is personal — announce it',song_question:'Robyn — Dancing On My Own'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"David and Mark know exactly who they are and this wedding is a full expression of that. The MIL must reflect their specific taste — Hozier, Troye Sivan, Kylie, Robyn — without defaulting to generic wedding language.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 15 — Richard & Anne
**Test: SECOND MARRIAGE, OLDER COUPLE, INTIMATE**
50s couple, second marriage, small intimate wedding, mature taste

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s15-richard-anne')
localStorage.setItem('wedin_couple_name','Richard & Anne')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Intimate, meaningful, grateful',driving_home:'Deeply happy and grateful that they found each other',home_listening:'Elton John, Carole King, Van Morrison, Joni Mitchell, some contemporary jazz',guilty_pleasure:'We are too old for guilty pleasures — we just love what we love',musical_confidence:'We know what we love — not trendy but genuinely ours',crowd_vs_taste:'Our taste — this is a small gathering of people who know us',live_vs_recorded:'Recorded is fine — we are not trying to impress anyone',guest_count:'under_50',venue_type:'wine_estate'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Warm and welcoming — these are all close friends and family',arrivals_style:'Jazz piano or acoustic — warm, adult, no fuss',arrivals_logistics:'Wine estate, 30 guests, 45 minutes',song_question:'Van Morrison — Brown Eyed Girl, Carole King — I Feel The Earth Move, Joni Mitchell — A Case of You, Elton John — Your Song'},ceremony:{ceremony_structure:'Non-religious civil ceremony — short and meaningful',ceremony_faith:'None',processional_song:'Van Morrison — Into The Mystic',processional_tone:'Meaningful and personal — not performative',signing_music:'Joni Mitchell — A Case of You — instrumental version',recessional_song:'Something joyful — Elton John or similar',ceremony_format:'Recorded is fine — we want it personal not elaborate',song_question:'Van Morrison — Into The Mystic, Joni Mitchell — A Case of You, Elton John — Your Song'},predrinks:{predrinks_impact:'Lovely background for close friends catching up',predrinks_energy_shift:'Gentle — this is an intimate gathering',predrinks_cultural:'No',song_question:'Carole King, James Taylor, Van Morrison — Astral Weeks era, Norah Jones'},entrance:{entrance_style:'Simple — we walk in, people clap, no big production',entrance_transition:'Into dinner',entrance_live_musicians:'No',song_question:'Elton John — Tiny Dancer'},dinner:{dinner_atmosphere:'Long dinner party with close friends — this is the whole event',dinner_style:'Jazz and 70s singer-songwriter — warm adult',dinner_live_or_recorded:'Recorded curated playlist',dinner_energy_shift:'Natural — speeches happen mid-dinner',song_question:'Norah Jones, Diana Krall, Van Morrison, James Taylor, Carole King'},speeches:{speeches_count:'2 speeches — keep it short',speeches_intro_songs:'No',speeches_between:'Very quiet',speeches_outro:'Into first dance naturally'},firstDance:{firstdance_song:'Elton John — Your Song',firstdance_room_feeling:'Warm and witnessed — close friends around us',firstdance_live_or_recorded:'Recorded — the original',firstdance_additional:'No',firstdance_transition:'Everyone joins naturally — this is a dinner party not a nightclub',song_question:'Elton John — Your Song'},dancing:{dancing_energy_arc:'Gentle — some people will dance, some will stay at the table',dancing_guest_mix:'All 50s and 60s — we are not doing EDM',dancing_avoid:'Nothing modern or loud — this is not that kind of party',dancing_peak_moment:'If it happens it happens — no pressure',dancing_wind_down:'End when people are ready to go home',song_question:'Elton John, Van Morrison, Fleetwood Mac — Go Your Own Way, The Eagles'},lastSong:{lastsong_song:'Something beautiful that ends the evening gently',lastsong_energy:'Warm and quiet — people heading home happy',lastsong_instruction:'Just let it end naturally',song_question:'Van Morrison — Into The Mystic, Fleetwood Mac — The Chain, Elton John'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Richard and Anne are not trying to impress anyone. This is a small, intimate gathering of people who love them. The MIL must match that register — no big production recommendations, no live acts for the sake of it. Warmth and quality over spectacle.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r30_60k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 16 — Kwame & Ama
**Test: DESTINATION WEDDING — OUTDOOR AMPLIFICATION + CULTURAL MIX**
SA couple marrying abroad, beach/outdoor, Ghanaian and South African cultural mix

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s16-kwame-ama')
localStorage.setItem('wedin_couple_name','Kwame & Ama')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Pan-African, joyful, proud',driving_home:'Proud of where they come from and excited about where they are going — together',home_listening:'Burna Boy, Wizkid, Black Coffee, Davido, Ama Lou, Miriam Makeba',guilty_pleasure:'Ed Sheeran — specifically Shape of You on a guilty late night',musical_confidence:'Very confident — African music is in our DNA',crowd_vs_taste:'Both — family tradition and our personal taste equally',live_vs_recorded:'Live for ceremony — DJ and live percussion for dancing',guest_count:'51_120',venue_type:'destination'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Live highlife or Afrobeats acoustic — guests arrive to Africa',arrivals_style:'Live acoustic Ghanaian highlife or Afrobeats fusion',arrivals_logistics:'Outdoor beach location, 80 guests, 60 minutes',song_question:'Burna Boy — Ye acoustic, Wizkid — Essence acoustic, Ama Lou, Miriam Makeba — Pata Pata'},ceremony:{ceremony_structure:'Outdoor civil ceremony with Ghanaian traditional blessings',ceremony_faith:'Christian Ghanaian — prayers and blessings incorporated',processional_song:'Live traditional Ghanaian music — kente-robed procession',processional_tone:'Joyful and traditional — this is our culture',signing_music:'Something contemporary — Burna Boy or Wizkid mellow',recessional_song:'Full Afrobeats celebration — everyone on their feet',ceremony_format:'Live traditional musicians plus contemporary DJ',song_question:'Burna Boy — Last Last, Wizkid — Blessed, traditional Ghanaian'},predrinks:{predrinks_impact:'Afrobeats energy — guests from different countries discovering each other',predrinks_energy_shift:'High from the start — ceremony was joyful',predrinks_cultural:'Yes — Ghana meets SA — both must be represented',song_question:'Black Coffee, Burna Boy, Davido, Freshlyground, Ama Lou'},entrance:{entrance_style:'Full Afrobeats entrance — everyone dancing',entrance_transition:'Into the reception',entrance_live_musicians:'Yes — live percussion leading them in',song_question:'Burna Boy — Kilometre, Davido — Fall'},dinner:{dinner_atmosphere:'Pan-African feast — warm, celebratory, loud',dinner_style:'Afrobeats and Afropop background',dinner_live_or_recorded:'Recorded — DJ Afrobeats set',dinner_energy_shift:'Build toward dancing',song_question:'Wizkid, Tems, Fireboy DML, Black Coffee, Ami Faku'},speeches:{speeches_count:'4 speeches — Ghanaian and South African family',speeches_intro_songs:'Yes — traditional and contemporary mix',speeches_between:'Afrobeats background',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Wizkid — Essence featuring Tems',firstdance_room_feeling:'Romantic and full — everyone watching and swaying',firstdance_live_or_recorded:'Recorded — the original version',firstdance_additional:'No',firstdance_transition:'Full Afrobeats floor immediately',song_question:'Wizkid — Essence'},dancing:{dancing_energy_arc:'Already high — build to Amapiano peak',dancing_guest_mix:'Ghanaian, South African, international guests — all must find their moment',dancing_avoid:'No music that excludes African guests',dancing_peak_moment:'Amapiano set closing the night',dancing_wind_down:'No wind-down — end at full energy',song_question:'Black Coffee, DJ Maphorisa, Burna Boy, Afrobeats into Amapiano'},lastSong:{lastsong_song:'Something pan-African that every guest knows',lastsong_energy:'Full floor finale',lastsong_instruction:'Everyone knows this — no announcement',song_question:'Burna Boy — Last Last, Black Coffee — Superman, Wizkid — Essence reprise'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Kwame and Ama are pan-African and proud. Their wedding is a meeting point between Ghanaian and South African culture, with guests from both countries and internationally. The outdoor destination venue triggers the amplification rule — AND their cultural context requires specific knowledge.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r100_150k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 17 — Jason & Caitlin
**Test: EXTREME BUDGET MISMATCH — BIG VISION, TINY BUDGET**
Couple wants full live band experience on under R30k budget
**Coordinator profile: volunteer** — select 'A friend or family member is helping out' when the chip appears

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s17-jason-caitlin')
localStorage.setItem('wedin_couple_name','Jason & Caitlin')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Fun, big, memorable',driving_home:'Like they had been to the best party of their lives',home_listening:'Coldplay, U2, Imagine Dragons, Foo Fighters, some EDM',guilty_pleasure:'Nickelback — we know, we know, but we love it',musical_confidence:'moderate — we know what gets people excited',crowd_vs_taste:'Crowd first — we want everyone having the best night',live_vs_recorded:'We want a full live band — the whole experience',guest_count:'121_220',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Live band from the moment guests walk in',arrivals_style:'Full band — we want live music everywhere',arrivals_logistics:'Hotel ballroom, 150 guests, 45 minutes',song_question:'Coldplay — Yellow, U2 — One, Imagine Dragons — Radioactive, Foo Fighters — Best of You'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Coldplay — Yellow — live band',processional_tone:'Big and emotional — stadium feel in the ceremony',signing_music:'U2 — One — live',recessional_song:'Foo Fighters — Best of You — full energy',ceremony_format:'Full live band for ceremony — all of it',song_question:'Coldplay — Yellow, U2 — One, Foo Fighters — Best of You'},predrinks:{predrinks_impact:'Live band playing hits — guests dancing from the start',predrinks_energy_shift:'Already at peak — we want high energy from the start',predrinks_cultural:'No',song_question:'Imagine Dragons, Coldplay B-sides, U2'},entrance:{entrance_style:'Stadium entrance — full band, lights, the works',entrance_transition:'Into the ballroom',entrance_live_musicians:'Full live band entrance — non-negotiable',song_question:'Imagine Dragons — Thunder, Foo Fighters — The Pretender'},dinner:{dinner_atmosphere:'Live band playing through dinner — never a quiet moment',dinner_style:'Full live band — rock and contemporary pop',dinner_live_or_recorded:'Full live band throughout',dinner_energy_shift:'Keep it high all the way through',song_question:'Coldplay, U2, Imagine Dragons, Foo Fighters'},speeches:{speeches_count:'3 speeches',speeches_intro_songs:'Rock song intro for each speaker',speeches_between:'Band playing between',speeches_outro:'Into first dance with band'},firstDance:{firstdance_song:'Coldplay — Yellow — live by the full band',firstdance_room_feeling:'Stadium moment — massive',firstdance_live_or_recorded:'Live — band plays it',firstdance_additional:'No',firstdance_transition:'Band straight into dancing set',song_question:'Coldplay — Yellow'},dancing:{dancing_energy_arc:'Peak from start — never drop below maximum',dancing_guest_mix:'Everyone — all ages',dancing_avoid:'Nothing slow or quiet',dancing_peak_moment:'Foo Fighters set — everyone moshing',dancing_wind_down:'No wind-down — end at maximum energy',song_question:'Foo Fighters, Rage Against The Machine, Nickelback, Imagine Dragons'},lastSong:{lastsong_song:'Foo Fighters — Best of You — full volume',lastsong_energy:'Maximum — full crowd',lastsong_instruction:'Play it loud — end at full',song_question:'Foo Fighters — Best of You'}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Jason and Caitlin want everything live, everything big, everything loud. Their vision is legitimate and their enthusiasm is genuine. But their budget (under R30k) cannot deliver a full live band experience. The MIL must be honest about this mismatch and redirect to what is actually achievable — without crushing their excitement.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'under_r30k',mil_existing_bookings:'nothing_booked',coordinator_profile:'volunteer'}))
location.reload()
```

---

## SCENARIO 18 — Tom & Sarah
**Test: MIXED MUSICAL CONFIDENCE — ONE STRONG, ONE PASSIVE**
One partner very musical, one has no opinions — classic mixed couple

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s18-tom-sarah')
localStorage.setItem('wedin_couple_name','Tom & Sarah')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'Fun, warm, ours',driving_home:'Tom: the music was perfect and Sarah loved it. Sarah: it was lovely and Tom was happy',home_listening:'Tom: specifically jazz — Bill Evans, Miles Davis, John Coltrane. Sarah: whatever Tom puts on',guilty_pleasure:'Tom: early 2000s hip hop. Sarah: whatever that is',musical_confidence:'One of us is very into music and one of us is along for the ride',crowd_vs_taste:'Tom wants his taste — Sarah wants guests to have fun',live_vs_recorded:'Tom wants live jazz — Sarah just wants people dancing',guest_count:'51_120',venue_type:'wine_estate'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Tom: live jazz trio — nothing else. Sarah: whatever Tom thinks',arrivals_style:'Jazz trio — Bill Evans style',arrivals_logistics:'Wine estate, 80 guests, 45 minutes',song_question:'Tom: Bill Evans — Waltz for Debby, Miles Davis — Kind of Blue, John Coltrane — My Favorite Things. Sarah: no idea'},ceremony:{ceremony_structure:'Non-religious civil ceremony',ceremony_faith:'None',processional_song:'Tom: Miles Davis — Someday My Prince Will Come. Sarah: something romantic',processional_tone:'Tom: sophisticated and cool. Sarah: emotional and beautiful',signing_music:'Bill Evans — Peace Piece',recessional_song:'Something upbeat and jazz',ceremony_format:'Live jazz — Tom is very clear on this',song_question:'Bill Evans — Waltz for Debby, Miles Davis — Someday My Prince Will Come'},predrinks:{predrinks_impact:'Jazz trio continuing — Tom loves this. Sarah wants energy building',predrinks_energy_shift:'Tom: no shift — keep the jazz. Sarah: maybe something more upbeat?',predrinks_cultural:'No',song_question:'Bill Evans, Miles Davis, John Coltrane, some Norah Jones for Sarah'},entrance:{entrance_style:'Jazz trio plays us in — Tom has specific ideas',entrance_transition:'Into dinner',entrance_live_musicians:'Yes — jazz trio',song_question:'Miles Davis — So What'},dinner:{dinner_atmosphere:'Jazz dinner — this is Tom\'s dream. Sarah is happy if guests are happy',dinner_style:'Live jazz trio through dinner',dinner_live_or_recorded:'Live — jazz trio',dinner_energy_shift:'Gradual build — jazz getting slightly more accessible',song_question:'Norah Jones, Diana Krall, some Chet Baker — bridging Tom and Sarah'},speeches:{speeches_count:'3 speeches',speeches_intro_songs:'Funny jazz songs for each speaker — Tom has ideas',speeches_between:'Jazz background',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'Tom: Bill Evans — Waltz for Debby. Sarah: she agrees — it\'s beautiful',firstdance_room_feeling:'Sophisticated and intimate',firstdance_live_or_recorded:'Live — jazz trio plays it for them',firstdance_additional:'No',firstdance_transition:'Sarah wants more dancing energy — Tom is happy to give guests what they want',song_question:'Bill Evans — Waltz for Debby'},dancing:{dancing_energy_arc:'Tom: keep it jazz sophisticated. Sarah: please can we have some Beyoncé',dancing_guest_mix:'Mix — Tom\'s jazz friends and Sarah\'s contemporary crowd',dancing_avoid:'Tom: nothing generic. Sarah: nothing too obscure',dancing_peak_moment:'DJ who can bridge jazz and contemporary',dancing_wind_down:'Something that honours both of them',song_question:"Tom: Herbie Hancock — Cantaloupe Island. Sarah: Beyoncé — Crazy in Love, Justin Timberlake"},lastSong:{lastsong_song:'Something everyone knows — a compromise',lastsong_energy:'Full floor',lastsong_instruction:'End together',song_question:"Don't Stop Believin — it works for both of them"}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Tom is the musician in this relationship — deeply into jazz, opinionated, and specific. Sarah trusts him on music but wants guests to be happy and the dancing to work for everyone. The MIL must honour Tom's taste while finding bridges to the broader crowd for the dancing section.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## SCENARIO 19 — Luke & Amy
**Test: INTERFAITH WEDDING — CATHOLIC + JEWISH**
Mixed religious background, two families with different expectations

```javascript
Object.keys(localStorage).filter(k=>k.startsWith('wedin_')).forEach(k=>localStorage.removeItem(k))
localStorage.setItem('wedin_session_id','test-s19-luke-amy')
localStorage.setItem('wedin_couple_name','Luke & Amy')
localStorage.setItem('wedin_is_paid','true')
localStorage.setItem('wedin_session_answers',JSON.stringify({three_words:'United, joyful, both',driving_home:'Like two families became one — and music was the thing that brought them together',home_listening:'Ed Sheeran, John Legend, Adele, some Motown, some classical',guilty_pleasure:'90s boy bands — both of them, separately discovered',musical_confidence:'moderate — we want something that works for everyone',crowd_vs_taste:'Both families must be respected equally — this is the whole challenge',live_vs_recorded:'Live for ceremony and hora — recorded for the rest',guest_count:'121_220',venue_type:'hotel_venue'}))
localStorage.setItem('wedin_moment_answers',JSON.stringify({guestArrivals:{arrivals_attention:'Something that feels welcoming to both families',arrivals_style:'Piano or string quartet — neutral and warm',arrivals_logistics:'Hotel, 160 guests, 45 minutes',song_question:'John Legend — All of Me, Ed Sheeran — Thinking Out Loud, Norah Jones, Diana Krall'},ceremony:{ceremony_structure:'Interfaith ceremony — Catholic priest and Jewish officiant',ceremony_faith:'Interfaith — Catholic and Jewish',processional_song:'Something that works for both traditions — classical or contemporary classical',processional_tone:'Reverent and meaningful to both families',signing_music:'Something instrumental and beautiful',recessional_song:'Joyful and celebratory — both traditions',ceremony_format:'Classical musicians who understand the dual tradition',song_question:'Pachelbel — Canon in D, John Legend — All of Me, traditional Jewish melody, Ave Maria'},predrinks:{predrinks_impact:'The hora — Jewish side expects this and it is wonderful',predrinks_energy_shift:'From ceremony reverence to hora joy',predrinks_cultural:'Hora is essential — Catholic family joins in',song_question:'Hava Nagila, Siman Tov Umazal Tov'},entrance:{entrance_style:'Celebrated — both families cheering',entrance_transition:'Into dinner',entrance_live_musicians:'Not essential',song_question:'Something joyful and contemporary'},dinner:{dinner_atmosphere:'Two families becoming one — warm and social',dinner_style:'Contemporary — both families comfortable',dinner_live_or_recorded:'Recorded — good taste DJ',dinner_energy_shift:'Build toward speeches',song_question:'John Legend, Ed Sheeran, Adele, Motown classics'},speeches:{speeches_count:'5 speeches — both families represented',speeches_intro_songs:'Appropriate intro songs — no religious content',speeches_between:'Background contemporary',speeches_outro:'Into first dance'},firstDance:{firstdance_song:'John Legend — All of Me',firstdance_room_feeling:'Both families watching with love',firstdance_live_or_recorded:'Recorded',firstdance_additional:'No',firstdance_transition:'Open the floor to both families',song_question:'John Legend — All of Me'},dancing:{dancing_energy_arc:'Build from Motown through contemporary',dancing_guest_mix:'Very mixed — Catholic and Jewish families, all ages',dancing_avoid:'Nothing that would exclude either family',dancing_peak_moment:'Motown for older family, contemporary for younger',dancing_wind_down:'End on something everyone knows',song_question:"Stevie Wonder, Marvin Gaye, Earth Wind & Fire, Journey — Don't Stop Believin"},lastSong:{lastsong_song:'Something universal — a song both families claim',lastsong_energy:'Full floor together',lastsong_instruction:'Announce it',song_question:"Don't Stop Believin, Sweet Caroline, Shout"}}))
localStorage.setItem('wedin_completed_moments',JSON.stringify(['arrivals','ceremony','predrinks','entrance','dinner','speeches','firstdance','dancing','lastsong']))
localStorage.setItem('wedin_moment_confirmed',JSON.stringify({arrivals:true,ceremony:true,predrinks:true,entrance:true,dinner:true,speeches:true,firstdance:true,dancing:true,lastsong:true}))
localStorage.setItem('wedin_portrait',"Luke and Amy are navigating two family traditions with grace and genuine love. The ceremony requires cultural intelligence — both a Catholic priest and Jewish officiant. The hora must happen. The MIL must serve both families without making either feel like an afterthought.")
localStorage.setItem('wedin_mil_answers',JSON.stringify({mil_budget:'r60_100k',mil_existing_bookings:'nothing_booked',coordinator_profile:'venue'}))
location.reload()
```

---

## RULE VERIFICATION CHECKLIST

After running each scenario through MIL intake, check the following. Select the coordinator profile chip matching the scenario assignment before generating.

### Scenario 1 — Entrance Rule
- [ ] Entrance recommendation = PA, not live musicians
- [ ] Model explicitly cross-references dinner (playlist only) as the reason
- [ ] No standalone live act recommended for entrance

### Scenario 2 — Amplification Rule
- [ ] Guest Arrivals instruction contains: *"Confirm the act has their own PA — acoustic music without amplification will not carry to all guests outdoors above 40 people."*
- [ ] Ceremony instruction contains the same sentence
- [ ] Pre-drinks instruction contains the same sentence
- [ ] Sentence does NOT appear in Speeches or Dancing

### Scenario 3 — Classical Act Caveat
- [ ] Every classical act instruction field contains: *"Confirm repertoire range before booking — ask specifically whether they can perform [named song] and request a sample recording."*
- [ ] Sentence appears in the instruction field, not only productionCheck

### Scenario 4 — Physical Constraints Override
- [ ] Solo acoustic NOT recommended as primary carrier for 280 guests
- [ ] MIL explicitly flags tension between intimate taste and large room
- [ ] Ensemble recommendation sized for room, not taste signal

### Scenario 5 — Production Check Coherence
- [ ] totalEstimate reflects ALL nine moments including marimba, choir, jazz band
- [ ] Does not only account for mil-b moments (dancing, last song)

### Scenarios 6–11 — Religious Ceremonies
- [ ] Ceremony structure correctly identified per tradition
- [ ] No Western music recommended for moments requiring traditional content
- [ ] Cultural constraints respected throughout

### Scenarios 12–13 — Musical Confidence Spectrum
- [ ] Scenario 12 (no opinions): MIL does not invent taste signals, works with Ed Sheeran as only named song
- [ ] Scenario 13 (very specific): Every recommendation references named Italian songs and artists

### Scenario 14 — Same-Sex Couple
- [ ] No assumed gender roles in any recommendation
- [ ] Specific artists referenced (Hozier, Troye Sivan, Kylie, Robyn)

### Scenario 15 — Intimate Second Marriage
- [ ] No big production recommendations
- [ ] Matches intimate register of the couple and guest count

### Scenario 16 — Destination + Cultural Mix
- [ ] Outdoor amplification sentence fires (destination venue_type)
- [ ] Pan-African cultural context respected

### Scenario 17 — Budget Mismatch
- [ ] MIL is honest about budget constraint
- [ ] Redirects from full live band to what is achievable under R30k
- [ ] Does not crush the couple's enthusiasm

### Scenario 18 — Mixed Confidence Couple
- [ ] Tom's jazz preference is honoured for ceremony and dinner
- [ ] Dancing section bridges toward Sarah's crowd-inclusive preference
- [ ] Both partners are acknowledged

### Scenario 19 — Interfaith Wedding
- [ ] Hora recommended and supported
- [ ] Ceremony respects dual tradition
- [ ] Both families' expectations addressed

---

## COORDINATOR PROFILE CHECKLIST

Run after generating the Coordinator Brief tab. Use the three designated scenarios.

### Scenario 13 — Professional Profile (Marco & Isabella)
- [ ] Brief uses concise, peer-to-peer register — no hand-holding
- [ ] Industry terminology present where it aids precision: cue sheet, pre-brief, sound check window, load-in, or PA spec
- [ ] Brief focuses on what is specific to Marco and Isabella — not general process
- [ ] No over-explanation of what a DJ handoff or sound check means
- [ ] No clock times anywhere in the brief

### Scenario 17 — Volunteer Profile (Jason & Caitlin)
- [ ] Plain language throughout — no industry jargon
- [ ] Each moment has one clear, single action
- [ ] Named person identified at every transition — e.g. 'find the DJ and tell them to begin' or 'check with Jason and Caitlin before the next moment starts'
- [ ] At least one 'if something goes wrong' instruction present
- [ ] Warm, encouraging tone — not a production manual
- [ ] No clock times anywhere in the brief

### Any Scenario — Venue Profile (default)
- [ ] Brief is fully self-contained — does not assume prior knowledge of the couple
- [ ] Enough context on couple's preferences that coordinator can brief acts without a discovery call
- [ ] Professional but accessible register
- [ ] No clock times anywhere in the brief
