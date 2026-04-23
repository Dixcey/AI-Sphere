import { CareerStage, LinkedInExtra, SentimentStage } from "../types";

/**
 * Supplemental profile data keyed by influencer `id` (matches `constants.ts`).
 *
 * These tables were hand-curated for the preview experience and migrated here
 * so the full React app renders the same LinkedIn snapshot, career timeline,
 * and sentiment evolution chart as `preview.html`.
 *
 * NOTE: Where a LinkedIn URL is `null`, the public profile either does not
 * exist for that person or the obvious vanity slug belongs to a different
 * person with the same name — so we intentionally omit the LinkedIn card.
 *
 * Keys use the lowercase Twitter handle convention from `constants.ts`
 * (`brian_armstrong`, `_akhaliq`, `drjimfan`, …) — NOT the short preview
 * aliases. That way `selectedNode.id` is always a valid lookup key.
 */

// ─────────────────────────────────────────────────────────────────────────────
// LinkedIn profile URLs
// ─────────────────────────────────────────────────────────────────────────────

export const linkedinUrls: Record<string, string | null> = {
  sama:            null, // LinkedIn profile belongs to a different person, not Sam Altman
  satyanadella:    'https://www.linkedin.com/in/satyanadella/',
  levie:           'https://www.linkedin.com/in/boxaaron/',
  karpathy:        'https://www.linkedin.com/in/karpathy/',
  brian_armstrong: 'https://www.linkedin.com/in/barmstrong/',
  andrewyng:       'https://www.linkedin.com/in/andrewyng/',
  ylecun:          'https://www.linkedin.com/in/yann-lecun/',
  gdb:             'https://www.linkedin.com/in/thegdb/',
  demishassabis:   'https://www.linkedin.com/in/demishassabis/',
  palmerluckey:    'https://www.linkedin.com/in/palmer-luckey-21a16959/',
  fchollet:        'https://www.linkedin.com/in/fchollet/',
  ilyasut:         'https://www.linkedin.com/in/ilya-sutskever/',
  drfeifei:        null, // linkedin.com/in/feifei-li-3667885 belongs to a different Feifei Li (Kavout Algo Financial)
  geoffreyhinton:  null,
  paraga:          'https://www.linkedin.com/in/paragagrawalcmu/',
  _akhaliq:        'https://www.linkedin.com/in/ahsenkhaliq/',
  austen:          'https://www.linkedin.com/in/austenallred/',
  miramurati:      'https://www.linkedin.com/in/mira-murati-4b39a066/',
  jeffdean:        'https://www.linkedin.com/in/jeff-dean-8b212555/',
  rasbt:           'https://www.linkedin.com/in/sebastianraschka/',
  hardmaru:        'https://www.linkedin.com/in/hardmaru/',
  alexandr_wang:   'https://www.linkedin.com/in/alexandrwang/',
  addyosmani:      'https://www.linkedin.com/in/addyosmani/',
  goodfellow_ian:  'https://www.linkedin.com/in/ian-goodfellow-b7187213/',
  drjimfan:        null, // linkedin.com/in/jim-fan belongs to a different Jim Fan (MARTA Atlanta)
  minchoi:         null, // linkedin.com/in/min-choi belongs to a different Min Choi (Canari Media DC)
  deryatr_:        'https://www.linkedin.com/in/deryaunutmaz/',
  emostaque:       'https://www.linkedin.com/in/emad-mostaque-9840ba274/',
  sriramk:         null, // linkedin.com/in/sriramkrishnan belongs to a different Sriram K. (Kearny Jackson NYC)
  omarsar0:        'https://www.linkedin.com/in/omarsanseviero/',
  soumithchintala: 'https://www.linkedin.com/in/soumith/',
  officiallogank:  'https://www.linkedin.com/in/logankilpatrick/',
  jeremyphoward:   'https://www.linkedin.com/in/howardjeremy/',
  steipete:        'https://www.linkedin.com/in/steipete/',
  tunguz:          'https://www.linkedin.com/in/tunguz/',
  bcherny:         'https://www.linkedin.com/in/bcherny/',
  mustafasuleyman: 'https://www.linkedin.com/in/mustafa-suleyman/',
  gavinsbaker:     'https://www.linkedin.com/in/gavinbaker-portfoliomanager/',
  esyudkowsky:     'https://www.linkedin.com/in/eliezer-yudkowsky-99a40a25a/',
  yacinemtb:       'https://www.linkedin.com/in/yacinemtb/',
  kazu_fujisawa:   null,
  oriolvinyalsml:  'https://www.linkedin.com/in/oriol-vinyals-00b3366/',
  clementdelangue: 'https://www.linkedin.com/in/clementdelangue/',
  aelluswamy:      'https://www.linkedin.com/in/eashokkumar/',
  schmidhuberai:   'https://www.linkedin.com/in/j%C3%BCrgen-schmidhuber-39226872/',
  goodside:        'https://www.linkedin.com/in/goodside/',
  mitchellh:       'https://www.linkedin.com/in/mitchellh/',
  darioamodei:     'https://www.linkedin.com/in/dario-amodei-3934934/',
  arankomatsuzaki: 'https://www.linkedin.com/in/aran-komatsuzaki-312a4188/',
  chrmanning:      'https://www.linkedin.com/in/christopher-manning-011575/',
  elonmusk:        null,
};

