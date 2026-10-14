import { asset } from '../assets';
export const mysteries = {
  "Joyful": {
    "colors": [
      "#F4EFE4",
      "#E5DDD0"
    ],
    "list": [
      "The Annunciation",
      "The Visitation",
      "The Nativity",
      "The Presentation",
      "The Finding in the Temple"
    ],
    "descriptions": [
      "The angel Gabriel announces to Mary that she will conceive the Son of God.",
      "Mary visits her cousin Elizabeth, who is pregnant with John the Baptist.",
      "Jesus is born in a stable in Bethlehem.",
      "Mary and Joseph present the infant Jesus at the Temple in Jerusalem.",
      "The boy Jesus is found teaching among the elders in the Temple."
    ],
    "details": [
      "The angel Gabriel announces that Mary will conceive Jesus, the Son of God, through the Holy Spirit. Although she cannot see the whole path ahead, Mary freely gives her faithful yes to God. This mystery invites us to receive God's will with the same humility, courage, and trust.",
      "Mary travels in haste to serve her cousin Elizabeth, carrying Christ within her. John the Baptist leaps in Elizabeth's womb, and Mary responds with the Magnificat. This mystery teaches that genuine encounter with Christ moves us toward joyful service of others.",
      "The eternal Son of God enters the world in the poverty and simplicity of Bethlehem. Mary and Joseph welcome him with love, while shepherds become the first witnesses. The Nativity reveals that God's greatness often comes quietly.",
      "Mary and Joseph present Jesus in the Temple in faithful obedience to the Law. Simeon recognizes the promised Messiah and foretells both salvation and sorrow. This mystery calls us to dedicate our lives to God.",
      "After three anxious days, Mary and Joseph find the young Jesus among the teachers in the Temple. Jesus speaks of being in his Father's house, yet returns home and lives obediently. This mystery comforts us when God seems absent."
    ]
  },
  "Sorrowful": {
    "colors": [
      "#571D25",
      "#241419"
    ],
    "list": [
      "The Agony in the Garden",
      "The Scourging at the Pillar",
      "The Crowning with Thorns",
      "The Carrying of the Cross",
      "The Crucifixion"
    ],
    "descriptions": [
      "Jesus prays in the Garden of Gethsemane in sorrow, knowing his arrest is near.",
      "Jesus is bound to a pillar and whipped by Roman soldiers.",
      "Soldiers mock Jesus as king, pressing a crown of thorns onto his head.",
      "Jesus carries his cross through Jerusalem to the hill of Calvary.",
      "Jesus dies on the cross for the salvation of humanity."
    ],
    "details": [
      "In Gethsemane, Jesus experiences profound sorrow as he faces betrayal, abandonment, and death. He honestly brings his anguish to the Father and freely prays that the Father's will be done. This mystery teaches us to surrender to God.",
      "Though innocent, Jesus is bound and brutally scourged by Roman soldiers. He accepts physical pain and humiliation without surrendering his love for humanity. Contemplating his wounds calls us to compassion.",
      "The soldiers clothe Jesus in mock royalty, press thorns upon his head, and ridicule him as king. Their cruelty unknowingly points toward the truth: Christ's kingship is revealed through humility, sacrifice, and love.",
      "Jesus carries the instrument of his execution toward Calvary, weakened yet steadfast in love. Simon of Cyrene is compelled to help bear the cross. This mystery invites us to carry our own crosses faithfully.",
      "Jesus is crucified and gives his life for the salvation of the world. From the cross he offers forgiveness and places himself completely in the Father's hands. This mystery reveals the depth of divine love."
    ]
  },
  "Glorious": {
    "colors": [
      "#193A59",
      "#0C1D31"
    ],
    "list": [
      "The Resurrection",
      "The Ascension",
      "The Descent of the Holy Spirit",
      "The Assumption of Mary",
      "The Coronation of Mary"
    ],
    "descriptions": [
      "Jesus rises from the dead on the third day, conquering sin and death.",
      "Jesus ascends into heaven forty days after his Resurrection.",
      "The Holy Spirit descends upon Mary and the apostles at Pentecost.",
      "Mary is taken up body and soul into heaven at the end of her earthly life.",
      "Mary is crowned Queen of Heaven and Earth."
    ],
    "details": [
      "On the third day, the tomb is found empty and the risen Jesus appears to his disciples. His Resurrection conquers sin and death, confirms his promises, and becomes the foundation of Christian hope.",
      "After preparing his disciples for their mission, Jesus ascends to the Father. His departure is not abandonment: he reigns in glory, intercedes for his people, and promises the Holy Spirit.",
      "Mary and the apostles remain together in prayer until the Holy Spirit descends at Pentecost. Wind, fire, and new languages signify God's power. This mystery asks us to welcome the Spirit's gifts.",
      "At the completion of her earthly life, Mary is taken body and soul into heavenly glory. Her Assumption flows from her unique union with Christ and anticipates the resurrection promised to all the faithful.",
      "Mary shares in the victory of her Son and is honored as Queen of Heaven and Earth. Her queenship is maternal and humble, always leading the faithful toward Christ and interceding for them."
    ]
  },
  "Luminous": {
    "colors": [
      "#275C5B",
      "#102E31"
    ],
    "list": [
      "The Baptism in the Jordan",
      "The Wedding at Cana",
      "The Proclamation of the Kingdom",
      "The Transfiguration",
      "The Institution of the Eucharist"
    ],
    "descriptions": [
      "Jesus is baptized by John in the Jordan River, and the Father's voice proclaims him.",
      "Jesus performs his first public miracle, turning water into wine at Cana.",
      "Jesus preaches repentance and announces the coming of God's kingdom.",
      "Jesus is transfigured in glory before Peter, James, and John on the mountain.",
      "Jesus gives his Body and Blood to the apostles at the Last Supper."
    ],
    "details": [
      "Jesus enters the Jordan and receives baptism from John, identifying himself with the people he has come to save. The Spirit descends like a dove and the Father's voice declares Jesus to be his beloved Son.",
      "At Cana, Mary notices the wedding family's need and brings it quietly to Jesus. Her instruction, 'Do whatever he tells you,' prepares the servants to witness water transformed into abundant wine.",
      "Jesus announces that the kingdom of God is at hand and calls every person to repentance and faith. Through his teaching, forgiveness, healing, and mercy, he reveals what life under God's reign looks like.",
      "Jesus reveals his glory to Peter, James, and John upon the mountain. Moses and Elijah appear beside him, and the Father's voice commands the disciples to listen to his beloved Son.",
      "At the Last Supper, Jesus gives the apostles bread and wine as his Body and Blood and commands them to continue this memorial. The Eucharist makes present his self-giving sacrifice."
    ]
  }
} as const;
export type MysterySet = keyof typeof mysteries;
export const mysterySets = Object.keys(mysteries) as MysterySet[];
export const artwork = {
  Joyful: [asset("rosary/joyful-v2-1.jpg"), asset("rosary/joyful-v2-2.jpg"), asset("rosary/joyful-v2-3.jpg"), asset("rosary/joyful-v2-4.jpg"), asset("rosary/joyful-v2-5.jpg")],
  Sorrowful: [asset("rosary/sorrowful-v2-1.jpg"), asset("rosary/sorrowful-v2-2.jpg"), asset("rosary/sorrowful-v2-3.jpg") + "?v=6d023c08bbfb", asset("rosary/sorrowful-v2-4.jpg"), asset("rosary/sorrowful-v2-5.jpg")],
  Glorious: [asset("rosary/Glorious1.jpg"), asset("rosary/Glorious2.jpg"), asset("rosary/Glorious3-sharp.jpg"), asset("rosary/Glorious4.jpg"), asset("rosary/Glorious5.jpg")],
  Luminous: [asset("rosary/Lum1.jpg"), asset("rosary/Lum2.jpg"), asset("rosary/Lum3.jpg"), asset("rosary/Lum4.jpg"), asset("rosary/Lum5.jpg")],
};
