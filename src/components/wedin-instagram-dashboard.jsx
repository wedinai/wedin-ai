import { useState, useEffect, useCallback } from "react";

// ─── SCHEDULE DATA ────────────────────────────────────────────────────────────
// Anchored to launch Monday. Change LAUNCH_DATE to shift the whole arc.
const LAUNCH_DATE = new Date("2026-05-25"); // Monday Week 1

function getScheduledDate(weekIndex, dayOfWeek) {
  // dayOfWeek: 1=Mon, 3=Wed, 4=Thu, 5=Fri
  const d = new Date(LAUNCH_DATE);
  d.setDate(LAUNCH_DATE.getDate() + weekIndex * 7 + (dayOfWeek - 1));
  return d;
}

const WEEKS = [
  {
    week: 1,
    theme: "Plant the Stakes",
    posts: [
      {
        day: 1, // Monday
        type: "Hero Carousel",
        concept: "The moment music made your wedding real",
        slides: [
          "Slide 1: 'There's a moment at every wedding…'",
          "Slide 2: '…when the music starts and everyone understands exactly what kind of love this is.'",
          "Slide 3: 'Not background noise. Not a playlist someone cobbled together.'",
          "Slide 4: 'A score. Written for you.'",
          "Slide 5: 'wedin.ai builds it in 15 minutes.'",
          "Slide 6: CTA — wedin.ai — Start free →",
        ],
        caption: `There's a moment at every wedding when the music starts and everyone understands exactly what kind of love this is.

Not background noise. Not a Spotify playlist someone cobbled together at midnight.

A score. Written for your specific story.

wedin.ai builds it in 15 minutes — Entrance. First Dance. Reception arc. Ceremony close. 80 songs, placed precisely.

Link in bio. Start free.

#WeddingSouth Africa #WeddingMusic #WeddingPlanning #WeddingDay #SouthAfricanWedding #BrideAndGroom #WeddingInspiration #WeddingPlaylist #FirstDance #WeddingDJ #WeddingBand #WeddingMoments`,
        imagePrompt: `Cinematic close-up: a DJ's hands hovering over CDJ decks, soft bokeh of fairy lights behind them. Mood: anticipation, artistry, the second before the first note. Color grade: warm cream-to-amber tones. No text overlay needed — pure atmosphere. Shot could double as a luxury music venue photo.`,
        canva: `Format: Instagram Carousel (1080x1080px each slide)
Slide 1–5: Navy (#1C2B3A) background, Cormorant Garamond 48pt in cream (#FAF7F2), centered. Single sentence per slide. No images — pure typography.
Slide 6: Split: left half navy with wordmark "wedin.ai" in gold (#C4922A), right half cream with "Start free →" in navy. Minimal, editorial.`,
        hashtags: "#WeddingSouthAfrica #WeddingMusic #WeddingPlanning #WeddingDay #SouthAfricanWedding #BrideAndGroom #WeddingInspiration #WeddingPlaylist #FirstDance #WeddingDJ",
      },
      {
        day: 3, // Wednesday
        type: "Single Image",
        concept: "The problem: most couples have no music plan until 6 weeks out",
        slides: [
          "Single frame: bold stat — '67% of couples only start planning wedding music 6 weeks before. wedin.ai: 15 minutes, sorted.'",
        ],
        caption: `Most couples start planning wedding music 6 weeks before the day.

Their DJ gets a 3-page brief with 40 song requests and no context.

Chaos, politely.

wedin.ai gives your music team a complete brief: 80 curated tracks, scene-by-scene timing, mood logic, and a Spotify playlist — all from one 15-minute session.

You arrive at your first DJ meeting with something actually useful.

Link in bio.

#WeddingPlanning #WeddingMusicSA #SouthAfricanBride #WeddingTips #WeddingDJ #WeddingBand #WeddingChecklist #BridalPrep #WeddingOrganisation`,
        imagePrompt: `Clean, editorial graphic: large Cormorant Garamond numeral "6" in gold on cream background, with "weeks" in small DM Sans below. Bottom third: "Most couples only start planning wedding music this close to the day." Feels like a magazine pull-quote. High contrast, no clutter.`,
        canva: `Format: Single 1080x1080px
Background: Cream (#FAF7F2)
Large "6" numeral: Cormorant Garamond 200pt, gold (#C4922A), centered upper half
"weeks" below in DM Sans 24pt, navy (#1C2B3A)
Divider line in gold, thin
Bottom copy: "Most couples only start planning wedding music this close to the day." DM Sans 18pt, navy, centered
Small wedin.ai wordmark bottom right in gold`,
        hashtags: "#WeddingPlanning #WeddingMusicSA #SouthAfricanBride #WeddingTips #WeddingDJ #WeddingBand #WeddingChecklist #BridalPrep",
      },
    ],
    stories: [
      "Poll: How far out did you / do you plan to plan your wedding music? (6+ months / 3–6 months / 6 weeks or less / What plan?)",
      "Question box: 'What's the one song that absolutely has to play at your wedding? Drop it below 👇'",
    ],
    storyPoll: "How far out did you start planning wedding music?",
    thursdayTip: "Thursday Tip: Send your DJ a scene-by-scene brief, not just a song list. Tell them the mood you want at arrival, during dinner, and when the floor opens. Three sentences per scene = better music.",
  },
  {
    week: 2,
    theme: "The Ceremony Moment",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "The ceremony entrance — the most emotionally loaded 90 seconds of the day",
        slides: [
          "Slide 1: 'The ceremony entrance is 90 seconds.'",
          "Slide 2: 'Your guests are standing. Your partner is watching. Everyone is holding their breath.'",
          "Slide 3: 'The wrong song turns it into someone else's wedding.'",
          "Slide 4: 'The right song turns it into a story that lives forever.'",
          "Slide 5: 'wedin.ai helps you find that song.'",
          "Slide 6: CTA — 'Build your music plan at wedin.ai →'",
        ],
        caption: `The ceremony entrance is 90 seconds.

Your guests are standing. Your partner is watching the door. Everyone is holding their breath.

The wrong song turns it into someone else's wedding.

The right song turns it into a story that lives forever.

wedin.ai asks you about your relationship, your taste, and your moment — then builds a complete music plan that includes exactly this: the entrance song, the processional, the signing, the recessional.

All of it, placed correctly. A Spotify playlist included.

Link in bio.

#WeddingCeremony #CeremonyMusic #WeddingEntrance #ProcessionalSong #WeddingMoment #SouthAfricanWedding #WeddingMusic #WeddingPlanning #BridalWalk #HereComesTheBride`,
        imagePrompt: `Cinematic: looking down a flower-lined aisle from above, guests standing on both sides, sunlight streaming through. The aisle is empty — we're in the moment just before the entrance. Mood: suspended time, anticipation, the held breath. Golden hour, South African bush or estate setting. Editorial, emotional.`,
        canva: `Format: Instagram Carousel (1080x1080px)
Slides 1–5: Deep navy (#1C2B3A) background. Cormorant Garamond Italic 44pt, cream (#FAF7F2). One sentence per slide — lines feel like poetry. Small gold (#C4922A) dot as slide indicator bottom center.
Slide 6: Cream background. "wedin.ai" wordmark in gold, large centered. "Build your music plan →" in navy DM Sans 20pt below. Minimal, premium.`,
        hashtags: "#WeddingCeremony #CeremonyMusic #WeddingEntrance #ProcessionalSong #WeddingMoment #SouthAfricanWedding #WeddingMusic #WeddingPlanning",
      },
      {
        day: 3,
        type: "Single Image",
        concept: "The signing moment — most overlooked scene in ceremony music planning",
        slides: [
          "Single image: 'Nobody plans music for the register signing. It's 4 minutes of acoustic awkwardness. Unless you do this →'",
        ],
        caption: `Nobody plans music for the register signing.

It's 4 minutes. Everyone's watching. There's nowhere to hide.

It usually lands as acoustic awkwardness — a cover version playing too quietly while people look at each other.

wedin.ai includes the signing scene specifically. We ask what the moment should feel like: intimate and quiet, joyful and loose, or something in between. Then we suggest 3 tracks that hold the room without crowding it.

Most couples have never thought about this until we ask.

Link in bio.

#WeddingCeremony #RegisterSigning #WeddingMoment #CeremonyMusic #WeddingTips #SouthAfricanWedding #WeddingPlanning #WeddingMusicSA #BridalInspo`,
        imagePrompt: `Close-up hands signing a marriage register on a beautifully set table — rings visible, fresh flowers alongside the register. Soft, diffused natural light. Mood: quiet intimacy, significance in the small gesture. No harsh shadows. Film-style color grade — warm, analog feel.`,
        canva: `Format: Single 1080x1080px
Background: cream (#FAF7F2)
Upper two-thirds: black-and-white photography of hands signing register (high-end editorial feel)
Lower third: cream bar with text in navy Cormorant Garamond Italic 28pt: "Nobody plans music for the register signing."
Sub-line in DM Sans 16pt grey: "wedin.ai does."
wedin.ai wordmark small, bottom right, gold`,
        hashtags: "#WeddingCeremony #RegisterSigning #WeddingMoment #CeremonyMusic #WeddingTips #SouthAfricanWedding #WeddingPlanning",
      },
    ],
    stories: [
      "Poll: Did you / have you planned specific music for the register signing? (Yes, it's sorted / No, I hadn't thought about it / What's a register signing?)",
      "Swipe-up teaser: 'The 5 ceremony scenes most couples forget to plan music for — see them all at wedin.ai'",
    ],
    storyPoll: "Did you plan specific music for the register signing?",
    thursdayTip: "Thursday Tip: Your ceremony has at least 5 distinct music moments — prelude, processional, signing, interlude, recessional. Each has a different emotional job. Don't treat them all the same.",
  },
  {
    week: 3,
    theme: "The First Dance",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "Why the first dance song is the hardest decision in wedding planning",
        slides: [
          "Slide 1: 'The first dance song is the hardest decision in wedding planning.'",
          "Slide 2: 'Every song means something to someone else first.'",
          "Slide 3: 'You need a song that's yours — not your parents', not your friends', not the algorithm's.'",
          "Slide 4: 'wedin.ai asks the right questions to find it.'",
          "Slide 5: 'How do you want to feel on that floor? Tell us that. We'll find the song.'",
          "Slide 6: CTA — wedin.ai — Build your music plan",
        ],
        caption: `The first dance song is the hardest decision in wedding planning.

Every obvious choice means something to someone else first. Ed Sheeran is your aunt's favourite. "At Last" is every wedding you've ever been to. "Can't Help Falling in Love" is beautiful and also absolutely everywhere.

You need a song that's yours.

wedin.ai asks how you want to feel on that floor — not what song you like. Nervous and sweetly vulnerable? Completely at ease? Joyful and a bit silly? Those feelings point to different songs.

We find the song from there.

Link in bio.

#FirstDance #FirstDanceSong #WeddingMusic #WeddingPlanning #SouthAfricanWedding #WeddingMoment #WeddingDay #BrideAndGroom #WeddingInspo #FirstDanceIdeas`,
        imagePrompt: `Couple mid-first dance — slightly out of focus, fairy lights bokeh behind them, shot through other guests. One partner is laughing, the other is looking at them like they're the only person in the room. Candid, not posed. South African reception venue — estate or wine farm. Magic hour light filtering through. This is the actual moment, not a rehearsed pose.`,
        canva: `Format: Instagram Carousel (1080x1080px)
Slides 1–5: Alternating — navy slides with cream Cormorant Garamond Italic copy, cream slides with navy copy. Creates visual rhythm.
Each slide: one punchy line, typographically centered. Gold (#C4922A) thin horizontal rule above and below text.
Slide 6: "wedin.ai" wordmark large in gold on cream. "Find your first dance song →" DM Sans below in navy.`,
        hashtags: "#FirstDance #FirstDanceSong #WeddingMusic #WeddingPlanning #SouthAfricanWedding #WeddingMoment #WeddingDay #BrideAndGroom #WeddingInspo",
      },
      {
        day: 3,
        type: "Product Reveal",
        concept: "Show the actual wedin.ai output — the music brief",
        slides: [
          "Slide 1: 'This is what wedin.ai actually produces.'",
          "Slide 2: Screenshot/mockup of the wedin.ai music portrait output",
          "Slide 3: Screenshot/mockup of the scene-by-scene brief",
          "Slide 4: Screenshot/mockup of the Spotify playlist",
          "Slide 5: '15 minutes. 80 songs. Every scene, covered.'",
          "Slide 6: CTA → wedin.ai",
        ],
        caption: `This is what wedin.ai actually produces.

Not a generic playlist. Not 10 suggestions and good luck.

A complete music portrait: your relationship's story translated into sound. Scene-by-scene. Entrance, ceremony, signing, reception arcs, last song.

80 curated songs. Placed exactly where they belong. A Spotify playlist you can hand directly to your DJ.

You fill in 15 minutes of questions. We build the plan.

Link in bio — try it free.

#WeddingMusic #WeddingPlanning #WeddingMusicPlan #WeddingDJ #WeddingPlaylist #SpotifyPlaylist #SouthAfricanWedding #WeddingBrief #WeddingTech #WeddingInspiration`,
        imagePrompt: `Clean product mockup: laptop or tablet on a marble surface showing the wedin.ai interface — the music portrait output page. Soft natural light from the side. Fresh flowers in the foreground, slightly out of focus. No clutter. Feels like a premium wedding service brochure. Brand colors visible on screen.`,
        canva: `Format: Instagram Carousel (1080x1080px)
Slide 1: Navy background, "This is what wedin.ai actually produces." Cormorant Garamond Italic 38pt cream, centered.
Slides 2–4: White/cream background, clean product UI screenshots with subtle drop shadow. Minimal framing — let the product speak.
Slide 5: Cream background, bold stat: "15 minutes." large gold Cormorant. "80 songs. Every scene, covered." navy DM Sans below.
Slide 6: Standard CTA slide — gold wordmark on cream.`,
        hashtags: "#WeddingMusic #WeddingPlanning #WeddingMusicPlan #WeddingDJ #WeddingPlaylist #SpotifyPlaylist #SouthAfricanWedding #WeddingBrief #WeddingTech",
      },
    ],
    stories: [
      "Interactive: 'Tell us your first dance song' question box — screenshot and share the best answers in Stories",
      "Poll: 'How are you choosing your first dance song?' (We already know / Still deciding / We're doing something non-traditional / What's a first dance?)",
    ],
    storyPoll: "How did you choose your first dance song?",
    thursdayTip: "Thursday Tip: Ask your DJ to fade the first dance song at the 2:30 mark — most couples run out of material at 90 seconds and it gets awkward. A clean 2:30 fade feels intentional and keeps the energy.",
  },
  {
    week: 4,
    theme: "The Reception Arc",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "The reception floor is a 4-hour arc — most couples treat it like a playlist",
        slides: [
          "Slide 1: 'Your reception floor is a 4-hour arc.'",
          "Slide 2: 'Hour 1: guests are eating, finding each other, warming up.'",
          "Slide 3: 'Hour 2: the floor cracks open. The right song at the right moment does this.'",
          "Slide 4: 'Hour 3: peak. Everyone who's going to dance is dancing.'",
          "Slide 5: 'Hour 4: the close. How you end matters more than you think.'",
          "Slide 6: 'wedin.ai plans all four hours. Not just the obvious ones.'",
        ],
        caption: `Your reception floor is a 4-hour arc.

Most couples hand their DJ a song list and hope for the best. The DJ does their best. But without knowing your crowd, your family dynamics, your "do not play under any circumstances" songs — it's guesswork.

wedin.ai helps you map the arc:
→ The dinner scene: ambient and conversation-friendly
→ The floor-opener: the exact moment and song that cracks it open
→ The peak hour: high energy, crowd reads correctly
→ The last song: something people carry home

Four distinct jobs. Four distinct song sets. Your DJ will know exactly what to do.

Link in bio.

#WeddingReception #ReceptionMusic #WeddingDanceFloor #WeddingDJ #WeddingPlaylist #WeddingMusic #SouthAfricanWedding #WeddingPlanning #WeddingParty #WeddingNight`,
        imagePrompt: `Wide shot of a full wedding reception dance floor from above — everyone dancing, fairy lights overhead, tables around the edges with guests watching and smiling. Joyful chaos that feels completely intentional. South African venue — possibly a wine farm barn or estate. Warm, golden light. The kind of photo that makes you want to be there.`,
        canva: `Format: Instagram Carousel (1080x1080px)
Slides 1–5: Each slide represents one hour. Navy background with large hour numerals in gold (#C4922A) — "1", "2", "3", "4" — Cormorant Garamond 180pt. Caption text in cream DM Sans 16pt below, describing that hour's mood.
Slide 6: Cream background. "wedin.ai plans all four hours." Cormorant Garamond 36pt navy. Gold CTA bar at bottom.`,
        hashtags: "#WeddingReception #ReceptionMusic #WeddingDanceFloor #WeddingDJ #WeddingPlaylist #WeddingMusic #SouthAfricanWedding #WeddingPlanning #WeddingParty",
      },
      {
        day: 3,
        type: "Single Image",
        concept: "The 'do not play' list — the most important 5 minutes of DJ prep",
        slides: [
          "Single image: 'The most important 5 minutes of DJ prep: your Do Not Play list. Here's how to build one →'",
        ],
        caption: `The most important 5 minutes of DJ prep.

Not song requests. Not "vibes". Your Do Not Play list.

Here's how to build one:
1. Think of every song that belongs to a complicated chapter
2. Add the ex's "our song"
3. Add the song from the funeral last year
4. Add the song that will cause your uncle to do The Move
5. Add anything your parents requested that you don't want

This list protects the room.

wedin.ai includes a Do Not Play section in every brief. Your DJ gets it before you meet.

Link in bio.

#WeddingDJ #WeddingPlanning #WeddingTips #ReceptionMusic #WeddingMusic #DoNotPlayList #WeddingMoments #SouthAfricanWedding #WeddingHacks #BridalTips`,
        imagePrompt: `Flat lay: a handwritten list on cream paper with "DO NOT PLAY" at the top in confident handwriting, next to a pen and a small sprig of dried florals. Marble surface. Clean, editorial. Warm light from side. Feels actionable and slightly witty — not precious.`,
        canva: `Format: Single 1080x1080px
Background: cream (#FAF7F2)
Centered: large "DO NOT PLAY" in Cormorant Garamond Bold 72pt, navy (#1C2B3A)
Below: thin gold line separator
Five short numbered items in DM Sans 16pt, navy — brief, direct, slightly funny
Bottom: "wedin.ai includes this in every brief." gold italic text
Small wordmark bottom right`,
        hashtags: "#WeddingDJ #WeddingPlanning #WeddingTips #ReceptionMusic #WeddingMusic #DoNotPlayList #WeddingMoments #SouthAfricanWedding #WeddingHacks",
      },
    ],
    stories: [
      "Question box: 'What's on your Do Not Play list? (We won't tell anyone 🤫)'",
      "Countdown sticker: '3 weeks until launch — something big is coming for couples planning their wedding music'",
    ],
    storyPoll: "Do you have a 'Do Not Play' list for your wedding?",
    thursdayTip: "Thursday Tip: Give your DJ the names and descriptions of your key guests — the ones who will definitely dance, the ones who are shy, the ones who need a specific decade. A crowd read before the event is worth 10 track suggestions.",
  },
  {
    week: 5,
    theme: "Music as Identity",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "Your wedding music is the most public statement about who you are as a couple",
        slides: [
          "Slide 1: 'Your wedding music is the most public statement about who you are as a couple.'",
          "Slide 2: 'Your guests will judge it. Not harshly. But they'll notice.'",
          "Slide 3: 'Generic = forgettable. Specific = unforgettable.'",
          "Slide 4: 'The couple who played Khruangbin during dinner. The couple who opened the floor with Toto. The couple whose last song was something nobody expected.'",
          "Slide 5: 'Those couples are remembered differently.'",
          "Slide 6: 'wedin.ai makes your music specific to you.'",
        ],
        caption: `Your wedding music is the most public statement about who you are as a couple.

Your guests will judge it. Not harshly — they love you. But they'll notice.

Generic music produces a generic memory. The wedding with the DJ who played "September" three times. The couple whose first dance felt borrowed from another love story.

Specific music produces a specific memory.

The couple who played something unusual during dinner that made people say "who IS this?" and then Shazam it. The couple whose last song cleared the room weeping.

That's what wedin.ai builds. Not a generic wedding playlist. Your wedding playlist.

Link in bio.

#WeddingMusic #WeddingIdentity #WeddingPersonality #SouthAfricanWedding #WeddingPlanning #WeddingMoment #FirstDance #WeddingVibes #WeddingInspo #UniqueWedding`,
        imagePrompt: `Stylish couple at their reception, not dancing — they're leaning against a wall, laughing at something, looking completely at ease and themselves. Not trying to be wedding-perfect. Behind them: their guests on the dance floor having the best time. The couple look like they're exactly where they should be. Candid, editorial, real.`,
        canva: `Format: Instagram Carousel (1080x1080px)
All slides: black (#0D0D0D) background — different from usual navy, creates impact.
Cormorant Garamond Italic, cream text, 42pt. Short punchy lines. Gold ellipsis (…) as slide connector.
Slide 6: back to navy, cream text. "wedin.ai makes your music specific to you." Large and confident. Gold CTA below.`,
        hashtags: "#WeddingMusic #WeddingIdentity #WeddingPersonality #SouthAfricanWedding #WeddingPlanning #WeddingMoment #FirstDance #WeddingVibes #WeddingInspo #UniqueWedding",
      },
      {
        day: 3,
        type: "Provocation",
        concept: "Controversial take: the DJ isn't the problem. The brief is.",
        slides: [
          "Single image: 'The DJ isn't the problem. The brief is.'",
        ],
        caption: `Controversial opinion: the DJ isn't the problem at most weddings.

The brief is.

Most couples hand over a half-page of bullet points, 20 song names with no context, and a vague request to "read the room."

DJs are good. Most of them are very good. But they cannot read your mind. They cannot know that your dad hates hip-hop, that three people on the floor are going through breakups, that the chorus of that one song is deeply weird for reasons you can't explain in person.

A good brief solves this. Scene by scene. Mood by mood. With context.

wedin.ai produces that brief. Your DJ reads it before you meet. The first conversation is already 10x better.

Link in bio.

#WeddingDJ #WeddingPlanning #WeddingTips #WeddingMusic #WeddingBrief #SouthAfricanWedding #WeddingProfessionals #WeddingVendors #BridalPlanning #WeddingHacks`,
        imagePrompt: `DJ behind their setup, focused — but the visual emphasis is on the printed brief on the table in front of them, covered in notes and highlights. The brief is clearly detailed and well-prepared. Mood: professional, prepared, confident. The DJ looks like they know exactly what they're doing because they've been properly briefed.`,
        canva: `Format: Single 1080x1080px
Bold typographic split composition.
Left half: navy (#1C2B3A). "THE DJ" in Cormorant Garamond 80pt cream. "isn't the problem." DM Sans 22pt cream below.
Right half: gold (#C4922A). "THE BRIEF" in Cormorant Garamond 80pt navy. "is." DM Sans 22pt navy below.
Thin white dividing line center.
Bottom strip: cream, "wedin.ai builds the brief." DM Sans 18pt navy, centered.`,
        hashtags: "#WeddingDJ #WeddingPlanning #WeddingTips #WeddingMusic #WeddingBrief #SouthAfricanWedding #WeddingProfessionals #WeddingVendors #BridalPlanning",
      },
    ],
    stories: [
      "Engagement: 'Drop your most specific music request below — the more unusual the better 👇'",
      "Poll: 'What matters more at a wedding?' (Music / Food / Décor / Open bar)",
    ],
    storyPoll: "What matters most at a wedding? Music / Food / Décor / Open bar",
    thursdayTip: "Thursday Tip: Tell your DJ your absolute favourite song — the one you'd be devastated not to hear. Then tell them when you want it. It should probably be around 10:30pm when the floor is fullest. That's the peak. That's where your song lands best.",
  },
  {
    week: 6,
    theme: "Proof and Invitation",
    posts: [
      {
        day: 1,
        type: "Social Proof",
        concept: "Real couple, real result — the wedin.ai story",
        slides: [
          "Slide 1: 'We built wedin.ai because this kept happening to us.'",
          "Slide 2: 'Couple after couple, arriving at their first DJ meeting with nothing but a list of songs they liked.'",
          "Slide 3: 'The DJ would smile, take the list, and do their absolute best.'",
          "Slide 4: 'But the best DJs we know all said the same thing: give me context, not just tracks.'",
          "Slide 5: 'Context is what wedin.ai builds. For every couple. In 15 minutes.'",
          "Slide 6: CTA — 'Try it free at wedin.ai →'",
        ],
        caption: `We built wedin.ai because this kept happening.

Couple after couple, arriving at their first DJ meeting with nothing but a list of songs they liked. The DJ would smile, take the list, and do their absolute best.

But the best DJs we know all said the same thing: give me context, not just tracks.

Tell me about the moment you want. Tell me who's in the room. Tell me the song that absolutely cannot play. Tell me what you want your guests to feel at 10:30pm.

That context is what makes a DJ great. And most couples never give it to them — not because they don't care, but because nobody ever asked them the right questions.

wedin.ai asks the right questions. For every couple. In 15 minutes.

Try it free — link in bio.

#WeddingMusic #WeddingDJ #WeddingPlanning #SouthAfricanWedding #WeddingTech #WeddingInspiration #WeddingMoment #BrideAndGroom #WeddingDay #WeddingStory`,
        imagePrompt: `Two phones side by side on a marble surface: left phone shows a couple's photo (backs to camera, overlooking a South African landscape — could be Winelands or bush), right phone shows the wedin.ai interface with their music portrait on screen. Warm natural light. The pairing tells a story: real couple, real plan. Editorial product photography feel.`,
        canva: `Format: Instagram Carousel (1080x1080px)
Slide 1: Warm cream background. "We built wedin.ai because this kept happening." Cormorant Garamond Italic 36pt navy. Feels personal, like an open letter.
Slides 2–5: Alternating cream/navy backgrounds. DM Sans body text 18pt. Conversational, like someone talking directly to you.
Slide 6: Navy background. "wedin.ai" wordmark large in gold. "Try it free →" cream DM Sans below. Clean CTA.`,
        hashtags: "#WeddingMusic #WeddingDJ #WeddingPlanning #SouthAfricanWedding #WeddingTech #WeddingInspiration #WeddingMoment #BrideAndGroom #WeddingDay #WeddingStory",
      },
      {
        day: 3,
        type: "Founder Story",
        concept: "Why we built this — the personal story behind wedin.ai",
        slides: [
          "Single image — founder story moment",
        ],
        caption: `Six weeks before our wedding, someone asked us: 'What do you want your guests to feel when they walk into the venue?'

We had no idea how to answer that.

Not because we didn't have feelings about it — we had every feeling about it. We just hadn't been asked to translate them into music yet.

That question changed how we thought about the whole day.

wedin.ai is built around questions like that. Not 'what songs do you like?' but 'what do you want this moment to feel like?'

From feeling to song. That's the job.

If you're planning your wedding music and you'd like a plan that's actually yours — try wedin.ai. It's free to start. Link in bio.

#WeddingMusic #WeddingPlanning #WeddingStory #SouthAfricanWedding #WeddingInspiration #WeddingMoment #WeddingDay #BridalInspo #WeddingVibes #WedinAI`,
        imagePrompt: `Intimate and warm: a single candle lit on a table next to an open notebook with a few lines of handwritten notes about a wedding — song names, feelings, question marks. The scene feels like someone figuring something out. Late evening light. Personal, reflective, slightly romantic. Not staged — the kind of photo that feels like a real moment of planning.`,
        canva: `Format: Single 1080x1080px
Full bleed: warm, moody photography of a candlelit table with planning notes
Overlay: semi-transparent navy bar across the lower third
Text over bar: "Six weeks before our wedding, someone asked us the right question." — Cormorant Garamond Italic 26pt cream
Below: "wedin.ai is built around that question." DM Sans 16pt cream
Bottom right: wedin.ai wordmark in gold`,
        hashtags: "#WeddingMusic #WeddingPlanning #WeddingStory #SouthAfricanWedding #WeddingInspiration #WeddingMoment #WeddingDay #BridalInspo #WeddingVibes #WedinAI",
      },
    ],
    stories: [
      "Final push: 'The 6-week arc is complete — wedin.ai is live. Try it free at the link in bio.'",
      "Testimonial: share first real couple result (screenshot of their portrait, anonymised)",
    ],
    storyPoll: "Have you sorted your wedding music plan yet?",
    thursdayTip: "Thursday Tip: The last song of the night is as important as the first dance. Choose something that sends people home right. It should feel like an ending — full, resolved, memorable. Not a fade-out. A finale.",
  },
];

