import { useState, useEffect, useCallback } from "react";

// ─── CAMPAIGN DATA ────────────────────────────────────────────────
const CAMPAIGN = [
  { week:1, theme:"The Problem Nobody Names", posts:[
    { date:"2026-06-09", day:"Mon 9 Jun",  type:"Carousel",         title:"Why couples regret their wedding music" },
    { date:"2026-06-11", day:"Wed 11 Jun", type:"Reel",             title:"The moment map — every transition explained" },
    { date:"2026-06-13", day:"Fri 13 Jun", type:"Behind the Build", title:"Why I built this after 100+ weddings" },
  ]},
  { week:2, theme:"The Ceremony", posts:[
    { date:"2026-06-16", day:"Mon 16 Jun", type:"Carousel",    title:"Most neglected moment — ceremony music" },
    { date:"2026-06-18", day:"Wed 18 Jun", type:"Social Proof",title:"Real portrait output — ceremony section" },
    { date:"2026-06-20", day:"Fri 20 Jun", type:"The Prompt",  title:"3 questions that reveal your ceremony sound" },
  ]},
  { week:3, theme:"The First Dance", posts:[
    { date:"2026-06-23", day:"Mon 23 Jun", type:"Carousel",    title:"Everyone plans this. Almost no one plans it well." },
    { date:"2026-06-25", day:"Wed 25 Jun", type:"Reel",        title:"First dance formats: band, DJ, acoustic" },
    { date:"2026-06-27", day:"Fri 27 Jun", type:"Social Proof",title:"Real portrait — first dance section" },
  ]},
  { week:4, theme:"The Reception Arc", posts:[
    { date:"2026-06-30", day:"Mon 30 Jun", type:"Carousel",         title:"How a great band builds a room" },
    { date:"2026-07-02", day:"Wed 2 Jul",  type:"The Prompt",       title:"Band vs DJ vs acoustic — the real differences" },
    { date:"2026-07-04", day:"Fri 4 Jul",  type:"Behind the Build", title:"What Tones of Note taught me about reception music" },
  ]},
  { week:5, theme:"Music As Identity", posts:[
    { date:"2026-07-07", day:"Mon 7 Jul",  type:"Carousel",    title:"Your taste tells the story of your relationship" },
    { date:"2026-07-09", day:"Wed 9 Jul",  type:"Social Proof",title:"Real portrait — full output showcase" },
    { date:"2026-07-11", day:"Fri 11 Jul", type:"Reel",        title:"The 20-minute session that changes everything" },
  ]},
  { week:6, theme:"The Brief That Works", posts:[
    { date:"2026-07-14", day:"Mon 14 Jul", type:"Carousel",    title:"What your planner actually needs from you" },
    { date:"2026-07-16", day:"Wed 16 Jul", type:"Social Proof",title:"Coordinator testimonial — the brief they received" },
    { date:"2026-07-18", day:"Fri 18 Jul", type:"The Offer",   title:"Start with the music. R699." },
  ]},
];

const ALL_POSTS = CAMPAIGN.flatMap(w => w.posts.map(p => ({ ...p, week:w.week, theme:w.theme })));

// ─── COORDINATOR SEED ─────────────────────────────────────────────
const COORDINATOR_SEED = [
  { id:"c1",  name:"Nicola Jane",    business:"Nicola Jane Weddings",    instagram:"nicolajaneweddings",           email:"", status:"coupon_sent", dateContacted:"", notes:"Coupon sent. Offered to share with coordinator WhatsApp group (~60 members)." },
  { id:"c2",  name:"Anne Mann",      business:"Anne Mann Weddings",       instagram:"annemannweddings",             email:"", status:"coupon_sent", dateContacted:"", notes:"Coupon sent." },
  { id:"c3",  name:"Nadine",         business:"Works with Anne Mann",     instagram:"",                             email:"", status:"coupon_sent", dateContacted:"", notes:"Coupon sent via Anne Mann." },
  { id:"c4",  name:"Joe Theron",     business:"Works with Anne Mann",     instagram:"",                             email:"", status:"coupon_sent", dateContacted:"", notes:"Coupon sent via Anne Mann." },
  { id:"c5",  name:"Shauna",         business:"Wedding Concepts SA",      instagram:"weddingconceptssa",            email:"", status:"followed",    dateContacted:"", notes:"Cape Town & Cape Winelands." },
  { id:"c6",  name:"Nicole",         business:"Kraak Weddings",           instagram:"kraak.co.za",                  email:"", status:"followed",    dateContacted:"", notes:"Cape Town | Luxury+" },
  { id:"c7",  name:"Dayna",          business:"Strawberry Weddings",      instagram:"",                             email:"", status:"followed",    dateContacted:"", notes:"Stellenbosch / Cape Winelands." },
  { id:"c8",  name:"Madri & Niki",   business:"The Event Planners SA",    instagram:"theeventplannerssa",           email:"", status:"followed",    dateContacted:"", notes:"Cape Town | Full-service." },
  { id:"c9",  name:"",               business:"Ethereal Events Co",       instagram:"",                             email:"", status:"to_email",    dateContacted:"", notes:"Pretoria-based." },
  { id:"c10", name:"",               business:"Oh Happy Day SA",          instagram:"ohhappydaysouthafrica",        email:"", status:"to_email",    dateContacted:"", notes:"National, strong Cape presence." },
  { id:"c11", name:"Nicole",         business:"Planning to Perfection",   instagram:"",                             email:"", status:"to_email",    dateContacted:"", notes:"Johannesburg | Full-service." },
  { id:"c12", name:"Beatrix",        business:"Beatrix Events",           instagram:"",                             email:"", status:"to_email",    dateContacted:"", notes:"Johannesburg | Weddings." },
  { id:"c13", name:"",               business:"Sitting Pretty Bespoke",   instagram:"sitting_pretty_bespoke_events",email:"", status:"followed",   dateContacted:"", notes:"" },
  { id:"c14", name:"",               business:"Otto De Jager Events",     instagram:"ottodejagerevents",            email:"", status:"followed",    dateContacted:"", notes:"" },
  { id:"c15", name:"",               business:"360 Link Events",          instagram:"360link_events",               email:"", status:"followed",    dateContacted:"", notes:"" },
  { id:"c16", name:"",               business:"Precious The Planner",     instagram:"precioustheplanner",           email:"", status:"followed",    dateContacted:"", notes:"" },
  { id:"c17", name:"",               business:"Zavion Kotze Events",      instagram:"zavionkotzeeventscompany",     email:"", status:"followed",    dateContacted:"", notes:"" },
  { id:"c18", name:"",               business:"Warren-Stone Weddings",    instagram:"warrenstoneweddings",          email:"", status:"followed",    dateContacted:"", notes:"" },
  { id:"c19", name:"",               business:"Mon Amour Events",         instagram:"mon_amourevents",              email:"", status:"followed",    dateContacted:"", notes:"" },
  { id:"c20", name:"",               business:"I Do Box",                 instagram:"idobox",                       email:"", status:"to_email",    dateContacted:"", notes:"" },
  { id:"c21", name:"",               business:"Celebration Theory",       instagram:"celebrationtheory",            email:"", status:"to_email",    dateContacted:"", notes:"" },
  { id:"c22", name:"",               business:"Piece of Cake Weddings",   instagram:"pieceofcakecapetown",          email:"", status:"to_email",    dateContacted:"", notes:"" },
  { id:"c23", name:"",               business:"OTD Wedding and Events",   instagram:"onthedayevents",               email:"", status:"to_email",    dateContacted:"", notes:"" },
  { id:"c24", name:"",               business:"Weddings By Marius",       instagram:"weddingsbymarius",             email:"", status:"to_email",    dateContacted:"", notes:"" },
  { id:"c25", name:"",               business:"Dear Grace Event Spec.",   instagram:"dear_grace_event_specialists_",email:"", status:"to_email",   dateContacted:"", notes:"" },
  { id:"c26", name:"",               business:"Mosaic Weddings",          instagram:"mosaicweddings",               email:"", status:"to_email",    dateContacted:"", notes:"" },
  { id:"c27", name:"",               business:"Paheli Weddings",          instagram:"paheliweddings",               email:"", status:"to_email",    dateContacted:"", notes:"" },
];