// ─────────────────────────────────────────────────────────────────────────────
// LinkedIn extras (displayed on the LinkedIn snapshot card)
// ─────────────────────────────────────────────────────────────────────────────

export const linkedinExtras: Record<string, LinkedInExtra> = {
  sama:            { connections: '500+',     location: 'San Francisco, CA' },
  satyanadella:    { connections: 'Over 10K', location: 'Redmond, WA' },
  levie:           { connections: '500+',     location: 'Redwood City, CA' },
  karpathy:        { connections: '500+',     location: 'San Francisco, CA' },
  brian_armstrong: { connections: '500+',     location: 'San Francisco, CA' },
  andrewyng:       { connections: 'Over 10K', location: 'Palo Alto, CA' },
  ylecun:          { connections: '500+',     location: 'New York, NY' },
  gdb:             { connections: '500+',     location: 'San Francisco, CA' },
  demishassabis:   { connections: '500+',     location: 'London, UK' },
  palmerluckey:    { connections: '500+',     location: 'Orange County, CA' },
  fchollet:        { connections: '500+',     location: 'Mountain View, CA' },
  ilyasut:         { connections: '500+',     location: 'San Francisco, CA' },
  paraga:          { connections: '500+',     location: 'San Francisco, CA' },
  _akhaliq:        { connections: '500+',     location: 'Lahore, Pakistan' },
  austen:          { connections: '500+',     location: 'San Francisco, CA' },
  miramurati:      { connections: '500+',     location: 'San Francisco, CA' },
  jeffdean:        { connections: '500+',     location: 'Mountain View, CA' },
  rasbt:           { connections: '500+',     location: 'Madison, WI' },
  hardmaru:        { connections: '500+',     location: 'Tokyo, Japan' },
  alexandr_wang:   { connections: '500+',     location: 'San Francisco, CA' },
  addyosmani:      { connections: '500+',     location: 'San Francisco, CA' },
  goodfellow_ian:  { connections: '500+',     location: 'San Francisco, CA' },
  deryatr_:        { connections: '500+',     location: 'Bar Harbor, ME' },
  emostaque:       { connections: '500+',     location: 'London, UK' },
  omarsar0:        { connections: '500+',     location: 'New York, NY' },
  soumithchintala: { connections: '500+',     location: 'New York, NY' },
  officiallogank:  { connections: '500+',     location: 'San Francisco, CA' },
  jeremyphoward:   { connections: '500+',     location: 'San Francisco, CA' },
  steipete:        { connections: '500+',     location: 'Vienna, Austria' },
  tunguz:          { connections: '500+',     location: 'Santa Clara, CA' },
  bcherny:         { connections: '500+',     location: 'San Francisco, CA' },
  mustafasuleyman: { connections: '500+',     location: 'Redmond, WA' },
  gavinsbaker:     { connections: '500+',     location: 'Boston, MA' },
  esyudkowsky:     { connections: '500+',     location: 'Berkeley, CA' },
  yacinemtb:       { connections: '500+',     location: 'San Francisco, CA' },
  oriolvinyalsml:  { connections: '500+',     location: 'London, UK' },
  clementdelangue: { connections: '500+',     location: 'New York, NY' },
  aelluswamy:      { connections: '500+',     location: 'Austin, TX' },
  schmidhuberai:   { connections: '500+',     location: 'Thuwal, Saudi Arabia' },
  goodside:        { connections: '500+',     location: 'San Francisco, CA' },
  mitchellh:       { connections: '500+',     location: 'San Francisco, CA' },
  darioamodei:     { connections: '500+',     location: 'San Francisco, CA' },
  arankomatsuzaki: { connections: '500+',     location: 'San Francisco, CA' },
  chrmanning:      { connections: '500+',     location: 'Stanford, CA' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Career history (newest → oldest)
// ─────────────────────────────────────────────────────────────────────────────

export const careerHistory: Record<string, CareerStage[]> = {
  sama: [
    { y: '2019–',   r: 'CEO',                        c: 'OpenAI' },
    { y: '2014–19', r: 'President',                  c: 'Y Combinator' },
    { y: '2005–12', r: 'Co-founder & CEO',           c: 'Loopt' },
  ],
  satyanadella: [
    { y: '2014–',   r: 'CEO',                        c: 'Microsoft' },
    { y: '2011–14', r: 'EVP, Cloud & Enterprise',    c: 'Microsoft' },
    { y: '2008–11', r: 'President, Server & Tools',  c: 'Microsoft' },
  ],
  levie: [
    { y: '2005–',   r: 'CEO & Co-founder',           c: 'Box' },
    { y: '2023–',   r: 'Board Member',               c: 'Salesforce' },
  ],
  karpathy: [
    { y: '2024–',   r: 'Founder',                    c: 'Eureka Labs' },
    { y: '2017–22', r: 'Director of AI',             c: 'Tesla' },
    { y: '2015–17', r: 'Research Scientist',         c: 'OpenAI' },
  ],
  brian_armstrong: [
    { y: '2012–',   r: 'CEO & Co-founder',           c: 'Coinbase' },
    { y: '2011–12', r: 'Software Engineer',          c: 'Airbnb' },
    { y: '2009–11', r: 'Software Engineer',          c: 'IBM' },
  ],
  andrewyng: [
    { y: '2017–',   r: 'Founder',                    c: 'DeepLearning.AI' },
    { y: '2014–17', r: 'VP & Chief Scientist',       c: 'Baidu' },
    { y: '2012–14', r: 'Co-founder',                 c: 'Coursera' },
    { y: '2011–12', r: 'Co-founder',                 c: 'Google Brain' },
  ],
  ylecun: [
    { y: '2013–',   r: 'VP & Chief AI Scientist',    c: 'Meta' },
    { y: '2003–',   r: 'Silver Professor',           c: 'NYU' },
    { y: '1988–02', r: 'Research Scientist',         c: 'AT&T Bell Labs' },
  ],
  gdb: [
    { y: '2015–',   r: 'Co-founder & President',     c: 'OpenAI' },
    { y: '2010–15', r: 'CTO',                        c: 'Stripe' },
    { y: '2008–10', r: 'Founding Engineer',          c: 'Various startups' },
  ],
  demishassabis: [
    { y: '2023–',   r: 'CEO',                        c: 'Google DeepMind' },
    { y: '2010–23', r: 'Co-founder & CEO',           c: 'DeepMind (acq. Google)' },
    { y: '2009–10', r: 'Researcher',                 c: 'UCL Gatsby Unit' },
  ],
  palmerluckey: [
    { y: '2017–',   r: 'Founder',                    c: 'Anduril Industries' },
    { y: '2012–17', r: 'Founder',                    c: 'Oculus VR (acq. Meta)' },
  ],
  fchollet: [
    { y: '2015–',   r: 'AI Researcher & Keras Creator', c: 'Google' },
    { y: '2014–15', r: 'Machine Learning Engineer',  c: 'Halide' },
  ],
  ilyasut: [
    { y: '2023–',   r: 'Co-founder & Chief Scientist', c: 'Safe Superintelligence (SSI)' },
    { y: '2015–23', r: 'Chief Scientist',            c: 'OpenAI' },
    { y: '2012–15', r: 'Research Scientist',         c: 'Google Brain' },
  ],
  drfeifei: [
    { y: '2024–',   r: 'CEO',                        c: 'World Labs' },
    { y: '2019–',   r: 'Co-Director, Stanford HAI',  c: 'Stanford University' },
    { y: '2017–18', r: 'VP & Chief Scientist',       c: 'Google Cloud' },
    { y: '2009–',   r: 'Professor',                  c: 'Stanford University' },
  ],
  geoffreyhinton: [
    { y: '2023–',   r: 'Independent Researcher',     c: 'AI Safety' },
    { y: '2013–23', r: 'VP Engineering Fellow',      c: 'Google Brain' },
    { y: '1987–13', r: 'Professor',                  c: 'University of Toronto' },
  ],
  paraga: [
    { y: '2021–22', r: 'CEO',                        c: 'Twitter' },
    { y: '2017–21', r: 'CTO',                        c: 'Twitter' },
    { y: '2014–17', r: 'SVP, Machine Learning',      c: 'Twitter' },
  ],
  _akhaliq: [
    { y: '2020–',   r: 'AI Research',                c: 'Hugging Face' },
    { y: '2020–',   r: 'AI Paper Curator',           c: 'Independent' },
  ],
  austen: [
    { y: '2024–',   r: 'Founder & CEO',              c: 'Gauntlet AI' },
    { y: '2017–23', r: 'Co-founder & CEO',           c: 'Lambda School / BloomTech' },
  ],
  miramurati: [
    { y: '2024–',   r: 'Founder',                    c: 'New AI company (stealth)' },
    { y: '2022–24', r: 'CTO',                        c: 'OpenAI' },
    { y: '2018–22', r: 'VP Product & Partnerships',  c: 'OpenAI' },
  ],
  jeffdean: [
    { y: '2023–',   r: 'Chief Scientist',            c: 'Google DeepMind' },
    { y: '2011–23', r: 'SVP, Google Brain',          c: 'Google' },
    { y: '2003–11', r: 'Distinguished Engineer',     c: 'Google' },
  ],
  rasbt: [
    { y: '2022–',   r: 'ML Research Engineer',       c: 'Lightning AI' },
    { y: '2019–22', r: 'Research Scientist',         c: 'Intel' },
    { y: '2014–19', r: 'PhD Researcher',             c: 'Penn State University' },
  ],
  hardmaru: [
    { y: '2023–',   r: 'Co-founder & CEO',           c: 'Sakana AI' },
    { y: '2015–23', r: 'Research Director',          c: 'Google Brain' },
    { y: '2012–15', r: 'PhD Researcher',             c: 'University of Toronto' },
  ],
  alexandr_wang: [
    { y: '2024–',   r: 'Chief AI Officer',           c: 'Meta' },
    { y: '2016–24', r: 'Founder & CEO',              c: 'Scale AI' },
  ],
  addyosmani: [
    { y: '2022–',   r: 'Director, Google Cloud AI',  c: 'Google' },
    { y: '2012–22', r: 'Engineering Lead, Chrome',   c: 'Google' },
  ],
  goodfellow_ian: [
    { y: '2019–22', r: 'Director of ML',             c: 'Apple' },
    { y: '2016–19', r: 'Staff Research Scientist',   c: 'Google Brain' },
    { y: '2014–16', r: 'Research Scientist',         c: 'OpenAI' },
    { y: '2013–14', r: 'PhD',                        c: 'Université de Montréal' },
  ],
  drjimfan: [
    { y: '2021–',   r: 'Sr Research Manager, Embodied AI', c: 'NVIDIA' },
    { y: '2020–21', r: 'Postdoctoral Researcher',    c: 'Stanford University' },
  ],
  minchoi: [
    { y: '2022–',   r: 'AI Educator & Builder',      c: 'Independent' },
    { y: '2015–22', r: 'Various tech roles',         c: 'Industry' },
  ],
  deryatr_: [
    { y: '2005–',   r: 'Professor',                  c: 'Jackson Laboratory' },
    { y: '1999–05', r: 'Assistant Professor',        c: 'New York University' },
  ],
  emostaque: [
    { y: '2020–23', r: 'Co-founder & CEO',           c: 'Stability AI' },
    { y: '2012–20', r: 'Quantitative Analyst',       c: 'Various hedge funds' },
  ],
  sriramk: [
    { y: '2023–24', r: 'AI Policy Advisor',          c: 'White House OSTP' },
    { y: '2021–23', r: 'General Partner',            c: 'a16z' },
    { y: '2019–21', r: 'Partner',                    c: 'Microsoft M12' },
  ],
  omarsar0: [
    { y: '2022–',   r: 'Founder',                    c: 'DAIR.AI' },
    { y: '2021–22', r: 'ML Engineer',                c: 'Hugging Face' },
  ],
  soumithchintala: [
    { y: '2014–',   r: 'Research Engineer',          c: 'Meta AI (FAIR)' },
    { y: '2014–',   r: 'Co-creator',                 c: 'PyTorch' },
  ],
  officiallogank: [
    { y: '2023–',   r: 'Product Lead, Gemini API',   c: 'Google' },
    { y: '2021–23', r: 'Developer Experience',       c: 'OpenAI' },
    { y: '2019–21', r: 'Developer Advocate',         c: 'Apple' },
  ],
  jeremyphoward: [
    { y: '2016–',   r: 'Founder',                    c: 'fast.ai' },
    { y: '2014–16', r: 'Chief Scientist',            c: 'Enlitic' },
    { y: '1999–14', r: 'CEO',                        c: 'FastMail' },
  ],
  steipete: [
    { y: '2024–',   r: 'Co-founder',                 c: 'OpenClaw' },
    { y: '2010–23', r: 'CEO',                        c: 'PSPDFKit / Nutrient' },
  ],
  tunguz: [
    { y: '2019–23', r: 'ML Researcher',              c: 'NVIDIA' },
    { y: '2013–19', r: 'Data Scientist',             c: 'Various companies' },
  ],
  bcherny: [
    { y: '2023–',   r: 'Lead, Claude Code',          c: 'Anthropic' },
    { y: '2017–23', r: 'Staff Engineer',             c: 'Meta' },
    { y: '2015–17', r: 'Engineer',                   c: 'Various startups' },
  ],
  mustafasuleyman: [
    { y: '2023–',   r: 'CEO, Microsoft AI',          c: 'Microsoft' },
    { y: '2022–23', r: 'CEO',                        c: 'Inflection AI' },
    { y: '2010–22', r: 'Co-founder & VP Applied AI', c: 'DeepMind / Google' },
  ],
  gavinsbaker: [
    { y: '2019–',   r: 'Managing Partner',           c: 'Atreides Management' },
    { y: '2001–19', r: 'Portfolio Manager',          c: 'Fidelity Investments' },
  ],
  esyudkowsky: [
    { y: '2001–',   r: 'Research Scientist',         c: 'Machine Intelligence Research Institute (MIRI)' },
  ],
  yacinemtb: [
    { y: '2022–',   r: 'Founder & Investor',         c: 'RL / Robotics / Hardware' },
    { y: '2018–22', r: 'Software Engineer',          c: 'Various companies' },
  ],
  kazu_fujisawa: [
    { y: '2020–',   r: 'Investor & Writer',          c: 'Independent' },
    { y: '2015–20', r: 'Venture Capital',            c: 'Various VC firms' },
  ],
  oriolvinyalsml: [
    { y: '2013–',   r: 'VP of Research',             c: 'Google DeepMind' },
    { y: '2012–13', r: 'Postdoctoral Researcher',    c: 'University of California, San Diego' },
  ],
  clementdelangue: [
    { y: '2016–',   r: 'Co-founder & CEO',           c: 'Hugging Face' },
    { y: '2014–16', r: 'Machine Learning Engineer',  c: 'Various companies' },
  ],
  aelluswamy: [
    { y: '2017–',   r: 'Director of AI / Autopilot', c: 'Tesla' },
    { y: '2015–17', r: 'ML Engineer',                c: 'Various startups' },
  ],
  schmidhuberai: [
    { y: '2014–',   r: 'Director, AI Initiative',    c: 'KAUST' },
    { y: '1995–',   r: 'Director',                   c: 'IDSIA (Swiss AI Lab)' },
    { y: '1992–95', r: 'Postdoctoral Researcher',    c: 'University of Colorado' },
  ],
  goodside: [
    { y: '2022–',   r: 'Staff Prompt Engineer',      c: 'Google DeepMind' },
    { y: '2020–22', r: 'Research Engineer',          c: 'Various companies' },
  ],
  mitchellh: [
    { y: '2023–',   r: 'Founder / Building with AI', c: 'Independent' },
    { y: '2012–23', r: 'Co-founder & CTO',           c: 'HashiCorp' },
  ],
  darioamodei: [
    { y: '2021–',   r: 'CEO & Co-founder',           c: 'Anthropic' },
    { y: '2019–21', r: 'VP of Research',             c: 'OpenAI' },
    { y: '2016–19', r: 'Research Scientist',         c: 'OpenAI' },
  ],
  arankomatsuzaki: [
    { y: '2022–',   r: 'Research Scientist',         c: 'Independent' },
    { y: '2021–22', r: 'Research Engineer',          c: 'EleutherAI' },
    { y: '2020–21', r: 'Research Intern',            c: 'Google Brain' },
  ],
  chrmanning: [
    { y: '1999–',   r: 'Professor & Director, NLP Group', c: 'Stanford University' },
    { y: '1994–99', r: 'Assistant Professor',        c: 'Carnegie Mellon University' },
  ],
  elonmusk: [
    { y: '2023–',   r: 'CEO',                        c: 'xAI' },
    { y: '2022–',   r: 'CEO & Owner',                c: 'X (Twitter)' },
    { y: '2008–',   r: 'CEO',                        c: 'Tesla' },
    { y: '2002–',   r: 'CEO & CTO',                  c: 'SpaceX' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Sentiment evolution per career stage (newest → oldest, aligns with careerHistory).
// ─────────────────────────────────────────────────────────────────────────────

export const sentimentEvolution: Record<string, SentimentStage[]> = {
  sama: [
    { reg:  0.30, use: 0.90, tru:  0.75, age:  0.90 },  // OpenAI
    { reg: -0.05, use: 0.75, tru:  0.60, age:  0.50 },  // Y Combinator
    { reg: -0.20, use: 0.60, tru:  0.50, age:  0.25 },  // Loopt
  ],
  satyanadella: [
    { reg: 0.55, use: 0.85, tru: 0.70, age: 0.80 },
    { reg: 0.40, use: 0.75, tru: 0.65, age: 0.60 },
    { reg: 0.25, use: 0.65, tru: 0.60, age: 0.40 },
  ],
  levie: [
    { reg: 0.20, use: 0.85, tru: 0.65, age: 0.80 },
    { reg: 0.10, use: 0.70, tru: 0.55, age: 0.45 },
  ],
  karpathy: [
    { reg: -0.10, use: 0.80, tru: 0.65, age: 0.70 },  // Eureka Labs
    { reg: -0.05, use: 0.85, tru: 0.70, age: 0.65 },  // Tesla — more deployment-focused
    { reg: -0.15, use: 0.75, tru: 0.60, age: 0.55 },  // OpenAI — research-cautious
  ],
  brian_armstrong: [
    { reg: -0.70, use: 0.70, tru: 0.55, age: 0.60 },
    { reg: -0.40, use: 0.60, tru: 0.50, age: 0.40 },
    { reg: -0.20, use: 0.55, tru: 0.50, age: 0.30 },
  ],
  andrewyng: [
    { reg: -0.20, use: 0.90, tru: 0.70, age: 0.90 },  // DeepLearning.AI
    { reg: -0.15, use: 0.85, tru: 0.65, age: 0.80 },  // Baidu
    { reg: -0.10, use: 0.80, tru: 0.65, age: 0.65 },  // Coursera
    { reg: -0.05, use: 0.75, tru: 0.65, age: 0.50 },  // Google Brain
  ],
  ylecun: [
    { reg: -0.50, use: 0.70, tru: 0.60, age: -0.30 },
    { reg: -0.35, use: 0.68, tru: 0.58, age: -0.20 },
    { reg: -0.20, use: 0.62, tru: 0.58, age: -0.10 },
  ],
  gdb: [
    { reg: 0.40, use: 0.80, tru: 0.65, age: 0.80 },
    { reg: 0.10, use: 0.72, tru: 0.62, age: 0.50 },
    { reg: 0.00, use: 0.65, tru: 0.58, age: 0.35 },
  ],
  demishassabis: [
    { reg: 0.50, use: 0.60, tru: 0.45, age: 0.80 },
    { reg: 0.40, use: 0.65, tru: 0.52, age: 0.75 },
    { reg: 0.20, use: 0.70, tru: 0.58, age: 0.50 },
  ],
  palmerluckey: [
    { reg: -0.40, use: 0.80, tru: 0.55, age: 0.75 },
    { reg: -0.20, use: 0.75, tru: 0.62, age: 0.55 },
  ],
  fchollet: [
    { reg: 0.30, use: 0.60, tru: 0.20, age: -0.10 },
    { reg: 0.20, use: 0.65, tru: 0.32, age:  0.05 },
  ],
  ilyasut: [
    { reg: 0.60, use: 0.40, tru: 0.20, age: 0.50 },
    { reg: 0.45, use: 0.50, tru: 0.30, age: 0.45 },
    { reg: 0.15, use: 0.72, tru: 0.58, age: 0.30 },
  ],
  drfeifei: [
    { reg: 0.60, use: 0.50, tru: 0.45, age: 0.30 },
    { reg: 0.55, use: 0.52, tru: 0.47, age: 0.28 },
    { reg: 0.40, use: 0.60, tru: 0.55, age: 0.25 },
    { reg: 0.35, use: 0.65, tru: 0.62, age: 0.18 },
  ],
  geoffreyhinton: [
    { reg: 0.90, use: 0.20, tru: -0.90, age: -0.40 },
    { reg: 0.55, use: 0.40, tru: -0.30, age: -0.25 },
    { reg: 0.10, use: 0.65, tru:  0.42, age: -0.10 },
  ],
  paraga: [
    { reg: 0.30, use: 0.75, tru: 0.50, age: 0.60 },
    { reg: 0.28, use: 0.75, tru: 0.52, age: 0.58 },
    { reg: 0.22, use: 0.72, tru: 0.55, age: 0.50 },
    { reg: 0.15, use: 0.65, tru: 0.55, age: 0.40 },
  ],
  _akhaliq: [
    { reg: 0.10, use: 0.90, tru: 0.70, age: 0.70 },
    { reg: 0.05, use: 0.85, tru: 0.65, age: 0.60 },
  ],
  austen: [
    { reg: 0.00, use: 0.90, tru: 0.65, age: 0.80 },
    { reg: 0.05, use: 0.82, tru: 0.60, age: 0.68 },
  ],
  miramurati: [
    { reg: 0.50, use: 0.70, tru: 0.55, age: 0.75 },
    { reg: 0.45, use: 0.72, tru: 0.52, age: 0.73 },
    { reg: 0.35, use: 0.76, tru: 0.60, age: 0.65 },
  ],
  jeffdean: [
    { reg: 0.30, use: 0.90, tru: 0.60, age: 0.75 },
    { reg: 0.25, use: 0.88, tru: 0.62, age: 0.70 },
    { reg: 0.15, use: 0.85, tru: 0.65, age: 0.55 },
  ],
  rasbt: [
    { reg: 0.20, use: 0.85, tru: 0.65, age: 0.65 },
    { reg: 0.15, use: 0.80, tru: 0.62, age: 0.55 },
    { reg: 0.10, use: 0.72, tru: 0.60, age: 0.42 },
  ],
  hardmaru: [
    { reg: 0.20, use: 0.80, tru: 0.60, age: 0.70 },
    { reg: 0.15, use: 0.78, tru: 0.62, age: 0.65 },
    { reg: 0.10, use: 0.70, tru: 0.60, age: 0.50 },
  ],
  alexandr_wang: [
    { reg: 0.30, use: 0.90, tru: 0.65, age: 0.70 },
    { reg: 0.22, use: 0.90, tru: 0.65, age: 0.68 },
  ],
  addyosmani: [
    { reg: 0.20, use: 0.85, tru: 0.65, age: 0.75 },
    { reg: 0.15, use: 0.80, tru: 0.65, age: 0.62 },
  ],
  goodfellow_ian: [
    { reg: 0.20, use: 0.75, tru: 0.45, age: 0.55 },
    { reg: 0.25, use: 0.70, tru: 0.42, age: 0.50 },
    { reg: 0.15, use: 0.78, tru: 0.52, age: 0.55 },
    { reg: 0.10, use: 0.82, tru: 0.58, age: 0.52 },
  ],
  drjimfan: [
    { reg: 0.20, use: 0.85, tru: 0.65, age: 0.90 },
    { reg: 0.15, use: 0.78, tru: 0.65, age: 0.78 },
  ],
  minchoi: [
    { reg: 0.10, use: 0.90, tru: 0.70, age: 0.75 },
    { reg: 0.05, use: 0.78, tru: 0.65, age: 0.58 },
  ],
  deryatr_: [
    { reg: 0.40, use: 0.70, tru: 0.50, age: 0.50 },
    { reg: 0.30, use: 0.62, tru: 0.55, age: 0.38 },
  ],
  emostaque: [
    { reg: -0.30, use: 0.85, tru: 0.50, age: 0.60 },
    { reg: -0.35, use: 0.88, tru: 0.52, age: 0.62 },
    { reg: -0.10, use: 0.58, tru: 0.55, age: 0.32 },
  ],
  sriramk: [
    { reg: 0.60, use: 0.75, tru: 0.45, age: 0.65 },
    { reg: 0.45, use: 0.78, tru: 0.48, age: 0.65 },
    { reg: 0.35, use: 0.70, tru: 0.52, age: 0.55 },
  ],
  omarsar0: [
    { reg: 0.30, use: 0.85, tru: 0.60, age: 0.65 },
    { reg: 0.25, use: 0.85, tru: 0.62, age: 0.62 },
  ],
  soumithchintala: [
    { reg:  0.00, use: 0.85, tru: 0.65, age: 0.65 },
    { reg: -0.05, use: 0.80, tru: 0.65, age: 0.52 },
  ],
  officiallogank: [
    { reg: 0.20, use: 0.90, tru: 0.70, age: 0.80 },
    { reg: 0.15, use: 0.88, tru: 0.68, age: 0.75 },
    { reg: 0.10, use: 0.78, tru: 0.65, age: 0.58 },
  ],
  jeremyphoward: [
    { reg: 0.40, use: 0.85, tru: 0.55, age: 0.65 },
    { reg: 0.30, use: 0.85, tru: 0.58, age: 0.60 },
    { reg: 0.20, use: 0.72, tru: 0.62, age: 0.38 },
  ],
  steipete: [
    { reg: 0.10, use: 0.85, tru: 0.60, age: 0.70 },
    { reg: 0.05, use: 0.75, tru: 0.60, age: 0.55 },
  ],
  tunguz: [
    { reg: 0.10, use: 0.85, tru: 0.60, age: 0.60 },
    { reg: 0.08, use: 0.82, tru: 0.62, age: 0.55 },
    { reg: 0.05, use: 0.72, tru: 0.60, age: 0.42 },
  ],
  bcherny: [
    { reg: 0.30, use: 0.85, tru: 0.65, age: 0.80 },
    { reg: 0.20, use: 0.82, tru: 0.65, age: 0.70 },
    { reg: 0.10, use: 0.72, tru: 0.60, age: 0.50 },
  ],
  mustafasuleyman: [
    { reg: 0.65, use: 0.70, tru: 0.25, age: 0.65 },
    { reg: 0.60, use: 0.72, tru: 0.28, age: 0.62 },
    { reg: 0.40, use: 0.76, tru: 0.42, age: 0.55 },
  ],
  gavinsbaker: [
    { reg: 0.20, use: 0.85, tru: 0.65, age: 0.75 },
    { reg: 0.10, use: 0.68, tru: 0.60, age: 0.48 },
  ],
  esyudkowsky: [
    { reg: 0.95, use: 0.10, tru: -0.95, age: -0.90 },
  ],
  yacinemtb: [
    { reg: 0.10, use: 0.85, tru: 0.65, age: 0.90 },
    { reg: 0.05, use: 0.72, tru: 0.60, age: 0.68 },
  ],
  kazu_fujisawa: [
    { reg: 0.20, use: 0.80, tru: 0.60, age: 0.70 },
    { reg: 0.15, use: 0.68, tru: 0.55, age: 0.52 },
  ],
  oriolvinyalsml: [
    { reg: 0.35, use: 0.70, tru: 0.55, age: 0.60 },
    { reg: 0.30, use: 0.72, tru: 0.58, age: 0.58 },
    { reg: 0.20, use: 0.68, tru: 0.60, age: 0.42 },
  ],
  clementdelangue: [
    { reg: 0.20, use: 0.95, tru: 0.75, age: 0.70 },
    { reg: 0.14, use: 0.88, tru: 0.70, age: 0.55 },
    { reg: 0.10, use: 0.75, tru: 0.65, age: 0.38 },
  ],
  aelluswamy: [
    { reg: 0.10, use: 0.90, tru: 0.70, age: 0.85 },
    { reg: 0.05, use: 0.78, tru: 0.65, age: 0.68 },
  ],
  schmidhuberai: [
    { reg: 0.40, use: 0.60, tru: 0.40, age: 0.30 },
    { reg: 0.35, use: 0.62, tru: 0.42, age: 0.28 },
    { reg: 0.25, use: 0.58, tru: 0.48, age: 0.18 },
  ],
  goodside: [
    { reg: 0.20, use: 0.90, tru: 0.65, age: 0.70 },
    { reg: 0.15, use: 0.83, tru: 0.62, age: 0.62 },
  ],
  mitchellh: [
    { reg: 0.15, use: 0.85, tru: 0.60, age: 0.75 },
    { reg: 0.10, use: 0.72, tru: 0.62, age: 0.55 },
  ],
  darioamodei: [
    { reg: 0.70, use: 0.50, tru: 0.15, age: 0.60 },
    { reg: 0.55, use: 0.55, tru: 0.20, age: 0.55 },
    { reg: 0.35, use: 0.65, tru: 0.38, age: 0.45 },
  ],
  arankomatsuzaki: [
    { reg: 0.20, use: 0.75, tru: 0.55, age: 0.60 },
    { reg: 0.15, use: 0.75, tru: 0.55, age: 0.58 },
    { reg: 0.10, use: 0.80, tru: 0.60, age: 0.50 },
  ],
  chrmanning: [
    { reg: 0.45, use: 0.65, tru: 0.45, age: 0.35 },
    { reg: 0.35, use: 0.65, tru: 0.52, age: 0.22 },
  ],
  elonmusk: [
    { reg: -0.90, use: 0.90, tru: 0.10, age: 0.90 },
    { reg: -0.75, use: 0.88, tru: 0.18, age: 0.85 },
    { reg: -0.60, use: 0.85, tru: 0.30, age: 0.80 },
    { reg: -0.30, use: 0.78, tru: 0.48, age: 0.65 },
  ],
};

/**
 * Extract the LinkedIn vanity slug from a full profile URL. Returns `null` if
 * the URL doesn't match the `linkedin.com/in/{slug}` shape.
 */
export function linkedinSlugFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/linkedin\.com\/in\/([^\/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
