import { prayers, type PrayerId } from '../data/prayers';
import { chapletPrayers } from '../data/chaplet-prayers';

export type ChapletPrayerId = PrayerId | keyof typeof chapletPrayers;
export type ChapletOptions = { includeOpening: boolean; includeClosing: boolean };
export type ChapletStep = {
  id: string; narrationId: ChapletPrayerId; title: string; text: string; instruction: string;
  phase: 'opening' | 'decade' | 'closing';
  decade?: number; repetition?: number; prayerId?: PrayerId;
};
export type ChapletSession = ChapletOptions & { version: 1; position: number };

export function buildChapletSteps(options: ChapletOptions): ChapletStep[] {
  const steps: ChapletStep[] = [];
  const familiar = (id: string, prayerId: PrayerId, phase: ChapletStep['phase']) =>
    steps.push({ id, narrationId: prayerId, ...prayers[prayerId], prayerId, phase, instruction: phase === 'opening' ? 'Begin the Chaplet.' : 'Conclude the Chaplet.' });
  const add = (id: string, prayer: keyof typeof chapletPrayers, phase: ChapletStep['phase'], instruction: string,
    extra: Partial<ChapletStep> = {}) => steps.push({ id, narrationId: prayer, ...chapletPrayers[prayer], phase, instruction, ...extra });
  familiar('opening-cross', 'sign-of-cross', 'opening');
  if (options.includeOpening) {
    add('you-expired', 'you-expired', 'opening', 'Optional opening prayer.');
    for (let repetition = 1; repetition <= 3; repetition++)
      add(`blood-and-water-${repetition}`, 'blood-and-water', 'opening', `Optional invocation ${repetition} of 3.`, { repetition });
  }
  familiar('our-father', 'our-father', 'opening');
  familiar('hail-mary', 'hail-mary', 'opening');
  familiar('creed', 'apostles-creed', 'opening');
  for (let decade = 0; decade < 5; decade++) {
    add(`father-${decade}`, 'eternal-father', 'decade', 'On the large bead.', { decade });
    for (let repetition = 1; repetition <= 10; repetition++)
      add(`passion-${decade}-${repetition}`, 'sorrowful-passion', 'decade', `On the small bead · ${repetition} of 10.`, { decade, repetition });
  }
  for (let repetition = 1; repetition <= 3; repetition++)
    add(`holy-god-${repetition}`, 'holy-god', 'closing', `Closing invocation ${repetition} of 3.`, { repetition });
  if (options.includeClosing) add('eternal-god', 'eternal-god', 'closing', 'Optional closing prayer.');
  familiar('closing-cross', 'sign-of-cross', 'closing');
  return steps;
}

export function parseChapletSession(value: unknown): ChapletSession | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  if (data.version !== 1 || typeof data.includeOpening !== 'boolean' || typeof data.includeClosing !== 'boolean' ||
      !Number.isInteger(data.position)) return null;
  const options = { includeOpening: data.includeOpening, includeClosing: data.includeClosing };
  const position = data.position as number;
  if (position < 0 || position > buildChapletSteps(options).length) return null;
  return { version: 1, ...options, position };
}

// Ignore delayed or duplicate completion events from a previous prayer.
export function advanceChapletAfterNarration(session: ChapletSession, finishedStepId: string): ChapletSession {
  const step = buildChapletSteps(session)[session.position];
  return step?.id === finishedStepId ? { ...session, position: session.position + 1 } : session;
}

// Keep the tracker visible for the entire devotion, deriving it from the saved prayer.
export type ChapletBeadProgress = {
  activeIndex: number; count: number; showCross: boolean; crossActive: boolean; complete: boolean; label: string; skippedIndex?: number;
};
export function chapletBeadProgress(step: ChapletStep, completed = false): ChapletBeadProgress {
  if (completed) return { activeIndex: 11, count: 11, showCross: true, crossActive: false, complete: true,
    label: 'Chaplet complete · All five decades prayed' };
  if (step.phase === 'opening') {
    const activeIndex = step.narrationId === 'our-father' ? 0 : step.narrationId === 'hail-mary' ? 1
      : step.narrationId === 'apostles-creed' ? 2 : -1;
    const invocation = step.narrationId === 'blood-and-water' ? ` · ${step.repetition} of 3` : '';
    return { activeIndex, count: 4, skippedIndex: 3, showCross: true, crossActive: activeIndex === -1, complete: false,
      label: `Opening prayers · ${step.title}${invocation}${activeIndex === 0 ? ' · Large bead' : activeIndex > 0 ? ` · Small bead ${activeIndex} of 3` : ''} · Third small bead skipped` };
  }
  if (step.phase === 'closing') {
    const invocation = step.narrationId === 'holy-god' ? ` · ${step.repetition} of 3` : '';
    return { activeIndex: 11, count: 11, showCross: true, crossActive: true, complete: false,
      label: `Closing prayers · ${step.title}${invocation}` };
  }
  const activeIndex = step.narrationId === 'eternal-father' ? 0 : step.repetition ?? 0;
  const label = `Decade ${(step.decade ?? 0) + 1} of 5 · ${activeIndex === 0 ? 'Eternal Father · Large bead' : `Bead ${activeIndex} of 10`}`;
  return { activeIndex, count: 11, showCross: false, crossActive: false, complete: false, label };
}