const VENUES = [{"id":1,"name":"ANEW Resort Ingeli Forest","email":"ingelires@anewhotels.co.za","contact":"Shannon / Paul Simpson","type":"Forest, rustic, mountain"},{"id":2,"name":"African Hills Safari Lodge","email":"weddings@askarilodge.co.za","contact":"Brenda Brand","type":"Safari, bushveld, historic"},{"id":3,"name":"Ashanti Estate","email":"events@ashantiestate.co.za","contact":"","type":"Tuscan-inspired, elegant"},{"id":4,"name":"Au d'Hex Estate","email":"venue@audehexestate.co.za","contact":"Almari Janse Van Rensburg","type":"Wine farm, elegant"},{"id":5,"name":"Avianto","email":"info@avianto.co.za","contact":"","type":"European-inspired, estate"},{"id":6,"name":"Babylonstoren","email":"functions@babylonstoren.com","contact":"Risa","type":"Wine farm, luxury, garden"},{"id":7,"name":"Bakenhof Winelands","email":"info@bakenhof.co.za","contact":"Heidi","type":"Wine farm, elegant"},{"id":8,"name":"Bakubung Bush Lodge","email":"bakubung@legacyhotels.com","contact":"George Mokotedi","type":"Bush, African, luxury"},{"id":9,"name":"Belair Pavilion","email":"jason@belair.co.za","contact":"Jason Plumbly","type":"Garden, country estate"},{"id":10,"name":"Bergwaters Eco Lodge","email":"info@bergwaters.co.za","contact":"","type":"Small, intimate, eco lodge"},{"id":11,"name":"Birkenhead House","email":"reservations@trp.travel","contact":"Wendy Jack","type":"Beach, intimate, luxury"},{"id":12,"name":"Blaauwklippen Wine Estate","email":"nanette@blaauwklippen.com","contact":"Nanette","type":"Vineyard, historic, elegant"},{"id":13,"name":"Blue Bay Lodge","email":"reservations@bluebaylodge.co.za","contact":"Cindy Thompson","type":"Beach, coastal, intimate"},{"id":14,"name":"Boschendal Wine Estate","email":"enquiries@boschendal.co.za","contact":"","type":"Wine farm, historic, elegant"},{"id":15,"name":"Botlierskop Game Reserve","email":"info@botlierskop.co.za","contact":"Francina","type":"Safari, exotic, intimate"},{"id":16,"name":"Brahman Hills","email":"weddingsales@brahmanhills.co.za","contact":"","type":"Country, elegant, large-scale"},{"id":17,"name":"Brenaissance Estate","email":"venue@brenaissance.co.za","contact":"","type":"Wine farm, elegant"},{"id":18,"name":"Bushman Sands Golf Lodge","email":"reservations@riverhotels.co.za","contact":"","type":"Golf estate, bushveld"},{"id":19,"name":"Cabo Beach Club","email":"info@cabobeachclub.co.za","contact":"","type":"Beach, luxury"},{"id":20,"name":"Casa Toscana Lodge","email":"events@casatoscana.co.za","contact":"Nicky Uys","type":"Tuscan-style, outdoor, garden"},{"id":21,"name":"Casablanca Manor","email":"info@casablancamanor.co.za","contact":"Kobus And Lynn","type":"Rustic, bushveld, elegant"},{"id":22,"name":"Casterbridge Hollow","email":"reservations@casterbridgehollow.co.za","contact":"","type":"Boutique hotel, elegant"},{"id":23,"name":"Cavalli Estate","email":"events@cavalliestate.com","contact":"Tammi Smuts","type":"Wine farm, luxury, classic"},{"id":24,"name":"Chez Charlene","email":"info@chezcharlene.co.za","contact":"Charlene Georgiades","type":"Boutique, elegant"},{"id":25,"name":"Collisheen Estate","email":"info@collisheen.co.za","contact":"Wayne Hulett","type":"Farm, elegant, garden"},{"id":26,"name":"Cradle Valley","email":"rynard@cradlevalley.co.za","contact":"Rynard","type":"Country, elegant, outdoor"},{"id":27,"name":"Cranford Country Lodge","email":"info@cranfordcountrylodge.co.za","contact":"Claire Culverwell","type":"Country-chic, rustic"},{"id":28,"name":"Critchley Hackle Lodge","email":"info@critchleyhackle.co.za","contact":"","type":"Country, romantic, lakeside"},{"id":29,"name":"Crystal Barn Country Estate","email":"kate@crystalbarn.co.za","contact":"Kate","type":"Country, vintage, rustic"},{"id":30,"name":"Cybele Forest Lodge","email":"reservations@cybele.co.za","contact":"Rupert Jeffries","type":"Forest, luxury, intimate"},{"id":31,"name":"De Stilte","email":"info@destilte.co.za","contact":"","type":"Glamping, nature, romantic"},{"id":32,"name":"De Uijlenes","email":"weddings@deuijlenes.co.za","contact":"","type":"Forest, modern-rustic, farm"},{"id":33,"name":"Delaire Graff Estate","email":"events@delaire.co.za","contact":"","type":"Luxury wine estate"},{"id":34,"name":"Diamant Estate","email":"info@diamantestate.com","contact":"Wilmarie Groenewald","type":"Wine farm, historic, luxury"},{"id":35,"name":"Die Woud","email":"info@diewoud.co.za","contact":"","type":"Forest, romantic, rustic"},{"id":36,"name":"Dieu Donne Vineyards","email":"info@dieudonnevineyards.com","contact":"","type":"Wine farm, elegant, scenic"},{"id":37,"name":"Du Kloof Lodge","email":"events@duklooflodge.co.za","contact":"Christiaan","type":"Destination, mountain, riverside"},{"id":38,"name":"Dwarsberg Trout Hideaway","email":"weddingsandevents@trouthaven.co.za","contact":"Suzanne","type":"Countryside, rustic, farm"},{"id":39,"name":"Eikenhof Estate","email":"info@eikenhofestate.co.za","contact":"","type":"Wine farm, boutique, elegant"},{"id":40,"name":"Emily Moon River Lodge","email":"events@emilymoon.co.za","contact":"","type":"Luxury, river lodge, intimate"},{"id":41,"name":"Erinvale Estate Hotel","email":"conf@erinvale.co.za","contact":"","type":"Luxury, elegant, destination"},{"id":42,"name":"Fancourt Hotel","email":"reservations@fancourt.co.za","contact":"","type":"Luxury, golf resort, large-scale"},{"id":43,"name":"Fordoun Hotel And Spa","email":"events@fordoun.co.za","contact":"","type":"Country, elegant, stylish"},{"id":44,"name":"Four Seasons Westcliff","email":"reservations@westcliff.co.za","contact":"Zamantungwa Nyaose","type":"Luxury, urban, garden"},{"id":45,"name":"Galagos Country Estate","email":"web@galagos.co.za","contact":"Lichelle Prinsloo","type":"Forest, elegant, luxury"},{"id":46,"name":"Glenburn Lodge & Spa","email":"weddings@glenburn.co.za","contact":"","type":"Country, nature, riverfront"},{"id":47,"name":"Grand Africa Cafe & Beach","email":"beach@grandafrica.co.za","contact":"","type":"Beach, luxury, large-scale"},{"id":48,"name":"Grande Provence Estate","email":"events@grandeprovence.co.za","contact":"Anine Bezuidenhoudt","type":"Wine farm, elegant, historic"},{"id":49,"name":"Green Leaves Country Lodge","email":"info@greenleaves.co.za","contact":"Jeannine","type":"Luxury, country, intimate"},{"id":50,"name":"Ground The Venue","email":"info@projectground.co.za","contact":"Robyn Cronje","type":"Farm, rustic, vineyard"},{"id":51,"name":"Hartford House","email":"events@hartford.co.za","contact":"Casey McGee","type":"Historic, elegant, romantic"},{"id":52,"name":"Haycroft Farm","email":"stay@haycroftfarm.com","contact":"Pippa Richards-Edwards","type":"Country, forest, exclusive"},{"id":53,"name":"Hazendal Wine Estate","email":"weddings@hazendal.co.za","contact":"","type":"Wine farm, elegant, historic"},{"id":54,"name":"Holden Manz Wine Estate","email":"events@holdenmanz.com","contact":"","type":"Wine farm, elegant, picturesque"},{"id":55,"name":"INsingizi Bush Weddings","email":"hello@insingizi.co.za","contact":"","type":"Bush, intimate, private"},{"id":56,"name":"Inimitable Wedding Venue","email":"info@staybyinimitable.com","contact":"Zavion Kotze-Brereton","type":"Luxury, modern, large-scale"},{"id":57,"name":"Karkloof Safari Spa","email":"kirsten@karkloofsafarispa.com","contact":"Kirsten","type":"Safari, nature, private reserve"},{"id":58,"name":"Kay And Monty Vineyards","email":"hello@kayandmonty.com","contact":"","type":"Wine farm, country"},{"id":59,"name":"Kearsney Manor","email":"info@kearsneymanor.co.za","contact":"Andrew","type":"Historic, colonial, heritage"},{"id":60,"name":"Kloofzicht Lodge & Spa","email":"weddings@kloofzicht.co.za","contact":"","type":"Nature reserve, lodge, scenic"},{"id":61,"name":"Kuungana Bush Lodge","email":"info@kuunganabushlodge.co.za","contact":"Michelle Janse Van Rensburg","type":"Bushveld, rustic chic"},{"id":62,"name":"Kwa Maritane Bush Lodge","email":"kwamaritane@legacyhotels.co.za","contact":"Candice Morawitz","type":"Bush, intimate, luxury"},{"id":63,"name":"L'Avenir Wine Estate","email":"functions@lavenir.co.za","contact":"","type":"Wine farm, elegant, intimate"},{"id":64,"name":"La Cotte Farm","email":"reception@lacottefarm.com","contact":"","type":"Wine farm, historic, elegant"},{"id":65,"name":"La Paris Estate","email":"events@laparis.co.za","contact":"Surine Van Tonder","type":"Luxury, intimate, destination"},{"id":66,"name":"La Residence","email":"info@laresidence.co.za","contact":"","type":"Luxury, intimate, exclusive"},{"id":67,"name":"Laborie Wine Estate","email":"info@laborieestate.co.za","contact":"Tanya","type":"Wine farm, historic, elegant"},{"id":68,"name":"Landtscap","email":"info@landtscap.co.za","contact":"Tammy","type":"Wine farm, modern, contemporary"},{"id":69,"name":"Langkloof Roses","email":"info@langkloofroses.co.za","contact":"","type":"Farm, rustic, romantic"},{"id":70,"name":"Lanzerac Wine Estate","email":"events@lanzerac.co.za","contact":"","type":"Wine farm, luxury, romantic"},{"id":71,"name":"Laurent At Lourensford","email":"functions@laurent.co.za","contact":"Mire De Jongh","type":"Wine farm, elegant, luxury"},{"id":72,"name":"Lavandou Elegant Venue","email":"info@lavandou.co.za","contact":"","type":"Elegant, French provincial, forest"},{"id":73,"name":"Lavender Hill Country Estate","email":"info@lavenderhillestate.co.za","contact":"","type":"Country estate, garden, grand"},{"id":74,"name":"Lieu De Grace","email":"getmarried@lieudegracevenue.co.za","contact":"Vivien","type":"Industrial chic, warehouse"},{"id":75,"name":"Lord's Wines","email":"events@lordswinery.com","contact":"","type":"Wine farm, country, scenic"},{"id":76,"name":"Lynton Hall","email":"ivan@lyntonhall.co.za","contact":"Ivan","type":"Historic, garden, coastal forest"},{"id":77,"name":"Lythwood Lodge","email":"events@lythwood.com","contact":"John","type":"Country, mountain, forest"},{"id":78,"name":"Maison Estate","email":"maison@chefswarehouse.co.za","contact":"","type":"Wine farm, rustic, luxury"},{"id":79,"name":"Makiti Wedding Venue","email":"info@makiti.co.za","contact":"","type":"Outdoor, elegant, large-scale"},{"id":80,"name":"Mangwa Valley Game Lodge","email":"info@mangwavalley.co.za","contact":"","type":"Bush, luxury, intimate"},{"id":81,"name":"Maroupi Wedding Venue","email":"cheryl@stirlingbridge.co.za","contact":"Cheryl","type":"Rustic, coastal, romantic"},{"id":82,"name":"Memoire Boutique Garden Venue","email":"info@memoire.co.za","contact":"Jaco","type":"Boutique, garden, luxury"},{"id":83,"name":"Midlands Saddle And Trout","email":"midlandsreservations@firstgroup-sa.co.za","contact":"","type":"Countryside, intimate, rustic"},{"id":84,"name":"MolenVliet Vineyards","email":"events@molenvliet.co.za","contact":"","type":"Wine farm, luxury, exclusive"},{"id":85,"name":"Mont Rouge","email":"cindy@montrouge.co.za","contact":"Cindy","type":"Farm, garden, mountain"},{"id":86,"name":"Monte De Dios","email":"info@montededios.co.za","contact":"Annabella Porta","type":"Boutique, elegant, modern"},{"id":87,"name":"Montpellier Wine Estate","email":"info@montpellier.co.za","contact":"","type":"Wine farm, historic, intimate"},{"id":88,"name":"Morrells Boutique Estate","email":"info@morrells.co.za","contact":"Alicia De Greef","type":"Intimate, vintage, French-style"},{"id":89,"name":"Mount Edgecombe CC","email":"estatereception@mountedgecombe.com","contact":"","type":"Golf estate, elegant, large-scale"},{"id":90,"name":"Mount Nelson Hotel","email":"reservations.mnh@belmond.com","contact":"Mandy Mavuso","type":"Luxury, historic, city"},{"id":91,"name":"Murasie Wedding Venue","email":"info@murasie.com","contact":"Leana","type":"Nature, rustic, outdoor"},{"id":92,"name":"Muratie Wine Estate","email":"info@muratie.co.za","contact":"Kim Melck","type":"Wine farm, historic, garden"},{"id":93,"name":"Nantes Estate","email":"bookings@nantesestate.com","contact":"","type":"Wine farm, elegant, luxury"},{"id":94,"name":"Netherwood Farm","email":"weddings@netherwood.co.za","contact":"","type":"Farm, contemporary, country"},{"id":95,"name":"Nooitgedacht Estate","email":"functions@nooitestate.co.za","contact":"","type":"Wine farm, historic, elegant"},{"id":96,"name":"Oakfield Farm","email":"info@oakfield.co.za","contact":"Carl Visser","type":"Country, farm, elegant"},{"id":97,"name":"Olive Rock Wedding Venue","email":"thevenue@oliverock.co.za","contact":"Nick & Simone Stanford","type":"Outdoor, intimate, rustic"},{"id":98,"name":"Olivewood Private Estate","email":"joinus@olivewoodestate.com","contact":"","type":"Elegant, modern, estate"},{"id":99,"name":"Ollivanders Estate","email":"info@ollivanders.co.za","contact":"Pam Cribbins","type":"Country, garden, intimate"},{"id":100,"name":"Oxbow Country Estate","email":"info@oxbowestate.co.za","contact":"Michelle","type":"Country, romantic, exclusive"},{"id":101,"name":"Palala Boutique Game Lodge","email":"events2@palala.co.za","contact":"Anel Matthysen","type":"Bush, luxury, romantic"},{"id":102,"name":"Pecan Manor","email":"info@pecanmanor.co.za","contact":"Louise Venter","type":"Intimate, forest, elegant"},{"id":103,"name":"Pezula Nature Retreat","email":"bookings@pezulanatureretreat.com","contact":"","type":"Luxury, nature, intimate"},{"id":104,"name":"Pheasant Hill Boutique Hotel","email":"bookings@pheasanthill.co.za","contact":"Pieter Bezuidenhout","type":"Boutique hotel, garden"},{"id":105,"name":"Providence Country Estate","email":"info@providencecountryweddings.co.za","contact":"Kevin and Fern McComb","type":"Country, romantic, farm"},{"id":106,"name":"Red Ivory Lodge","email":"info@redivory.net","contact":"","type":"Contemporary, destination, mountain"},{"id":107,"name":"Rickety Bridge Winery","email":"functions@ricketybridge.com","contact":"Eldoret Ferreira","type":"Wine farm, elegant, intimate"},{"id":108,"name":"Riverside Country Estate","email":"info@riverside4me.co.za","contact":"","type":"Country, elegant, nature"},{"id":109,"name":"Rosemary Hill","email":"info@rosemaryhill.co.za","contact":"Caryn Gill","type":"Farm, organic, rustic"},{"id":110,"name":"Saronsberg Cellar","email":"events@saronsberg.com","contact":"Shayne Reynolds","type":"Wine farm, elegant, mountain"},{"id":111,"name":"Schoone Oordt Country House","email":"reservations@schooneoordt.co.za","contact":"Alison Walker","type":"Country, luxury, intimate"},{"id":112,"name":"Shamwari Private Game Reserve","email":"reservations@shamwari.com","contact":"Kim Matysik","type":"Safari, luxury, bush"},{"id":113,"name":"Shepstone Gardens","email":"info@shepstonegardens.co.za","contact":"Jessica Gaisford","type":"Elegant, historic, garden"},{"id":114,"name":"Shiluvari Lakeside Lodge","email":"info@shiluvari.com","contact":"Clare Girardin","type":"Lakeside, nature, intimate"},{"id":115,"name":"Simbithi Country Club","email":"events@simbithi.com","contact":"Nelisiwe Ncama","type":"Country club, eco-estate"},{"id":116,"name":"Spier Wine Farm","email":"info@spier.co.za","contact":"Hannes Loubser","type":"Wine farm, historic, outdoor"},{"id":117,"name":"Steenberg Hotel And Spa","email":"reservations@steenberghotel.com","contact":"","type":"Wine farm, luxury, historic"},{"id":118,"name":"Strandkombuis","email":"contact@strandkombuis.com","contact":"","type":"Beach, rustic, seaside"},{"id":119,"name":"Summerplace Game Reserve","email":"bookings@summerplacegamereserve.com","contact":"Simone Baber","type":"Bushveld, wilderness, nature"},{"id":120,"name":"Tala Private Game Reserve","email":"info@tala.co.za","contact":"","type":"Safari, bush, destination"},{"id":121,"name":"Tintswalo Atlantic","email":"melissa@tintswalo.com","contact":"Melissa Du Rand","type":"Luxury, intimate, seaside"},{"id":122,"name":"Tsala Treetop Lodge","email":"weddings@hunterhotels.com","contact":"","type":"Forest, intimate, luxury"},{"id":123,"name":"Val de Vie Estate","email":"simone@valdevie.co.za","contact":"Simone","type":"Luxury, wine farm, polo estate"},{"id":124,"name":"Vergelegen Wine Estate","email":"events@vergelegen.co.za","contact":"","type":"Wine farm, elegant, formal"},{"id":125,"name":"Victoria Yards","email":"mike@sl8.co.za","contact":"Mike Walker","type":"Industrial, urban, creative"},{"id":126,"name":"Villa Castollini","email":"functions@castollini.co.za","contact":"","type":"Luxury, glamorous, large-scale"},{"id":127,"name":"Vivari Hotel Jala Pavilion","email":"info@vivarihotel.co.za","contact":"","type":"Luxury, garden, intimate"},{"id":128,"name":"Vondeling Wines","email":"info@vondelingwines.co.za","contact":"Hilani Van Der Merwe","type":"Wine farm, elegant, rustic"},{"id":129,"name":"Vrede en Lust Estate","email":"functions@vnl.co.za","contact":"","type":"Wine farm, elegant, historic"},{"id":130,"name":"Vredenheim","email":"feestafel@vredenheim.co.za","contact":"Anne","type":"Wine farm, intimate, garden"},{"id":131,"name":"Walkersons Hotel And Spa","email":"reservations@walkersons.co.za","contact":"","type":"Small, intimate, country estate"},{"id":132,"name":"Webersburg Wine Estate","email":"events@webersburg.co.za","contact":"Jolandi Viljoen","type":"Wine farm, historic, elegant"},{"id":133,"name":"Welgelegen Cherry Estate","email":"info@cherryestate.co.za","contact":"Fanie Grobbelaar","type":"Farm, scenic, weekend destination"},{"id":134,"name":"Weltevreden Estate","email":"info@weltevredenestate.com","contact":"","type":"Wine farm, elegant, historic"},{"id":135,"name":"Whispering Thorns","email":"info@whisperingthorns.com","contact":"Marinda","type":"Luxury, bushveld, modern safari"},{"id":136,"name":"Zebra Country Lodge","email":"reservations@zebralodge.com","contact":"","type":"Bushveld, nature reserve"},{"id":137,"name":"Zimbali Resort","email":"zimbali@thecapital.co.za","contact":"Christo Van Wyk","type":"Luxury, coastal, large-scale"},{"id":138,"name":"Zorgvliet Wines","email":"info@zorgvliet.com","contact":"","type":"Wine farm, elegant, country"}];