// ─── SCHEDULE BUILDER ─────────────────────────────────────────────────────────

function buildSchedule() {
  const schedule = [];
  WEEKS.forEach((week, wi) => {
    week.posts.forEach((post) => {
      schedule.push({
        id: `w${wi + 1}-d${post.day}`,
        date: getScheduledDate(wi, post.day),
        week: wi + 1,
        weekTheme: week.theme,
        ...post,
        isStoryTip: false,
      });
    });
    // Thursday Story Tip (day 4 = Thursday)
    schedule.push({
      id: `w${wi + 1}-thu`,
      date: getScheduledDate(wi, 4),
      week: wi + 1,
      weekTheme: week.theme,
      type: "Thursday Tip",
      concept: week.thursdayTip,
      caption: week.thursdayTip,
      slides: [week.thursdayTip],
      imagePrompt: "",
      canva: "",
      hashtags: "#WeddingTips #WeddingMusic #WeddingPlanning #SouthAfricanWedding",
      isStoryTip: true,
    });
  });
  return schedule.sort((a, b) => a.date - b.date);
}

const SCHEDULE = buildSchedule();

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d) {
  return d.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function getWeekLabel(wi) {
  const start = getScheduledDate(wi, 1);
  const end = getScheduledDate(wi, 7);
  return `${start.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}`;
}

// ─── TYPE META ────────────────────────────────────────────────────────────────

const TYPE_META = {
  "Hero Carousel": {
    icon: "◈",
    bg: "bg-[#1C2B3A]",
    text: "text-[#FAF7F2]",
    border: "border-[#1C2B3A]",
  },
  "Single Image": {
    icon: "◉",
    bg: "bg-[#C4922A]",
    text: "text-[#FAF7F2]",
    border: "border-[#C4922A]",
  },
  "Product Reveal": {
    icon: "◎",
    bg: "bg-emerald-700",
    text: "text-white",
    border: "border-emerald-700",
  },
  Provocation: {
    icon: "◈",
    bg: "bg-rose-700",
    text: "text-white",
    border: "border-rose-700",
  },
  "Social Proof": {
    icon: "◉",
    bg: "bg-violet-700",
    text: "text-white",
    border: "border-violet-700",
  },
  "Founder Story": {
    icon: "◎",
    bg: "bg-[#6B6560]",
    text: "text-[#FAF7F2]",
    border: "border-[#6B6560]",
  },
  "Thursday Tip": {
    icon: "✦",
    bg: "bg-amber-600",
    text: "text-white",
    border: "border-amber-600",
  },
};

function getTypeMeta(type) {
  return (
    TYPE_META[type] || {
      icon: "○",
      bg: "bg-gray-400",
      text: "text-white",
      border: "border-gray-400",
    }
  );
}

// ─── STATUS UTILS ─────────────────────────────────────────────────────────────

const STATUS_CYCLE = ["draft", "in progress", "ready", "posted"];
const STATUS_STYLES = {
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
  "in progress": "bg-amber-50 text-amber-700 border border-amber-200",
  ready: "bg-emerald-50 text-emerald-700 border border-emerald-300",
  posted: "bg-[#1C2B3A] text-[#FAF7F2] border border-[#1C2B3A]",
};

const LS_KEY = "wedin-statuses";

function loadStatuses() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded border border-[#C4922A] text-[#C4922A] hover:bg-[#C4922A] hover:text-white transition-colors"
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}

function StatusPill({ id }) {
  const [statuses, setStatuses] = useState(loadStatuses);
  const status = statuses[id] || "draft";
  const cycle = () => {
    const next =
      STATUS_CYCLE[(STATUS_CYCLE.indexOf(status) + 1) % STATUS_CYCLE.length];
    const updated = { ...statuses, [id]: next };
    setStatuses(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };
  return (
    <button
      onClick={cycle}
      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize cursor-pointer transition-all ${STATUS_STYLES[status]}`}
    >
      {status}
    </button>
  );
}

function Section({ title, content, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!content) return null;
  return (
    <div className="border-t border-gray-100 pt-3 mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left text-sm font-semibold text-[#1C2B3A] hover:text-[#C4922A] transition-colors"
      >
        <span>{title}</span>
        <span className="text-gray-400 ml-2">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, isSelected, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const meta = getTypeMeta(task.type);

  return (
    <div
      className={`rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? "border-[#C4922A] shadow-md"
          : "border-gray-200 hover:border-gray-300"
      } bg-white`}
      onClick={() => {
        onClick?.(task);
        setExpanded((e) => !e);
      }}
    >
      {/* Card header */}
      <div className="p-4 flex items-start gap-3">
        <div
          className={`text-base w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.text}`}
        >
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.bg} ${meta.text}`}
            >
              {task.type}
            </span>
            <span className="text-xs text-gray-400">{formatDate(task.date)}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1C2B3A] leading-snug">
            {task.concept}
          </p>
        </div>
        <StatusPill id={task.id} />
      </div>

      {/* Expanded content */}
      {expanded && !task.isStoryTip && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          {/* Slides */}
          {task.slides && task.slides.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Slides / Frame
              </p>
              <ul className="space-y-1">
                {task.slides.map((s, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-[#C4922A] flex-shrink-0">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Caption */}
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Caption
              </p>
              <CopyButton text={task.caption} label="Copy caption" />
            </div>
            <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed line-clamp-6">
              {task.caption}
            </p>
          </div>

          {/* AI Image Prompt */}
          {task.imagePrompt && (
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  AI Image Prompt
                </p>
                <CopyButton text={task.imagePrompt} label="Copy prompt" />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                {task.imagePrompt}
              </p>
            </div>
          )}

          {/* Canva Brief */}
          {task.canva && (
            <Section title="Canva Brief" content={task.canva} />
          )}

          {/* Hashtags */}
          {task.hashtags && (
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Hashtags
                </p>
                <CopyButton text={task.hashtags} label="Copy hashtags" />
              </div>
              <p className="text-xs text-[#1C2B3A] leading-relaxed">
                {task.hashtags}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Thursday Tip expanded */}
      {expanded && task.isStoryTip && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Story Tip Text
            </p>
            <CopyButton text={task.caption} label="Copy tip" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{task.caption}</p>
        </div>
      )}
    </div>
  );
}

// ─── MINI CALENDAR ────────────────────────────────────────────────────────────

function MiniCalendar({ selectedDate, onSelect }) {
  const today = new Date();
  // Show 6 weeks starting from LAUNCH_DATE week
  const calStart = new Date(LAUNCH_DATE);
  calStart.setDate(calStart.getDate() - calStart.getDay() + 1); // Monday of launch week

  const scheduledDates = SCHEDULE.map((t) => t.date);

  const weeks = [];
  let cur = new Date(calStart);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Launch Arc — May 25 to Jul 5
      </p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-xs text-gray-400 font-medium py-1">
            {d}
          </div>
        ))}
        {weeks.flat().map((day, i) => {
          const isScheduled = scheduledDates.some((sd) => isSameDay(sd, day));
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const inArc =
            day >= LAUNCH_DATE && day <= getScheduledDate(5, 7);

          return (
            <button
              key={i}
              onClick={() => isScheduled && onSelect(day)}
              className={`relative text-xs rounded py-1 transition-all ${
                !inArc ? "text-gray-200" : ""
              } ${
                isSelected
                  ? "bg-[#1C2B3A] text-white font-bold"
                  : isToday
                  ? "bg-[#FAF7F2] text-[#C4922A] font-bold ring-1 ring-[#C4922A]"
                  : inArc
                  ? "text-gray-700 hover:bg-gray-100"
                  : ""
              }`}
            >
              {day.getDate()}
              {isScheduled && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C4922A]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── WEEK CARD ────────────────────────────────────────────────────────────────

function WeekCard({ week, tasks, onDayClick }) {
  const statuses = loadStatuses();
  const posted = tasks.filter(
    (t) => (statuses[t.id] || "draft") === "posted"
  ).length;
  const pct = tasks.length ? Math.round((posted / tasks.length) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-[#C4922A] font-semibold uppercase tracking-wide">
            Week {week.week}
          </p>
          <h3 className="text-base font-bold text-[#1C2B3A] mt-0.5">
            {week.theme}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{getWeekLabel(week.week - 1)}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#1C2B3A]">{pct}%</p>
          <p className="text-xs text-gray-400">posted</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-4">
        <div
          className="h-1.5 bg-[#C4922A] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Task pills */}
      <div className="flex flex-wrap gap-2">
        {tasks.map((task) => {
          const meta = getTypeMeta(task.type);
          const status = statuses[task.id] || "draft";
          return (
            <button
              key={task.id}
              onClick={() => onDayClick(task.date)}
              className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-all border ${
                status === "posted"
                  ? "bg-[#1C2B3A] text-[#FAF7F2] border-[#1C2B3A]"
                  : `border-gray-200 text-gray-600 hover:border-[#C4922A] hover:text-[#C4922A]`
              }`}
            >
              <span>{meta.icon}</span>
              <span>{formatDate(task.date)}</span>
            </button>
          );
        })}
      </div>

      {/* Stories reminder */}
      {week.stories && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Stories this week
          </p>
          <ul className="space-y-1">
            {week.stories.map((s, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-[#C4922A]">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function WedinDashboard() {
  const [view, setView] = useState("today"); // today | week | arc
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  // Progress
  const statuses = loadStatuses();
  const postedCount = SCHEDULE.filter(
    (t) => (statuses[t.id] || "draft") === "posted"
  ).length;
  const totalCount = SCHEDULE.length;
  const progressPct = Math.round((postedCount / totalCount) * 100);

  // Tasks for selected day
  const dayTasks = SCHEDULE.filter((t) => isSameDay(t.date, selectedDate));

  // Today's tasks
  const todayTasks = SCHEDULE.filter((t) => isSameDay(t.date, today));

  // Next upcoming
  const upcoming = SCHEDULE.find((t) => t.date >= today);

  const handleDayClick = useCallback((date) => {
    setSelectedDate(date);
    setView("today");
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      {/* Header */}
      <div className="bg-[#1C2B3A] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                wedin.ai Content Arc
              </h1>
              <p className="text-sm text-blue-200 mt-0.5">
                6-week Instagram launch — May 25 to Jul 5, 2026
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#C4922A]">{progressPct}%</p>
              <p className="text-xs text-blue-200">{postedCount}/{totalCount} posted</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-white/10 rounded-full">
            <div
              className="h-1.5 bg-[#C4922A] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Nav */}
          <div className="flex gap-1 mt-5">
            {[
              { key: "today", label: "Today" },
              { key: "week", label: "This Week" },
              { key: "arc", label: "Full Arc" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  view === key
                    ? "bg-[#C4922A] text-white"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ── TODAY VIEW ── */}
        {view === "today" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mini calendar */}
              <div className="md:col-span-1">
                <MiniCalendar
                  selectedDate={selectedDate}
                  onSelect={(d) => setSelectedDate(d)}
                />
                {/* Next up banner */}
                {upcoming && !isSameDay(upcoming.date, today) && (
                  <div className="mt-3 bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold text-[#C4922A] uppercase tracking-wide mb-1">
                      Next post
                    </p>
                    <p className="text-sm font-bold text-[#1C2B3A]">
                      {formatDate(upcoming.date)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{upcoming.concept}</p>
                  </div>
                )}
              </div>

              {/* Day tasks */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#1C2B3A]">
                    {isSameDay(selectedDate, today)
                      ? "Today"
                      : formatDate(selectedDate)}
                  </h2>
                  {dayTasks.length === 0 && (
                    <p className="text-xs text-gray-400">No posts scheduled</p>
                  )}
                </div>

                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isSelected={false}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                    <p className="text-3xl mb-2">📅</p>
                    <p className="text-sm text-gray-500">
                      No posts scheduled for this day.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Gold dots on the calendar mark posting days.
                    </p>
                  </div>
                )}

                {/* Today's stories reminder */}
                {isSameDay(selectedDate, today) && todayTasks.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                      Stories reminder
                    </p>
                    <p className="text-sm text-amber-800">
                      Don't forget to post your Story today — poll or question box to drive engagement on this post.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── WEEK VIEW ── */}
        {view === "week" && (
          <div className="space-y-4">
            {WEEKS.map((week, wi) => {
              const weekTasks = SCHEDULE.filter((t) => t.week === wi + 1);
              return (
                <WeekCard
                  key={wi}
                  week={week}
                  tasks={weekTasks}
                  onDayClick={handleDayClick}
                />
              );
            })}
          </div>
        )}

        {/* ── ARC VIEW ── */}
        {view === "arc" && (
          <div className="space-y-3">
            {SCHEDULE.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={selectedDate && isSameDay(task.date, selectedDate)}
                onClick={(t) => {
                  setSelectedDate(t.date);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
