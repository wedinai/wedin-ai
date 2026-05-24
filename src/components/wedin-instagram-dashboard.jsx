import { useState, useCallback } from "react";

// ─── MASTER STYLE PREFIX ──────────────────────────────────────────────────────
// Prepend this to every AI image prompt before the slide-specific prompt.
export const MASTER_PREFIX =
  "Warm editorial photography aesthetic. Soft directional light, late afternoon warmth. Colour palette: warm cream (#FAF7F2), deep navy (#1C2B3A), single gold accent. Tactile surfaces — linen, white plaster, aged timber, hand-thrown ceramics. Minimal composition with strong negative space. South African winelands setting where relevant. No people unless specified. No sparklers, no confetti, no clichéd wedding tropes. 4:5 aspect ratio for Instagram feed.";

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-05-25"); // Monday Week 1

function getScheduledDate(weekIndex, dayOfWeek) {
  // dayOfWeek: 1=Mon, 3=Wed
  const d = new Date(LAUNCH_DATE);
  d.setDate(LAUNCH_DATE.getDate() + weekIndex * 7 + (dayOfWeek - 1));
  return d;
}

// ─── CONTENT DATA ─────────────────────────────────────────────────────────────
// Each post: { day, type, concept, slides[], caption, hashtags }
// Each slide: { label, prompt, canva }
// prompt = slide-specific only; prepend MASTER_PREFIX when copying.
// Stories run daily from repurposed feed content — see Stories section in each week.

