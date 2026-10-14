import { mysteries, mysterySets, type MysterySet } from '../data/mysteries';
import { prayers, type PrayerId } from '../data/prayers';

export type RosaryStep = {
  id: string;
  title: string;
  text: string;
  instruction: string;
  phase: 'opening' | 'decade' | 'closing';
  prayerId?: PrayerId;
  mysteryIndex?: number;
  beadIndex?: number;
  hailNumber?: number;
};

export function buildRosarySteps(set: MysterySet, includeFatima: boolean): RosaryStep[] {
  const steps: RosaryStep[] = [];
  const add = (id: string, prayerId: PrayerId, phase: RosaryStep['phase'], instruction: string,
    extra: Partial<RosaryStep> = {}) => {
    steps.push({ id, prayerId, phase, instruction, title: prayers[prayerId].title, text: prayers[prayerId].text, ...extra });
  };
  add('opening-cross', 'sign-of-cross', 'opening', 'Begin in the presence of God.');
  add('creed', 'apostles-creed', 'opening', 'Holding the crucifix, profess your faith.');
  add('opening-father', 'our-father', 'opening', 'On the first large bead.', { beadIndex: 0 });
  ['Faith', 'Hope', 'Charity'].forEach((virtue, index) => {
    add(`opening-mary-${index}`, 'hail-mary', 'opening', `For an increase in ${virtue.toLowerCase()}.`,
      { beadIndex: index + 1, hailNumber: index + 1 });
  });
  add('opening-glory', 'glory-be', 'opening', 'Give glory to the Holy Trinity.', { beadIndex: 3 });
  if (includeFatima) add('opening-fatima', 'fatima-prayer', 'opening', 'After the opening Glory Be, pray the Fatima Prayer.', { beadIndex: 3 });
  for (let decade = 0; decade < 5; decade++) {
    const bead = 4 + decade * 11;
    steps.push({ id: `mystery-${decade}`, title: mysteries[set].list[decade],
      text: mysteries[set].details[decade], instruction: `Announce the ${['first', 'second', 'third', 'fourth', 'fifth'][decade]} mystery. Take a moment to meditate.`,
      phase: 'decade', mysteryIndex: decade, beadIndex: bead });
    add(`father-${decade}`, 'our-father', 'decade', 'On the large bead, begin this decade.', { mysteryIndex: decade, beadIndex: bead });
    for (let hail = 1; hail <= 10; hail++) {
      add(`mary-${decade}-${hail}`, 'hail-mary', 'decade', `Hail Mary ${hail} of 10. Keep this mystery in your heart.`,
        { mysteryIndex: decade, beadIndex: bead + hail, hailNumber: hail });
    }
    add(`glory-${decade}`, 'glory-be', 'decade', 'Conclude this decade with praise.', { mysteryIndex: decade, beadIndex: bead + 10 });
    if (includeFatima) add(`fatima-${decade}`, 'fatima-prayer', 'decade', 'The optional prayer after each decade.', { mysteryIndex: decade, beadIndex: bead + 10 });
  }
  add('queen', 'hail-holy-queen', 'closing', 'After the five decades, turn to Mary in prayer.');
  add('closing-prayer', 'rosary-closing', 'closing', 'Let us pray.');
  add('closing-cross', 'sign-of-cross', 'closing', 'Conclude the Rosary.');
  return steps;
}

export type RosarySession = { version: 2; set: MysterySet; includeFatima: boolean; position: number };

// The medal joins the opening strand to the two ends of the five-decade loop.
export function rosaryMedalPlacement(step: RosaryStep): 'before' | 'after' | null {
  if (step.phase === 'opening' || step.phase === 'closing') return 'after';
  if (step.mysteryIndex === 0) return 'before';
  if (step.mysteryIndex === 4) return 'after';
  return null;
}

export function beadLabel(step: RosaryStep): string {
  if (step.phase === 'closing') return 'All 59 beads complete';
  if (step.beadIndex === undefined) return 'Holding the crucifix';
  return `Bead ${step.beadIndex + 1} of 59${step.prayerId === 'hail-mary' && step.phase === 'decade' ? ` · Hail Mary ${step.hailNumber} of 10` : ''}`;
}

// Completion events belong to one step; a late event must never skip the next bead.
export function advanceAfterNarration(session: RosarySession, finishedStepId: string): RosarySession {
  const steps = buildRosarySteps(session.set, session.includeFatima);
  return steps[session.position]?.id === finishedStepId ? { ...session, position: session.position + 1 } : session;
}
export function parseRosarySession(value: unknown): RosarySession | null {
  if (!value || typeof value !== 'object') return null;
  const session = value as Record<string, unknown>;
  if ((session.version !== 1 && session.version !== 2) || !mysterySets.includes(session.set as MysterySet) ||
      typeof session.includeFatima !== 'boolean' || !Number.isInteger(session.position)) return null;
  const length = buildRosarySteps(session.set as MysterySet, session.includeFatima).length;
  const oldSequence = session.version === 1 && session.includeFatima;
  const savedLength = length - (oldSequence ? 1 : 0);
  if ((session.position as number) < 0 || (session.position as number) > savedLength) return null;
  // Preserve the prayer being resumed, including already-completed rosaries.
  const position = (session.position as number) + (oldSequence && (session.position as number) >= 7 ? 1 : 0);
  return { version: 2, set: session.set as MysterySet, includeFatima: session.includeFatima, position };
}