// ─── STORAGE ─────────────────────────────────────────────────────
function loadSt() { try { return JSON.parse(localStorage.getItem("wedin_gtm_v3")||"{}"); } catch { return {}; } }
function saveSt(s) { try { localStorage.setItem("wedin_gtm_v3", JSON.stringify(s)); } catch {} }

// ─── AUTH ─────────────────────────────────────────────────────────
const GTM_PASSWORD = "music2026";
const GTM_LS_KEY = "gtm_auth";

function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === GTM_PASSWORD) {
      localStorage.setItem(GTM_LS_KEY, GTM_PASSWORD);
      onAuth();
    } else {
      setError(true);
      setPw("");
    }
  };
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif", background:"#FAF7F2", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;600&display=swap" rel="stylesheet"/>
      <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:400, color:"#1C2B3A", letterSpacing:"0.12em", marginBottom:40}}>wedin.ai</div>
      <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:16, width:"100%", maxWidth:320}}>
        <input type="password" placeholder="Enter password" value={pw}
          onChange={e => { setPw(e.target.value); setError(false); }} autoFocus
          style={{fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"#1C2B3A", background:"#FFFFFF", border:error?"1.5px solid #C4922A":"1.5px solid rgba(28,43,58,0.18)", borderRadius:8, padding:"12px 16px", width:"100%", minHeight:44, outline:"none", textAlign:"center", boxSizing:"border-box"}}/>
        {error && <p style={{fontSize:13, color:"#C4922A", margin:0}}>Incorrect — try again.</p>}
        <button type="submit" style={{fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:"#FAF7F2", background:"#1C2B3A", border:"none", borderRadius:10, padding:"12px 40px", minHeight:44, cursor:"pointer", width:"100%", letterSpacing:"0.06em"}}>Enter</button>
      </form>
    </div>
  );
}