const WEEKS = [
  // ── WEEK 1 ──────────────────────────────────────────────────────────────────
  {
    week: 1,
    theme: "Plant the Stakes",
    goal: "Make people feel the category before they hear the product name. You are creating the problem, not selling the solution.",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "The 8 moments",
        slides: [
          {
            label: "Slide 1 — Cover",
            prompt:
              "An empty ceremony aisle. White chairs in soft rows, morning light falling through tall windows. Single white floral arrangement at the end of the aisle. No people. Quiet anticipation. Overhead perspective or level ground-angle.",
            canva:
              "Background: generated image fills the frame. Overlay in Cormorant Garamond Light, large, centred: 'The 8 moments where music decides how your day feels.' White text with navy shadow for legibility. Bottom left: 'wedin.ai' in DM Sans, cream, small. Swipe prompt bottom right in DM Sans Light: 'Swipe to see them all' in warm grey.",
          },
          {
            label: "Slide 2 — Guest Arrival",
            prompt:
              "A drinks table set outdoors in dappled shade. Tall glassware, a simple floral stem in a bud vase, linen napkins. Winelands landscape soft-focus in background. No guests. Still, waiting quality.",
            canva:
              "Navy overlay at 20% opacity across bottom third. Text in Cormorant Garamond italic, cream: 'Guest arrival.' Below in DM Sans Light, warm grey small: 'Sets the mood before a word is spoken.'",
          },
          {
            label: "Slide 3 — The Ceremony Processional",
            prompt:
              "A stone pathway through a vineyard leading toward a ceremony arch of white florals. Morning light. No people. Sense of approach and threshold.",
            canva:
              "Text centred in image: 'The processional.' in Cormorant Garamond Light, large, navy. Below: 'The most underestimated 90 seconds of your day.' in DM Sans Regular, warm grey, smaller.",
          },
          {
            label: "Slide 4 — The Ceremony",
            prompt:
              "Close-up of two hands intertwined, wedding rings visible on linen surface. Soft depth of field. Warm light from one side. Intimate, still.",
            canva:
              "Minimal overlay. Bottom of image: 'The ceremony.' Cormorant Garamond italic, cream. One line below in DM Sans Light, cream at 80% opacity: 'Every guest silent. Every song choice audible.'",
          },
          {
            label: "Slide 5 — Pre-Drinks / Cocktail Hour",
            prompt:
              "An outdoor terrace at golden hour. Long shadows across wooden decking, a few empty cocktail glasses catching the light. Wine country hills in soft background. Ambient, golden.",
            canva:
              "Overlay text in Cormorant Garamond, navy on cream band at bottom: 'Pre-drinks.' Below in DM Sans: 'The transition. Most couples forget to plan it.'",
          },
          {
            label: "Slide 6 — The First Dance",
            prompt:
              "An empty dancefloor. Parquet or pale stone. A single spotlight circle on the floor. Surrounding tables with soft candlelight. Expectant emptiness.",
            canva:
              "Large Cormorant Garamond Light centred: 'The first dance.' Below in DM Sans Regular, grey: 'Three minutes everyone watches. Forty percent of couples choose a song and nothing else.'",
          },
          {
            label: "Slide 7 — Dinner",
            prompt:
              "A long harvest table set for dinner. Candles lit, glasses filled, small floral arrangements at intervals. No guests. The moment before everyone sits down. Warm candlelight.",
            canva:
              "Cormorant Garamond italic at top: 'Dinner.' DM Sans below: 'Music that holds the room without owning it. Harder to find than it sounds.'",
          },
          {
            label: "Slide 8 — The Reception",
            prompt:
              "A dancefloor from above, late in the evening. The floor lit warmly, surrounding darkness. Empty but feeling of energy, as if people just stepped away. South African farm venue aesthetic.",
            canva:
              "Large text centred: 'The reception.' Cormorant Garamond Light, cream on dark. DM Sans below: 'Where everything either builds to something, or doesn't.'",
          },
          {
            label: "Slide 9 — Closing CTA",
            prompt:
              "A simple flat-lay: a blank cream notebook open to an empty page, a fine-line pen resting on it, a single dried floral stem beside it. Top-down view. Minimal, intentional.",
            canva:
              "Cream background, no overlay needed. Large Cormorant Garamond, navy: 'Most couples plan one of these moments.' Gold accent on 'one'. Below in DM Sans Regular: 'wedin.ai plans all eight. 20 minutes.' Small link text below: 'app.wedin.ai' in DM Sans, gold.",
          },
        ],
        caption: `Most couples spend more time choosing table linens than they do planning their music.

The music is the only thing every single guest experiences together — from the moment you walk in to the moment the last person leaves the floor. And there are eight distinct moments where it determines what people feel.

Most couples plan one of them.

Swipe to see all eight — and ask yourself which ones you've actually thought about.

20 minutes at app.wedin.ai builds a plan for all of them.`,
        hashtags:
          "#weddingmusic #weddingplanning #SAwedding #capetownwedding #weddingband #weddingday #weddinginspo",
      },
      {
        day: 3,
        type: "Single Image",
        concept: "The processional provocation",
        slides: [
          {
            label: "Image",
            prompt:
              "A long straight aisle through a vineyard, late afternoon light. Rows of vines on either side converging in the distance. The feeling of walking toward something significant. No people. Aerial or level perspective.",
            canva:
              "Strong text overlay in Cormorant Garamond Light, large, cream: 'Your ceremony music sets the emotional register for your entire day.' Below in DM Sans Regular, cream at 80%: 'Not your first dance. Not the reception. This.' Bottom: 'wedin.ai' small in DM Sans cream.",
          },
        ],
        caption: `Everyone puts their energy into the first dance song.

The ceremony processional is more important. It's the first time every guest experiences your day together — it sets the emotional tone that everything else runs from. Get it wrong, and the day spends two hours recovering.

Most couples choose a ceremony song because they like it. The brief approach is different: what do you want every person in that room to feel in the first 90 seconds? Choose backward from there.

This is one of eight moments wedin.ai plans — link in bio.`,
        hashtags:
          "#weddingceremony #ceremonymusic #weddingplanning #SAwedding #weddingmusicplanning #bridetobe #engaged",
      },
    ],
    stories: [
      "Mon: Share hero carousel to Stories. Add 'New post — swipe up' in DM Sans, navy, cream background.",
      "Tue poll: 'Have you started planning your wedding music?' — Yes / Not yet",
      "Wed: Share mid-week post to Stories.",
      "Thu tip (text Story): 'The cocktail hour is when your guests form their first impression of your taste. Don't leave it to chance.'",
      "Fri: Reshare anything with high engagement from the week.",
      "Special: Repurpose carousel slides as individual Story frames across the week.",
    ],
  },

  // ── WEEK 2 ──────────────────────────────────────────────────────────────────
  {
    week: 2,
    theme: "The Ceremony Moment",
    goal: "The ceremony is the most emotionally significant musical moment — and the most neglected. Make the audience feel the stakes before they've planned a note.",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "What actually happens when you walk in to the wrong song",
        slides: [
          {
            label: "Slide 1 — Cover",
            prompt:
              "A ceremony aisle from behind the couple's perspective — looking toward the officiant, guests on either side blurred in soft focus. Empty — the moment just before the processional begins. Morning light through high windows.",
            canva:
              "Text overlay, Cormorant Garamond Light, large, centred: 'What happens when you walk in to the wrong song.' Cream text on semi-transparent navy bar at bottom. Swipe indicator.",
          },
          {
            label: "Slide 2 — The mismatch",
            prompt:
              "Close-up of a guest's face — but rendered as a silhouette or abstract shape rather than a recognisable person. Side-lit, blurred background of ceremony chairs. Emotional presence without identifiable features.",
            canva:
              "Text: 'The wrong song creates a 2-second emotional mismatch.' Cormorant Garamond italic, navy on cream. DM Sans below: 'Guests feel it before they can name it. And the room never fully resets.'",
          },
          {
            label: "Slide 3 — First impression",
            prompt:
              "A pair of shoes — bridal or elegant — at the top of a stone staircase leading down toward a garden ceremony. View from behind. Anticipation and threshold.",
            canva:
              "Text centred: 'You don't get a second first impression.' Cormorant Garamond Light, large. DM Sans below in grey: 'The processional plays once. It's worth planning like it matters.'",
          },
          {
            label: "Slide 4 — Three questions",
            prompt:
              "A simple elegant table with a single open notebook and a pen. Morning light. The beginning of a plan being made. Cream and white tones.",
            canva:
              "Text: 'Three questions that change your ceremony music completely:' Cormorant Garamond, gold accent on 'three'. List below in DM Sans: '1. What do you want guests to feel as you walk in? 2. What energy do you want during the vows? 3. How do you want to leave?' Small: 'wedin.ai asks all of these — and builds from your answers.'",
          },
          {
            label: "Slide 5 — Closing CTA",
            prompt:
              "A single white floral stem laid across a cream linen surface. Simple, intentional, complete.",
            canva:
              "Cormorant Garamond Light, large: 'Your ceremony music deserves more than a good song.' Gold accent on 'more'. DM Sans below: 'Plan it properly. app.wedin.ai'",
          },
        ],
        caption: `The ceremony processional is the most underestimated decision in wedding music.

Most couples pick a song they love. Which is a good start. But 'we love this song' and 'this song creates the emotional moment we want for the people we love most' are two different briefs.

When the song starts and you begin to walk, every person in that room is watching. What they feel in the first 90 seconds sets the tone for everything that follows.

The questions we ask are different: What do you want them to feel? What energy do you want to carry into your vows? How do you want to leave the aisle?

Work backward from those answers, and the right song finds itself.

Link in bio — we plan it all.`,
        hashtags:
          "#weddingceremony #weddingprocessional #ceremonymusic #SAwedding #weddingmusicplanning #capetownwedding #engaged #weddingplanning",
      },
      {
        day: 3,
        type: "Single Image",
        concept: "The vow silence",
        slides: [
          {
            label: "Image",
            prompt:
              "Two empty chairs facing each other in a ceremony setting. Soft natural light. The feeling of an intimate exchange about to happen. Winelands garden in soft focus behind.",
            canva:
              "Minimal overlay. Cormorant Garamond italic, large, cream: 'The music stops before the vows.' Below DM Sans: 'Most couples forget this is a decision. What fills that silence says everything.' Bottom: wedin.ai small.",
          },
        ],
        caption: `Here is a decision most couples don't realise they're making:

What happens to the music when the vows begin?

Some stop it entirely. Some fade it under. Some let it play. None of these is wrong — but all of them are felt differently by every person in the room. The silence (or non-silence) during the most intimate moment of your day is a choice worth making deliberately.

This is one of the things we map out in your ceremony plan. Because silence, done right, is its own kind of music.`,
        hashtags:
          "#weddingvows #weddingceremony #weddingmusic #SAwedding #bridetobe #weddingplanning #weddinginspo",
      },
    ],
    stories: [
      "Mon: Share hero carousel to Stories.",
      "Tue poll: 'Have you chosen your ceremony songs yet?' — Yes / Still deciding",
      "Wed: Share mid-week post to Stories.",
      "Thu tip (text Story): 'A DJ who doesn't get a brief defaults to what worked at the last wedding. Not yours.'",
      "Fri: Reshare anything with high engagement.",
    ],
  },

  // ── WEEK 3 ──────────────────────────────────────────────────────────────────
  {
    week: 3,
    theme: "The First Dance",
    goal: "Everyone plans the first dance song. Almost no one plans the first dance. The angle is the gap between picking a song and actually creating a moment.",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "Your first dance song is not the decision",
        slides: [
          {
            label: "Slide 1 — Cover",
            prompt:
              "An empty parquet dancefloor. Warm evening light, soft candles surrounding the space. A single spot of light on the centre of the floor. The expectation before someone steps in.",
            canva:
              "Cormorant Garamond Light, large, cream: 'Your first dance song is not the decision.' Gold accent on 'not'. DM Sans below, smaller: 'Swipe — here's what is.'",
          },
          {
            label: "Slide 2 — The song is 20%",
            prompt:
              "A close-up of a record sleeve on a cream linen surface. No recognisable artwork — abstract or blank. The tactile quality of vinyl and paper. Warm light.",
            canva:
              "Text: 'The song is 20% of the moment.' Cormorant Garamond, large. DM Sans below: 'How you enter the floor, what happens in the first 8 bars, whether you face each other or face the room — these are the other 80%.'",
          },
          {
            label: "Slide 3 — The room's reaction",
            prompt:
              "Two champagne glasses touching in a gentle clink, close-up, golden light. Behind them, a soft-focus room of candlelit tables. Celebratory but restrained.",
            canva:
              "Text: 'The room holds its breath or reaches for its phone.' Cormorant Garamond italic, cream. DM Sans below: 'What determines which one happens has nothing to do with the song title.'",
          },
          {
            label: "Slide 4 — Four questions",
            prompt:
              "A flat-lay of handwritten notes on cream paper. The look of someone planning something carefully. Alongside it, a small floral sprig and a fine-line pen. Top-down.",
            canva:
              "Text: 'Four first dance questions worth answering:' DM Sans list: '1. Do you want it intimate (facing each other) or performed (facing guests)? 2. Does your song have a natural moment for other couples to join? 3. Are you comfortable with 3 full minutes of attention? 4. What happens when the song ends?' DM Sans small at bottom: 'wedin.ai covers all of this in your moment plan.'",
          },
          {
            label: "Slide 5 — Closing CTA",
            prompt:
              "A single dried flower pressed between the pages of an open book. Cream and warm tones. The feeling of something preserved and intentional.",
            canva:
              "Cormorant Garamond Light, large: 'Plan the moment, not just the song.' Gold on 'moment'. DM Sans: 'app.wedin.ai'",
          },
        ],
        caption: `The most common thing couples say when they look back at their first dance:

'I wish we'd thought about it more than just the song.'

The song is the starting point. The moment is everything else: how you walk onto the floor, what you do in the opening bars, whether the rest of the room is watching or joining, how it ends and what follows it directly.

A three-minute first dance with a plan behind it feels completely different from a three-minute first dance where you hoped for the best.

Your music portrait covers all of it. Link in bio.`,
        hashtags:
          "#firstdance #weddingdance #weddingmusic #weddingplanning #SAwedding #newlyengaged #bridetobe #weddingband",
      },
      {
        day: 3,
        type: "Product Reveal",
        concept: "First look at product output",
        slides: [
          {
            label: "Canva Only — no AI image needed",
            prompt:
              "No AI image generation needed for this post. Use a real output from a test session: the First Dance section of a generated music portrait.",
            canva:
              "Cream background. Screenshot of First Dance portrait section centred with generous padding. Thin navy border around the screenshot. Header text above in Cormorant Garamond italic, navy: 'What your first dance brief could look like.' Footer in DM Sans Light, warm grey: 'From a real wedin.ai music portrait.' Wordmark bottom right.",
          },
        ],
        caption: `This is the first dance section from a wedin.ai music portrait.

It was generated in about 20 minutes — no spreadsheets, no back-and-forth with a planner. The couple answered questions about how they wanted the moment to feel. The portrait built the brief.

It covers the song choice reasoning, the moment structure, and the handover notes for their band — specific enough that an act can prepare properly.

This is what every moment of your day can look like — mapped, planned, briefed.

Link in bio.`,
        hashtags:
          "#weddingplanning #firstdance #weddingband #weddingmusic #SAwedding #weddingbrief #weddingtech #capetownwedding",
      },
    ],
    stories: [
      "Mon: Share hero carousel to Stories.",
      "Tue poll: 'Do you know what you want your first dance to feel like?' — Yes, totally / Still figuring it out",
      "Wed: Share product reveal to Stories.",
      "Thu tip (text Story): 'Ask your DJ to fade the first dance at 2:30 — most couples run out of material at 90 seconds and it gets awkward.'",
      "Fri: Reshare anything with high engagement.",
    ],
  },

  // ── WEEK 4 ──────────────────────────────────────────────────────────────────
  {
    week: 4,
    theme: "The Reception Arc",
    goal: "A great reception has a shape. Most don't. This week is for the ICP-2 couple (overwhelmed, needs direction) — education on something they've never been told explicitly.",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "How a great band builds a room",
        slides: [
          {
            label: "Slide 1 — Cover",
            prompt:
              "A large barn or farm venue reception in full swing — but rendered as an atmospheric, slightly abstract interior. Warm light, sense of energy and movement, no identifiable faces. Tables, dancefloor, band stage in background soft-focus. South African wine estate aesthetic.",
            canva:
              "Cormorant Garamond Light, large, cream: 'How a great band builds a room.' Below DM Sans: 'And why most receptions flatten out by 10pm.' Swipe indicator.",
          },
          {
            label: "Slide 2 — The arc",
            prompt:
              "A simple elegant diagram feel — but rendered as a physical object: a clean timeline sketched on cream paper, a pen beside it. Minimal, intelligent-looking.",
            canva:
              "Text across the slide maps a reception arc: '7PM: Cocktail energy. Warm, ambient, people arriving and connecting.' '8PM: Dinner settles. Music pulls back, conversation takes over.' '9PM: First turn. Energy starts to build. The first few people approach the floor.' '10PM: The peak. If you've built to it correctly, you don't need to ask people to dance.' '11PM: Sustain or release. Both are valid. Neither happens by accident.' Bottom DM Sans small: 'A great band knows this arc instinctively. Your brief helps them execute it for your specific room.'",
          },
          {
            label: "Slide 3 — What goes wrong",
            prompt:
              "An empty dancefloor, clearly mid-reception. Guests visible but seated in background, nobody dancing. The feeling of an opportunity missed. Warm but slightly melancholic light.",
            canva:
              "Cormorant Garamond italic, large: 'The floor empties because nobody built to the peak.' DM Sans below: 'It's not the song choice. It's the absence of a plan for how energy moves across four hours.'",
          },
          {
            label: "Slide 4 — The brief solution",
            prompt:
              "A beautifully lit band setup — instruments in place, no performers, just the anticipation of sound. Stage lighting warm. Farm venue aesthetic.",
            canva:
              "Text: 'Your brief tells your band how your room works.' Cormorant Garamond. List in DM Sans: 'Who are your guests (age mix, energy level)? What does your crowd need to warm up? When do you want the peak? What keeps them on the floor?' DM Sans small: 'wedin.ai extracts this from your portrait and puts it directly in the coordinator brief.'",
          },
          {
            label: "Slide 5 — Closing CTA",
            prompt:
              "A full dancefloor from above — abstracted, atmospheric, no faces. Just the energy of a room in full motion. Warm.",
            canva:
              "Cormorant Garamond Light, large, cream on dark overlay: 'Four hours. Five chapters. One arc.' Gold accent on 'Five'. DM Sans: 'Plan it like that. app.wedin.ai'",
          },
        ],
        caption: `A reception doesn't have energy because people are having fun.

People have fun because the energy was built correctly.

A great band knows how to construct a four-hour arc — warming up the room, reading the crowd, building to the peak at the right moment, then sustaining or releasing depending on your specific group. But they can only do their best work when they know what they're building toward.

That's what the coordinator brief is for. Not 'please play some good songs' — but here's our crowd, here's our energy, here's when we want the floor full, here's what keeps them there.

Your wedin.ai portrait extracts all of this and puts it in a format your band can actually use.

Link in bio.`,
        hashtags:
          "#weddingband #weddingdj #weddingreception #weddingmusic #SAwedding #weddingplanning #capetownwedding #winelands",
      },
      {
        day: 3,
        type: "Single Image",
        concept: "The music at dinner isn't supposed to be noticed",
        slides: [
          {
            label: "Image",
            prompt:
              "A wedding dinner table at the moment between courses — candles lit, glasses present, soft ambient light, quiet. The exact quality of a dinner held together by the right music underneath it.",
            canva:
              "Cormorant Garamond italic overlay: 'The music at dinner isn't supposed to be noticed.' DM Sans below: 'That's not an easy brief to write. But it's worth writing.' Wordmark small bottom right.",
          },
        ],
        caption: `The hardest music brief in a wedding isn't the first dance.

It's dinner.

You need something present enough to feel intentional, but invisible enough that a table of eight can have a real conversation without raising their voices. Too quiet and it feels empty. Too much personality and it competes.

This is a musical direction decision that most couples never make explicitly — which means their band or DJ makes it for them.

The dinner section of your wedin.ai plan covers it. Because 'something nice in the background' is not a brief.`,
        hashtags:
          "#weddingdinner #weddingmusic #weddingplanning #SAwedding #weddingband #weddingdj #weddinginspo",
      },
    ],
    stories: [
      "Mon: Share hero carousel to Stories.",
      "Tue poll: 'Have you briefed your band or DJ?' — Yes, properly / Not yet",
      "Wed: Share mid-week post to Stories.",
      "Thu tip (text Story): 'Tell your DJ the names of 3 guests who will definitely dance and 2 who need a specific decade. A crowd read before the event beats 10 track suggestions.'",
      "Fri: Reshare anything with high engagement.",
    ],
  },

  // ── WEEK 5 ──────────────────────────────────────────────────────────────────
  {
    week: 5,
    theme: "Music as Identity",
    goal: "Your music choices are a statement about who you are, not a service you book. This is the ICP-1 week — the Intentional Couple who has opinions and wants to be understood.",
    posts: [
      {
        day: 1,
        type: "Hero Carousel",
        concept: "What your music choices say about you",
        slides: [
          {
            label: "Slide 1 — Cover",
            prompt:
              "A collection of objects arranged as a personal portrait: a vinyl record, a dog-eared paperback, a cinema ticket stub, a dried flower from somewhere, a single photograph face-down. Top-down flat-lay. Cream surface, warm light.",
            canva:
              "Cormorant Garamond Light, large: 'What your wedding music says about you.' Gold accent on 'you'. DM Sans: 'A field guide to musical personalities.' Swipe indicator.",
          },
          {
            label: "Slide 2 — The Understated Couple",
            prompt:
              "A small intimate table set for two in a corner. A single candle, one book, two glasses. Quiet and deliberate. Nothing excessive.",
            canva:
              "Cormorant Garamond italic: 'The Understated Couple.' DM Sans body: 'You don't want a DJ with a microphone. You want music that feels like it belongs to the day rather than performing for it. Your brief includes three words: present, considered, warm.' Small: 'Does this sound like you?'",
          },
          {
            label: "Slide 3 — The Full Floor Couple",
            prompt:
              "A wide expansive dancefloor, empty but lit for a crowd, energy implicit in the space. Stage lights warm. A room that exists to be filled.",
            canva:
              "Cormorant Garamond italic: 'The Full Floor Couple.' DM Sans: 'The reception is the event. You want the floor full at 9pm and to sustain it until midnight. Your brief includes: \"If in doubt, build harder.\"' Small: 'Does this sound like you?'",
          },
          {
            label: "Slide 4 — The Music-Led Couple",
            prompt:
              "A music lover's space — a record player on a wooden shelf, albums in a row beside it, a single reading lamp. Personal, considered, specific.",
            canva:
              "Cormorant Garamond italic: 'The Music-Led Couple.' DM Sans: 'Music is how you experience the world. Your wedding playlist is curated with the same rigour as your record collection. The wrong song is a personal affront. Your brief is the longest one we generate.' Small: 'Does this sound like you?'",
          },
          {
            label: "Slide 5 — Closing CTA",
            prompt:
              "A blank cream notebook open to a fresh page. A single line has been written in fine pencil: 'Start with the music.' The rest is empty, waiting.",
            canva:
              "Cormorant Garamond Light, large: 'There is no such thing as a neutral wedding playlist.' Gold on 'neutral'. DM Sans: 'Every choice is a statement. wedin.ai helps you make it deliberately.' CTA: 'app.wedin.ai'",
          },
        ],
        caption: `There are three types of couples when it comes to wedding music.

The Understated Couple: you want music that belongs to the day, not music that performs for it. Present, considered, warm — and you'd rather clear the floor early than play a song that doesn't fit.

The Full Floor Couple: the reception is the event. You want bodies on that floor by 9pm and you want to sustain it. The brief says: if in doubt, build.

The Music-Led Couple: music is how you experience the world, and your wedding playlist is getting the same rigour as your record collection. You have opinions. The wrong song is a personal affront.

Most couples are somewhere between all three. The point is: knowing which one you are changes every music decision you make.

Your wedin.ai portrait figures this out in the first five questions — and builds from there.

Link in bio.`,
        hashtags:
          "#weddingmusic #weddingpersonality #weddingplanning #SAwedding #weddingband #newlyengaged #bridetobe",
      },
      {
        day: 3,
        type: "Provocation",
        concept: "There is no such thing as a neutral wedding playlist",
        slides: [
          {
            label: "Image",
            prompt:
              "A vinyl record on a cream linen surface, partially pulled from its sleeve. The label visible but not recognisable — abstract. Warm light. The sensation of choosing carefully.",
            canva:
              "Strong headline in Cormorant Garamond Light, large, navy: 'There is no such thing as a neutral wedding playlist.' Below in DM Sans Regular: 'Every choice lands. Make them deliberately.' Wordmark bottom right.",
          },
        ],
        caption: `The couples who regret their wedding music are rarely the ones who made a bad choice.

They're the ones who didn't make a choice at all — who deferred, said 'the band knows what they're doing,' and hoped for the best.

The band does know what they're doing. But 'what they're doing' defaults to what works for most rooms, most crowds, most couples — not your room, your crowd, your relationship.

The brief is how you tell them who you actually are.

Yours is 20 minutes away. Link in bio.`,
        hashtags:
          "#weddingmusic #weddingband #weddingplanning #SAwedding #capetownwedding #weddinginspo #engaged",
      },
    ],
    stories: [
      "Mon: Share hero carousel to Stories.",
      "Tue poll: 'Do you have strong opinions about your wedding music?' — Very strong / Some / Not really",
      "Wed: Share provocation post to Stories.",
      "Thu tip (text Story): 'Tell your DJ your absolute favourite song and ask them to place it at 10:30pm — when the floor is fullest. That's the peak. That's where it lands best.'",
      "Fri: Reshare anything with high engagement.",
    ],
  },

  // ── WEEK 6 ──────────────────────────────────────────────────────────────────
  {
    week: 6,
    theme: "Proof and Invitation",
    goal: "Five weeks of credibility built. Week 6 is when the product earns the spotlight. Social proof carries the weight — your job is to frame it and invite action. Every post this week ends with a clear path to app.wedin.ai.",
    posts: [
      {
        day: 1,
        type: "Social Proof",
        concept: "Real portrait output, styled for sharing",
        slides: [
          {
            label: "Canva Only — no AI image needed",
            prompt:
              "No AI image generation needed. In Canva: take a screenshot of the full music portrait output. Use your best test portrait — ideally with a strong music identity section and at least two moment plans. Blur or remove any identifying details.",
            canva:
              "Place screenshot on cream background with 48px padding. Navy 1px border around screenshot. Slight drop shadow (navy, 10% opacity). Above screenshot in Cormorant Garamond italic, navy: 'A wedin.ai music portrait.' Below in DM Sans Light, warm grey: 'Generated in 20 minutes from a discovery session. Names and details changed.' Wordmark bottom right. If portrait is long, show only the most compelling section — the music identity section or the ceremony moment plan. Legibility matters — the goal is for someone to read it and want one for themselves.",
          },
        ],
        caption: `This is a wedin.ai music portrait.

It was built in 20 minutes. A couple answered questions about their musical taste, their wedding moments, and how they wanted their day to feel. This is what came out the other end.

A music identity that describes them. A plan for eight moments. A coordinator brief ready to send.

We launched at R699 because we wanted every couple who cares about their music to be able to access it — not just the ones with large planning budgets.

If you want yours: app.wedin.ai in the bio. 20 minutes.`,
        hashtags:
          "#weddingplanning #weddingmusic #SAwedding #weddingband #weddingdj #capetownwedding #weddingbrief #newlyengaged",
      },
      {
        day: 3,
        type: "Founder Story",
        concept: "Behind the Build — why Rus built this",
        slides: [
          {
            label: "Image",
            prompt:
              "A notebook open on a wooden desk, afternoon light, a coffee beside it. The beginning of something being figured out. Personal and considered, not polished or staged.",
            canva:
              "Minimal text overlay — just the wedin.ai wordmark in the bottom right, cream on the image. Let the caption carry this post. The image is context, not hero.",
          },
        ],
        caption: `I built wedin.ai because of a conversation I couldn't stop thinking about.

[INSERT YOUR SPECIFIC STORY HERE — the actual moment, the specific conversation, the real thing you witnessed or experienced that made this obvious. The more specific, the better. Generic founder stories don't land. Yours does.]

Every couple I spoke to said the same thing: they knew what they wanted their day to feel like. They just didn't have the words.

That's the gap wedin.ai fills. Not a music directory. Not another planning checklist. A 20-minute conversation that turns what you feel into a brief your planner and acts can actually use.

We're live at app.wedin.ai. R699 for your complete music plan. If you're planning your wedding and music is the thing you keep deferring — this is for you.

[Insert your personal CTA — something you'd actually say]`,
        hashtags:
          "#wedinai #weddingmusic #weddingplanning #SAwedding #founderlife #startuplife #weddingtech #capetownstartup",
      },
    ],
    stories: [
      "Mon: Share social proof post to Stories.",
      "Tue poll: 'Have you looked at wedin.ai yet?' — Yes / Not yet",
      "Wed: Share founder story to Stories.",
      "Thu tip (text Story): 'The last song of the night is as important as the first dance. Choose something that sends people home right — full, resolved, memorable. Not a fade-out. A finale.'",
      "Fri: Reshare anything with high engagement. Push the social proof post again if it's getting saves.",
    ],
  },
];

