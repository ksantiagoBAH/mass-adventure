import { asset } from '../assets';
import type { MysterySet } from './mysteries';

// Static requires let Metro bundle the complete, offline-ready set.
export const mysteryVideos: Record<MysterySet, readonly [string, string, string, string, string]> = {
  Joyful: [
    asset("rosary/mystery-joyful-01.mp4"),
    asset("rosary/mystery-joyful-02.mp4"),
    asset("rosary/mystery-joyful-03.mp4"),
    asset("rosary/mystery-joyful-04.mp4"),
    asset("rosary/mystery-joyful-05.mp4"),
  ],
  Sorrowful: [
    asset("rosary/mystery-sorrowful-01.mp4"),
    asset("rosary/mystery-sorrowful-02.mp4"),
    asset("rosary/mystery-sorrowful-03.mp4"),
    asset("rosary/mystery-sorrowful-04.mp4"),
    asset("rosary/mystery-sorrowful-05.mp4"),
  ],
  Glorious: [
    asset("rosary/mystery-glorious-01.mp4"),
    asset("rosary/mystery-glorious-02.mp4"),
    asset("rosary/mystery-glorious-03.mp4"),
    asset("rosary/mystery-glorious-04.mp4"),
    asset("rosary/mystery-glorious-05.mp4"),
  ],
  Luminous: [
    asset("rosary/mystery-luminous-01.mp4"),
    asset("rosary/mystery-luminous-02.mp4"),
    asset("rosary/mystery-luminous-03.mp4"),
    asset("rosary/mystery-luminous-04.mp4"),
    asset("rosary/mystery-luminous-05.mp4"),
  ],
};