// ─── STATUS CONFIG ────────────────────────────────────────────────
const STATUS_ORDER  = ["to_email","followed","emailed","coupon_sent","activated"];
const STATUS_COLORS = { to_email:"#6B6560", followed:"#1C2B3A", emailed:"#1C2B3A", coupon_sent:"#C4922A", activated:"#2a7a4a" };
const STATUS_LABELS = { to_email:"To email", followed:"Followed", emailed:"Emailed", coupon_sent:"Coupon sent", activated:"Activated" };

// ─── MAIN COMPONENT ───────────────────────────────────────────────
export default function GTMDashboard() {
  const [authed,       setAuthed]       = useState(() => localStorage.getItem(GTM_LS_KEY) === GTM_PASSWORD);
  const [tab,          setTab]          = useState("today");
  const [st,           setSt]           = useState(loadSt);
  const [metrics,      setMetrics]      = useState(null);
  const [vSearch,      setVSearch]      = useState("");
  const [cSearch,      setCSearch]      = useState("");
  const [showAdd,      setShowAdd]      = useState(false);
  const [expandedIds,  setExpandedIds]  = useState({});
  const [newCoord,     setNewCoord]     = useState({ name:"", business:"", instagram:"", email:"", status:"to_email", dateContacted:"", notes:"" });

  useEffect(() => { saveSt(st); }, [st]);

  // Fetch live metrics from Supabase via gtm-data function
  useEffect(() => {
    fetch("/.netlify/functions/gtm-data")
      .then(r => r.json())
      .then(data => setMetrics(data))
      .catch(() => {});
  }, []);

  const get = (key, def) => st[key] !== undefined ? st[key] : def;
  const set = (key, val) => setSt(s => ({ ...s, [key]: val }));

  const toggleExpand = id => setExpandedIds(e => ({ ...e, [id]: !e[id] }));

  const allCoords = useCallback(() => {
    const ov = get("coord_ov", {});
    const added = get("coord_added", []);
    return [
      ...COORDINATOR_SEED.map(c => ({ ...c, ...ov[c.id] })),
      ...added,
    ];
  }, [st]);

  const updateCoord = (id, field, val) => {
    setSt(s => {
      const ov = { ...(s.coord_ov||{}) };
      ov[id] = { ...(ov[id]||{}), [field]: val };
      return { ...s, coord_ov: ov };
    });
  };

  const updateAdded = (id, field, val) => {
    setSt(s => {
      const arr = [...(s.coord_added||[])];
      const idx = arr.findIndex(x => x.id === id);
      if (idx >= 0) arr[idx] = { ...arr[idx], [field]: val };
      return { ...s, coord_added: arr };
    });
  };

  const addCoordinator = () => {
    if (!newCoord.business.trim()) return;
    const entry = { ...newCoord, id: "u" + Date.now() };
    setSt(s => ({ ...s, coord_added: [...(s.coord_added||[]), entry] }));
    setNewCoord({ name:"", business:"", instagram:"", email:"", status:"to_email", dateContacted:"", notes:"" });
    setShowAdd(false);
  };

  // Date helpers
  const todayStr = new Date().toISOString().split("T")[0];
  const todayPost = ALL_POSTS.find(p => p.date === todayStr) || null;
  const currentWeek = CAMPAIGN.find(w => w.posts.some(p => p.date >= todayStr)) || CAMPAIGN[CAMPAIGN.length-1];
  const nextPost = ALL_POSTS.find(p => p.date > todayStr) || null;
  const dow = new Date().getDay();
  const isPostDay = [1,3,5].includes(dow);

  // Venue slot for today
  const LAUNCH_MS = new Date("2026-06-09").getTime();
  const diffDays = Math.max(0, Math.floor((Date.now() - LAUNCH_MS) / 86400000));
  const venueSlot = Math.min(Math.floor(diffDays), Math.floor(VENUES.length/10) - 1);
  const todayVenues = VENUES.slice(venueSlot*10, (venueSlot+1)*10);

  // ─ DESIGN TOKENS ──────────────────────────────────────────────────
  const gold  = "#C4922A";
  const navy  = "#1C2B3A";
  const cream = "#FAF7F2";
  const grey  = "#6B6560";
  const white = "#FFFFFF";
  const navyBorder = "rgba(28,43,58,0.12)";

  const T = {
    wrap:     { fontFamily:"'DM Sans',sans-serif", background:cream, color:navy, minHeight:"100vh" },
    hdr:      { background:navy, borderBottom:"none", padding:"20px 24px 0" },
    hdrTop:   { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 },
    brand:    { fontFamily:"'Cormorant Garamond',serif", fontSize:24, letterSpacing:"0.14em", color:cream },
    lockBtn:  { fontSize:12, color:"rgba(250,247,242,0.45)", background:"none", border:"none", cursor:"pointer", letterSpacing:"0.10em", textTransform:"uppercase", padding:0 },
    sub:      { fontSize:11, color:"rgba(250,247,242,0.45)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:16 },
    tabs:     { display:"flex", gap:0, overflowX:"auto", scrollbarWidth:"none" },
    tab:      a => ({ padding:"12px 22px", fontSize:14, fontWeight:a?600:400, color:a?gold:"rgba(250,247,242,0.5)", background:"none", border:"none", borderBottom:a?`2px solid ${gold}`:"2px solid transparent", cursor:"pointer", whiteSpace:"nowrap" }),
    body:     { padding:"28px 24px", maxWidth:780, margin:"0 auto" },
    h1:       { fontFamily:"'Cormorant Garamond',serif", fontSize:34, color:navy, fontWeight:400, marginBottom:4 },
    label:    { fontSize:11, textTransform:"uppercase", letterSpacing:"0.13em", color:grey, marginBottom:8, display:"block" },
    card:     { background:white, border:`1px solid ${navyBorder}`, borderRadius:14, padding:"18px 22px", marginBottom:12, boxShadow:"0 2px 12px rgba(28,43,58,0.06)" },
    row:      { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14 },
    meta:     { fontSize:13, color:grey, marginTop:4 },
    em:       { fontSize:12, color:navy, fontFamily:"monospace", marginTop:3, opacity:0.6 },
    tag:      { display:"inline-block", padding:"2px 9px", borderRadius:100, fontSize:11, background:cream, color:grey, border:`1px solid ${navyBorder}`, marginRight:4, marginTop:3 },
    inp:      { background:cream, border:`1.5px solid ${navyBorder}`, borderRadius:8, color:navy, padding:"10px 14px", fontSize:14, width:"100%", boxSizing:"border-box", outline:"none", marginBottom:10 },
    textarea: { background:cream, border:`1.5px solid ${navyBorder}`, borderRadius:8, color:navy, padding:"10px 14px", fontSize:14, width:"100%", boxSizing:"border-box", outline:"none", resize:"vertical", minHeight:64, fontFamily:"'DM Sans',sans-serif", marginBottom:10 },
    btn:      a => ({ padding:"7px 16px", fontSize:12, borderRadius:8, cursor:"pointer", background:a?navy:white, color:a?cream:navy, border:`1.5px solid ${a?navy:navyBorder}`, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap", boxShadow:a?"0 2px 6px rgba(28,43,58,0.18)":"0 1px 3px rgba(28,43,58,0.08)" }),
    btnPrim:  { padding:"10px 22px", fontSize:13, borderRadius:10, cursor:"pointer", background:navy, color:cream, border:"none", fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", boxShadow:"0 2px 8px rgba(28,43,58,0.18)" },
    pill:     c => ({ display:"inline-flex", alignItems:"center", padding:"4px 12px", borderRadius:100, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", background:`${c}15`, color:c, border:`1px solid ${c}40`, cursor:"pointer" }),
    divider:  { borderTop:`1px solid ${navyBorder}`, margin:"18px 0" },
    grid3:    { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:18 },
    goldCard: { background:white, border:`1px solid ${navyBorder}`, borderLeft:`3px solid ${gold}`, borderRadius:"0 14px 14px 0", padding:"18px 22px", marginBottom:12, boxShadow:"0 2px 12px rgba(28,43,58,0.06)" },
  };

  // ─── TODAY ───────────────────────────────────────────────────────
  const renderToday = () => {
    const postKey = todayPost ? `post_${todayPost.date}` : null;
    const postDone = postKey ? get(postKey, false) : false;
    const outreachCount = get(`outreach_${todayStr}`, 0);
    const venuesDone = get(`venues_${venueSlot}`, false);
    const storiesDone = get(`stories_${todayStr}`, false);

    // Live metrics from Supabase
    const d = metrics?.daily || {};
    const w = metrics?.weekly || {};

    return (
      <div style={T.body}>
        <div style={T.h1}>{new Date().toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"long"})}</div>
        <div style={{...T.label, marginBottom:16}}>Week {currentWeek.week} · {currentWeek.theme}</div>

        {/* Live metrics panel */}
        <div style={T.grid3}>
          {[
            { label:"Sessions today",  value: d.sessions_started != null ? String(d.sessions_started) : "—" },
            { label:"Captures today",  value: d.email_captures   != null ? String(d.email_captures)   : "—" },
            { label:"Payments today",  value: d.payments         != null ? String(d.payments)         : "—" },
          ].map(m => (
            <div key={m.label} style={{...T.card, marginBottom:0, textAlign:"center", padding:"10px 8px"}}>
              <div style={{...T.label, marginBottom:4, textAlign:"center"}}>{m.label}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:28, color: m.value !== "0" && m.value !== "—" ? gold : navy, lineHeight:1}}>{m.value}</div>
            </div>
          ))}
        </div>

        {metrics?.morning_briefing && (
          <div style={{...T.goldCard, marginBottom:14}}>
            <span style={T.label}>Morning briefing</span>
            {metrics.morning_briefing.split("\n").filter(l=>l.trim()).map((line,i) => (
              <div key={i} style={{fontSize:12, color:navy, lineHeight:1.6}}>{line.trim()}</div>
            ))}
          </div>
        )}

        <div style={T.divider}/>

        <span style={T.label}>Instagram</span>
        {isPostDay && todayPost ? (
          <div style={{...T.card, borderColor: postDone ? navyBorder : gold+"44"}}>
            <div style={T.row}>
              <div>
                <div style={{fontSize:13, fontWeight:600, color: postDone ? "#2a7a4a" : navy}}>{todayPost.title}</div>
                <div style={T.meta}>{todayPost.type} · Post between 7–9am · Share to Stories immediately</div>
              </div>
              <button style={T.btn(postDone)} onClick={() => set(postKey, !postDone)}>{postDone ? "✓ Posted" : "Mark posted"}</button>
            </div>
          </div>
        ) : (
          <div style={T.card}>
            <div style={{fontSize:11, color:grey}}>
              No post today.{nextPost ? ` Next: ${nextPost.title} · ${nextPost.day}` : " Campaign complete."}
            </div>
          </div>
        )}

        {isPostDay && (
          <>
            <div style={T.divider}/>
            <span style={T.label}>Stories</span>
            <div style={T.card}>
              <div style={T.row}>
                <div style={{fontSize:11, color:grey}}>Repurpose today's post. Reply to all DMs and comments within 60 minutes.</div>
                <button style={T.btn(storiesDone)} onClick={() => set(`stories_${todayStr}`, !storiesDone)}>{storiesDone ? "✓ Done" : "Mark done"}</button>
              </div>
            </div>
          </>
        )}

        <div style={T.divider}/>
        <span style={T.label}>Planner outreach — target 10 today</span>
        <div style={{...T.card, borderColor: outreachCount >= 10 ? navyBorder : "rgba(28,43,58,0.10)"}}>
          <div style={T.row}>
            <div>
              <div style={{fontSize:13, fontWeight:600, color: outreachCount >= 10 ? "#2a7a4a" : navy}}>
                {outreachCount}/10 emails sent
              </div>
              <div style={T.meta}>
                {allCoords().filter(c => (get(`coord_ov`,{})[c.id]?.status || c.status) === "to_email").slice(0,3).map(c => c.business).join(" · ") || "All actioned — check pipeline for next contacts"}
              </div>
            </div>
            <div style={{display:"flex", gap:6, alignItems:"center"}}>
              <button style={T.btn(false)} onClick={() => set(`outreach_${todayStr}`, Math.max(0, outreachCount-1))}>−</button>
              <span style={{fontSize:18, color: outreachCount >= 10 ? "#2a7a4a" : gold, fontFamily:"'Cormorant Garamond',serif", minWidth:18, textAlign:"center"}}>{outreachCount}</span>
              <button style={T.btn(false)} onClick={() => set(`outreach_${todayStr}`, outreachCount+1)}>+</button>
            </div>
          </div>
        </div>

        <div style={T.divider}/>
        <span style={T.label}>Venue outreach — 10 emails today</span>
        <div style={{...T.card, borderColor: venuesDone ? navyBorder : "rgba(28,43,58,0.10)"}}>
          <div style={T.row}>
            <div>
              <div style={{fontSize:13, fontWeight:600, color: venuesDone ? "#2a7a4a" : navy}}>
                Venues #{todayVenues[0]?.id}–{todayVenues[todayVenues.length-1]?.id}
              </div>
              <div style={T.meta}>{todayVenues.slice(0,3).map(v=>v.name).join(", ")}{todayVenues.length > 3 ? "…" : ""} · Full list in Outreach tab</div>
            </div>
            <button style={T.btn(venuesDone)} onClick={() => set(`venues_${venueSlot}`, !venuesDone)}>{venuesDone ? "✓ Done" : "Mark done"}</button>
          </div>
        </div>
      </div>
    );
  };

  // ─── PIPELINE ────────────────────────────────────────────────────
  const renderPipeline = () => {
    const coords = allCoords();
    const counts = Object.fromEntries(STATUS_ORDER.map(s => [s, 0]));
    coords.forEach(c => { const s = c.status; if (counts[s] !== undefined) counts[s]++; });

    const filtered = coords.filter(c =>
      (c.name + c.business + (c.instagram||"")).toLowerCase().includes(cSearch.toLowerCase())
    );

    const isAdded = id => String(id).startsWith("u");

    const handleStatusClick = (c) => {
      const cur = c.status;
      const next = STATUS_ORDER[(STATUS_ORDER.indexOf(cur)+1) % STATUS_ORDER.length];
      if (isAdded(c.id)) updateAdded(c.id, "status", next);
      else updateCoord(c.id, "status", next);
    };

    const handleField = (c, field, val) => {
      if (isAdded(c.id)) updateAdded(c.id, field, val);
      else updateCoord(c.id, field, val);
    };

    const getField = (c, field) => c[field] || "";

    return (
      <div style={T.body}>
        <div style={{...T.row, marginBottom:4}}>
          <div style={T.h1}>Coordinator Pipeline</div>
          <button style={T.btn(showAdd)} onClick={() => setShowAdd(v=>!v)}>+ Add</button>
        </div>

        <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:14, marginTop:10}}>
          {STATUS_ORDER.map(s => (
            <span key={s} style={T.pill(STATUS_COLORS[s])}>{counts[s]} {STATUS_LABELS[s]}</span>
          ))}
        </div>

        {showAdd && (
          <div style={{...T.card, borderColor:gold+"55", marginBottom:14}}>
            <span style={T.label}>New coordinator</span>
            {[["Name","name"],["Business *","business"],["Instagram handle","instagram"],["Email","email"],["Date contacted (DD/MM/YY)","dateContacted"]].map(([ph,field]) => (
              <input key={field} style={T.inp} placeholder={ph} value={newCoord[field]}
                onChange={e => setNewCoord(v=>({...v,[field]:e.target.value}))}/>
            ))}
            <textarea style={T.textarea} placeholder="Notes" value={newCoord.notes}
              onChange={e => setNewCoord(v=>({...v,notes:e.target.value}))}/>
            <div style={{display:"flex", gap:8}}>
              <button style={T.btnPrim} onClick={addCoordinator}>Save</button>
              <button style={T.btn(false)} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        <input style={T.inp} placeholder="Search coordinators…" value={cSearch} onChange={e=>setCSearch(e.target.value)}/>

        {filtered.map(c => {
          const col = STATUS_COLORS[c.status] || "#3a5060";
          const expanded = expandedIds[c.id] || false;
          const dateVal = getField(c, "dateContacted");
          const notesVal = getField(c, "notes");

          return (
            <div key={c.id} style={{...T.card, borderColor: c.status==="activated" ? navyBorder : "rgba(28,43,58,0.10)"}}>
              <div style={T.row}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, fontSize:12, color:navy}}>{c.business}</div>
                  {c.name && <div style={T.meta}>{c.name}</div>}
                  {c.instagram && <div style={T.meta}>@{c.instagram}</div>}
                  {c.email && <div style={T.em}>{c.email}</div>}
                  {dateVal && <div style={{...T.meta, marginTop:4}}>Contacted: {dateVal}</div>}
                  {notesVal && !expanded && <div style={{...T.meta, marginTop:2, fontStyle:"italic", opacity:0.8}}>{notesVal.slice(0,60)}{notesVal.length>60?"…":""}</div>}
                </div>
                <div style={{display:"flex", gap:5, flexShrink:0}}>
                  <button style={T.pill(col)} onClick={() => handleStatusClick(c)}>
                    {STATUS_LABELS[c.status]}
                  </button>
                  <button style={{...T.btn(expanded), padding:"2px 8px"}} onClick={() => toggleExpand(c.id)}>
                    {expanded ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {expanded && (
                <div style={{marginTop:12}}>
                  <span style={T.label}>Date contacted</span>
                  <input style={T.inp} placeholder="DD/MM/YY"
                    value={dateVal}
                    onChange={e => handleField(c, "dateContacted", e.target.value)}/>
                  <span style={T.label}>Notes</span>
                  <textarea style={T.textarea} placeholder="Notes…"
                    value={notesVal}
                    onChange={e => handleField(c, "notes", e.target.value)}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── OUTREACH ────────────────────────────────────────────────────
  const renderOutreach = () => {
    const LAUNCH_D = new Date("2026-06-09");
    const days = [];
    let d = new Date(LAUNCH_D);
    while (days.length < 18) {
      if (d.getDay()!==0 && d.getDay()!==6) days.push(new Date(d));
      d.setDate(d.getDate()+1);
    }
    const sel = get("outreach_day_sel", 0);
    const venues = VENUES.slice(sel*10, (sel+1)*10);
    const fmt = dt => dt.toLocaleDateString("en-ZA",{weekday:"short",day:"numeric",month:"short"});

    return (
      <div style={T.body}>
        <div style={T.h1}>Venue Outreach</div>
        <div style={{...T.label, marginBottom:14}}>10 emails per weekday · {VENUES.length} venues · 18 days</div>

        <div style={{display:"flex", gap:5, overflowX:"auto", marginBottom:14, paddingBottom:4, scrollbarWidth:"none"}}>
          {days.map((d,i) => {
            const isToday = d.toDateString()===new Date().toDateString();
            return (
              <button key={i} style={{...T.btn(sel===i), minWidth:66, flexShrink:0, borderColor:isToday?gold+"88":"rgba(28,43,58,0.10)"}}
                onClick={() => set("outreach_day_sel", i)}>
                {fmt(d).split(" ").slice(0,2).join(" ")}
              </button>
            );
          })}
        </div>

        <div style={T.card}>
          <div style={{fontWeight:600, fontSize:13, color:navy, marginBottom:12}}>{fmt(days[sel])} — {venues.length} venues</div>
          {venues.map((v,vi) => {
            const k = `ve_${v.id}`; const sent = get(k, false);
            return (
              <div key={vi} style={{padding:"9px 0", borderBottom:vi<venues.length-1?"1px solid rgba(28,43,58,0.10)":"none", opacity:sent?0.45:1}}>
                <div style={T.row}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:11, fontWeight:600}}>{v.name}</span>
                    {v.contact && <span style={{fontSize:10, color:grey, marginLeft:6}}>· {v.contact}</span>}
                    <div style={T.em}>{v.email}</div>
                    <div>{v.type.split(",").slice(0,3).map((t,ti)=><span key={ti} style={T.tag}>{t.trim()}</span>)}</div>
                  </div>
                  <button style={T.btn(sent)} onClick={() => set(k, !sent)}>{sent?"✓ Sent":"Mark sent"}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── VENUES ──────────────────────────────────────────────────────
  const renderVenues = () => {
    const filt = VENUES.filter(v =>
      (v.name+v.type+v.contact).toLowerCase().includes(vSearch.toLowerCase())
    );
    return (
      <div style={T.body}>
        <div style={T.h1}>Venue Directory</div>
        <div style={{...T.label, marginBottom:12}}>{VENUES.length} SA wedding venues</div>
        <input style={T.inp} placeholder="Search by name, type, or contact…" value={vSearch} onChange={e=>setVSearch(e.target.value)}/>
        <div style={{fontSize:10, color:grey, marginBottom:10}}>{filt.length} results</div>
        {filt.map((v,i) => {
          const k = `ve_${v.id}`; const sent = get(k,false);
          return (
            <div key={i} style={{...T.card, opacity:sent?0.45:1}}>
              <div style={T.row}>
                <div style={{flex:1}}>
                  <span style={{fontSize:11, fontWeight:600}}>{v.name}</span>
                  {v.contact && <span style={{fontSize:10, color:grey, marginLeft:6}}>· {v.contact}</span>}
                  <div style={T.em}>{v.email}</div>
                  <div>{v.type.split(",").slice(0,4).map((t,ti)=><span key={ti} style={T.tag}>{t.trim()}</span>)}</div>
                </div>
                <button style={T.btn(sent)} onClick={() => set(k,!sent)}>{sent?"✓ Sent":"Email"}</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── DONE ────────────────────────────────────────────────────────
  const renderDone = () => (
    <div style={T.body}>
      <div style={T.h1}>Already Done</div>
      <div style={{...T.label, marginBottom:16}}>Before campaign reset · 8 June 2026</div>

      <div style={{...T.card, borderColor:"rgba(28,43,58,0.06)"}}>
        <span style={{...T.pill("#2a7a4a"), display:"inline-flex", marginBottom:10}}>3 social posts published</span>
        {["Week 1 post #1","Week 1 post #2","Week 1 post #3"].map((p,i) => (
          <div key={i} style={{padding:"5px 0", borderBottom:i<2?"1px solid rgba(28,43,58,0.10)":"none", fontSize:11, color:grey}}>✓ {p}</div>
        ))}
      </div>

      <div style={{...T.card, borderColor:gold+"33", marginTop:8}}>
        <span style={{...T.pill(gold), display:"inline-flex", marginBottom:10}}>4 coupon codes issued</span>
        {[
          {n:"Nicola Jane",  d:"Nicola Jane Weddings · @nicolajaneweddings"},
          {n:"Anne Mann",    d:"Anne Mann Weddings · @annemannweddings"},
          {n:"Nadine",       d:"Works with Anne Mann"},
          {n:"Joe Theron",   d:"Works with Anne Mann"},
        ].map((c,i) => (
          <div key={i} style={{padding:"7px 0", borderBottom:i<3?"1px solid rgba(28,43,58,0.10)":"none"}}>
            <div style={{fontSize:12, fontWeight:600, color:navy}}>{c.n}</div>
            <div style={T.meta}>{c.d}</div>
          </div>
        ))}
      </div>

      <div style={{...T.card, borderColor:"rgba(196,146,42,0.12)", marginTop:8}}>
        <span style={{...T.pill("#1C2B3A"), display:"inline-flex", marginBottom:8}}>Instagram follows — Amanda</span>
        <div style={{fontSize:11, color:grey, lineHeight:1.7}}>
          bubblesco_events · mehfilhaus · feast.capetown · gardenroutewedd · popupweddingsa · kirstenmurphymakeup · dj_joe_sa · paheliweddings · sitting_pretty_bespoke_events · ottodejagerevents · allthingsweddingsa · shootingstarrsocial · 360link_events · capturingcontent.sa · zavionk · jesserajhfilms · precioustheplanner · zavionkotzeeventscompany · thewedding_fairy · sadiebosworthatelier · weddingconceptssa · warrenstoneweddings · mon_amourevents · idobox · celebrationtheory · theeventplannerssa · kraak.co.za · ohhappydaysouthafrica · pieceofcakecapetown · onthedayevents · weddingsbymarius · dear_grace_event_specialists_ · mosaicweddings
        </div>
      </div>
    </div>
  );

  // ─── SHELL ───────────────────────────────────────────────────────
  const TABS = [
    {id:"today",    label:"Today"},
    {id:"pipeline", label:"Pipeline"},
    {id:"outreach", label:"Outreach"},
    {id:"venues",   label:"Venues"},
    {id:"done",     label:"Done"},
  ];
  const views = {today:renderToday, pipeline:renderPipeline, outreach:renderOutreach, venues:renderVenues, done:renderDone};

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  return (
    <div style={T.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;600&display=swap" rel="stylesheet"/>
      <div style={T.hdr}>
        <div style={T.hdrTop}>
          <div style={T.brand}>wedin.ai</div>
          <button style={T.lockBtn} onClick={() => { localStorage.removeItem(GTM_LS_KEY); setAuthed(false); }}>Lock</button>
        </div>
        <div style={T.sub}>GTM Command Centre · {new Date().toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
        <div style={T.tabs}>{TABS.map(t=><button key={t.id} style={T.tab(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
      </div>
      {(views[tab]||renderToday)()}
    </div>
  );
}
