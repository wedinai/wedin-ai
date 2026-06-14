import { useState, useEffect, useCallback } from "react";

// ─── BRAND ───────────────────────────────────────────────────────────────────
const CREAM = "#FAF7F2";
const NAVY  = "#1C2B3A";
const GOLD  = "#C4922A";
const GREY  = "#6B6560";
const LIGHT = "#F0EBE3";

// ─── DATA ────────────────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-06-09T00:00:00");

// Coordinators — 60 confirmed, pre-marked with correct statuses
const COORDINATORS = [
  // ── ALREADY CONTACTED ────────────────────────────────────────────────────
  { id:"c01", name:"Nicola Jane", biz:"Nicola Jane Weddings",      handle:"@nicolajaneweddings",            region:"Cape Town",     status:"coupon_sent", notes:"Coupon sent. Offered to share with coordinator WhatsApp group (~60 members)." },
  { id:"c02", name:"Anne Mann",   biz:"Anne Mann Weddings",        handle:"@anne.mann",                     region:"Cape Town",     status:"coupon_sent", notes:"Coupon sent." },
  { id:"c03", name:"Nadine",      biz:"Works with Anne Mann",      handle:"",                               region:"Cape Town",     status:"coupon_sent", notes:"Coupon sent via Anne Mann." },
  { id:"c04", name:"Joe Theron",  biz:"Works with Anne Mann",      handle:"",                               region:"Cape Town",     status:"coupon_sent", notes:"Coupon sent via Anne Mann." },
  { id:"c05", name:"Shauna",      biz:"Wedding Concepts SA",       handle:"@weddingconceptssa",             region:"Cape Town",     status:"emailed",     notes:"" },
  { id:"c06", name:"Nicole",      biz:"Kraak Wedding and Events",  handle:"@kraak.co.za",                   region:"Cape Town",     status:"emailed",     notes:"" },
  { id:"c07", name:"Dayna",       biz:"Strawberry Weddings",       handle:"@strawberryweddingsandevents",   region:"Winelands",     status:"emailed",     notes:"" },
  { id:"c08", name:"Madri & Niki",biz:"The Event Planners SA",     handle:"@theeventplannerssa",            region:"Cape Town",     status:"emailed",     notes:"" },
  // ── FOLLOWED — not yet emailed ───────────────────────────────────────────
  { id:"c09", name:"",            biz:"Ethereal Events Co",        handle:"@etherealevents.co",             region:"Pretoria",      status:"followed",    notes:"" },
  { id:"c10", name:"",            biz:"Oh Happy Day SA",           handle:"@ohhappydaysouthafrica",         region:"Durban",        status:"followed",    notes:"" },
  { id:"c11", name:"Nicole",      biz:"Planning to Perfection",    handle:"@planningtoperfection_za",       region:"Johannesburg",  status:"followed",    notes:"" },
  { id:"c12", name:"",            biz:"Sitting Pretty Bespoke",    handle:"@sitting_pretty_bespoke_events", region:"Cape Town",     status:"followed",    notes:"" },
  { id:"c13", name:"Otto",        biz:"Otto De Jager Events",      handle:"@ottodejagerevents",             region:"Johannesburg",  status:"followed",    notes:"" },
  { id:"c14", name:"",            biz:"360 Link Events",           handle:"@360link_events",                region:"Pretoria",      status:"followed",    notes:"" },
  { id:"c15", name:"Precious",    biz:"Precious the Planner",      handle:"@precioustheplanner",            region:"Johannesburg",  status:"followed",    notes:"" },
  { id:"c16", name:"Zavion",      biz:"Zavion Kotze Events Co",    handle:"@zavionkotzeeventscompany",      region:"Johannesburg",  status:"followed",    notes:"52K followers" },
  { id:"c17", name:"Warren",      biz:"Warren Stone Weddings",     handle:"@warrenstoneweddings",           region:"Cape Town",     status:"followed",    notes:"" },
  { id:"c18", name:"",            biz:"Mon Amour Events",          handle:"@mon_amourevents",               region:"Cape Town",     status:"followed",    notes:"" },
  // ── TO EMAIL — Cape Town & Winelands ────────────────────────────────────
  { id:"c19", name:"Cara Lee",    biz:"Mosaic Weddings",           handle:"@mosaicweddings",                region:"Cape Town",     status:"to_email",    notes:"" },
  { id:"c20", name:"",            biz:"Piece of Cake Weddings",    handle:"@pieceofcakecapetown",           region:"Cape Town",     status:"to_email",    notes:"" },
  { id:"c21", name:"",            biz:"On the Day Events",         handle:"@onthedayevents",                region:"Cape Town",     status:"to_email",    notes:"12+ years experience" },
  { id:"c22", name:"Grace",       biz:"Dear Grace Event Spec.",    handle:"@dear_grace_event_specialists_", region:"Cape Town",     status:"to_email",    notes:"" },
  { id:"c23", name:"",            biz:"The Wedding Fairy",         handle:"@thewedding_fairy",              region:"Cape Town",     status:"to_email",    notes:"10.1K followers, featured in The Lane" },
  { id:"c24", name:"",            biz:"Trunk Events",              handle:"@trunkevents",                   region:"Cape Town",     status:"to_email",    notes:"6K followers, Claremont-based" },
  { id:"c25", name:"",            biz:"Watermelon Weddings",       handle:"@watermelonweddings",            region:"Cape Town",     status:"to_email",    notes:"Well-connected in CT wedding industry" },
  { id:"c26", name:"",            biz:"Nicolette Weddings",        handle:"@nicoletteweddings",             region:"Cape Town",     status:"to_email",    notes:"10K followers, luxury destination" },
  { id:"c27", name:"",            biz:"Celebration Theory",        handle:"@celebrationtheory",             region:"Cape Town",     status:"to_email",    notes:"" },
  { id:"c28", name:"",            biz:"I Do Box",                  handle:"@idobox",                        region:"Cape Town",     status:"to_email",    notes:"10K followers, luxury" },
  { id:"c29", name:"",            biz:"On Reserve Events",         handle:"@onreserveevents",               region:"Cape Town",     status:"to_email",    notes:"" },
  { id:"c30", name:"",            biz:"Blank Canvas Events",       handle:"@blankcanvasevents",             region:"Cape Town",     status:"to_email",    notes:"Design-led, CT & Winelands" },
  { id:"c31", name:"",            biz:"Pluk Weddings",             handle:"@plukweddings",                  region:"Cape Town",     status:"to_email",    notes:"Modern aesthetic, trendy CT venues" },
  { id:"c32", name:"",            biz:"Nearest and Dearest",       handle:"@nearestanddearest",             region:"Cape Town",     status:"to_email",    notes:"Intimate, modern CT weddings" },
  { id:"c33", name:"",            biz:"Franseman Events Atelier",  handle:"@fransemanevents",               region:"Winelands",     status:"to_email",    notes:"High-end, Franschhoek & Stellenbosch focus" },
  { id:"c34", name:"",            biz:"Rolling Events",            handle:"@rollingevents",                 region:"Winelands",     status:"to_email",    notes:"Stellenbosch & Franschhoek estates" },
  { id:"c35", name:"",            biz:"Bellvine Events",           handle:"@bellvineevents",                region:"Winelands",     status:"to_email",    notes:"Vineyard-style, Stellenbosch & Franschhoek" },
  { id:"c36", name:"",            biz:"Forever & Always Events",   handle:"@foreverandalwaysevents",        region:"Winelands",     status:"to_email",    notes:"Romantic vineyard-style" },
  { id:"c37", name:"",            biz:"Kunnexi Weddings & Events", handle:"@kunnexi.events",               region:"Winelands",     status:"to_email",    notes:"CT & Winelands" },
  { id:"c38", name:"Aleit",       biz:"The Aleit Group",           handle:"@thealeit_group",               region:"Cape Town",     status:"to_email",    notes:"High-end full-service, CT & JHB" },
  // ── TO EMAIL — Johannesburg & Pretoria ───────────────────────────────────
  { id:"c39", name:"Beatrix",     biz:"Beatrix Events",            handle:"@beatrixevents",                 region:"Johannesburg",  status:"to_email",    notes:"" },
  { id:"c40", name:"",            biz:"Jubilee Weddings and Events",handle:"@jubileeweddingsandevents",     region:"Johannesburg",  status:"to_email",    notes:"Luxury, national" },
  { id:"c41", name:"Zavion",      biz:"Zavion Kotze-Brereton",     handle:"@zavionk",                      region:"Johannesburg",  status:"to_email",    notes:"Celebrity designer, 117K followers — approach thoughtfully" },
  { id:"c42", name:"",            biz:"Stark Events SA",           handle:"@starkevents_sa",               region:"Cape Town",     status:"to_email",    notes:"" },
  { id:"c43", name:"",            biz:"Masi Events",               handle:"@masievents",                   region:"South Africa",  status:"to_email",    notes:"Intimate affairs specialist" },
  { id:"c44", name:"",            biz:"Blue Olive Events",         handle:"@blueoliveevents",              region:"South Africa",  status:"to_email",    notes:"Full-service" },
  { id:"c45", name:"",            biz:"Infinite Luxe Weddings",    handle:"@infiniteluxeweddings",         region:"South Africa",  status:"to_email",    notes:"" },
  // ── TO EMAIL — Durban & KZN ──────────────────────────────────────────────
  { id:"c46", name:"",            biz:"Mehfil Haus",               handle:"@mehfilhaus",                   region:"Durban",        status:"to_email",    notes:"8K followers, planning & styling, national" },
  { id:"c47", name:"",            biz:"NH Weddings",               handle:"@nh.weddings",                  region:"South Africa",  status:"to_email",    notes:"" },
  // ── TO EMAIL — Garden Route ──────────────────────────────────────────────
  { id:"c48", name:"",            biz:"Garden Route Weddings",     handle:"@gardenroutewedd",              region:"Garden Route",  status:"to_email",    notes:"Regional hub, 3K followers" },
  { id:"c49", name:"",            biz:"Bubblesco Events",          handle:"@bubblesco_events",             region:"Garden Route",  status:"to_email",    notes:"Styling, setup, flowers" },
  { id:"c50", name:"May",         biz:"Events by May",             handle:"@eventsbymay",                  region:"Garden Route",  status:"to_email",    notes:"Plett/Knysna, destination & beach weddings" },
  // ── TO EMAIL — National ──────────────────────────────────────────────────
  { id:"c51", name:"",            biz:"Weddings by Marius",        handle:"@weddingsbymarius",             region:"South Africa",  status:"to_email",    notes:"20+ years experience, 10K followers" },
  { id:"c52", name:"",            biz:"Paheli Weddings",           handle:"@paheliweddings",               region:"South Africa",  status:"to_email",    notes:"Featured in Vogue India, 8K followers" },
  { id:"c53", name:"",            biz:"Dure Events",               handle:"@dureevents",                   region:"International", status:"to_email",    notes:"International luxury, 5K followers" },
  { id:"c54", name:"",            biz:"Bright Light Events",       handle:"@brightlight.events",           region:"South Africa",  status:"to_email",    notes:"" },
  { id:"c55", name:"",            biz:"Pop Up Wedding SA",         handle:"@popupweddingsa",               region:"Cape Town",     status:"to_email",    notes:"Elopements & intimate destination weddings" },
  // ── TO VERIFY — check handle before emailing ────────────────────────────
  { id:"c56", name:"",            biz:"Megara Weddings",           handle:"@megaraweddings",               region:"Cape Town",     status:"to_email",    notes:"⚠ Verify handle before outreach" },
  { id:"c57", name:"",            biz:"On The Bill Events",        handle:"@onthebill",                    region:"Winelands",     status:"to_email",    notes:"⚠ Verify handle before outreach" },
  { id:"c58", name:"",            biz:"Eurasia Events",            handle:"@eurasiaevents",                region:"Winelands",     status:"to_email",    notes:"⚠ Verify handle — multilingual/multicultural" },
  { id:"c59", name:"",            biz:"IDO4U",                     handle:"@ido4u_weddings",               region:"Cape Town",     status:"to_email",    notes:"⚠ Verify handle before outreach" },
  { id:"c60", name:"",            biz:"The Winelands Bride",       handle:"@thewinelandsbride",            region:"Winelands",     status:"to_email",    notes:"⚠ Verify handle — planning hub, Franschhoek & Stellenbosch" },
];