// ─── SCHEDULE BUILDER ─────────────────────────────────────────────────────────
// Feed posts only: Mon (day 1) + Wed (day 3). Thursday is a Stories-only text post.

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
      });
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
  const end = getScheduledDate(wi, 3);
  return `${start.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })} & ${end.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}`;
}

// ─── TYPE META ────────────────────────────────────────────────────────────────

const TYPE_META = {
  "Hero Carousel": { icon: "◈", bg: "bg-[#1C2B3A]", text: "text-[#FAF7F2]" },
  "Single Image": { icon: "◉", bg: "bg-[#C4922A]", text: "text-[#FAF7F2]" },
  "Product Reveal": { icon: "◎", bg: "bg-emerald-700", text: "text-white" },
  Provocation: { icon: "◈", bg: "bg-rose-700", text: "text-white" },
  "Social Proof": { icon: "◉", bg: "bg-violet-700", text: "text-white" },
  "Founder Story": { icon: "◎", bg: "bg-[#6B6560]", text: "text-[#FAF7F2]" },
};

function getTypeMeta(type) {
  return TYPE_META[type] || { icon: "○", bg: "bg-gray-400", text: "text-white" };
}

// ─── STATUS ───────────────────────────────────────────────────────────────────

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
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      className="text-xs px-2 py-0.5 rounded border border-[#C4922A] text-[#C4922A] hover:bg-[#C4922A] hover:text-white transition-colors flex-shrink-0"
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}

