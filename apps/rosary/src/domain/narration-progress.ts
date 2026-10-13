export type TimedWord = { start: number; end: number; offset: number; endOffset: number };
export type NarrationTiming = { transcript: string; audioSha256: string; model: string; words: TimedWord[] };

// Audio position already accounts for playback speed, pause, and replay.
export function wordAtTime(words: readonly TimedWord[], seconds: number): number {
  if (!Number.isFinite(seconds)) return -1;
  let low = 0;
  let high = words.length - 1;
  while (low <= high) {
    const middle = (low + high) >>> 1;
    if (words[middle].start <= seconds) low = middle + 1;
    else high = middle - 1;
  }
  return high >= 0 && seconds < words[high].end ? high : -1;
}

export type ReadingLine = { start: number; end: number; y: number; height: number };
export function readingLines(text: string, lines: readonly { text: string; y: number; height: number }[]): ReadingLine[] {
  let cursor = 0;
  const result: ReadingLine[] = [];
  for (const line of lines) {
    const content = line.text.trim();
    if (!content) continue;
    const start = text.indexOf(content, cursor);
    if (start < 0) continue;
    cursor = start + content.length;
    result.push({ start, end: cursor, y: line.y, height: line.height });
  }
  return result;
}

export function scrollForWord(lines: readonly ReadingLine[], offset: number, textTop: number, scrollY: number, viewport: number): number | null {
  if (viewport <= 0) return null;
  const line = lines.find(item => offset >= item.start && offset < item.end);
  if (!line) return null;
  const top = textTop + line.y;
  if (top >= scrollY + 20 && top + line.height <= scrollY + viewport - 30) return null;
  return Math.max(0, top - viewport * 0.35);
}

export type NarrationPhrase = { firstWord: number; lastWord: number; text: string };
export function narrationPhrases(text: string, words: readonly TimedWord[], maxWords = 6): NarrationPhrase[] {
  const result: NarrationPhrase[] = [];
  let first = 0;
  for (let index = 0; index < words.length; index++) {
    const word = text.slice(words[index].offset, words[index].endOffset);
    const count = index - first + 1;
    const paragraphBreak = /\n/.test(text.slice(words[index].endOffset, words[index + 1]?.offset ?? text.length));
    if (count >= maxWords || /[.!?;:]$/.test(word) || (count >= 4 && /,$/.test(word)) || paragraphBreak || index === words.length - 1) {
      result.push({ firstWord: first, lastWord: index, text: text.slice(words[first].offset, words[index].endOffset) });
      first = index + 1;
    }
  }
  return result;
}

export function phraseAtWord(phrases: readonly NarrationPhrase[], word: number): number {
  return phrases.findIndex(phrase => word >= phrase.firstWord && word <= phrase.lastWord);
}