const VENUES = [{"id":1,"name":"ANEW Resort Ingeli Forest","email":"ingelires@anewhotels.co.za","contact":"Shannon / Paul Simpson","type":"Forest, rustic, mountain, intimate, large-scale"},{"id":2,"name":"African Hills Safari Lodge & Spa","email":"weddings@askarilodge.co.za","contact":"Brenda Brand","type":"Safari, bushveld, historic, outdoor, rustic"},{"id":3,"name":"Ashanti Estate","email":"events@ashantiestate.co.za","contact":"Not available","type":"Tuscan-inspired, elegant, exclusive, mountain views, large-scale, intimate"},{"id":4,"name":"Au d'Hex Estate","email":"venue@audehexestate.co.za","contact":"Almari Janse Van Rensburg","type":"Wine farm, elegant, modern, indoor, outdoor"},{"id":5,"name":"Avianto","email":"info@avianto.co.za","contact":"Not available","type":"European-inspired village, estate, river setting, large-scale, intimate"},{"id":6,"name":"Babylonstoren","email":"functions@babylonstoren.com","contact":"Risa","type":"Wine farm, historic, luxury, rustic, chic, garden, intimate, family-style"},{"id":7,"name":"Bakenhof Winelands Venue","email":"info@bakenhof.co.za","contact":"Heidi","type":"Wine farm, elegant, destination, weekend celebrations"},{"id":8,"name":"Bakubung Bush Lodge","email":"bakubung@legacyhotels.com","contact":"George Mokotedi","type":"Bush, African, luxury, intimate, large-scale"},{"id":9,"name":"Belair Pavilion","email":"jason@belair.co.za","contact":"Jason Plumbly","type":"Garden, country estate, elegant, large-scale"},{"id":10,"name":"Bergwaters Eco Lodge And Spa","email":"info@bergwaters.co.za","contact":"Not available","type":"Small, intimate, picturesque, eco lodge"},{"id":11,"name":"Birkenhead House","email":"reservations@trp.travel","contact":"Wendy Jack","type":"Beach, intimate, luxury, clifftop, destination"},{"id":12,"name":"Blaauwklippen Wine Estate","email":"nanette@blaauwklippen.com","contact":"Nanette","type":"Vineyard, historic, elegant, luxury"},{"id":13,"name":"Blue Bay Lodge","email":"reservations@bluebaylodge.co.za","contact":"Cindy Thompson","type":"Beach, coastal, intimate, all-inclusive, outdoor"},{"id":14,"name":"Boschendal Wine Estate","email":"enquiries@boschendal.co.za","contact":"Not available","type":"Wine farm, historic, elegant, nature, large-scale, intimate"},{"id":15,"name":"Botlierskop Private Game Reserve","email":"info@botlierskop.co.za","contact":"Francina","type":"Safari, exotic, intimate, bush"},{"id":16,"name":"Brahman Hills","email":"weddingsales@brahmanhills.co.za","contact":"Not available","type":"Country, elegant, intimate, large-scale"},{"id":17,"name":"Brenaissance Wine & Stud Estate","email":"venue@brenaissance.co.za","contact":"Not available","type":"Wine farm, elegant, large-scale, intimate"},{"id":18,"name":"Bushman Sands Golf Lodge","email":"reservations@riverhotels.co.za","contact":"Not available","type":"Golf estate, bushveld, country, hotel"},{"id":19,"name":"Cabo Beach Club","email":"info@cabobeachclub.co.za","contact":"Not available","type":"Beach, luxury, large-scale, intimate"},{"id":20,"name":"Casa Toscana Lodge","email":"events@casatoscana.co.za","contact":"Nicky Uys","type":"Tuscan-style, outdoor, garden, intimate, large-scale, LGBT-friendly"},{"id":21,"name":"Casablanca Manor Wedding, Function And Conference Venue","email":"info@casablancamanor.co.za","contact":"Kobus And Lynn","type":"Rustic, bushveld, elegant, intimate, large-scale, garden"},{"id":22,"name":"Casterbridge Hollow Boutique Hotel","email":"reservations@casterbridgehollow.co.za","contact":"Not available","type":"Boutique hotel, elegant, romantic, intimate, large-scale"},{"id":23,"name":"Cavalli Estate","email":"events@cavalliestate.com","contact":"Tammi Smuts, Jodi Jarrett","type":"Wine farm, luxury, elegant, classic, large-scale"},{"id":24,"name":"Chez Charlene","email":"info@chezcharlene.co.za","contact":"Charlene Georgiades","type":"Boutique, elegant, classy, all-inclusive"},{"id":25,"name":"Collisheen Estate","email":"info@collisheen.co.za","contact":"Wayne Hulett","type":"Farm, elegant, garden, indoor, outdoor, intimate, large-scale"},{"id":26,"name":"Cradle Valley","email":"rynard@cradlevalley.co.za","contact":"Rynard","type":"Country, elegant, intimate, outdoor"},{"id":27,"name":"Cranford Country Lodge","email":"info@cranfordcountrylodge.co.za","contact":"Claire Culverwell","type":"Country-chic, idyllic, getaway, rustic"},{"id":28,"name":"Critchley Hackle Lodge","email":"info@critchleyhackle.co.za","contact":"Not available","type":"Country, romantic, lakeside, intimate"},{"id":29,"name":"Crystal Barn Country Estate","email":"kate@crystalbarn.co.za","contact":"Kate","type":"Country, vintage, rustic, large-scale"},{"id":30,"name":"Cybele Forest Lodge And Spa","email":"reservations@cybele.co.za","contact":"Rupert Jeffries","type":"Forest, luxury, intimate, romantic, destination"},{"id":31,"name":"De Stijl Gariep Hotel","email":"info@destijl.co.za","contact":"Not available","type":"Karoo, weekend, large-scale"},{"id":32,"name":"De Stilte","email":"info@destilte.co.za","contact":"Not available","type":"Glamping, nature, romantic, small weddings, countryside"},{"id":33,"name":"De Uijlenes","email":"weddings@deuijlenes.co.za","contact":"Not available","type":"Forest, modern-rustic, farm, intimate, large-scale, weekend getaway"},{"id":34,"name":"Delaire Graff Estate","email":"events@delaire.co.za","contact":"Not available","type":"Not available"},{"id":35,"name":"Diamant Estate","email":"info@diamantestate.com","contact":"Wilmarie Groenewald","type":"Wine farm, historic, luxury, intimate, large-scale"},{"id":36,"name":"Die Woud","email":"info@diewoud.co.za","contact":"Not available","type":"Forest, romantic, rustic, outdoor, intimate"},{"id":37,"name":"Dieu Donne Vineyards","email":"info@dieudonnevineyards.com","contact":"Not available","type":"Wine farm, elegant, scenic, romantic"},{"id":38,"name":"Du Kloof Lodge","email":"events@duklooflodge.co.za","contact":"Christiaan","type":"Destination, mountain, riverside, scenic, all-in-one"},{"id":39,"name":"Dwarsberg Trout Hideaway","email":"weddingsandevents@trouthaven.co.za","contact":"Suzanne","type":"Countryside, rustic, destination, farm"},{"id":40,"name":"Eikenhof Estate","email":"info@eikenhofestate.co.za","contact":"Not available","type":"Wine farm, boutique, elegant, rustic charm, intimate, up to 120 guests"},{"id":41,"name":"Emily Moon River Lodge","email":"events@emilymoon.co.za","contact":"Not available","type":"Luxury, river lodge, intimate, romantic, outdoor"},{"id":42,"name":"Erinvale Estate Hotel & Spa","email":"conf@erinvale.co.za","contact":"Not available","type":"Luxury, elegant, intimate, destination"},{"id":43,"name":"Fancourt Hotel","email":"reservations@fancourt.co.za","contact":"Not available","type":"Luxury, golf resort, estate, large-scale"},{"id":44,"name":"Fordoun Hotel And Spa","email":"events@fordoun.co.za","contact":"Not available","type":"Country, elegant, stylish, large-scale"},{"id":45,"name":"Four Seasons Hotel The Westcliff","email":"reservations@westcliff.co.za","contact":"Zamantungwa Nyaose","type":"Luxury, urban, garden, ballroom, elegant"},{"id":46,"name":"Galagos Country Estate","email":"web@galagos.co.za","contact":"Lichelle Prinsloo","type":"Forest, elegant, luxury, nature-inspired, rustic"},{"id":47,"name":"Glenburn Lodge & Spa","email":"weddings@glenburn.co.za","contact":"Not available","type":"Country, nature, riverfront, mountain, large-scale, intimate"},{"id":48,"name":"Grand Africa Café & Beach","email":"beach@grandafrica.co.za","contact":"Not available","type":"Beach, luxury, large-scale"},{"id":49,"name":"Grande Provence Heritage Wine Estate","email":"events@grandeprovence.co.za","contact":"Anine Bezuidenhoudt","type":"Wine farm, elegant, historic, intimate, luxury"},{"id":50,"name":"Green Leaves Country Lodge","email":"info@greenleaves.co.za","contact":"Jeannine","type":"Luxury, country, intimate, large-scale, bespoke"},{"id":51,"name":"Ground The Venue","email":"info@projectground.co.za","contact":"Robyn Cronje","type":"Farm, rustic, outdoor, garden, vineyard"},{"id":52,"name":"Hartford House","email":"events@hartford.co.za","contact":"Casey McGee","type":"Historic, elegant, romantic, estate, luxury, boutique"},{"id":53,"name":"Haycroft Farm","email":"stay@haycroftfarm.com","contact":"Pippa Richards-Edwards","type":"Country, forest, farm, exclusive"},{"id":54,"name":"Hazendal Wine Estate","email":"weddings@hazendal.co.za","contact":"Not available","type":"Wine farm, elegant, historic, countryside, luxury"},{"id":55,"name":"Highgate Ostrich Show Farm","email":"reservations@highgate.co.za","contact":"Billy Engelbrecht","type":"Rustic, intimate, large-scale, farm"},{"id":56,"name":"Holden Manz Wine Estate","email":"events@holdenmanz.com","contact":"Not available","type":"Wine farm, elegant, picturesque, outdoor"},{"id":57,"name":"INsingizi Bush Weddings And Spa","email":"hello@insingizi.co.za","contact":"Not available","type":"Bush, intimate, private, outdoor"},{"id":58,"name":"In The Woods","email":"info@inthewoods.co.za","contact":"Not available","type":"Forest, country, rustic, intimate, large-scale"},{"id":59,"name":"Inimitable Wedding Venue","email":"info@staybyinimitable.com","contact":"Zavion Kotze-Brereton","type":"Luxury, modern, large-scale"},{"id":60,"name":"Karkloof Safari Spa","email":"kirsten@karkloofsafarispa.com","contact":"Kirsten","type":"Safari, nature, private reserve, elegant"},{"id":61,"name":"Kay And Monty Vineyards","email":"hello@kayandmonty.com","contact":"Not available","type":"Wine farm, country, greenhouse, private estate"},{"id":62,"name":"Kearsney Manor","email":"info@kearsneymanor.co.za","contact":"Andrew","type":"Historic, colonial, country, heritage, garden"},{"id":63,"name":"Kloofzicht Lodge & Spa","email":"weddings@kloofzicht.co.za","contact":"Not available","type":"Nature reserve, lodge, scenic, outdoor, large-scale"},{"id":64,"name":"Kuungana Bush Lodge","email":"info@kuunganabushlodge.co.za","contact":"Michelle Janse Van Rensburg","type":"Bushveld, rustic chic, family-friendly, intimate, large-scale"},{"id":65,"name":"Kwa Maritane Bush Lodge","email":"kwamaritane@legacyhotels.co.za","contact":"Candice Morawitz","type":"Bush, intimate, large-scale, luxury"},{"id":66,"name":"L'Avenir Wine Estate","email":"functions@lavenir.co.za","contact":"Not available","type":"Wine farm, elegant, intimate, destination"},{"id":67,"name":"La Cotte Farm","email":"reception@lacottefarm.com","contact":"Not available","type":"Wine farm, historic, elegant, destination, large-scale"},{"id":68,"name":"La Merveille Function Venue","email":"info.lamerveille@gmail.com","contact":"Not available","type":"Garden, intimate, large-scale, luxury"},{"id":69,"name":"La Paris Estate","email":"events@laparis.co.za","contact":"Surine Van Tonder","type":"Luxury, intimate, large-scale, elegant, destination, outdoor, indoor"},{"id":70,"name":"La Residence","email":"info@laresidence.co.za","contact":"Not available","type":"Luxury, intimate, wine farm, exclusive, elopements"},{"id":71,"name":"Laborie Wine Estate","email":"info@laborieestate.co.za","contact":"Tanya","type":"Wine farm, historic, elegant, large-scale, intimate"},{"id":72,"name":"Lace On Timber","email":"info@laceontimber.com","contact":"Not available","type":"Modern, elegant, romantic, intimate, large-scale"},{"id":73,"name":"Lalibela Game Reserve","email":"stay@lalibela.co.za","contact":"Not available","type":"Safari, game reserve, intimate, destination"},{"id":74,"name":"Landtscap","email":"info@landtscap.co.za","contact":"Tammy","type":"Wine farm, modern, contemporary, scenic, indoor, outdoor"},{"id":75,"name":"Langkloof Roses","email":"info@langkloofroses.co.za","contact":"Not available","type":"Farm, rustic, romantic, garden"},{"id":76,"name":"Lanzerac Wine Estate","email":"events@lanzerac.co.za","contact":"Not available","type":"Wine farm, luxury, romantic, scenic"},{"id":77,"name":"Laurent At Lourensford","email":"functions@laurent.co.za","contact":"Miré De Jongh","type":"Wine farm, elegant, luxury, intimate, large-scale"},{"id":78,"name":"Lavandou Elegant Wedding Venue","email":"info@lavandou.co.za","contact":"Not available","type":"Elegant, French provincial, forest, garden, intimate"},{"id":79,"name":"Lavender Hill Country Estate","email":"info@lavenderhillestate.co.za","contact":"Not available","type":"Country estate, garden, grand, intimate"},{"id":80,"name":"Leriba Hotel And Spa","email":"sales@leriba.co.za","contact":"Not available","type":"Luxury, garden, indoor, large-scale"},{"id":81,"name":"Lieu De Grace","email":"getmarried@lieudegracevenue.co.za","contact":"Vivien","type":"Industrial chic, warehouse, destination"},{"id":82,"name":"Lord's Wines","email":"events@lordswinery.com","contact":"Not available","type":"Wine farm, country, scenic, intimate, large-scale"},{"id":83,"name":"Lynton Hall","email":"ivan@lyntonhall.co.za","contact":"Ivan","type":"Historic, garden, coastal forest, exclusive use"},{"id":84,"name":"Lythwood Lodge","email":"events@lythwood.com","contact":"John","type":"Country, mountain, forest, rustic, intimate, micro-wedding"},{"id":85,"name":"Maison Estate","email":"maison@chefswarehouse.co.za","contact":"Not available","type":"Wine farm, rustic, luxury, intimate, garden"},{"id":86,"name":"Makiti Wedding Venue","email":"info@makiti.co.za","contact":"Not available","type":"Outdoor, elegant, large-scale, intimate"},{"id":87,"name":"Mangwa Valley Game Lodge","email":"info@mangwavalley.co.za","contact":"Not available","type":"Bush, luxury, intimate, large-scale"},{"id":88,"name":"Maroupi Wedding Venue","email":"cheryl@stirlingbridge.co.za","contact":"Cheryl","type":"Rustic, coastal, romantic, scenic, large-scale"},{"id":89,"name":"Memoire Boutique Garden Venue","email":"info@memoire.co.za","contact":"Jaco","type":"Boutique, garden, luxury, elegant"},{"id":90,"name":"Midlands Saddle And Trout","email":"midlandsreservations@firstgroup-sa.co.za","contact":"Not available","type":"Countryside, intimate, rustic"},{"id":91,"name":"MolenVliet Vineyards","email":"events@molenvliet.co.za","contact":"Not available","type":"Wine farm, luxury, exclusive, elegant"},{"id":92,"name":"Mont Rouge","email":"cindy@montrouge.co.za","contact":"Cindy","type":"Farm, garden, mountain, nature"},{"id":93,"name":"Montagu Country Hotel","email":"res@montagucountryhotel.co.za","contact":"Not available","type":"Hotel, intimate, elegant, vintage, Art Deco"},{"id":94,"name":"Monte De Dios","email":"info@montededios.co.za","contact":"Annabella Porta","type":"Boutique, elegant, rustic, nature, modern, glasshouse, intimate, large-scale"},{"id":95,"name":"Montpellier Wine Estate","email":"info@montpellier.co.za","contact":"Not available","type":"Wine farm, historic, intimate, large-scale"},{"id":96,"name":"Morrells Boutique Estate","email":"info@morrells.co.za","contact":"Alicia De Greef","type":"Intimate, unique, vintage, French-style, luxury, boutique"},{"id":97,"name":"Mount Edgecombe Country Club","email":"estatereception@mountedgecombe.com","contact":"Not available","type":"Golf estate, elegant, large-scale, intimate, outdoor"},{"id":98,"name":"Mount Nelson, A Belmond Hotel","email":"reservations.mnh@belmond.com","contact":"Mandy Mavuso","type":"Luxury, historic, city, destination, intimate, large-scale"},{"id":99,"name":"Murasie Wedding Venue","email":"info@murasie.com","contact":"Leana","type":"Nature, rustic, outdoor, scenic"},{"id":100,"name":"Muratie Wine Estate","email":"info@muratie.co.za","contact":"Kim Melck","type":"Wine farm, historic, garden, intimate"},{"id":101,"name":"Nantes Estate","email":"bookings@nantesestate.com","contact":"Not available","type":"Wine farm, elegant, luxury, large-scale, intimate"},{"id":102,"name":"Netherwood Farm","email":"weddings@netherwood.co.za","contact":"Not available","type":"Farm, contemporary, country, intimate, large-scale"},{"id":103,"name":"Nooitgedacht Estate","email":"functions@nooitestate.co.za","contact":"Not available","type":"Wine farm, historic, elegant, indoor, outdoor, intimate, large-scale"},{"id":104,"name":"Oakfield Farm","email":"info@oakfield.co.za","contact":"Carl Visser","type":"Country, farm, elegant, garden"},{"id":105,"name":"Okiep Country Hotel","email":"info@okiep.co.za","contact":"Malcolm Mostert","type":"Country, banquet, private functions, intimate"},{"id":106,"name":"Old Halliwell Country Inn","email":"info@halliwell.co.za","contact":"Not available","type":"Country, garden, historic, intimate, large-scale"},{"id":107,"name":"Olive Rock Wedding And Function Venue","email":"thevenue@oliverock.co.za","contact":"Nick & Simone Stanford","type":"Outdoor, intimate, elegant, rustic, farm"},{"id":108,"name":"Olivewood Private Estate And Golf Club","email":"joinus@olivewoodestate.com","contact":"Not available","type":"Elegant, modern, luxurious, estate, golf course"},{"id":109,"name":"Ollivanders Estate","email":"info@ollivanders.co.za","contact":"Pam Cribbins","type":"Country, garden, intimate, large-scale"},{"id":110,"name":"Oranje Guest Farm","email":"info@oranjegasteplaas.co.za","contact":"Elsa","type":"Farm, rustic, elegant, mountain, large-scale"},{"id":111,"name":"Oxbow Country Estate","email":"info@oxbowestate.co.za","contact":"Michelle","type":"Country, romantic, chic, intimate, exclusive"},{"id":112,"name":"Palala Boutique Game Lodge & Spa","email":"events2@palala.co.za","contact":"Anel Matthysen","type":"Bush, luxury, romantic, exclusive"},{"id":113,"name":"Pecan Manor","email":"info@pecanmanor.co.za","contact":"Louise Venter","type":"Intimate, forest, elegant, outdoor"},{"id":114,"name":"Pezula Nature Retreat","email":"bookings@pezulanatureretreat.com","contact":"Not available","type":"Luxury, nature, intimate, large-scale, beach, elegant"},{"id":115,"name":"Pheasant Hill Boutique Hotel","email":"bookings@pheasanthill.co.za","contact":"Pieter Bezuidenhout","type":"Boutique hotel, garden, intimate, large-scale"},{"id":116,"name":"Premier Resort Mpongo Private Game Reserve","email":"info@mpongo.com","contact":"Not available","type":"Bush, luxury, wildlife, nature"},{"id":117,"name":"Providence Country Estate","email":"info@providencecountryweddings.co.za","contact":"Kevin and Fern McComb","type":"Country, romantic, elegant, farm, indoor, outdoor"},{"id":118,"name":"Red Ivory Lodge","email":"info@redivory.net","contact":"Not available","type":"Contemporary, destination, mountain, large-scale"},{"id":119,"name":"Rickety Bridge Winery","email":"functions@ricketybridge.com","contact":"Eldorét Ferreira","type":"Wine farm, elegant, intimate, outdoor"},{"id":120,"name":"Riverman Cabin Country Lodge","email":"info@rivermancabin.co.za","contact":"Linda","type":"Rustic, country, intimate, nature"},{"id":121,"name":"Riverside Country Estate","email":"info@riverside4me.co.za","contact":"Not available","type":"Country, elegant, nature, wetland"},{"id":122,"name":"Riverstone Lodge","email":"bookings@riverstonelodge.co.za","contact":"Not available","type":"Riverside, garden, intimate, nature, countryside"},{"id":123,"name":"Rosemary Hill","email":"info@rosemaryhill.co.za","contact":"Caryn Gill","type":"Farm, organic, rustic, elegant, weekend getaway"},{"id":124,"name":"Rustique Boutique Hotel","email":"events@rustique.co.za","contact":"Not available","type":"Boutique, country, intimate, year-end function"},{"id":125,"name":"Saronsberg Cellar","email":"events@saronsberg.com","contact":"Shayne Reynolds","type":"Wine farm, elegant, mountain, weekend-long"},{"id":126,"name":"Schoone Oordt Country House","email":"reservations@schooneoordt.co.za","contact":"Alison Walker","type":"Country, luxury, intimate, garden"},{"id":127,"name":"Shamwari Private Game Reserve","email":"reservations@shamwari.com","contact":"Kim Matysik","type":"Safari, luxury, bush, intimate"},{"id":128,"name":"Shepstone Gardens","email":"info@shepstonegardens.co.za","contact":"Jessica Gaisford","type":"Elegant, sophisticated, historic, garden, large-scale"},{"id":129,"name":"Shiluvari Lakeside Lodge","email":"info@shiluvari.com","contact":"Clare Girardin","type":"Lakeside, nature, cultural, intimate"},{"id":130,"name":"Simbithi Country Club","email":"events@simbithi.com","contact":"Nelisiwe Ncama","type":"Country club, eco-estate, rustic, elegant"},{"id":131,"name":"Spier Wine Farm","email":"info@spier.co.za","contact":"Hannes Loubser","type":"Wine farm, historic, outdoor, intimate, large-scale"},{"id":132,"name":"Steenberg Hotel And Spa","email":"reservations@steenberghotel.com","contact":"Not available","type":"Wine farm, luxury, historic, intimate"},{"id":133,"name":"Strandkombuis","email":"contact@strandkombuis.com","contact":"Not available","type":"Beach, rustic, seaside, intimate, large-scale"},{"id":134,"name":"Summerplace Game Reserve","email":"bookings@summerplacegamereserve.com","contact":"Simone Baber","type":"Bushveld, wilderness, weekend celebration, intimate, nature"},{"id":135,"name":"Sun Valley Wedding And Golf Venue","email":"info@sunvalleyweddings.co.za","contact":"Not available","type":"Garden, intimate, nature, golf course"},{"id":136,"name":"Tala Private Game Reserve","email":"info@tala.co.za","contact":"Not available","type":"Safari, bush, destination, traditional, intimate, large-scale"},{"id":137,"name":"Thaba Eco Hotel","email":"reservations@thabahotel.co.za","contact":"Not available","type":"Bushveld, eco-friendly, luxury, nature reserve, large-scale"},{"id":138,"name":"The Black Marlin","email":"reservations@blackmarlin.co.za","contact":"Mercia","type":"Beachfront, ocean view, restaurant, romantic"},{"id":139,"name":"The Boardwalk Hotel","email":"conventions.boardwalk@suninternational.com","contact":"Not available","type":"Luxury, large-scale, premium"},{"id":140,"name":"The Conservatory","email":"Joanne@theconservatory.co.za","contact":"Joanne","type":"Country, garden, indoor/outdoor, versatile"},{"id":141,"name":"The Forest Walk Venue","email":"theforestwalkvenue@gmail.com","contact":"Johan Bray","type":"Forest, garden, country, all-inclusive"},{"id":142,"name":"The Forum Embassy Hill","email":"info@theforum.co.za","contact":"Marelize Smit","type":"Luxury, historic, intimate, elegant, exclusive"},{"id":143,"name":"The Forum White Light","email":"info@theforum.co.za","contact":"Sarah Sokhela","type":"Country, modern, elegant, rustic, intimate"},{"id":144,"name":"The Gallery Wedding Venue","email":"info@thegalleryweddings.co.za","contact":"Not available","type":"Country, elegant, intimate, large-scale"},{"id":145,"name":"The Groves Venue","email":"kate@thegrovesvenue.co.za","contact":"Kate Bain","type":"Country, elegant, farm-style, romantic, indoor, outdoor"},{"id":146,"name":"The Homestead By Karkloof Safari Spa","email":"bookings@karkloofsafarispa.com","contact":"Kirsten","type":"Luxury, nature-immersed, safari, large-scale"},{"id":147,"name":"The Loft Coffee Company","email":"Theloftcoffee.co@gmail.com","contact":"Not available","type":"Farm, jungle, intimate"},{"id":148,"name":"The Marine Hotel","email":"reservations@collectionmcgrath.com","contact":"Not available","type":"Luxury, bespoke, elegant, intimate, seaside, coastal"},{"id":149,"name":"The Moon And Sixpence","email":"info@moonandsixpence.co.za","contact":"Cecilia Kruger","type":"Country, exquisite, private"},{"id":150,"name":"The Oyster Box Hotel","email":"weddingplanner@oysterbox.co.za","contact":"Ginny Eslick","type":"Luxury, beachfront, elegant, intimate, elaborate"},{"id":151,"name":"The Palazzo Montecasino","email":"palazzo.reservations@tsogosun.com","contact":"Catia Viegas","type":"Luxury, elegant, garden, Tuscan-inspired"},{"id":152,"name":"The Plantation","email":"bookings@theplantation.co.za","contact":"Not available","type":"Forest, elegant, romantic, fairy tale"},{"id":153,"name":"The Rosendal Country Retreat","email":"info@therosendal.co.za","contact":"Marius Becker Or Bonni Meyer","type":"Country, destination, intimate, weekend, retreat"},{"id":154,"name":"The Turbine Hotel And Spa","email":"book@turbinehotel.co.za","contact":"Not available","type":"Modern industrial, waterfront, intimate, large-scale"},{"id":155,"name":"The Twelve Apostles Hotel And Spa","email":"weddings@12apostles.co.za","contact":"Sally Shap","type":"Luxury, garden, ocean view, intimate, hotel"},{"id":156,"name":"The Venue At Morgan Bay Hotel","email":"info@morganbayhotel.co.za","contact":"Richard Warren-Smith","type":"Beach, coastal, romantic, elegant"},{"id":157,"name":"The Venue Fontana","email":"mara@thevenuefontana.co.za","contact":"Mara Fontana","type":"Rustic, elegant, farm, coastal"},{"id":158,"name":"The Venue at Wetherby","email":"info@thevenueatwetherby.co.za","contact":"Not available","type":"Timeless elegance, Midlands"},{"id":159,"name":"Tintswalo Atlantic","email":"melissa@tintswalo.com","contact":"Melissa Du Rand","type":"Luxury, intimate, seaside, boutique, romantic"},{"id":160,"name":"Tres Jolie Wedding And Function Venue","email":"info@tresjolie.co.za","contact":"Not available","type":"Country, rustic, elegant, outdoor, intimate, large-scale"},{"id":161,"name":"Tsala Treetop Lodge","email":"weddings@hunterhotels.com","contact":"Not available","type":"Forest, intimate, luxury, bespoke"},{"id":162,"name":"Umthunzi Hotel & Conference","email":"reservations@umthunzi.co.za","contact":"Not available","type":"Coastal, beach, tropical, elegant, relaxed, romantic, intimate, large-scale"},{"id":163,"name":"Val de Vie Estate","email":"simone@valdevie.co.za","contact":"Simone","type":"Luxury, wine farm, polo estate, elegant"},{"id":164,"name":"Vergelegen Wine Estate","email":"events@vergelegen.co.za","contact":"Not available","type":"Wine farm, elegant, intimate, formal, garden"},{"id":165,"name":"Victoria Yards","email":"mike@sl8.co.za","contact":"Mike Walker","type":"Industrial, urban, creative, artistic, outdoor, indoor"},{"id":166,"name":"Villa Castollini","email":"functions@castollini.co.za","contact":"Not available","type":"Luxury, glamorous, large-scale, intimate, lagoon view, beach"},{"id":167,"name":"Vivari Hotel Jala Pavilion","email":"info@vivarihotel.co.za","contact":"Not available","type":"Luxury, garden, intimate, outdoor"},{"id":168,"name":"Volmoed","email":"admin@volmoed.co.za","contact":"Not available","type":"Retreat, intimate, peaceful, nature"},{"id":169,"name":"Vondeling Wines","email":"info@vondelingwines.co.za","contact":"Hilani Van Der Merwe","type":"Wine farm, elegant, rustic charm, intimate, country style"},{"id":170,"name":"Vrede en Lust Estate","email":"functions@vnl.co.za","contact":"Not available","type":"Wine farm, elegant, historic, destination"},{"id":171,"name":"Vredenheim","email":"feestafel@vredenheim.co.za","contact":"Anne","type":"Wine farm, intimate, garden, elegant"},{"id":172,"name":"Walkersons Hotel And Spa","email":"reservations@walkersons.co.za","contact":"Not available","type":"Small, intimate, country estate, romantic"},{"id":173,"name":"Webersburg Wine Estate","email":"events@webersburg.co.za","contact":"Jolandi Viljoen","type":"Wine farm, historic, elegant, boutique, intimate, large-scale"},{"id":174,"name":"Welgelegen Cherry Estate","email":"info@cherryestate.co.za","contact":"Fanie Grobbelaar","type":"Farm, scenic, weekend destination, rustic-meets-modern"},{"id":175,"name":"Weltevreden Estate","email":"info@weltevredenestate.com","contact":"Not available","type":"Wine farm, elegant, historic, family-friendly"},{"id":176,"name":"Whispering Thorns","email":"info@whisperingthorns.com","contact":"Marinda","type":"Luxury, bushveld, glass venue, modern safari, destination, all-inclusive"},{"id":177,"name":"Zebra Country Lodge","email":"reservations@zebralodge.com","contact":"Not available","type":"Bushveld, nature reserve, country, indoor, outdoor"},{"id":178,"name":"Zimbali Resort","email":"zimbali@thecapital.co.za","contact":"Christo Van Wyk","type":"Luxury, coastal, intimate, large-scale, resort"},{"id":179,"name":"Zorgvliet Wines","email":"info@zorgvliet.com","contact":"Not available","type":"Wine farm, elegant, country, garden"}];