function StatusPill({ id }) {
  const [statuses, setStatuses] = useState(loadStatuses);
  const status = statuses[id] || "draft";
  const cycle = (e) => {
    e.stopPropagation();
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(status) + 1) % STATUS_CYCLE.length];
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

function SlideCard({ slide, index, isCarousel }) {
  const [open, setOpen] = useState(false);
  const fullPrompt = `${MASTER_PREFIX}\n\n${slide.prompt}`;

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <span className="text-xs font-semibold text-[#1C2B3A]">
          {isCarousel ? `${index + 1}. ${slide.label}` : slide.label}
        </span>
        <span className="text-gray-400 text-xs ml-2">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-2 space-y-3 bg-white">
          {/* AI Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                AI Image Prompt
              </p>
              <CopyButton text={fullPrompt} label="Copy full prompt" />
            </div>
            <p className="text-xs text-gray-400 italic mb-1">
              ↑ Copies master prefix + slide prompt together. Paste directly into Ideogram or DALL-E.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {slide.prompt}
            </p>
          </div>
          {/* Canva Brief */}
          <div className="border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Canva Brief
              </p>
              <CopyButton text={slide.canva} label="Copy brief" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {slide.canva}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false);
  const meta = getTypeMeta(task.type);
  const isCarousel = task.type === "Hero Carousel";

  return (
    <div
      className="rounded-xl border border-gray-200 hover:border-gray-300 bg-white transition-all cursor-pointer"
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div
          className={`text-base w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.text}`}
        >
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.bg} ${meta.text}`}>
              {task.type}
            </span>
            <span className="text-xs text-gray-400">{formatDate(task.date)}</span>
            {isCarousel && (
              <span className="text-xs text-gray-400">· {task.slides.length} slides</span>
            )}
          </div>
          <p className="text-sm font-semibold text-[#1C2B3A] leading-snug">{task.concept}</p>
        </div>
        <StatusPill id={task.id} />
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4" onClick={(e) => e.stopPropagation()}>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Caption</p>
              <CopyButton text={task.caption} label="Copy caption" />
            </div>
            <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
              {task.caption}
            </p>
          </div>

          {/* Hashtags */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hashtags</p>
              <CopyButton text={task.hashtags} label="Copy hashtags" />
            </div>
            <p className="text-xs text-[#1C2B3A]">{task.hashtags}</p>
          </div>

          {/* Slides / Image */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {isCarousel ? `Slides (${task.slides.length}) — AI Prompts & Canva Briefs` : "Image & Canva"}
            </p>
            <div className="space-y-1.5">
              {task.slides.map((slide, i) => (
                <SlideCard key={i} slide={slide} index={i} isCarousel={isCarousel} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MASTER PREFIX CARD ───────────────────────────────────────────────────────

function MasterPrefixCard() {
  return (
    <div className="bg-[#1C2B3A] rounded-xl p-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#C4922A] uppercase tracking-wide mb-1">
            Master Style Prefix — add to start of every AI prompt
          </p>
          <p className="text-xs text-blue-200 leading-relaxed">{MASTER_PREFIX}</p>
          <p className="text-xs text-blue-300 mt-1.5">
            Tool: Ideogram (first choice for text-in-image) · DALL-E 3 via ChatGPT (backup for atmospheric) · Midjourney (editorial, more iteration)
          </p>
        </div>
        <CopyButton text={MASTER_PREFIX} label="Copy prefix" />
      </div>
    </div>
  );
}

// ─── MINI CALENDAR ────────────────────────────────────────────────────────────

function MiniCalendar({ selectedDate, onSelect }) {
  const today = new Date();
  const scheduledDates = SCHEDULE.map((t) => t.date);

  const calStart = new Date(LAUNCH_DATE);
  calStart.setDate(calStart.getDate() - calStart.getDay() + 1);

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

  const arcEnd = getScheduledDate(5, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        May 25 – Jul 5 · Mon + Wed posts
      </p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
        {weeks.flat().map((day, i) => {
          const isScheduled = scheduledDates.some((sd) => isSameDay(sd, day));
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const inArc = day >= LAUNCH_DATE && day <= arcEnd;

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
              } ${isScheduled && !isSelected ? "cursor-pointer" : "cursor-default"}`}
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

