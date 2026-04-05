// Developer test scenarios — seed data for the /test route.
// Usage: /test?scenario=s1  (s1–s5)

export const SCENARIOS = {
  s1: {
    sessionId: 'test-s1-sophie-liam',
    coupleName: 'Sophie & Liam',
    portrait:
      "Sophie and Liam have a clear musical identity — warm, acoustic, emotionally honest. Their listening world is Norah Jones, Jack Johnson, Ben Harper. They want guests to feel at home from the moment they arrive and the day to build organically toward joy.",
    milIntake: {
      budget: 'R85 000',
      existingBookings: 'None',
    },
    sessionAnswers: {
      three_words: 'Intimate, warm, joyful',
      driving_home: 'Feeling like themselves, just married, with everyone they love',
      home_listening: 'Norah Jones, Jack Johnson, Ben Harper, John Mayer',
      guilty_pleasure: 'Taylor Swift — all eras',
      musical_confidence: 'confident',
      crowd_vs_taste: 'Lean toward our taste — our friends will go with it',
      live_vs_recorded: 'Mix of live and recorded depending on the moment',
      guest_count: '121_220',
      venue_type: 'hotel_venue',
    },
    momentAnswers: {
      guestArrivals: {
        arrivals_attention: 'Something warm and welcoming — not too formal',
        arrivals_style: 'Acoustic guitar, coffeehouse feel',
        arrivals_logistics: 'Indoor hotel foyer, about 60 minutes',
        song_question:
          'Jack Johnson — Better Together, Ben Harper — Steal My Kisses, John Mayer — Your Body Is A Wonderland, Norah Jones — Come Away With Me',
      },
      ceremony: {
        ceremony_structure: 'Non-religious civil ceremony',
        ceremony_faith: 'None',
        processional_song: 'Norah Jones — Come Away With Me',
        processional_tone: 'Emotional and intimate',
        signing_music: 'Ben Harper — Forever',
        recessional_song: 'Something upbeat that says we did it',
        ceremony_format: 'Live musicians — it matters to us',
        song_question:
          'Norah Jones — Come Away With Me, Ben Harper — Forever, Eva Cassidy — Fields of Gold',
      },
      predrinks: {
        predrinks_impact: "Something they'll notice and talk about",
        predrinks_energy_shift: 'Yes — we want a shift midway',
        predrinks_cultural: 'No',
        song_question: 'Jack Johnson, John Mayer, Brett Dennen — warm acoustic world',
      },
      entrance: {
        entrance_style: 'Grand and announced — we want a moment',
        entrance_transition: 'Yes — guests move from terrace to ballroom',
        entrance_live_musicians: 'Yes — this appeals to us',
        song_question: 'Mark Ronson — Uptown Funk energy',
      },
      dinner: {
        dinner_atmosphere: 'Warm and conversational — background only',
        dinner_style: 'Light acoustic or easy jazz',
        dinner_live_or_recorded: 'Recorded — DJ or curated playlist is completely fine',
        dinner_energy_shift: 'Gradual build toward speeches',
        song_question: 'Norah Jones, Corinne Bailey Rae, Jack Johnson, Diana Krall',
      },
      speeches: {
        speeches_count: '4 speeches',
        speeches_intro_songs: 'No specific intro songs',
        speeches_between: 'Very quiet between speakers',
        speeches_outro: 'Build from last speech into first dance',
      },
      firstDance: {
        firstdance_song: 'Ben Harper — Steal My Kisses',
        firstdance_room_feeling: 'Warm and joyful — smiling and swaying',
        firstdance_live_or_recorded: 'Recorded — we want the original',
        firstdance_additional: 'No additional dances',
        firstdance_transition: 'Straight into dancing after',
        song_question: 'Ben Harper — Steal My Kisses, Jack Johnson — Better Together',
      },
      dancing: {
        dancing_energy_arc: 'Build steadily — not too early a peak',
        dancing_guest_mix: 'Mix of ages — mostly 30s but parents matter',
        dancing_avoid: 'Nothing too heavy or aggressive',
        dancing_peak_moment: 'Around midnight when older guests have left',
        dancing_wind_down: 'Yes — end on something meaningful',
        song_question: 'Mark Ronson, Pharrell, 80s classics, Taylor Swift — Shake It Off',
      },
      lastSong: {
        lastsong_song: 'Something everyone knows — an anthem',
        lastsong_energy: 'End big — everyone on the floor',
        lastsong_instruction: 'Announce the last song so people know to get up',
        song_question: "Don't Stop Believin, Mr Brightside, Livin on a Prayer",
      },
    },
  },

  s2: {
    sessionId: 'test-s2-emma-tom',
    coupleName: 'Emma & Tom',
    portrait:
      "Emma and Tom know exactly who they are. Their music lives in the folk-acoustic world — Mumford, Fleet Foxes, Bon Iver — and their farm venue is an extension of that identity. The outdoor setting is central to their vision and a significant practical consideration for everything acoustic.",
    milIntake: {
      budget: 'R65 000',
      existingBookings: 'None',
    },
    sessionAnswers: {
      three_words: 'Natural, relaxed, real',
      driving_home: 'Like the best, most grounded version of themselves',
      home_listening: 'Mumford & Sons, The Lumineers, Fleet Foxes, Bon Iver, Iron & Wine',
      guilty_pleasure: 'ABBA — full commitment',
      musical_confidence: 'moderate',
      crowd_vs_taste: 'Balance — our friends will follow',
      live_vs_recorded: 'Strongly prefer live',
      guest_count: '51_120',
      venue_type: 'farm_bush',
    },
    momentAnswers: {
      guestArrivals: {
        arrivals_attention: 'Something acoustic and natural — like it grew from the landscape',
        arrivals_style: 'Folk acoustic, guitar-led, warm and unhurried',
        arrivals_logistics: 'Outdoor under mature trees, 75 minutes',
        song_question:
          'Mumford & Sons — After The Storm, The Lumineers — Ho Hey, Iron & Wine — Flightless Bird, Fleet Foxes — Helplessness Blues',
      },
      ceremony: {
        ceremony_structure: 'Non-religious civil ceremony',
        ceremony_faith: 'None',
        processional_song: 'Fleet Foxes — White Winter Hymnal',
        processional_tone: 'Natural, understated, moving',
        signing_music: 'Something quiet and instrumental',
        recessional_song: 'Upbeat — Mumford & Sons energy',
        ceremony_format: 'Live musicians — it matters to us',
        song_question:
          'Fleet Foxes — White Winter Hymnal, Mumford & Sons — The Cave, Bon Iver — Holocene',
      },
      predrinks: {
        predrinks_impact: 'Atmosphere — present but not demanding attention',
        predrinks_energy_shift: 'No — consistent energy',
        predrinks_cultural: 'No',
        song_question: 'The Lumineers, Bon Iver, Iron & Wine, Novo Amor',
      },
      entrance: {
        entrance_style: 'Intimate and surprising — not announced',
        entrance_transition: 'Yes — outdoor to barn',
        entrance_live_musicians: 'No — recorded music',
        song_question: 'The Lumineers — Stubborn Love',
      },
      dinner: {
        dinner_atmosphere: 'Relaxed, rustic, long dinner with close friends',
        dinner_style: 'Folk acoustic or fingerstyle guitar',
        dinner_live_or_recorded: 'Live musicians — it matters to us',
        dinner_energy_shift: 'Stay consistent and warm',
        song_question: 'Bon Iver, Sufjan Stevens, Fleet Foxes, Iron & Wine',
      },
      speeches: {
        speeches_count: '3 speeches',
        speeches_intro_songs: 'No — just start them directly',
        speeches_between: 'Brief silence — let the emotion sit',
        speeches_outro: 'Build gently into first dance',
      },
      firstDance: {
        firstdance_song: 'Iron & Wine — Flightless Bird, American Mouth',
        firstdance_room_feeling: 'Intimate — room goes quiet',
        firstdance_live_or_recorded: 'Recorded — the original only',
        firstdance_additional: 'No',
        firstdance_transition: 'Open the floor after — let it breathe',
        song_question: 'Iron & Wine — Flightless Bird, Bon Iver — Skinny Love',
      },
      dancing: {
        dancing_energy_arc: 'Start gentle, build through the night',
        dancing_guest_mix: 'Mostly late 20s early 30s',
        dancing_avoid: 'Nothing cheesy — no Cha Cha Slide',
        dancing_peak_moment: 'Natural peak when crowd dictates',
        dancing_wind_down: 'Yes — end meaningful not just loud',
        song_question:
          "Mumford & Sons — Little Lion Man, The Killers — Mr Brightside, LCD Soundsystem, Oasis",
      },
      lastSong: {
        lastsong_song: 'Something everyone has a memory attached to',
        lastsong_energy: 'Big sing-along ending',
        lastsong_instruction: "Make sure everyone knows it's the last one",
        song_question: "Don't Look Back In Anger, Mr Brightside, Closing Time",
      },
    },
  },

  s3: {
    sessionId: 'test-s3-charlotte-james',
    coupleName: 'Charlotte & James',
    portrait:
      "Charlotte and James have exacting taste — contemporary classical, post-rock, and the kind of refinement that only comes from genuinely loving the music. Their wedding needs to feel like a piece of music itself: structured, considered, building to something.",
    milIntake: {
      budget: 'R120 000',
      existingBookings: 'String quartet already booked for ceremony',
    },
    sessionAnswers: {
      three_words: 'Elegant, timeless, personal',
      driving_home: 'Moved by the music — slightly overwhelmed in the best possible way',
      home_listening: 'Max Richter, Ludovico Einaudi, Radiohead, Nick Cave, Nils Frahm',
      guilty_pleasure: '90s pop — Spice Girls, Backstreet Boys',
      musical_confidence: 'very confident — music is central to our lives',
      crowd_vs_taste: 'Our taste drives everything',
      live_vs_recorded: 'Strongly prefer live — imperfection and presence',
      guest_count: '51_120',
      venue_type: 'wine_estate',
    },
    momentAnswers: {
      guestArrivals: {
        arrivals_attention: 'An arrival experience — not just background',
        arrivals_style: 'String quartet or classical piano — contemporary not traditional',
        arrivals_logistics: 'Indoor estate chapel entrance, about 60 minutes',
        song_question:
          'Max Richter — On The Nature Of Daylight, Einaudi — Experience, Radiohead — Creep arranged for strings, Nils Frahm — Says',
      },
      ceremony: {
        ceremony_structure: 'Non-religious civil ceremony',
        ceremony_faith: 'None',
        processional_song: 'Max Richter — On The Nature Of Daylight',
        processional_tone: 'Cinematic, emotional, not theatrical',
        signing_music: 'Einaudi — Experience',
        recessional_song: 'Ólafur Arnalds — Near Light, joyful',
        ceremony_format: 'Live — string ensemble',
        song_question:
          'Max Richter — On The Nature Of Daylight, Einaudi — Experience, Ólafur Arnalds — Near Light',
      },
      predrinks: {
        predrinks_impact: 'Deliberate shift from ceremony — something more alive',
        predrinks_energy_shift: 'Yes — from ceremony intimacy to contemporary energy',
        predrinks_cultural: 'No',
        song_question: 'Nick Cave, Radiohead, Sufjan Stevens, The National',
      },
      entrance: {
        entrance_style: 'Grand and announced — a scene change',
        entrance_transition: 'No — everyone already seated',
        entrance_live_musicians: 'Tell me what works',
        song_question: 'Hans Zimmer — Time',
      },
      dinner: {
        dinner_atmosphere: 'Sophisticated and warm — centrepiece of the evening',
        dinner_style: 'Jazz standards or contemporary classical',
        dinner_live_or_recorded: 'Live musicians',
        dinner_energy_shift: 'Stay elegant — speeches feel like part of the evening',
        song_question:
          'Nick Cave — Into My Arms, Radiohead — The Bends, Sufjan Stevens — Death With Dignity',
      },
      speeches: {
        speeches_count: '2 speeches',
        speeches_intro_songs: 'No — keep it formal',
        speeches_between: 'Silence — let it breathe',
        speeches_outro: 'Transition to first dance',
      },
      firstDance: {
        firstdance_song: 'Nick Cave — Into My Arms',
        firstdance_room_feeling: 'Romantic and intimate — whole room holds its breath',
        firstdance_live_or_recorded: 'Recorded — original only',
        firstdance_additional: 'No',
        firstdance_transition: 'Open the floor with a DJ takeover',
        song_question: 'Nick Cave — Into My Arms',
      },
      dancing: {
        dancing_energy_arc: 'Sophisticated build — never loses refined feel',
        dancing_guest_mix: 'Friends in 30s and 40s, some older family',
        dancing_avoid: 'Nothing commercial or current pop',
        dancing_peak_moment: 'Radiohead or Arcade Fire as peak',
        dancing_wind_down: 'No wind-down — end at energy',
        song_question:
          'Radiohead — Karma Police, LCD Soundsystem — All My Friends, Arcade Fire — Wake Up',
      },
      lastSong: {
        lastsong_song: 'Arcade Fire — Wake Up',
        lastsong_energy: 'Full room — a declaration not a goodbye',
        lastsong_instruction: 'Announce it by name before it drops',
        song_question:
          'Arcade Fire — Wake Up, Radiohead — Karma Police, LCD Soundsystem — All My Friends',
      },
    },
  },

  s4: {
    sessionId: 'test-s4-thabo-priya',
    coupleName: 'Thabo & Priya',
    portrait:
      "Thabo and Priya have deeply personal, intimate taste — but their guest count and venue create a real tension the MIL must surface honestly. A solo acoustic guitarist cannot hold a hotel ballroom with 280 people. The MIL's job here is to honour their taste while being honest about what the room requires.",
    milIntake: {
      budget: 'R95 000',
      existingBookings: 'None',
    },
    sessionAnswers: {
      three_words: 'Intimate, soulful, ours',
      driving_home: 'Like they witnessed something true and beautiful',
      home_listening: 'Bon Iver, Nick Drake, Sufjan Stevens, Iron & Wine',
      guilty_pleasure: "Destiny's Child — full choreography in the kitchen",
      musical_confidence: 'moderate — we feel it more than we can name it',
      crowd_vs_taste: 'Our taste first — guests will trust us',
      live_vs_recorded: 'Live always if possible',
      guest_count: '221_300',
      venue_type: 'hotel_venue',
    },
    momentAnswers: {
      guestArrivals: {
        arrivals_attention: 'Something gentle and intimate — like a soft welcome',
        arrivals_style: 'Solo acoustic guitar or piano — nothing too big',
        arrivals_logistics: 'Large hotel ballroom, 280 guests, 45 minutes',
        song_question:
          'Bon Iver — Skinny Love, Nick Drake — Pink Moon, Sufjan Stevens — Death With Dignity, Iron & Wine — Naked As We Came',
      },
      ceremony: {
        ceremony_structure: 'Non-religious civil ceremony',
        ceremony_faith: 'None',
        processional_song: 'Bon Iver — Skinny Love',
        processional_tone: 'Raw and intimate — like a held breath',
        signing_music: 'Nick Drake — Pink Moon instrumental',
        recessional_song: 'Something gentle but with lift',
        ceremony_format: 'Prefer live',
        song_question:
          'Bon Iver — Skinny Love, Nick Drake — Pink Moon, Sufjan Stevens — Casimir Pulaski Day',
      },
      predrinks: {
        predrinks_impact: 'Soft and present — not demanding',
        predrinks_energy_shift: 'No — keep it consistent',
        predrinks_cultural: 'Priya has some Hindu family — respectful of that',
        song_question: 'Iron & Wine, Bon Iver, Novo Amor, Gregory Alan Isakov',
      },
      entrance: {
        entrance_style: 'Quiet — not theatrical',
        entrance_transition: 'No transition needed',
        entrance_live_musicians: 'Not specifically',
        song_question: 'Sufjan Stevens — Mystery of Love',
      },
      dinner: {
        dinner_atmosphere: 'Intimate and conversational — like a dinner party',
        dinner_style: 'Solo acoustic or minimal folk',
        dinner_live_or_recorded: 'Live if possible',
        dinner_energy_shift: 'Gentle lift toward speeches',
        song_question: 'Gregory Alan Isakov, Fleet Foxes, The Paper Kites, Novo Amor',
      },
      speeches: {
        speeches_count: '3 speeches',
        speeches_intro_songs: 'No',
        speeches_between: 'Silence is fine',
        speeches_outro: 'Gentle into first dance',
      },
      firstDance: {
        firstdance_song: 'Bon Iver — Skinny Love',
        firstdance_room_feeling: 'Private in public — the room disappears',
        firstdance_live_or_recorded: 'Recorded — we want that version',
        firstdance_additional: 'No',
        firstdance_transition: 'Open floor quietly',
        song_question: 'Bon Iver — Skinny Love',
      },
      dancing: {
        dancing_energy_arc: 'Slow build — never forced',
        dancing_guest_mix: 'Very mixed — Indian family, South African friends, 20s through 70s',
        dancing_avoid: 'Nothing aggressive or electronic',
        dancing_peak_moment: 'Whatever feels natural',
        dancing_wind_down: 'Yes — something meaningful to close',
        song_question: "Destiny's Child — Survivor, Beyoncé — Crazy in Love, Bon Iver, Fleet Foxes",
      },
      lastSong: {
        lastsong_song: 'Something that brings everyone together',
        lastsong_energy: 'Full room but not frantic',
        lastsong_instruction: 'Announce it',
        song_question: 'Bon Iver — Holocene, Fleet Foxes — White Winter Hymnal',
      },
    },
  },

  s5: {
    sessionId: 'test-s5-naledi-david',
    coupleName: 'Naledi & David',
    portrait:
      "Naledi and David are the maximum-expression test case: full budget, full ambition, deeply South African identity, multigenerational and multicultural guest list. Their vision is genuinely complex — marimba arrivals, choir ceremony, jazz dinner, live band into DJ. The production check coherence test is the primary target.",
    milIntake: {
      budget: 'R110 000',
      existingBookings: 'Cantor already booked',
    },
    sessionAnswers: {
      three_words: 'Opulent, joyful, African',
      driving_home:
        'Feeling like royalty surrounded by everyone they love — deeply South African',
      home_listening:
        'Freshlyground, Asa, Hugh Masekela, Miriam Makeba, Black Coffee, Nomcebo Zikode',
      guilty_pleasure: "Early 2000s Britney and Destiny's Child — the full works",
      musical_confidence: 'very confident — music is central to who we are',
      crowd_vs_taste:
        'Balance — our taste anchors it but every generation on the floor',
      live_vs_recorded: 'All live if we can',
      guest_count: '121_220',
      venue_type: 'wine_estate',
    },
    momentAnswers: {
      guestArrivals: {
        arrivals_attention:
          'Live marimba or African percussion — distinctly South African from the first second',
        arrivals_style: 'Marimba or mbira ensemble — joyful, welcoming',
        arrivals_logistics: 'Outdoor estate terrace, 150 guests, 90-minute arrival',
        song_question:
          'Miriam Makeba — Pata Pata, Freshlyground — Nomvula, Hugh Masekela — Stimela, Ladysmith Black Mambazo — Homeless',
      },
      ceremony: {
        ceremony_structure: 'Cultural and traditional elements alongside civil ceremony',
        ceremony_faith: 'African traditional — lobola paid, family rituals observed',
        processional_song: 'A live choir processional — overwhelming',
        processional_tone: 'Joyful and celebratory — not solemn',
        signing_music: 'Asa — Beautiful Imperfection',
        recessional_song: 'Full choir recessional — happy tears',
        ceremony_format: 'All live — choir, marimba, everything',
        song_question:
          'Asa — Beautiful Imperfection, Miriam Makeba — Pata Pata, traditional Zulu wedding song, Ladysmith Black Mambazo',
      },
      predrinks: {
        predrinks_impact: 'Something they will talk about for years',
        predrinks_energy_shift: 'Yes — ceremony atmosphere to reception energy',
        predrinks_cultural:
          'Yes — international guests must experience something genuinely South African',
        song_question: 'Hugh Masekela — Grazing in the Grass, Freshlyground, Fela Kuti, Simphiwe Dana',
      },
      entrance: {
        entrance_style: 'Grand — a major production moment',
        entrance_transition: 'Yes — outdoor to estate hall',
        entrance_live_musicians:
          'Yes — live percussion leading us in, drummers through the crowd',
        song_question: 'Black Coffee — Drive, live drum ensemble build',
      },
      dinner: {
        dinner_atmosphere:
          'Celebratory and sophisticated — high energy, not quiet background',
        dinner_style: 'Live jazz with SA and African influences',
        dinner_live_or_recorded: 'Live musicians — all of dinner',
        dinner_energy_shift:
          'Build confidently toward speeches — a performance not background',
        song_question: 'Asa — Be My Man, Freshlyground, Simphiwe Dana, Somi',
      },
      speeches: {
        speeches_count: '6 speeches',
        speeches_intro_songs: 'Yes — each speaker has their own intro song',
        speeches_between: 'DJ manages transitions',
        speeches_outro: 'Build directly into first dance',
      },
      firstDance: {
        firstdance_song: 'Asa — Be My Man',
        firstdance_room_feeling: 'Everyone stops and watches — full room moment',
        firstdance_live_or_recorded: 'Live — jazz band plays it',
        firstdance_additional: 'Yes — parent dances immediately after',
        firstdance_transition: 'Band continues into first dancing set',
        song_question: 'Asa — Be My Man, Freshlyground — Pot of Gold',
      },
      dancing: {
        dancing_energy_arc: 'Band 60–90 min live then DJ takeover',
        dancing_guest_mix: 'Everyone on the floor — floor must never be empty',
        dancing_avoid: 'No Afrikaans music whatsoever',
        dancing_peak_moment: 'DJ takeover from band — feels like an event',
        dancing_wind_down: 'No wind-down — end at full energy hard stop',
        song_question:
          "Beyoncé — Crazy in Love, Rihanna — We Found Love, Black Coffee — Superman, Ami Faku — Into You, Amapiano closer",
      },
      lastSong: {
        lastsong_song:
          'South African pride — a song everyone in the room knows and claims',
        lastsong_energy: 'Full energy — no one sitting for the last song',
        lastsong_instruction: 'DJ announces 30 seconds before it drops',
        song_question:
          'Black Coffee — Superman, Nomcebo Zikode — Xola Moya Wam, DJ Maphorisa — Izolo',
      },
    },
  },
}