const CONTENT_CALENDAR = [
  { week:1, theme:"Music as Emotional Architecture", posts:[
    { id:"p_w1_1", day:"Mon 9 Jun",  type:"Single Image", title:"Music as the connective tissue",           done:true  },
    { id:"p_w1_2", day:"Wed 11 Jun", type:"Carousel · 5 slides", title:"Pre-drinks — the most underplanned moment", done:true  },
    { id:"p_w1_3", day:"Fri 13 Jun", type:"Single Image", title:"The music tab still says TBD",             done:true  },
  ]},
  { week:2, theme:"The Moments", posts:[
    { id:"p_w2_1", day:"Mon 16 Jun", type:"Single Image", title:"The processional question",                done:true  },
    { id:"p_w2_2", day:"Wed 18 Jun", type:"Carousel · 5 slides", title:"She wants acoustic. He wants the floor packed.", done:true },
    { id:"p_w2_3", day:"Fri 20 Jun", type:"Single Image", title:"The last song",                            done:true  },
  ]},
  { week:3, theme:"The Insider Knowledge", posts:[
    { id:"p_w3_1", day:"Mon 23 Jun", type:"Carousel · 6 slides", title:"What a live band quote actually includes", done:false },
    { id:"p_w3_2", day:"Wed 25 Jun", type:"Single Image", title:"The sound check",                          done:false },
    { id:"p_w3_3", day:"Fri 27 Jun", type:"Single Image", title:"For the planner — the brief problem",      done:false },
  ]},
  { week:4, theme:"The Product in Motion", posts:[
    { id:"p_w4_1", day:"Mon 30 Jun", type:"Carousel · 5 slides", title:"The question nobody asked",        done:false },
    { id:"p_w4_2", day:"Wed 2 Jul",  type:"Single Image", title:"What a Music Portrait looks like",         done:false },
    { id:"p_w4_3", day:"Fri 4 Jul",  type:"Single Image", title:"The booking window",                       done:false },
  ]},
  { week:5, theme:"The SA Context", posts:[
    { id:"p_w5_1", day:"Mon 7 Jul",  type:"Carousel · 5 slides", title:"Planning an SA wedding from abroad", done:false },
    { id:"p_w5_2", day:"Wed 9 Jul",  type:"Carousel · 4 slides", title:"The generation gap",                done:false },
    { id:"p_w5_3", day:"Fri 11 Jul", type:"Single Image", title:"The Winelands in summer",                  done:false },
  ]},
  { week:6, theme:"The Close", posts:[
    { id:"p_w6_1", day:"Mon 14 Jul", type:"Carousel · 5 slides", title:"The moment it landed — real story", done:false },
    { id:"p_w6_2", day:"Wed 16 Jul", type:"Single Image", title:"What the brief does — for planners",       done:false },
    { id:"p_w6_3", day:"Fri 18 Jul", type:"Single Image", title:"The closing post — pianist hands",         done:false },
  ]},
];
const STORAGE_KEY = "wedin_gtm_v3";

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-ZA", { weekday:"short", day:"numeric", month:"short" });
}