function WeekCard({ weekData, tasks, onDayClick }) {
  const [storiesOpen, setStoriesOpen] = useState(false);
  const statuses = loadStatuses();
  const posted = tasks.filter((t) => (statuses[t.id] || "draft") === "posted").length;
  const pct = tasks.length ? Math.round((posted / tasks.length) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-[#C4922A] font-semibold uppercase tracking-wide">
            Week {weekData.week}
          </p>
          <h3 className="text-base font-bold text-[#1C2B3A] mt-0.5">{weekData.theme}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{getWeekLabel(weekData.week - 1)}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#1C2B3A]">{pct}%</p>
          <p className="text-xs text-gray-400">posted</p>
        </div>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full mb-4">
        <div
          className="h-1.5 bg-[#C4922A] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Goal */}
      <p className="text-xs text-gray-500 italic mb-3 leading-relaxed">{weekData.goal}</p>

      {/* Task pills */}
      <div className="flex flex-wrap gap-2 mb-3">
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
                  : "border-gray-200 text-gray-600 hover:border-[#C4922A] hover:text-[#C4922A]"
              }`}
            >
              <span>{meta.icon}</span>
              <span>{formatDate(task.date)}</span>
              <span className="opacity-60">— {task.concept}</span>
            </button>
          );
        })}
      </div>

      {/* Stories */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => setStoriesOpen((o) => !o)}
          className="flex items-center justify-between w-full text-left text-xs font-semibold text-[#C4922A] hover:text-[#1C2B3A] transition-colors"
        >
          <span>📱 Stories rhythm this week</span>
          <span className="text-gray-400">{storiesOpen ? "▲" : "▼"}</span>
        </button>
        {storiesOpen && (
          <ul className="mt-2 space-y-1">
            {weekData.stories.map((s, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-[#C4922A] flex-shrink-0">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function WedinDashboard() {
  const [view, setView] = useState("today");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  const statuses = loadStatuses();
  const postedCount = SCHEDULE.filter((t) => (statuses[t.id] || "draft") === "posted").length;
  const totalCount = SCHEDULE.length;
  const progressPct = Math.round((postedCount / totalCount) * 100);

  const dayTasks = SCHEDULE.filter((t) => isSameDay(t.date, selectedDate));
  const todayTasks = SCHEDULE.filter((t) => isSameDay(t.date, today));
  const upcoming = SCHEDULE.find((t) => t.date >= today && !isSameDay(t.date, today));

  const handleDayClick = useCallback((date) => {
    setSelectedDate(date);
    setView("today");
  }, []);

  // Find week data for selected date
  const selectedTask = SCHEDULE.find((t) => isSameDay(t.date, selectedDate));
  const selectedWeekData = selectedTask
    ? WEEKS[selectedTask.week - 1]
    : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      {/* Header */}
      <div className="bg-[#1C2B3A] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                wedin.ai Content Arc
              </h1>
              <p className="text-sm text-blue-200 mt-0.5">
                6-week Instagram launch · May 25 – Jul 5, 2026 · 12 feed posts
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#C4922A]">{progressPct}%</p>
              <p className="text-xs text-blue-200">{postedCount}/{totalCount} posted</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-white/10 rounded-full">
            <div
              className="h-1.5 bg-[#C4922A] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
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
                  view === key ? "bg-[#C4922A] text-white" : "text-blue-200 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* Master prefix — always visible */}
        <MasterPrefixCard />

        {/* ── TODAY ── */}
        {view === "today" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <MiniCalendar selectedDate={selectedDate} onSelect={(d) => setSelectedDate(d)} />
              {upcoming && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-[#C4922A] uppercase tracking-wide mb-1">Next post</p>
                  <p className="text-sm font-bold text-[#1C2B3A]">{formatDate(upcoming.date)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{upcoming.concept}</p>
                </div>
              )}
              {/* Stories for selected day's week */}
              {selectedWeekData && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-[#C4922A] uppercase tracking-wide mb-2">
                    📱 Week {selectedWeekData.week} Stories
                  </p>
                  <ul className="space-y-1.5">
                    {selectedWeekData.stories.map((s, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                        <span className="text-[#C4922A] flex-shrink-0">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1C2B3A]">
                  {isSameDay(selectedDate, today) ? "Today" : formatDate(selectedDate)}
                </h2>
                {isSameDay(selectedDate, today) && todayTasks.length === 0 && (
                  <p className="text-xs text-gray-400">No feed post today</p>
                )}
              </div>
              {dayTasks.length > 0 ? (
                dayTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="text-sm text-gray-500">No feed post scheduled.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Gold dots mark Mon + Wed posting days. Check Stories panel for daily rhythm.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── WEEK ── */}
        {view === "week" && (
          <div className="space-y-4">
            {WEEKS.map((weekData, wi) => {
              const weekTasks = SCHEDULE.filter((t) => t.week === wi + 1);
              return (
                <WeekCard
                  key={wi}
                  weekData={weekData}
                  tasks={weekTasks}
                  onDayClick={handleDayClick}
                />
              );
            })}
          </div>
        )}

        {/* ── ARC ── */}
        {view === "arc" && (
          <div className="space-y-3">
            {SCHEDULE.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
