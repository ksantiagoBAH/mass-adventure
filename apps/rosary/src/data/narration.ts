import { mysteries, mysterySets, type MysterySet } from './mysteries';
import { prayerIds, prayers, type PrayerId } from './prayers';
import type { RosaryStep } from '../domain/rosary';

export type NarrationId = `prayer:${PrayerId}` | `mystery:${MysterySet}:${number}`;
export type NarrationScript = { id: NarrationId; title: string; text: string; filename: string; kind: 'prayer' | 'mystery' };

export function mysteryNarrationId(set: MysterySet, index: number): NarrationId {
  return `mystery:${set}:${index}`;
}

export const narrationScripts: NarrationScript[] = [
  ...prayerIds.map(id => ({ id: `prayer:${id}` as NarrationId, title: prayers[id].title,
    text: prayers[id].text.replace(/^[VR]\. /gm, ''), filename: `prayer-${id}.mp3`, kind: 'prayer' as const })),
  ...mysterySets.flatMap(set => mysteries[set].list.map((title, index) => ({
    id: mysteryNarrationId(set, index), title: `${set} · ${title}`,
    text: `${title}.\n\n${mysteries[set].details[index]}`,
    filename: `mystery-${set.toLowerCase()}-${String(index + 1).padStart(2, '0')}.mp3`, kind: 'mystery' as const,
  }))),
];

export function stepNarrationId(set: MysterySet, step: RosaryStep): NarrationId | undefined {
  return step.prayerId ? `prayer:${step.prayerId}` : step.mysteryIndex !== undefined ? mysteryNarrationId(set, step.mysteryIndex) : undefined;
}

export type NarrationRecording = { source: string; narrator: string; transcript: string; kind: 'human' | 'synthetic' };
export function recordingMatchesScript(recording: NarrationRecording | undefined, script: NarrationScript | undefined) {
  return !!recording && !!script && recording.transcript === script.text;
}
