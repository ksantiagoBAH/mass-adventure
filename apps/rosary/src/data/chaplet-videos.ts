import { asset } from '../assets';
// Silent timeline exports from the user’s Runway workspace, bundled for offline prayer.
export const chapletVideos = [
  { title: 'Jesus, I trust in You', source: asset("chaplet/jesus.mp4"), still: asset("chaplet/jesus.jpg") },
  { title: 'Jesus appears to Saint Faustina', source: asset("chaplet/decade-01.mp4"), still: asset("chaplet/decade-01.jpg") },
  { title: 'Saint Faustina prays for mercy', source: asset("chaplet/decade-02.mp4"), still: asset("chaplet/decade-02.jpg") },
  { title: 'The Divine Mercy image', source: asset("chaplet/decade-03.mp4"), still: asset("chaplet/decade-03.jpg") },
  { title: 'Mercy flows from the Cross', source: asset("chaplet/decade-04.mp4"), still: asset("chaplet/decade-04.jpg") },
  { title: 'The whole world gathers in prayer', source: asset("chaplet/decade-05.mp4"), still: asset("chaplet/decade-05.jpg") },
] as const;
