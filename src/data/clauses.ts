export type Clause = { text: string; deluxe?: boolean };

export enum Scenario {
  FIRST_DATE = 'First Date',
  AFTER_TWO_DRINKS = 'After 2 Drinks',
  SLEEPOVER = 'Sleepover',
  NETFLIX = 'Netflix & Chill',
}

export const BaseClauses: Clause[] = [
  { text: 'I acknowledge the risk of dad jokes.' },
  { text: 'I waive all rights to complain about morning breath.' },
  { text: 'I consent to mild flirting and potential spooning.' },
  { text: 'I shall not disclose any embarrassing karaoke performances henceforth.' },
  { text: 'I agree to accept pizza as legal tender for apologies.' },
  { text: 'I will not judge pajama choices, including but not limited to novelty onesies.' },
];

export const DeluxeClauses: Clause[] = [
  { text: 'The Kanye Clause: I may interrupt, but only to compliment your outfit.', deluxe: true },
  { text: 'Taylor Swift Addendum: Breakup songs must be catchy and fair.', deluxe: true },
  { text: 'The Beyoncé Provision: All drama will be handled flawlessly.', deluxe: true },
  { text: 'Keanu Rider: Be excellent to each other.', deluxe: true },
];

export function scenarioIntro(scenario: string): string {
  switch (scenario) {
    case Scenario.FIRST_DATE:
      return 'On this auspicious First Date, the parties agree as follows:';
    case Scenario.AFTER_TWO_DRINKS:
      return 'After approximately two (2) libations, sanity being optional, the parties stipulate:';
    case Scenario.SLEEPOVER:
      return 'In the event of a Sleepover, the undersigned hereby covenant:';
    case Scenario.NETFLIX:
      return 'During a Netflix & Chill session, both parties shall abide by:';
    default:
      return 'In the following scenario, the signatories mutually agree:';
  }
}

export function randomClause(includeDeluxe: boolean): Clause {
  const pool = includeDeluxe ? [...BaseClauses, ...DeluxeClauses] : BaseClauses;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function defaultBody(
  scenario: string,
  includeDeluxe: boolean,
  extraClauses: Clause[],
): string {
  const intro = scenarioIntro(scenario);
  const base = [
    'I, the undersigned, consent to mild flirting and agree not to disclose any embarrassing karaoke performances that may occur henceforth.',
    'Parties acknowledge the potential for dad jokes and waive all rights to complain about morning breath.',
    'Hugging, spooning, and blanket-hogging to be negotiated in good faith.',
  ];
  const picked = shuffle(base).slice(0, 2);
  const deluxes = includeDeluxe ? shuffle(DeluxeClauses).slice(0, 1).map(c => c.text) : [];
  const wheel = extraClauses.map(c => c.text);
  return [intro, ...picked, ...deluxes, ...wheel].join('\n\n');
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

