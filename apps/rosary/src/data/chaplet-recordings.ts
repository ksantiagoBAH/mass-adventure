import { asset } from '../assets';
import type { NarrationRecording } from './narration';
import type { ChapletPrayerId } from '../domain/chaplet';
import type { NarrationVoice } from '../domain/narration-voice';
import type { NarrationTiming } from '../domain/narration-progress';
import { recordingForVoice } from './voice-recordings';
import { timingForNarration } from './narration-timing';
import { isPrayerId } from './prayers';
import timings from './chaplet-narration-timings.json';

export const chapletRecordings: Record<NarrationVoice, Partial<Record<ChapletPrayerId, NarrationRecording>>> = {
  male: {
    "eternal-father": { source: asset("audio/chaplet/male/prayer-eternal-father.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.", kind: 'synthetic' },
    "eternal-god": { source: asset("audio/chaplet/male/prayer-eternal-god.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible, look kindly upon us and increase Your mercy in us, that in difficult moments we might not despair nor become despondent, but with great confidence submit ourselves to Your holy will, which is Love and Mercy itself. Amen.", kind: 'synthetic' },
    "sorrowful-passion": { source: asset("audio/chaplet/male/prayer-sorrowful-passion.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "For the sake of His sorrowful Passion, have mercy on us and on the whole world.", kind: 'synthetic' },
    "hail-mary": { source: asset("audio/chaplet/male/prayer-hail-mary.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", kind: 'synthetic' },
    "holy-god": { source: asset("audio/chaplet/male/prayer-holy-god.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.", kind: 'synthetic' },
    "apostles-creed": { source: asset("audio/chaplet/male/prayer-apostles-creed.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "I believe in God, the Father almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; the third day He rose again from the dead; He ascended into heaven, and sits at the right hand of God, the Father almighty; from there He shall come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.", kind: 'synthetic' },
    "sign-of-cross": { source: asset("audio/chaplet/male/prayer-sign-of-cross.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.", kind: 'synthetic' },
    "blood-and-water": { source: asset("audio/chaplet/male/prayer-blood-and-water.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "O Blood and Water, which gushed forth from the Heart of Jesus as a fountain of Mercy for us, I trust in You!", kind: 'synthetic' },
    "our-father": { source: asset("audio/chaplet/male/prayer-our-father.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven.\n\nGive us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.", kind: 'synthetic' },
    "you-expired": { source: asset("audio/chaplet/male/prayer-you-expired.mp3"), narrator: 'Male voice · ElevenLabs', transcript: "You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.", kind: 'synthetic' },
  },
  female: {
    "eternal-father": { source: asset("audio/chaplet/female/prayer-eternal-father.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.", kind: 'synthetic' },
    "eternal-god": { source: asset("audio/chaplet/female/prayer-eternal-god.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible, look kindly upon us and increase Your mercy in us, that in difficult moments we might not despair nor become despondent, but with great confidence submit ourselves to Your holy will, which is Love and Mercy itself. Amen.", kind: 'synthetic' },
    "sorrowful-passion": { source: asset("audio/chaplet/female/prayer-sorrowful-passion.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "For the sake of His sorrowful Passion, have mercy on us and on the whole world.", kind: 'synthetic' },
    "holy-god": { source: asset("audio/chaplet/female/prayer-holy-god.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.", kind: 'synthetic' },
    "apostles-creed": { source: asset("audio/chaplet/female/prayer-apostles-creed.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "I believe in God, the Father almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; the third day He rose again from the dead; He ascended into heaven, and sits at the right hand of God, the Father almighty; from there He shall come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.", kind: 'synthetic' },
    "sign-of-cross": { source: asset("audio/chaplet/female/prayer-sign-of-cross.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.", kind: 'synthetic' },
    "blood-and-water": { source: asset("audio/chaplet/female/prayer-blood-and-water.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "O Blood and Water, which gushed forth from the Heart of Jesus as a fountain of Mercy for us, I trust in You!", kind: 'synthetic' },
    "our-father": { source: asset("audio/chaplet/female/prayer-our-father.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven.\n\nGive us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.", kind: 'synthetic' },
    "you-expired": { source: asset("audio/chaplet/female/prayer-you-expired.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.", kind: 'synthetic' },
    "hail-mary": { source: asset("audio/chaplet/female/prayer-hail-mary.mp3"), narrator: 'Female voice · ElevenLabs', transcript: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", kind: 'synthetic' },
  },
};

export function chapletRecordingForVoice(id: ChapletPrayerId, voice: NarrationVoice) {
  return chapletRecordings[voice][id] ?? (isPrayerId(id) ? recordingForVoice(`prayer:${id}`, voice) : undefined);
}
const catalogs: Record<NarrationVoice, Partial<Record<ChapletPrayerId, NarrationTiming>>> = timings;
export function chapletTimingForVoice(id: ChapletPrayerId, voice: NarrationVoice) {
  const recording = chapletRecordingForVoice(id, voice);
  const timing = catalogs[voice][id] ?? (isPrayerId(id) ? timingForNarration(`prayer:${id}`, recording?.transcript, voice) : undefined);
  return timing?.transcript === recording?.transcript ? timing : undefined;
}
