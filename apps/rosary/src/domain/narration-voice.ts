export const narrationVoices = ['male', 'female'] as const;
export type NarrationVoice = typeof narrationVoices[number];

export function parseNarrationVoice(value: unknown): NarrationVoice {
  if (!value || typeof value !== 'object') return 'male';
  const preference = value as { version?: unknown; voice?: unknown };
  return preference.version === 1 && preference.voice === 'female' ? 'female' : 'male';
}

export function narrationPlaybackKey(voice: NarrationVoice, step: string) {
  return `${voice}:${step}`;
}
