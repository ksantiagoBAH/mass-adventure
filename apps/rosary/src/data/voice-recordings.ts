import { recordings } from './recordings';
import { femaleRecordings } from './female-recordings';
import type { NarrationId } from './narration';
import type { NarrationVoice } from '../domain/narration-voice';

export function recordingForVoice(id: NarrationId, voice: NarrationVoice) {
  return (voice === 'female' ? femaleRecordings : recordings)[id];
}