function weekday(offset) {
  const d = new Date(LAUNCH_DATE);
  let added = 0;
  while (added < offset) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d.toISOString().slice(0,10);
}

// Build venue schedule: 10/day across 18 weekdays
function buildVenueSchedule() {
  const schedule = {};
  VENUES.forEach((v, i) => {
    const dayIndex = Math.floor(i / 10);
    const dateStr = weekday(dayIndex);
    if (!schedule[dateStr]) schedule[dateStr] = [];
    schedule[dateStr].push(v);
  });
  return schedule;
}

const VENUE_SCHEDULE = buildVenueSchedule();

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily:"'DM Sans', system-ui, sans-serif", background:CREAM, minHeight:"100vh", color:NAVY },
  header: { background:NAVY, padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  logo: { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:22, color:CREAM, letterSpacing:"0.02em", fontWeight:600 },
  subtitle: { fontSize:11, color:GREY, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:2 },
  nav: { display:"flex", gap:0, background:NAVY, borderTop:`1px solid rgba(255,255,255,0.08)`, padding:"0 24px" },
  navBtn: (active) => ({
    padding:"12px 16px", fontSize:12, letterSpacing:"0.06em", textTransform:"uppercase",
    fontWeight:active?600:400, color:active?GOLD:CREAM+"99", background:"none", border:"none",
    borderBottom:active?`2px solid ${GOLD}`:"2px solid transparent", cursor:"pointer",
    transition:"all 0.15s",
  }),
  body: { padding:"24px", maxWidth:860, margin:"0 auto" },
  card: { background:"#fff", border:`1px solid ${LIGHT}`, borderRadius:8, padding:"16px 20px", marginBottom:12 },
  cardHover: { background:"#fff", border:`1px solid ${LIGHT}`, borderRadius:8, padding:"16px 20px", marginBottom:12, cursor:"pointer" },
  h1: { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:32, fontWeight:600, color:NAVY, margin:"0 0 4px" },
  h2: { fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:GOLD, fontWeight:600, margin:"0 0 16px" },
  h3: { fontSize:13, color:GREY, margin:"0 0 12px" },
  meta: { fontSize:11, color:GREY },
  tag: (color) => ({ display:"inline-block", padding:"2px 8px", borderRadius:4, fontSize:10, letterSpacing:"0.04em", fontWeight:600, textTransform:"uppercase", background:color+"18", color:color, marginRight:4 }),
  pill: { display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:"0.04em" },
  input: { width:"100%", border:`1px solid ${LIGHT}`, borderRadius:4, padding:"6px 10px", fontSize:12, color:NAVY, background:CREAM, fontFamily:"'DM Sans', sans-serif", boxSizing:"border-box" },
  textarea: { width:"100%", border:`1px solid ${LIGHT}`, borderRadius:4, padding:"6px 10px", fontSize:12, color:NAVY, background:CREAM, fontFamily:"'DM Sans', sans-serif", resize:"vertical", boxSizing:"border-box" },
  row: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 },
  btn: (active, color=GOLD) => ({
    padding:"6px 14px", fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase",
    border:`1px solid ${active?color:LIGHT}`, borderRadius:4, cursor:"pointer",
    background:active?color:"transparent", color:active?"#fff":GREY, whiteSpace:"nowrap", transition:"all 0.15s",
  }),
  statBox: { background:"#fff", border:`1px solid ${LIGHT}`, borderRadius:8, padding:"16px 20px", textAlign:"center" },
  statNum: { fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:36, fontWeight:600, color:NAVY, lineHeight:1 },
  statLabel: { fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:GREY, marginTop:4 },
  progressBar: (pct, color=GOLD) => ({
    height:4, background:LIGHT, borderRadius:2, overflow:"hidden", marginTop:8,
    position:"relative",
  }),
  progressFill: (pct, color=GOLD) => ({
    height:"100%", width:`${Math.min(pct,100)}%`, background:color, borderRadius:2, transition:"width 0.3s",
  }),
  divider: { height:1, background:LIGHT, margin:"16px 0" },
  section: { marginBottom:28 },
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const C_STATUS = {
  to_email:    { label:"To Email",    color:GREY },
  followed:    { label:"Followed",    color:"#5B8DB8" },
  emailed:     { label:"Emailed",     color:"#B8935B" },
  coupon_sent: { label:"Coupon Sent", color:GOLD },
  replied:     { label:"Replied",     color:"#5BB87A" },
  activated:   { label:"Activated",   color:"#2D7D46" },
};
const STATUS_CYCLE = ["to_email","followed","emailed","coupon_sent","replied","activated"];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]   = useState("today");
  const [state, setState] = useState(loadState);

  const set = useCallback((key, val) => {
    setState(prev => {
      const next = { ...prev, [key]: val };
      saveState(next);
      return next;
    });
  }, []);

  const get = useCallback((key, def="") => {
    return state[key] !== undefined ? state[key] : def;
  }, [state]);

  // Derived metrics
  const venueSent     = VENUES.filter(v => get(`v_sent_${v.id}`) === true).length;
  const coordEmailed  = COORDINATORS.filter(c => ["emailed","coupon_sent","replied","activated"].includes(get(`c_status_${c.id}`, c.status))).length;
  const coordActivated = COORDINATORS.filter(c => get(`c_status_${c.id}`, c.status) === "activated").length;
  const postsDone     = CONTENT_CALENDAR.flatMap(w=>w.posts).filter(p => get(`post_done_${p.id}`, p.done) === true).length;
  const todayStr      = today();

  const tabs = [
    { id:"today",     label:"Today"      },
    { id:"pipeline",  label:"Coordinators" },
    { id:"venues",    label:"Venues"     },
    { id:"content",   label:"Content"    },
    { id:"metrics",   label:"Metrics"    },
  ];

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div>
          <div style={S.logo}>wedin.ai</div>
          <div style={S.subtitle}>GTM Command Centre · {new Date().toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
      </div>
      <nav style={S.nav}>
        {tabs.map(t => (
          <button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </nav>
      <div style={S.body}>
        {tab==="today"    && <Today    get={get} set={set} venueSent={venueSent} coordEmailed={coordEmailed} postsDone={postsDone} todayStr={todayStr} />}
        {tab==="pipeline" && <Pipeline get={get} set={set} coordEmailed={coordEmailed} coordActivated={coordActivated} />}
        {tab==="venues"   && <Venues   get={get} set={set} venueSent={venueSent} todayStr={todayStr} />}
        {tab==="content"  && <Content  get={get} set={set} postsDone={postsDone} />}
        {tab==="metrics"  && <Metrics  get={get} set={set} />}
      </div>
    </div>
  );
}

// ─── TODAY ────────────────────────────────────────────────────────────────────
function Today({ get, set, venueSent, coordEmailed, postsDone, todayStr }) {
  const sessions  = get("metric_sessions_today",  "—");
  const captures  = get("metric_captures_today",  "—");
  const payments  = get("metric_payments_today",  "—");

  // Today's venue batch
  const todayVenues = VENUE_SCHEDULE[todayStr] || [];
  const todayVenueSent = todayVenues.filter(v => get(`v_sent_${v.id}`) === true).length;

  // Today's coordinators to email (next 3 with status to_email or followed)
  const todayCoords = COORDINATORS
    .filter(c => ["to_email","followed"].includes(get(`c_status_${c.id}`, c.status)))
    .slice(0,3);

  // Next post
  const allPosts = CONTENT_CALENDAR.flatMap(w=>w.posts);
  const nextPost = allPosts.find(p => !get(`post_done_${p.id}`, p.done));
  const weekTheme = CONTENT_CALENDAR.find(w => w.posts.some(p => !get(`post_done_${p.id}`, p.done)));

  return (
    <div>
      <div style={S.section}>
        <div style={S.h2}>Today's Overview</div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20}}>
          {[
            { label:"Sessions Today",  key:"metric_sessions_today" },
            { label:"Captures Today",  key:"metric_captures_today" },
            { label:"Payments Today",  key:"metric_payments_today" },
          ].map(m => (
            <div key={m.key} style={S.statBox}>
              <div style={S.statNum}>{get(m.key,"—")}</div>
              <div style={S.statLabel}>{m.label}</div>
              <input
                style={{...S.input, marginTop:8, textAlign:"center"}}
                placeholder="Enter number"
                value={get(m.key,"")}
                onChange={e => set(m.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={S.section}>
        <div style={S.h2}>Morning Briefing</div>
        <div style={S.card}>
          <div style={{borderLeft:`3px solid ${GOLD}`, paddingLeft:12}}>
            <div style={{fontSize:13, color:NAVY, lineHeight:1.7}}>
              <div>Venues emailed to date: <strong>{venueSent} / 179</strong> · {179-venueSent} remaining</div>
              <div>Coordinators in pipeline: <strong>{coordEmailed} / {COORDINATORS.length}</strong> contacted</div>
              <div>Content published: <strong>{postsDone} / {CONTENT_CALENDAR.flatMap(w=>w.posts).length}</strong> posts</div>
            </div>
          </div>
        </div>
      </div>

      <div style={S.section}>
        <div style={S.h2}>Coordinator Outreach — 3 today</div>
        {todayCoords.length === 0
          ? <div style={S.card}><div style={{color:GREY, fontSize:13}}>All coordinators contacted. Time to find more.</div></div>
          : todayCoords.map(c => (
            <CoordinatorCard key={c.id} c={c} get={get} set={set} compact />
          ))
        }
      </div>

      <div style={S.section}>
        <div style={S.h2}>Venue Outreach — {todayVenues.length > 0 ? `${todayVenueSent}/${todayVenues.length} sent today` : "No venues scheduled today"}</div>
        {todayVenues.length === 0
          ? <div style={S.card}><div style={{color:GREY, fontSize:13}}>No venue emails scheduled for today. Check the Venues tab.</div></div>
          : (
            <div style={S.card}>
              <div style={{...S.row, marginBottom:12}}>
                <div>
                  <div style={{fontWeight:600, fontSize:13}}>{todayVenueSent} / {todayVenues.length} sent</div>
                  <div style={S.meta}>{todayVenues.map(v=>v.name).join(" · ")}</div>
                </div>
                <button
                  style={S.btn(todayVenueSent===todayVenues.length)}
                  onClick={() => todayVenues.forEach(v => set(`v_sent_${v.id}`, true))}
                >Mark All Done</button>
              </div>
              <div style={S.progressBar()}>
                <div style={S.progressFill(todayVenueSent/todayVenues.length*100)} />
              </div>
            </div>
          )
        }
      </div>

      <div style={S.section}>
        <div style={S.h2}>Instagram</div>
        <div style={S.card}>
          {nextPost
            ? <>
                <div style={{fontSize:12, color:GREY, marginBottom:4}}>Next post</div>
                <div style={{fontWeight:600, fontSize:13}}>{nextPost.title}</div>
                <div style={S.meta}>{nextPost.day} · {nextPost.type} · {weekTheme?.theme}</div>
              </>
            : <div style={{color:GREY, fontSize:13}}>All posts published. Campaign complete.</div>
          }
        </div>
      </div>

      <div style={S.section}>
        <div style={S.h2}>Notes</div>
        <textarea
          style={{...S.textarea, minHeight:80}}
          placeholder="Daily notes, follow-ups, ideas..."
          value={get(`notes_${todayStr}`,"")}
          onChange={e => set(`notes_${todayStr}`, e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── COORDINATOR CARD ────────────────────────────────────────────────────────
function CoordinatorCard({ c, get, set, compact=false }) {
  const [open, setOpen] = useState(false);
  const status = get(`c_status_${c.id}`, c.status);
  const notes  = get(`c_notes_${c.id}`,  c.notes);
  const date   = get(`c_date_${c.id}`,   "");
  const cfg    = C_STATUS[status] || C_STATUS.to_email;

  function cycleStatus() {
    const idx = STATUS_CYCLE.indexOf(status);
    const next = STATUS_CYCLE[(idx+1) % STATUS_CYCLE.length];
    set(`c_status_${c.id}`, next);
    if (!date) set(`c_date_${c.id}`, today());
  }

  return (
    <div style={{...S.card, borderLeft:`3px solid ${cfg.color}`}}>
      <div style={S.row}>
        <div style={{flex:1, cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
          <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
            <span style={{fontWeight:600, fontSize:13}}>{c.biz}</span>
            {c.name && <span style={{fontSize:11, color:GREY}}>{c.name}</span>}
            {c.handle && <span style={{fontSize:11, color:GREY}}>{c.handle}</span>}
          </div>
          <div style={S.meta}>{c.region}{date ? ` · ${fmtDate(date)}` : ""}</div>
          {notes && !open && <div style={{fontSize:11, color:GREY, marginTop:2, fontStyle:"italic"}}>{notes.slice(0,60)}{notes.length>60?"…":""}</div>}
        </div>
        <button style={S.btn(["emailed","coupon_sent","replied","activated"].includes(status), cfg.color)} onClick={cycleStatus}>
          {cfg.label}
        </button>
      </div>
      {open && (
        <div style={{marginTop:12}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8}}>
            <div>
              <div style={{...S.meta, marginBottom:3}}>Date contacted</div>
              <input
                type="date"
                style={S.input}
                value={date}
                onChange={e => set(`c_date_${c.id}`, e.target.value)}
              />
            </div>
            <div>
              <div style={{...S.meta, marginBottom:3}}>Status</div>
              <select
                style={{...S.input}}
                value={status}
                onChange={e => set(`c_status_${c.id}`, e.target.value)}
              >
                {STATUS_CYCLE.map(s => <option key={s} value={s}>{C_STATUS[s].label}</option>)}
              </select>
            </div>
          </div>
          <div style={{...S.meta, marginBottom:3}}>Notes</div>
          <textarea
            style={{...S.textarea, minHeight:60}}
            value={notes}
            onChange={e => set(`c_notes_${c.id}`, e.target.value)}
            placeholder="Notes, replies, next steps..."
          />
        </div>
      )}
    </div>
  );
}

// ─── PIPELINE ────────────────────────────────────────────────────────────────
function Pipeline({ get, set, coordEmailed, coordActivated }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const counts = {};
  STATUS_CYCLE.forEach(s => {
    counts[s] = COORDINATORS.filter(c => get(`c_status_${c.id}`, c.status) === s).length;
  });

  const filtered = COORDINATORS.filter(c => {
    const s = get(`c_status_${c.id}`, c.status);
    const matchFilter = filter==="all" || s===filter;
    const matchSearch = !search || c.biz.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pct = Math.round(coordEmailed / COORDINATORS.length * 100);

  return (
    <div>
      <div style={S.section}>
        <div style={S.h2}>Coordinator Pipeline</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20}}>
          <div style={S.statBox}>
            <div style={S.statNum}>{coordEmailed}</div>
            <div style={S.statLabel}>Contacted</div>
            <div style={{...S.progressBar(), marginTop:8}}><div style={S.progressFill(pct)} /></div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>{COORDINATORS.length - coordEmailed}</div>
            <div style={S.statLabel}>Remaining</div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>{coordActivated}</div>
            <div style={S.statLabel}>Activated</div>
          </div>
        </div>

        <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:12}}>
          {[["all","All"], ...STATUS_CYCLE.map(s=>[s, C_STATUS[s].label])].map(([val,label]) => (
            <button key={val} style={S.btn(filter===val)} onClick={()=>setFilter(val)}>
              {label}{val!=="all" ? ` (${counts[val]||0})` : ` (${COORDINATORS.length})`}
            </button>
          ))}
        </div>
        <input
          style={{...S.input, marginBottom:16}}
          placeholder="Search coordinators..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>

      {filtered.map(c => (
        <CoordinatorCard key={c.id} c={c} get={get} set={set} />
      ))}
      {filtered.length===0 && <div style={{...S.card, color:GREY, fontSize:13}}>No matches.</div>}
    </div>
  );
}

// ─── VENUES ──────────────────────────────────────────────────────────────────
function Venues({ get, set, venueSent, todayStr }) {
  const [selectedDay, setSelectedDay] = useState(todayStr);
  const [search, setSearch] = useState("");

  const scheduleDays = Object.keys(VENUE_SCHEDULE).sort();
  const dayVenues = VENUE_SCHEDULE[selectedDay] || [];
  const daySent = dayVenues.filter(v => get(`v_sent_${v.id}`) === true).length;

  const searchResults = search.length > 1
    ? VENUES.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()))
    : null;

  const pct = Math.round(venueSent / 179 * 100);

  return (
    <div>
      <div style={S.section}>
        <div style={S.h2}>Venue Outreach Pipeline</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20}}>
          <div style={S.statBox}>
            <div style={S.statNum}>{venueSent}</div>
            <div style={S.statLabel}>Sent</div>
            <div style={{...S.progressBar(), marginTop:8}}><div style={S.progressFill(pct)} /></div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>{179 - venueSent}</div>
            <div style={S.statLabel}>Remaining</div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>179</div>
            <div style={S.statLabel}>Total Venues</div>
          </div>
        </div>
      </div>

      <div style={S.section}>
        <input
          style={{...S.input, marginBottom:16}}
          placeholder="Search venues by name or email..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />

        {searchResults ? (
          <>
            <div style={S.h3}>{searchResults.length} results for "{search}"</div>
            {searchResults.map(v => <VenueRow key={v.id} v={v} get={get} set={set} />)}
          </>
        ) : (
          <>
            <div style={S.h2}>Daily Schedule — 10 venues/day</div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:16}}>
              {scheduleDays.map(d => {
                const dv = VENUE_SCHEDULE[d] || [];
                const ds = dv.filter(v => get(`v_sent_${v.id}`) === true).length;
                const done = ds === dv.length;
                const isToday = d === todayStr;
                return (
                  <button
                    key={d}
                    style={{...S.btn(selectedDay===d || isToday), borderColor:done?GOLD:isToday?NAVY:LIGHT, position:"relative"}}
                    onClick={()=>setSelectedDay(d)}
                  >
                    {fmtDate(d)}
                    {done && <span style={{marginLeft:4, color:GOLD}}>✓</span>}
                  </button>
                );
              })}
            </div>

            <div style={{...S.card, marginBottom:16}}>
              <div style={{...S.row, marginBottom:8}}>
                <div>
                  <div style={{fontWeight:600, fontSize:13}}>{fmtDate(selectedDay)} — {daySent}/{dayVenues.length} sent</div>
                  <div style={S.meta}>{dayVenues.slice(0,3).map(v=>v.name).join(", ")}{dayVenues.length>3?` +${dayVenues.length-3} more`:""}</div>
                </div>
                <button
                  style={S.btn(daySent===dayVenues.length && dayVenues.length>0)}
                  onClick={()=>dayVenues.forEach(v=>set(`v_sent_${v.id}`,true))}
                >Mark All Sent</button>
              </div>
              <div style={S.progressBar()}>
                <div style={S.progressFill(dayVenues.length>0?daySent/dayVenues.length*100:0)} />
              </div>
            </div>

            {dayVenues.map(v => <VenueRow key={v.id} v={v} get={get} set={set} />)}
          </>
        )}
      </div>
    </div>
  );
}

function VenueRow({ v, get, set }) {
  const [open, setOpen] = useState(false);
  const sent = get(`v_sent_${v.id}`) === true;
  const replied = get(`v_replied_${v.id}`, false);
  const notes = get(`v_notes_${v.id}`, "");
  const date = get(`v_date_${v.id}`, "");

  return (
    <div style={{...S.card, borderLeft:`3px solid ${sent?GOLD:LIGHT}`}}>
      <div style={S.row}>
        <div style={{flex:1, cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
          <div style={{fontWeight:600, fontSize:13}}>{v.name}</div>
          <div style={S.meta}>{v.email}{v.contact && v.contact !== "Not available" ? ` · ${v.contact}` : ""}</div>
          {v.type && <div style={{fontSize:10, color:GREY, marginTop:2}}>{v.type.split(",").slice(0,3).join(", ")}</div>}
        </div>
        <div style={{display:"flex", gap:6, flexDirection:"column", alignItems:"flex-end"}}>
          <button style={S.btn(sent)} onClick={()=>set(`v_sent_${v.id}`, !sent)}>
            {sent?"Sent ✓":"Mark Sent"}
          </button>
          {sent && <button style={{...S.btn(replied, "#5BB87A"), fontSize:10}} onClick={()=>set(`v_replied_${v.id}`, !replied)}>
            {replied?"Replied ✓":"Replied?"}
          </button>}
        </div>
      </div>
      {open && (
        <div style={{marginTop:12}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8}}>
            <div>
              <div style={{...S.meta, marginBottom:3}}>Date sent</div>
              <input type="date" style={S.input} value={date} onChange={e=>set(`v_date_${v.id}`, e.target.value)} />
            </div>
          </div>
          <div style={{...S.meta, marginBottom:3}}>Notes / reply summary</div>
          <textarea style={{...S.textarea, minHeight:50}} value={notes} onChange={e=>set(`v_notes_${v.id}`, e.target.value)} placeholder="Any reply or follow-up notes..." />
        </div>
      )}
    </div>
  );
}

// ─── CONTENT ─────────────────────────────────────────────────────────────────
function Content({ get, set, postsDone }) {
  const total = CONTENT_CALENDAR.flatMap(w=>w.posts).length;
  return (
    <div>
      <div style={S.section}>
        <div style={S.h2}>Content Calendar — 6 Weeks</div>
        <div style={{...S.card, marginBottom:20}}>
          <div style={S.row}>
            <div>
              <div style={{fontWeight:600, fontSize:13}}>{postsDone} / {total} posts published</div>
              <div style={S.meta}>Mon / Wed / Fri · 9 Jun – 18 Jul 2026</div>
            </div>
            <div style={{fontSize:11, color:GOLD, fontWeight:600}}>{Math.round(postsDone/total*100)}%</div>
          </div>
          <div style={{...S.progressBar(), marginTop:8}}>
            <div style={S.progressFill(postsDone/total*100)} />
          </div>
        </div>
      </div>

      {CONTENT_CALENDAR.map((w,wi) => (
        <div key={wi} style={S.section}>
          <div style={S.h2}>Week {w.week} — {w.theme}</div>
          {w.posts.map(p => {
            const done = get(`post_done_${p.id}`, p.done) === true;
            return (
              <div key={p.id} style={{...S.card, borderLeft:`3px solid ${done?GOLD:LIGHT}`}}>
                <div style={S.row}>
                  <div>
                    <div style={{fontWeight:600, fontSize:13, color:done?GREY:NAVY}}>{p.title}</div>
                    <div style={S.meta}>{p.day} · <span style={{color:GOLD+"99"}}>{p.type}</span></div>
                  </div>
                  <button style={S.btn(done)} onClick={()=>set(`post_done_${p.id}`, !done)}>
                    {done?"Published ✓":"To do"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── METRICS ─────────────────────────────────────────────────────────────────
function Metrics({ get, set }) {
  const weeks = Array.from({length:6},(_,i)=>i+1);
  return (
    <div>
      <div style={S.section}>
        <div style={S.h2}>Weekly Metrics Log</div>
        <div style={S.h3}>Track conversion funnel weekly. Sessions → Captures → Payments.</div>
      </div>

      {weeks.map(w => {
        const prefix = `wk${w}_`;
        return (
          <div key={w} style={S.card}>
            <div style={{fontWeight:600, fontSize:13, color:GOLD, marginBottom:12}}>Week {w}</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8}}>
              {[
                { label:"Sessions Started", key:"sessions" },
                { label:"Email Captures",   key:"captures" },
                { label:"Payments",         key:"payments" },
              ].map(m => (
                <div key={m.key}>
                  <div style={{...S.meta, marginBottom:3}}>{m.label}</div>
                  <input
                    style={S.input}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={get(prefix+m.key,"")}
                    onChange={e=>set(prefix+m.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div style={{marginTop:8}}>
              <div style={{...S.meta, marginBottom:3}}>Notes</div>
              <textarea style={{...S.textarea, minHeight:44}} value={get(prefix+"notes","")} onChange={e=>set(prefix+"notes",e.target.value)} placeholder="What moved this week, what didn't..." />
            </div>
          </div>
        );
      })}

      <div style={S.section}>
        <div style={S.h2}>All-time Totals</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
          {["sessions","captures","payments"].map(k => {
            const total = weeks.reduce((sum,w)=>sum+(parseInt(get(`wk${w}_${k}`,"0"))||0),0);
            return (
              <div key={k} style={S.statBox}>
                <div style={S.statNum}>{total}</div>
                <div style={S.statLabel}>{k.charAt(0).toUpperCase()+k.slice(1)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
