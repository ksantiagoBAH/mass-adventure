// Traditional English prayer texts, using public-domain formulations.
// Rosary sequence reference: https://www.usccb.org/how-to-pray-the-rosary
export const prayers = {
  'sign-of-cross': {
    title: 'Sign of the Cross', category: 'Rosary',
    text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
  },
  'apostles-creed': {
    title: "Apostles’ Creed", category: 'Rosary',
    text: 'I believe in God, the Father almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; the third day He rose again from the dead; He ascended into heaven, and sits at the right hand of God, the Father almighty; from there He shall come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
  },
  'our-father': {
    title: 'Our Father', category: 'Rosary',
    text: 'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven.\n\nGive us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
  },
  'hail-mary': {
    title: 'Hail Mary', category: 'Rosary',
    text: 'Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
  },
  'glory-be': {
    title: 'Glory Be', category: 'Rosary',
    text: 'Glory be to the Father, and to the Son, and to the Holy Spirit.\n\nAs it was in the beginning, is now, and ever shall be, world without end. Amen.',
  },
  'fatima-prayer': {
    title: 'Fatima Prayer', category: 'Rosary',
    text: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those who have most need of Thy mercy.',
  },
  'hail-holy-queen': {
    title: 'Hail, Holy Queen', category: 'Rosary',
    text: 'Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears.\n\nTurn then, most gracious advocate, thine eyes of mercy toward us; and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.',
  },
  'rosary-closing': {
    title: 'Closing Prayer of the Rosary', category: 'Rosary',
    text: 'O God, whose only-begotten Son, by His life, death, and resurrection, has purchased for us the rewards of eternal life; grant, we beseech Thee, that meditating upon these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.',
  },
  memorare: {
    title: 'Memorare', category: 'Devotions',
    text: 'Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided.\n\nInspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come; before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.',
  },
  'saint-michael': {
    title: 'Prayer to Saint Michael', category: 'Devotions',
    text: 'Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil.\n\nMay God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.',
  },
  'guardian-angel': {
    title: 'Guardian Angel Prayer', category: 'Devotions',
    text: 'Angel of God, my guardian dear, to whom God’s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.',
  },
  'act-of-contrition': {
    title: 'Act of Contrition', category: 'Devotions',
    text: 'O my God, I am heartily sorry for having offended Thee, and I detest all my sins, because I dread the loss of heaven and the pains of hell; but most of all because they offend Thee, my God, who art all good and deserving of all my love.\n\nI firmly resolve, with the help of Thy grace, to confess my sins, to do penance, and to amend my life. Amen.',
  },
} as const;

export type PrayerId = keyof typeof prayers;
export const prayerIds = Object.keys(prayers) as PrayerId[];
export function isPrayerId(value: unknown): value is PrayerId {
  return typeof value === 'string' && Object.hasOwn(prayers, value);
}
