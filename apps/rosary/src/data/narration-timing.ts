import timings from './narration-timings.json';
import femaleTimings from './female-narration-timings.json';
import type { NarrationVoice } from '../domain/narration-voice';
import type { NarrationId } from './narration';
import type { NarrationTiming } from '../domain/narration-progress';

const catalogs: Record<NarrationVoice, Partial<Record<NarrationId, NarrationTiming>>> = { male: timings, female: femaleTimings };
export function timingForNarration(id: NarrationId | undefined, transcript: string | undefined, voice: NarrationVoice = 'male') {
  const timing = id ? catalogs[voice][id] : undefined;
  return timing?.transcript === transcript ? timing : undefined;
}
