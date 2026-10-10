export type Art =
  | "church"
  | "cross"
  | "hands"
  | "music"
  | "bible"
  | "scroll"
  | "dove"
  | "altar"
  | "chalice"
  | "host"
  | "heart"
  | "lamb"
  | "sun";
export type Part = {
  id: string;
  name: string;
  art: Art;
  alt: string;
  happening: string;
  why: string;
  action: string;
  ccc: string;
  glossary?: [string, string];
  note?: string;
  rite?: string;
};
export const parishArtwork = {
  sanctuary: {
    src: `${import.meta.env.BASE_URL}artwork/parish-sanctuary-paten.webp`,
    alt: "A wide storybook church sanctuary. An ambo with an open Bible stands to the left of the white-clothed altar, where a gold paten holds a round white host. Below the crucifix is a heart-shaped gold tabernacle, topped with a red-and-gold sculpted flame, framed by silver rays, and resting on a black base. Flowers, green banners, a chalice, and a candle are nearby.",
  },
  church: {
    src: `${import.meta.env.BASE_URL}artwork/parish-church-storybook.webp`,
    alt: "Storybook illustration of the red-brick parish church with broad peaked roofs, a rooftop cross, a circular stained-glass window, trees, and a welcoming walkway.",
  },
  altar: {
    src: `${import.meta.env.BASE_URL}artwork/parish-altar-reference-tabernacle.webp`,
    alt: "Storybook illustration of the parish sanctuary: a white-clothed altar, flowers, green banners, candles, and a crucifix of Jesus on the brick wall. The gold tabernacle is shaped like a heart with a red-and-gold sculpted flame, silver rays, and a black base.",
  },
};
export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  feedback: string;
};
export type Section = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  art: Art;
  sticker: string;
  parts: Part[];
  quiz: QuizQuestion[];
};
export const artDescriptions: Record<Art, string> = {
  church: "A small welcoming church with a cross and arched windows",
  cross: "A golden cross",
  hands: "Hands joined in prayer",
  music: "Musical notes and a golden star",
  bible: "An open Bible",
  scroll: "A parchment scroll",
  dove: "A white dove with an olive branch",
  altar: "An altar with a white cloth and two candles",
  chalice: "Bread and a golden chalice",
  host: "A white host marked with a cross beside a golden chalice",
  heart: "A warm coral heart",
  lamb: "A gentle white lamb",
  sun: "A golden sun",
};
const part = (
  id: string,
  name: string,
  art: Art,
  happening: string,
  why: string,
  action: string,
  ccc: string,
  glossary?: [string, string],
  note?: string,
  rite?: string,
): Part => ({
  id,
  name,
  art,
  alt: `${artDescriptions[art]}, representing ${name.toLowerCase()}`,
  happening,
  why,
  action,
  ccc,
  glossary,
  note,
  rite,
});
const q = (
  question: string,
  options: string[],
  answer: number,
  feedback: string,
): QuizQuestion => ({ question, options, answer, feedback });
export const copy = {
  brand: "Mass Adventure",
  tagline: "Little hearts. Big faith.",
  badge: "A little adventure. A lot of love.",
  title: "Come closer to",
  titleAccent: "the wonder of Mass.",
  intro:
    "A joyful journey to discover, pray, and grow with Jesus. One little step at a time.",
  start: "Start the Mass Adventure",
  homeNote: "Made for curious hearts, ages 5–10",
  mapTitle: "Your Mass adventure",
  mapIntro: "Four stops. One beautiful celebration. Where shall we go?",
  stickerTitle: "Your little treasures",
  stickerIntro:
    "Finish a stop or explore every item in our church to collect a sticker. Each one is a reminder of what you discovered!",
  parentTitle: "For the grown-ups",
  parentIntro:
    "Explore together, then notice these moments at your parish. This learning companion is for use before or after Mass. Help your child follow your parish’s gestures and instructions.",
  parentNote:
    "The Catechism references below support each lesson’s teaching; they are not a rubric-by-rubric description of the Roman Missal. This Sunday Mass overview includes prayers that are omitted on some days. The Sanctus and Consecration are within the Eucharistic Prayer; the Communion Rite follows it. Reception of Holy Communion requires appropriate preparation and disposition. Children who have not yet made their First Communion can remain with their family and pray. Ask your parish priest about local practice.",
  privacy:
    "No accounts, ads, or tracking. Progress stays in this visit and resets on refresh.",
  review:
    "For parish review: child-facing wording about the Real Presence, Eucharistic sacrifice, repentance, Communion preparation, seasonal omissions, and local posture or peace customs.",
  quizIntro:
    "Let’s see what you discovered. Take your time—you can always try again!",
  retry: "Good thinking! Here’s a little hint. Try another answer.",
  complete: "You did it!",
  completeNote:
    "You explored, listened, and learned. A new sticker is waiting in your book.",
  glossaryLabel: "Big Word",
  labels: {
    home: "Home",
    map: "Adventure Map",
    stickers: "Sticker Book",
    parents: "Parent Corner",
  },
};
export const sections: Section[] = [
  {
    id: "gathering",
    name: "Gathering",
    subtitle: "Introductory Rites",
    description: "We come together as God’s family.",
    color: "green",
    art: "church",
    sticker: "God’s family",
    parts: [
      part(
        "entrance",
        "Entrance Procession and Hymn",
        "church",
        "The priest and helpers walk toward the altar. We stand and sing as Mass begins.",
        "We gather as God’s family to worship him.",
        "Stand tall and think of one thing to thank God for.",
        "1348; 1157",
        [
          "Altar",
          "The holy table where the Eucharistic sacrifice is celebrated.",
        ],
      ),
      part(
        "sign",
        "Sign of the Cross",
        "cross",
        "We make the Sign of the Cross. We begin in the name of the Father, the Son, and the Holy Spirit.",
        "We remember that we belong to God.",
        "With your right hand, touch your forehead, chest, left shoulder, then right shoulder.",
        "2157",
      ),
      part(
        "greeting",
        "Greeting",
        "hands",
        "The priest greets everyone. When he says “The Lord be with you,” we answer “And with your spirit.”",
        "Our words remind us that God is with us.",
        "Ask a grown-up to say “The Lord be with you.” Answer “And with your spirit.”",
        "1348",
      ),
      part(
        "penitential",
        "Penitential Act",
        "heart",
        "We remember the times we have done wrong. We ask God for mercy and help to love better.",
        "God invites us to turn back to him.",
        "Quietly tell God you are sorry and ask for help to be kind.",
        "1431",
        undefined,
        "This prayer does not replace sacramental confession for grave sins.",
      ),
      part(
        "gloria",
        "Gloria",
        "music",
        "We sing or say a joyful song of praise. We give glory to God for his goodness.",
        "We praise God because he is wonderful.",
        "Say one short sentence praising God.",
        "2639",
        undefined,
        "The Gloria is omitted during Advent and Lent and on many weekdays.",
      ),
      part(
        "collect",
        "Opening Prayer (Collect)",
        "hands",
        "The priest invites us to pray. After a quiet moment, he gathers our prayer into one prayer to God.",
        "We pray together with one heart.",
        "Think of someone to pray for. Then listen and answer “Amen.”",
        "1348; 1153",
        ["Collect", "The opening prayer that gathers our prayers together."],
      ),
    ],
    quiz: [
      q(
        "What do we do as Mass begins?",
        ["Gather and sing", "Go home", "Eat a snack"],
        0,
        "We gather as God’s family and sing to him.",
      ),
      q(
        "The Sign of the Cross reminds us we belong to…",
        ["A sports team", "God", "A club"],
        1,
        "We begin in the name of the Father, Son, and Holy Spirit.",
      ),
      q(
        "What do we ask for when we say sorry to God?",
        ["A sticker", "A longer song", "Mercy and help to love"],
        2,
        "God helps us turn back to him and love better.",
      ),
    ],
  },
  {
    id: "listening",
    name: "Listening",
    subtitle: "Liturgy of the Word",
    description: "God’s Word speaks to our hearts.",
    color: "blue",
    art: "bible",
    sticker: "A listening heart",
    parts: [
      part(
        "first",
        "First Reading",
        "scroll",
        "A reader shares words from the Bible, often from the Old Testament. At the end, the reader says “The word of the Lord.” We answer “Thanks be to God.”",
        "God teaches us through Sacred Scripture.",
        "Sit quietly and listen. When the reader says “The word of the Lord,” join in: “Thanks be to God.”",
        "1349",
      ),
      part(
        "psalm",
        "Responsorial Psalm",
        "music",
        "We hear a prayer from the Book of Psalms. We sing or say a response together.",
        "We answer God’s Word with prayer.",
        "Listen for the repeated line and join in.",
        "1154; 1156",
        ["Psalm", "A prayer or song from the Bible."],
      ),
      part(
        "second",
        "Second Reading",
        "bible",
        "On Sundays and special days, we hear another Bible reading, usually from a New Testament letter. At the end, the reader says “The word of the Lord.” We answer “Thanks be to God.”",
        "The apostles help us learn to live with Jesus.",
        "Listen for a way to love God or other people. When the reader says “The word of the Lord,” answer “Thanks be to God.”",
        "1349",
      ),
      part(
        "alleluia",
        "Gospel Acclamation (Alleluia)",
        "music",
        "We stand to welcome the Gospel. Usually we sing Alleluia, a word of praise.",
        "We welcome Jesus speaking to us in the Gospel.",
        "Stand and get your listening heart ready.",
        "1154",
        ["Alleluia", "A word that means “Praise the Lord!”"],
        "During Lent, we use a different acclamation instead of Alleluia.",
      ),
      part(
        "gospel",
        "Gospel",
        "bible",
        "The priest or deacon reads from a Gospel. We hear about Jesus’ words and deeds.",
        "Jesus teaches us how to follow him.",
        "Make a little cross on your forehead, lips, and heart.",
        "1349; 1154",
        ["Gospel", "The Good News about Jesus."],
      ),
      part(
        "homily",
        "Homily",
        "scroll",
        "The priest or deacon helps us understand the readings. He shows how they connect to our lives.",
        "God’s Word helps us love in everyday life.",
        "Remember one idea you can try this week.",
        "1349",
        ["Homily", "A talk that helps us understand God’s Word."],
      ),
      part(
        "creed",
        "Creed",
        "cross",
        "Together, we say what we believe. We speak about the Father, the Son, the Holy Spirit, and the Church.",
        "We share the faith of the Church.",
        "Say “I believe” and think of God’s love.",
        "185",
        ["Creed", "A summary of what the Church believes."],
      ),
      part(
        "faithful",
        "Prayer of the Faithful",
        "heart",
        "We pray for the Church and the world. We remember people who need God’s help.",
        "God calls us to care for everyone.",
        "Think of someone in need and pray for them.",
        "1349",
      ),
    ],
    quiz: [
      q(
        "What is the Gospel about?",
        ["Jesus’ words and deeds", "Weather", "A shopping list"],
        0,
        "The Gospel is the Good News about Jesus.",
      ),
      q(
        "What helps us understand the readings?",
        ["The dismissal", "The homily", "The entrance procession"],
        1,
        "The homily helps us live God’s Word.",
      ),
      q(
        "Who can we pray for?",
        ["Only ourselves", "Only our friends", "Everyone in need"],
        2,
        "We pray for the Church and the whole world.",
      ),
    ],
  },
  {
    id: "sharing",
    name: "Sharing the Gift",
    subtitle: "Liturgy of the Eucharist",
    description: "Jesus gives us the gift of himself.",
    color: "coral",
    art: "chalice",
    sticker: "A thankful heart",
    parts: [
      part(
        "gifts",
        "Presentation of the Gifts",
        "altar",
        "Bread and wine are brought to the altar. We offer our lives to God, too.",
        "We thank God for his gifts.",
        "Think of one kind thing you can offer God today.",
        "1350; 1351",
        [
          "Altar",
          "The holy table where the Eucharistic sacrifice is celebrated.",
        ],
      ),
      part(
        "offerings",
        "Prayer over the Offerings",
        "altar",
        "The priest prays over the gifts. We join his prayer and answer Amen.",
        "We ask God to accept our offering.",
        "Listen and answer “Amen” with everyone.",
        "1348; 1350",
      ),
      part(
        "eucharistic",
        "Eucharistic Prayer",
        "chalice",
        "The priest leads the great prayer of thanks to the Father. Jesus’ one sacrifice is made present at Mass.",
        "We join Jesus in his offering to the Father.",
        "Listen with a quiet heart and give thanks to God.",
        "1352–1354; 1367",
        [
          "Eucharist",
          "The sacrament of Jesus’ Body and Blood; the word means thanksgiving.",
        ],
      ),
      part(
        "sanctus",
        "Holy Holy Holy (Sanctus)",
        "music",
        "We join the angels and saints in praising God. Together, we sing or say that God is holy.",
        "We worship with the whole Church in heaven and on earth.",
        "Join in the words “Holy, Holy, Holy.”",
        "1352",
        ["Sanctus", "A word that means holy."],
        undefined,
        "Within the Eucharistic Prayer",
      ),
      part(
        "consecration",
        "Consecration",
        "host",
        "By Jesus’ words and the Holy Spirit’s power, bread and wine become Jesus’ Body and Blood. Their look and taste stay the same. Jesus is truly present: Body, Blood, soul, and divinity.",
        "Jesus gives us his whole self in the Eucharist.",
        "Adore Jesus quietly and say in your heart, “Jesus, I love you.”",
        "1353; 1374–1376",
        ["Chalice", "The sacred cup used at Mass."],
        undefined,
        "Within the Eucharistic Prayer",
      ),
      part(
        "amen",
        "Great Amen",
        "chalice",
        "The great prayer ends by giving glory to God. We answer with a strong Amen.",
        "Our Amen joins us to the prayer.",
        "Say “Amen” clearly and joyfully.",
        "1348; 1345",
        ["Amen", "A word that says yes to God: so be it."],
        undefined,
        "End of the Eucharistic Prayer",
      ),
      part(
        "ourfather",
        "Our Father",
        "hands",
        "We pray the prayer Jesus taught us. We call God our Father and ask for what we need.",
        "Jesus teaches us to trust our loving Father.",
        "Pray slowly with your family. Think about forgiving others.",
        "1355; 2759",
        undefined,
        undefined,
        "Communion Rite",
      ),
      part(
        "peace",
        "Sign of Peace",
        "dove",
        "We pray for peace and unity. We may share a simple sign of peace with those nearby.",
        "We want to live as one family in Christ.",
        "Practice saying “Peace be with you” gently.",
        "1345; 1396",
        undefined,
        "Follow your parish’s custom for the exchange of peace.",
        "Communion Rite",
      ),
      part(
        "lamb",
        "Lamb of God",
        "lamb",
        "As the priest breaks the consecrated host, we call Jesus the Lamb of God. We ask him for mercy and peace.",
        "Jesus gave his life to save us.",
        "Join the prayer with a gentle, listening voice.",
        "608; 1355",
        ["Lamb of God", "A name for Jesus, who offers himself to save us."],
        undefined,
        "Communion Rite",
      ),
      part(
        "communion",
        "Holy Communion",
        "host",
        "Catholics who are prepared receive Jesus in Holy Communion. Jesus draws us closer to himself and to one another.",
        "Jesus nourishes our life with him.",
        "Thank Jesus quietly. If you have not made First Communion, stay with your family and pray.",
        "1385–1387; 1391; 1396",
        undefined,
        "A parent and parish priest can explain preparation, fasting, and worthy reception.",
        "Communion Rite",
      ),
    ],
    quiz: [
      q(
        "What gifts are brought to the altar?",
        ["Bread and wine", "Toys", "Flowers only"],
        0,
        "Bread and wine are brought for the Eucharist.",
      ),
      q(
        "After the consecration, who is truly present?",
        ["Only a reminder", "Jesus, whole and entire", "An angel"],
        1,
        "Jesus is truly present: Body, Blood, soul, and divinity.",
      ),
      q(
        "Who taught us the Our Father?",
        ["A reader", "A king", "Jesus"],
        2,
        "Jesus taught us to pray to our loving Father.",
      ),
    ],
  },
  {
    id: "going",
    name: "Going Out",
    subtitle: "Concluding Rites",
    description: "We carry God’s love into the world.",
    color: "purple",
    art: "dove",
    sticker: "A little peacemaker",
    parts: [
      part(
        "blessing",
        "Final Blessing",
        "cross",
        "The priest asks God to bless us. We make the Sign of the Cross.",
        "God helps us live our faith each day.",
        "Make the Sign of the Cross slowly and answer “Amen.”",
        "2627; 2157",
      ),
      part(
        "dismissal",
        "Dismissal",
        "sun",
        "The priest or deacon sends us out with words such as “Go in peace.” We answer “Thanks be to God.” We are ready to love God and serve others.",
        "The Mass sends us to share Christ’s love.",
        "Practice answering “Thanks be to God” after “Go in peace.” Then choose one act of kindness to do today.",
        "1332",
      ),
    ],
    quiz: [
      q(
        "What do we receive before we go?",
        ["A shopping list", "God’s blessing", "A new name"],
        1,
        "God’s blessing helps us live our faith.",
      ),
      q(
        "What does Mass send us to do?",
        ["Love and serve", "Forget everyone", "Keep love to ourselves"],
        0,
        "We carry Christ’s love into our everyday lives.",
      ),
      q(
        "How can you share God’s love today?",
        ["Ignore a friend", "Argue with everyone", "Help someone"],
        2,
        "A little act of kindness can share God’s love.",
      ),
    ],
  },
];
export const referenceSources = [
  {
    name: "The celebration and structure of the Eucharist",
    paragraphs: "1345–1355",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/iv_the_liturgical_celebration_of_the_eucharist.html",
  },
  {
    name: "The Eucharistic sacrifice and Real Presence",
    paragraphs: "1367; 1374–1376",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/v_the_sacramental_sacrifice_thanksgiving_memorial_presence.html",
  },
  {
    name: "Holy Communion and its fruits",
    paragraphs: "1383; 1385–1387; 1391; 1396",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/vi_the_paschal_banquet.html",
  },
  {
    name: "Liturgical signs, responses, and music",
    paragraphs: "1153–1157",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_one/chapter_two/article_1/ii_how_is_the_liturgy_celebrated.html",
  },
  {
    name: "The Sign of the Cross",
    paragraphs: "2157",
    url: "https://www.vatican.va/content/catechism/en/part_three/section_two/chapter_one/article_2/iii_the_christian_name.html",
  },
  {
    name: "Interior repentance",
    paragraphs: "1431",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_two/article_4/iv_interior_penance.html",
  },
  {
    name: "Prayer of praise",
    paragraphs: "2639",
    url: "https://www.vatican.va/content/catechism/en/part_four/section_one/chapter_one/article_3/v_prayer_of_praise.html",
  },
  {
    name: "Blessing and adoration",
    paragraphs: "2627",
    url: "https://www.vatican.va/content/catechism/en/part_four/section_one/chapter_one/article_3/i_blessing_and_adoration.html",
  },
  {
    name: "The Creeds",
    paragraphs: "185",
    url: "https://www.vatican.va/content/catechism/en/part_one/section_two.index.html",
  },
  {
    name: "Jesus, the Lamb of God",
    paragraphs: "608",
    url: "https://www.vatican.va/content/catechism/en/part_one/section_two/chapter_two/article_4/paragraph_2_jesus_died_crucified.html",
  },
  {
    name: "The Lord’s Prayer",
    paragraphs: "2759",
    url: "https://www.vatican.va/content/catechism/en/part_four/section_two.index.html",
  },
  {
    name: "Mass and mission",
    paragraphs: "1332",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/ii_what_is_this_sacrament_called.html",
  },
  {
    name: "Liturgical signs, including light",
    paragraphs: "1189",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_one/chapter_two/article_1/in_brief.html",
  },
];

export function getCatechismLinks(references: string) {
  const range = (label: string) => label.split(/[–-]/).map(Number);
  return references.split(/;\s*/).map((paragraphs) => {
    const [first, last = first] = range(paragraphs);
    const source = referenceSources.find((source) =>
      source.paragraphs.split(/;\s*/).some((label) => {
        const [start, end = start] = range(label);
        return first >= start && last <= end;
      }),
    );
    return { paragraphs, url: source?.url, name: source?.name };
  });
}

export const ui = {
  headerNote: "A journey with Jesus",
  journeyEyebrow: "YOUR JOURNEY AT A GLANCE",
  journeyTitle: "One Mass. Four wonderful stops.",
  discover: "So much to discover!",
  explore: "Explore this stop",
  homeFooter: "A little learning today. A deeper love for Mass tomorrow.",
  welcomeTag: "You belong here ♡",
  walkTag: "Let’s walk with Jesus",
  mapEyebrow: "LET’S EXPLORE TOGETHER",
  stepHint: "Take it one step at a time",
  mapHint: "Every stop is open. Follow the path or choose your own!",
  again: "Explore again",
  discoverStop: "Let’s discover",
  mapBack: "Adventure Map",
  swipeHint: "Swipe or use the arrows to explore",
  back: "Back",
  nextPart: "Next part",
  miniQuiz: "Mini quiz",
  stopComplete: "STOP COMPLETED",
  seeSticker: "See my sticker",
  backAdventure: "Back to the adventure",
  checkTitle: "A little discovery check",
  quizLovely: "Lovely! You’ve got it.",
  quizHint: "Let’s discover together.",
  collect: "Collect my sticker",
  nextQuestion: "Next question",
  stickerEyebrow: "COLLECT A LITTLE JOY",
  stickerEarned: "★ You earned this!",
  keepExploring: "Keep exploring",
  parentEyebrow: "GROW IN FAITH, TOGETHER",
  companion: "A companion for your family",
  referenceTitle: "Catechism reference guide",
  referenceNote:
    "CCC = Catechism of the Catholic Church. References checked against the Holy See’s English Catechism.",
  referenceLinkNote:
    "For grown-ups: tap a CCC reference to read its section on the Vatican website. Links open in a new tab; find the paragraph number on that page.",
  reviewTitle: "Parish review",
  footer: "Kenny & Edith Santiago ♡",
  companionLink: "For parents & adults: Explore At the Table",
  parentLink: "A note for parents",
  happening: "What is happening?",
  why: "Why do we do this?",
  try: "Try it!",
  glossary: "Big Word",
  read: "Read aloud",
  stop: "Stop",
  stopReading: "Stop reading",
  audioUnavailable:
    "Read aloud is unavailable in this browser. Ask a grown-up to read with you.",
  voiceUnavailable:
    "The voice is unavailable. Try again or read with a grown-up.",
  recordingFallback:
    "The recording could not play. Let’s try your device’s voice.",
  referenceDefault:
    "This reference supports the teaching in this card. Explore together with your child.",
} as const;

export const phrases = {
  progress: (count: number) => `${count} of 4 stops completed`,
  mapStop: (index: number, count: number) =>
    `STOP 0${index + 1} · ${count} PARTS`,
  lessonProgress: (index: number, total: number) =>
    `Part ${index + 1} of ${total}`,
  questionCount: (index: number) => `QUESTION ${index + 1} OF 3`,
  stickerCount: (count: number) => `${count} / 5 treasures collected`,
  explore: (name: string) => `Explore ${name}`,
  backTo: (name: string) => `Back to ${name}`,
  parentReference: (ccc: string) => `For grown-ups · CCC ${ccc}`,
  catechismLink: (ccc: string, part: string) => `CCC ${ccc} for ${part} on the Vatican website (opens in a new tab)`,
};

export const narratorCopy = {
  title: "A voice for your adventure",
  description:
    "Listen with our warm, gently paced narrator, or choose a voice from your device. The lesson recordings use an AI-generated voice.",
  label: "Narrator voice",
  automatic: "Warm storybook narrator (recorded)",
  device: "Choose a device voice automatically",
  noVoices:
    "Your device has not listed its English voices yet. Our recorded narrator is still available.",
  preview: "Listen to a preview",
  stop: "Stop preview",
  sample:
    "Welcome to Mass Adventure! Let’s take a little journey together. At Mass, we gather as God’s family, listen to his Word, and grow closer to Jesus. Take your time. There is so much to discover.",
  note: "Recordings are included with the app and play only when you tap. No microphone or voice account is needed. Device voices are a fallback; their quality varies. Your choice lasts for this visit.",
} as const;

// Shared by playback and the offline audio generator. Edit lesson copy above;
// generated recordings fall back to device narration if their text is outdated.
export function getNarrationText(part: Part) {
  return `${part.name}. ${ui.happening} ${part.happening} ${ui.why} ${part.why} ${ui.try} ${part.action}${part.glossary ? `. Big word: ${part.glossary[0]}. ${part.glossary[1]}` : ""}`;
}

export const activityCopy = {
  responseTitle: "What do we say?",
  responseHint: "Listen to the words, then choose our response. You can try again!",
  listen: "Hear the words",
  stop: "Stop listening",
  correct: "Yes! Let’s say it together:",
  retry: "Let’s discover together. Listen again, then try another response.",
  again: "Practice again",
  replay: "Replay scene",
  explorerTitle: "Take a little look around",
  explorerHint: "Take a look around our church! Tap a number or a label to learn about the special things we use at Mass.",
  explorerAlt: "An illustrated church sanctuary with an altar, an ambo holding a Bible, candles, and a chalice.",
  explorerChoose: "What would you like to explore?",
  explorerRead: "Listen to this discovery",
  explorerStop: "Stop discovery",
};

export const responsePractice: Record<string, {
  cue: string; options: string[]; answer: number;
}> = {
  greeting: {
    cue: "The priest says: The Lord be with you.",
    options: ["Thanks be to God.", "And with your spirit.", "Amen."], answer: 1,
  },
  first: {
    cue: "At the end of the reading, the reader says: The word of the Lord.",
    options: ["Thanks be to God.", "And with your spirit.", "Amen."], answer: 0,
  },
  second: {
    cue: "At the end of the reading, the reader says: The word of the Lord.",
    options: ["Amen.", "And with your spirit.", "Thanks be to God."], answer: 2,
  },
  dismissal: {
    cue: "The priest or deacon sends us forth with words such as: Go in peace.",
    options: ["And with your spirit.", "Thanks be to God.", "Amen."], answer: 1,
  },
};

export const churchDiscoveries = [
  { id: "altar", name: "Altar", x: 63, y: 80, targetX: 64, targetY: 69,
    text: "The altar is the holy table where the Eucharistic sacrifice is celebrated. At Mass, we gather around it to worship God.", ccc: "1383" },
  { id: "ambo", name: "Ambo", x: 17, y: 68, targetX: 17, targetY: 51,
    text: "The ambo is the special place where the Bible readings are proclaimed. We listen carefully to God’s Word.", ccc: "1154" },
  { id: "candles", name: "Candles", x: 92, y: 35, targetX: 91.5, targetY: 49,
    text: "Candles give light in the church. Their light helps us remember Jesus, the Light of the world.", ccc: "1189" },
  { id: "chalice", name: "Chalice", x: 85, y: 63, targetX: 85.7, targetY: 52.5,
    text: "A chalice is the cup used at Mass. After the consecration, it holds the Precious Blood of Jesus.", ccc: "1376" },
  { id: "tabernacle", name: "Tabernacle", x: 50, y: 44, targetX: 58.5, targetY: 50,
    text: "The tabernacle is the special place where the consecrated hosts are kept. Jesus is truly present in the Eucharist. We can pray quietly to him here.", ccc: "1374, 1379" },
  { id: "crucifix", name: "Crucifix", x: 44, y: 18, targetX: 62, targetY: 22,
    text: "A crucifix is a cross with an image of Jesus on it. It reminds us that Jesus gave his life to save us because he loves us.", ccc: "616–617" },
  { id: "paten", name: "Paten", x: 38, y: 83, targetX: 47, targetY: 56,
    text: "A paten is a small plate used to hold the host. After the consecration, the host is truly the Body of Jesus. We treat the Eucharist with great love and respect.", ccc: "1374, 1378" },
] as const;

export const explorerReward = {
  name: "Church Explorer",
  alt: "A welcoming church sticker for exploring every sanctuary item.",
  hint: "Explore every item to earn your Church Explorer sticker!",
  progress: (count: number, total: number) => `${count} of ${total} items explored`,
  earned: "You earned your Church Explorer sticker!",
  note: "You discovered every special item in our church. Well done!",
  locked: "Explore all the items in our church",
  visited: "Already explored",
  openEarned: "Church Explorer, earned, explore again",
  openLocked: "Church Explorer, not yet earned, explore our church",
} as const;

export const stickerDesigns: Record<string, { alt: string; tint: string; ink: string }> = {
  gathering: { alt: "God’s family sticker: a smiling man, woman, and child gathered around a heart with a cross, inside a gold medallion.", tint: "#e5edd7", ink: "#62835c" },
  listening: { alt: "A listening heart sticker: an open Bible with a ribbon, a coral heart, and golden rays, inside a gold medallion.", tint: "#e1edf4", ink: "#5c8195" },
  sharing: { alt: "A thankful heart sticker: a gold chalice and a white host marked with a cross, with wheat and grapes, inside a gold medallion.", tint: "#fff0da", ink: "#a9783f" },
  going: { alt: "A little peacemaker sticker: a white dove carrying an olive branch in warm sunlight, inside a gold medallion.", tint: "#eee5f5", ink: "#89719c" },
  explorer: { alt: "Church Explorer sticker: a church, a compass, a dotted trail, and a magnifying glass showing a cross, inside a gold medallion.", tint: "#e0eef0", ink: "#5c8590" },
};

export const lessonScenes: Record<string, {
  kind: "procession" | "book" | "reading" | "song" | "candle" | "sun";
  caption: string;
  alt?: string;
}> = {
  entrance: { kind: "procession", caption: "The ministers walk toward the altar",
    alt: "A cross-bearer leads an altar server and a priest toward the altar. Their feet stay on the sanctuary floor." },
  gloria: { kind: "song", caption: "We sing or say our praise to God" },
  first: { kind: "reading", caption: "We listen to God’s Word" },
  psalm: { kind: "song", caption: "We sing or say the psalm response" },
  second: { kind: "book", caption: "We listen to the Bible reading" },
  alleluia: { kind: "song", caption: "We welcome the Gospel" },
  gospel: { kind: "book", caption: "We listen to the Gospel" },
  offerings: { kind: "candle", caption: "We join the priest’s prayer" },
  sanctus: { kind: "song", caption: "We join the angels in praising God" },
  dismissal: { kind: "sun", caption: "We go out to love God and serve others" },
};

export const signOfCrossCopy = {
  alt: "A child facing us demonstrates the Sign of the Cross with their right hand. The child’s left shoulder is on the right side of the picture.",
  instruction: "Use your right hand. Follow one gesture at a time.",
  play: "Play the gestures",
  pause: "Pause gestures",
  next: "Next gesture",
  reset: "Start again",
  steps: [
    { label: "Forehead", words: "In the name of the Father", x: 130, y: 72 },
    { label: "Chest", words: "and of the Son", x: 130, y: 140 },
    { label: "Left shoulder", words: "and of the Holy", x: 160, y: 115 },
    { label: "Right shoulder", words: "Spirit.", x: 100, y: 115 },
    { label: "Hands together", words: "Amen.", x: 130, y: 153 },
  ],
};

// All translated lesson and interface content stays in this editable data file.
export type Language = "en" | "es" | "pl";
export const languageOptions = [
  { value: "en" as const, label: "English" },
  { value: "es" as const, label: "Español" },
  { value: "pl" as const, label: "Polski" },
];
const translatedLessons: Record<"es" | "pl", string> = {
  es: `Procesión y canto de entrada|El sacerdote y sus ayudantes caminan hacia el altar. Nos ponemos de pie y cantamos al comenzar la Misa.|Nos reunimos como familia de Dios para adorarlo.|Ponte de pie y piensa en algo por lo que dar gracias a Dios.|Altar|La mesa sagrada donde se celebra el sacrificio eucarístico.
Señal de la Cruz|Hacemos la Señal de la Cruz. Comenzamos en el nombre del Padre, del Hijo y del Espíritu Santo.|Recordamos que pertenecemos a Dios.|Con la mano derecha, toca la frente, el pecho, el hombro izquierdo y luego el derecho.
Saludo|El sacerdote nos saluda. Dice: «El Señor esté con ustedes». Respondemos: «Y con tu espíritu».|Estas palabras nos recuerdan que Dios está con nosotros.|Pide a un adulto que diga: «El Señor esté con ustedes». Responde: «Y con tu espíritu».
Acto penitencial|Recordamos las veces que hemos hecho algo malo. Pedimos a Dios misericordia y ayuda para amar mejor.|Dios nos invita a volver a él.|Dile a Dios en silencio que lo sientes y pídele ayuda para ser amable.|||Esta oración no sustituye la confesión sacramental de los pecados graves.
Gloria|Cantamos o decimos un canto alegre de alabanza. Damos gloria a Dios por su bondad.|Alabamos a Dios porque es maravilloso.|Di una frase corta de alabanza a Dios.|||El Gloria se omite en Adviento, en Cuaresma y en muchos días entre semana.
Oración colecta|El sacerdote nos invita a rezar. Después de un momento de silencio, reúne nuestras oraciones en una oración a Dios.|Rezamos juntos con un solo corazón.|Piensa en alguien por quien rezar. Escucha y responde: «Amén».|Colecta|La oración inicial que reúne nuestras oraciones.
Primera lectura|Un lector proclama la Biblia, a menudo el Antiguo Testamento. Al terminar dice: «Palabra de Dios». Respondemos: «Te alabamos, Señor».|Dios nos enseña por medio de la Sagrada Escritura.|Siéntate y escucha en silencio. Después de «Palabra de Dios», responde: «Te alabamos, Señor».
Salmo responsorial|Escuchamos una oración del Libro de los Salmos. Cantamos o decimos juntos una respuesta.|Respondemos a la Palabra de Dios con una oración.|Escucha la frase que se repite y participa.|Salmo|Una oración o un canto de la Biblia.
Segunda lectura|Los domingos y días especiales escuchamos otra lectura bíblica, normalmente una carta del Nuevo Testamento. Al terminar oímos: «Palabra de Dios». Respondemos: «Te alabamos, Señor».|Los apóstoles nos enseñan a vivir con Jesús.|Escucha cómo amar a Dios y a los demás. Después de «Palabra de Dios», responde: «Te alabamos, Señor».
Aclamación al Evangelio (Aleluya)|Nos ponemos de pie para recibir el Evangelio. Normalmente cantamos Aleluya, una palabra de alabanza.|Recibimos a Jesús, que nos habla en el Evangelio.|Ponte de pie y prepara tu corazón para escuchar.|Aleluya|Una palabra que significa «¡Alaben al Señor!».|En Cuaresma se usa otra aclamación en lugar del Aleluya.
Evangelio|El sacerdote o el diácono lee el Evangelio. Escuchamos las palabras y las obras de Jesús.|Jesús nos enseña a seguirlo.|Haz una pequeña cruz en la frente, los labios y el corazón.|Evangelio|La Buena Noticia de Jesús.
Homilía|El sacerdote o el diácono nos ayuda a entender las lecturas. Explica cómo se relacionan con nuestra vida.|La Palabra de Dios nos ayuda a amar cada día.|Recuerda una idea que puedas poner en práctica esta semana.|Homilía|Una explicación que nos ayuda a entender la Palabra de Dios.
Credo|Decimos juntos lo que creemos. Hablamos del Padre, del Hijo, del Espíritu Santo y de la Iglesia.|Compartimos la fe de la Iglesia.|Di: «Creo», y piensa en el amor de Dios.|Credo|Un resumen de lo que cree la Iglesia.
Oración de los fieles|Rezamos por la Iglesia y por el mundo. Recordamos a quienes necesitan la ayuda de Dios.|Dios nos llama a cuidar de todos.|Piensa en alguien que necesite ayuda y reza por esa persona.
Presentación de las ofrendas|Llevamos pan y vino al altar. También ofrecemos nuestra vida a Dios.|Damos gracias a Dios por sus dones.|Piensa en una acción amable que puedas ofrecer a Dios hoy.|Altar|La mesa sagrada donde se celebra el sacrificio eucarístico.
Oración sobre las ofrendas|El sacerdote reza sobre las ofrendas. Nos unimos a su oración y respondemos Amén.|Pedimos a Dios que acepte nuestra ofrenda.|Escucha y responde: «Amén», con todos.
Plegaria eucarística|El sacerdote dirige la gran oración de acción de gracias al Padre. El único sacrificio de Jesús se hace presente en la Misa.|Nos unimos a Jesús en su ofrenda al Padre.|Escucha con el corazón tranquilo y da gracias a Dios.|Eucaristía|El sacramento del Cuerpo y la Sangre de Jesús; la palabra significa acción de gracias.
Santo (Sanctus)|Nos unimos a los ángeles y a los santos para alabar a Dios. Cantamos o decimos juntos que Dios es santo.|Adoramos con toda la Iglesia del cielo y de la tierra.|Participa diciendo: «Santo, Santo, Santo».|Sanctus|Una palabra que significa santo.||Dentro de la plegaria eucarística
Consagración|Por las palabras de Jesús y el poder del Espíritu Santo, el pan y el vino se convierten en el Cuerpo y la Sangre de Jesús. Su aspecto y sabor no cambian. Jesús está realmente presente: Cuerpo, Sangre, alma y divinidad.|Jesús se nos da por completo en la Eucaristía.|Adora a Jesús en silencio y dile en tu corazón: «Jesús, te amo».|Cáliz|La copa sagrada que se usa en la Misa.||Dentro de la plegaria eucarística
Gran Amén|La gran oración termina dando gloria a Dios. Respondemos con un Amén firme.|Nuestro Amén nos une a esta oración.|Di: «Amén», con claridad y alegría.|Amén|Una palabra que dice sí a Dios: así sea.||Final de la plegaria eucarística
Padrenuestro|Rezamos la oración que Jesús nos enseñó. Llamamos a Dios nuestro Padre y le pedimos lo que necesitamos.|Jesús nos enseña a confiar en nuestro Padre amoroso.|Reza despacio con tu familia. Piensa en perdonar a los demás.||||Rito de la Comunión
Signo de la paz|Rezamos por la paz y la unidad. Podemos ofrecer un signo sencillo de paz a quienes están cerca.|Queremos vivir como una familia en Cristo.|Practica decir: «La paz esté contigo», con cariño.|||Sigue la costumbre de tu parroquia para el saludo de paz.|Rito de la Comunión
Cordero de Dios|Mientras el sacerdote parte la hostia consagrada, llamamos a Jesús Cordero de Dios. Le pedimos misericordia y paz.|Jesús dio su vida para salvarnos.|Participa en la oración con una voz suave y atenta.|Cordero de Dios|Un nombre de Jesús, que se ofrece para salvarnos.||Rito de la Comunión
Sagrada Comunión|Los católicos que están preparados reciben a Jesús en la Sagrada Comunión. Jesús nos acerca más a él y a los demás.|Jesús alimenta nuestra vida con él.|Da gracias a Jesús en silencio. Si aún no has hecho la Primera Comunión, quédate con tu familia y reza.|||Tus padres y el sacerdote pueden explicar la preparación, el ayuno y cómo recibir dignamente la Comunión.|Rito de la Comunión
Bendición final|El sacerdote pide a Dios que nos bendiga. Hacemos la Señal de la Cruz.|Dios nos ayuda a vivir nuestra fe cada día.|Haz la Señal de la Cruz despacio y responde: «Amén».
Despedida|El sacerdote o el diácono nos envía con palabras como: «Pueden ir en paz». Respondemos: «Demos gracias a Dios». Salimos para amar a Dios y servir a los demás.|La Misa nos envía a compartir el amor de Cristo.|Después de «Pueden ir en paz», responde: «Demos gracias a Dios». Elige una acción amable para hoy.`,
  pl: `Procesja i pieśń na wejście|Ksiądz i ministranci idą do ołtarza. Wstajemy i śpiewamy na początku Mszy Świętej.|Gromadzimy się jako rodzina Boża, aby oddawać Mu cześć.|Stań prosto i pomyśl, za co chcesz podziękować Bogu.|Ołtarz|Święty stół, przy którym sprawowana jest Ofiara Eucharystyczna.
Znak krzyża|Robimy znak krzyża. Zaczynamy w imię Ojca i Syna, i Ducha Świętego.|Pamiętamy, że należymy do Boga.|Prawą ręką dotknij czoła, piersi, lewego ramienia, a potem prawego.
Pozdrowienie|Ksiądz wita wszystkich. Mówi: „Pan z wami”. Odpowiadamy: „I z duchem twoim”.|Te słowa przypominają nam, że Bóg jest z nami.|Poproś dorosłego, by powiedział: „Pan z wami”. Odpowiedz: „I z duchem twoim”.
Akt pokuty|Przypominamy sobie, kiedy zrobiliśmy coś złego. Prosimy Boga o miłosierdzie i pomoc, aby lepiej kochać.|Bóg zaprasza nas, byśmy do Niego wrócili.|Przeproś Boga w ciszy i poproś o pomoc w byciu życzliwym.|||Ta modlitwa nie zastępuje sakramentalnej spowiedzi z grzechów ciężkich.
Chwała na wysokości Bogu|Śpiewamy lub odmawiamy radosny hymn uwielbienia. Oddajemy chwałę Bogu za Jego dobroć.|Wielbimy Boga, bo jest wspaniały.|Powiedz krótkie zdanie uwielbienia Boga.|||Hymn Chwała na wysokości Bogu pomija się w Adwencie, Wielkim Poście i w wiele dni powszednich.
Kolekta|Ksiądz zaprasza nas do modlitwy. Po chwili ciszy zbiera nasze modlitwy w jedną modlitwę do Boga.|Modlimy się razem, jednym sercem.|Pomyśl, za kogo chcesz się pomodlić. Słuchaj i odpowiedz: „Amen”.|Kolekta|Modlitwa na początku Mszy, która zbiera nasze prośby.
Pierwsze czytanie|Lektor czyta słowa Biblii, często ze Starego Testamentu. Na końcu mówi: „Oto słowo Boże”. Odpowiadamy: „Bogu niech będą dzięki”.|Bóg uczy nas przez Pismo Święte.|Usiądź i słuchaj w ciszy. Po słowach „Oto słowo Boże” odpowiedz: „Bogu niech będą dzięki”.
Psalm responsoryjny|Słuchamy modlitwy z Księgi Psalmów. Razem śpiewamy lub mówimy odpowiedź.|Odpowiadamy modlitwą na słowo Boże.|Słuchaj powtarzającego się refrenu i dołącz do niego.|Psalm|Modlitwa lub pieśń z Biblii.
Drugie czytanie|W niedziele i szczególne dni słuchamy drugiego czytania, zwykle z listu w Nowym Testamencie. Na końcu lektor mówi: „Oto słowo Boże”. Odpowiadamy: „Bogu niech będą dzięki”.|Apostołowie uczą nas żyć z Jezusem.|Słuchaj, jak kochać Boga i innych. Po słowach „Oto słowo Boże” odpowiedz: „Bogu niech będą dzięki”.
Aklamacja przed Ewangelią (Alleluja)|Wstajemy, aby przyjąć Ewangelię. Zwykle śpiewamy Alleluja, słowo uwielbienia.|Witamy Jezusa, który mówi do nas w Ewangelii.|Wstań i przygotuj serce do słuchania.|Alleluja|Słowo, które znaczy „Chwalcie Pana!”.|W Wielkim Poście zamiast Alleluja śpiewamy inną aklamację.
Ewangelia|Ksiądz lub diakon czyta Ewangelię. Słuchamy o słowach i czynach Jezusa.|Jezus uczy nas, jak za Nim iść.|Zrób mały krzyżyk na czole, ustach i sercu.|Ewangelia|Dobra Nowina o Jezusie.
Homilia|Ksiądz lub diakon pomaga nam zrozumieć czytania. Pokazuje, jak łączą się z naszym życiem.|Słowo Boże pomaga nam kochać każdego dnia.|Zapamiętaj jedną myśl, którą możesz wykorzystać w tym tygodniu.|Homilia|Wyjaśnienie, które pomaga zrozumieć słowo Boże.
Wyznanie wiary|Razem mówimy, w co wierzymy. Mówimy o Ojcu, Synu, Duchu Świętym i Kościele.|Wyznajemy wspólną wiarę Kościoła.|Powiedz: „Wierzę”, i pomyśl o miłości Boga.|Wyznanie wiary|Krótki opis tego, w co wierzy Kościół.
Modlitwa wiernych|Modlimy się za Kościół i świat. Pamiętamy o ludziach, którzy potrzebują Bożej pomocy.|Bóg wzywa nas do troski o wszystkich.|Pomyśl o kimś, kto potrzebuje pomocy, i pomódl się za niego.
Przygotowanie darów|Chleb i wino są przynoszone do ołtarza. Ofiarujemy Bogu także nasze życie.|Dziękujemy Bogu za Jego dary.|Pomyśl o dobrym uczynku, który możesz dziś ofiarować Bogu.|Ołtarz|Święty stół, przy którym sprawowana jest Ofiara Eucharystyczna.
Modlitwa nad darami|Ksiądz modli się nad darami. Łączymy się z jego modlitwą i odpowiadamy Amen.|Prosimy Boga, aby przyjął naszą ofiarę.|Słuchaj i odpowiedz z innymi: „Amen”.
Modlitwa eucharystyczna|Ksiądz prowadzi wielką modlitwę dziękczynienia do Ojca. Jedyna Ofiara Jezusa staje się obecna podczas Mszy Świętej.|Łączymy się z Jezusem w Jego ofierze dla Ojca.|Słuchaj ze spokojnym sercem i dziękuj Bogu.|Eucharystia|Sakrament Ciała i Krwi Jezusa; słowo oznacza dziękczynienie.
Święty (Sanctus)|Razem z aniołami i świętymi wielbimy Boga. Śpiewamy lub mówimy, że Bóg jest święty.|Oddajemy cześć Bogu z całym Kościołem w niebie i na ziemi.|Dołącz do słów: „Święty, Święty, Święty”.|Sanctus|Słowo, które znaczy święty.||W modlitwie eucharystycznej
Konsekracja|Przez słowa Jezusa i moc Ducha Świętego chleb i wino stają się Ciałem i Krwią Jezusa. Ich wygląd i smak się nie zmieniają. Jezus jest prawdziwie obecny: Ciało, Krew, dusza i Bóstwo.|Jezus daje nam całego siebie w Eucharystii.|Adoruj Jezusa w ciszy i powiedz w sercu: „Jezu, kocham Cię”.|Kielich|Święte naczynie używane podczas Mszy.||W modlitwie eucharystycznej
Wielkie Amen|Wielka modlitwa kończy się oddaniem chwały Bogu. Odpowiadamy wyraźnym Amen.|Nasze Amen łączy nas z tą modlitwą.|Powiedz: „Amen”, wyraźnie i radośnie.|Amen|Słowo, które mówi Bogu tak: niech tak będzie.||Zakończenie modlitwy eucharystycznej
Ojcze nasz|Modlimy się modlitwą, której nauczył nas Jezus. Nazywamy Boga naszym Ojcem i prosimy o to, czego potrzebujemy.|Jezus uczy nas ufać kochającemu Ojcu.|Módl się powoli z rodziną. Pomyśl o przebaczaniu innym.||||Obrzędy Komunii
Znak pokoju|Modlimy się o pokój i jedność. Możemy przekazać prosty znak pokoju osobom obok nas.|Chcemy żyć jak jedna rodzina w Chrystusie.|Poćwicz łagodne słowa: „Pokój z tobą”.|||Postępuj zgodnie ze zwyczajem przekazywania pokoju w swojej parafii.|Obrzędy Komunii
Baranku Boży|Gdy ksiądz łamie konsekrowaną Hostię, nazywamy Jezusa Barankiem Bożym. Prosimy Go o miłosierdzie i pokój.|Jezus oddał życie, aby nas zbawić.|Dołącz do modlitwy spokojnym, uważnym głosem.|Baranek Boży|Imię Jezusa, który ofiaruje siebie, aby nas zbawić.||Obrzędy Komunii
Komunia Święta|Przygotowani katolicy przyjmują Jezusa w Komunii Świętej. Jezus zbliża nas do siebie i do innych.|Jezus karmi nasze życie z Nim.|Podziękuj Jezusowi w ciszy. Jeśli jeszcze nie było Twojej Pierwszej Komunii, zostań z rodziną i módl się.|||Rodzic i ksiądz mogą wyjaśnić przygotowanie, post i godne przyjmowanie Komunii.|Obrzędy Komunii
Błogosławieństwo końcowe|Ksiądz prosi Boga, aby nas pobłogosławił. Robimy znak krzyża.|Bóg pomaga nam żyć wiarą każdego dnia.|Zrób powoli znak krzyża i odpowiedz: „Amen”.
Rozesłanie|Ksiądz lub diakon posyła nas słowami takimi jak: „Idźcie w pokoju Chrystusa”. Odpowiadamy: „Bogu niech będą dzięki”. Idziemy kochać Boga i służyć innym.|Msza posyła nas, aby dzielić się miłością Chrystusa.|Po słowach „Idźcie w pokoju Chrystusa” odpowiedz: „Bogu niech będą dzięki”. Wybierz dobry uczynek na dziś.`,
};

// path | Spanish | Polish; paths match the English content objects above.
const translationRows = `copy.tagline|Corazones pequeños. Gran fe.|Małe serca. Wielka wiara.
copy.badge|Una pequeña aventura. Mucho amor.|Mała przygoda. Wiele miłości.
copy.title|Acércate a|Odkryj
copy.titleAccent|la maravilla de la Misa.|piękno Mszy Świętej.
copy.intro|Un camino alegre para descubrir, rezar y crecer con Jesús. Un pequeño paso a la vez.|Radosna podróż, by odkrywać, modlić się i wzrastać z Jezusem. Krok po kroku.
copy.start|Comenzar la aventura de la Misa|Rozpocznij przygodę z Mszą
copy.homeNote|Para corazones curiosos, de 5 a 10 años|Dla ciekawych serc w wieku 5–10 lat
copy.mapTitle|Tu aventura de la Misa|Twoja przygoda z Mszą
copy.mapIntro|Cuatro paradas. Una hermosa celebración. ¿Adónde vamos?|Cztery przystanki. Jedna piękna celebracja. Dokąd pójdziemy?
copy.stickerTitle|Tus pequeños tesoros|Twoje małe skarby
copy.stickerIntro|Completa una parada o explora todos los objetos de nuestra iglesia para ganar una pegatina. ¡Cada una te recuerda lo que descubriste!|Ukończ przystanek lub poznaj wszystkie przedmioty w kościele, aby zdobyć naklejkę. Każda przypomina o Twoich odkryciach!
copy.parentTitle|Para los adultos|Dla dorosłych
copy.parentIntro|Exploren juntos y reconozcan estos momentos en su parroquia. Usen esta guía antes o después de la Misa. Ayuden a su hijo a seguir los gestos y las indicaciones de su parroquia.|Odkrywajcie razem, a potem rozpoznawajcie te chwile w parafii. Korzystajcie z tej pomocy przed Mszą lub po niej. Pomóżcie dziecku stosować się do gestów i wskazówek w swojej parafii.
copy.parentNote|Las referencias del Catecismo apoyan cada enseñanza; no describen cada rúbrica del Misal Romano. Esta guía de la Misa dominical incluye oraciones que se omiten algunos días. El Santo y la Consagración forman parte de la plegaria eucarística; después sigue el rito de la Comunión. Recibir la Comunión requiere preparación y disposición adecuadas. Los niños que aún no han hecho la Primera Comunión pueden quedarse con su familia y rezar. Consulten al sacerdote sobre la práctica local.|Odnośniki do Katechizmu wspierają naukę każdej lekcji; nie opisują wszystkich rubryk Mszału Rzymskiego. Ten przewodnik po niedzielnej Mszy zawiera modlitwy pomijane w niektóre dni. Święty i konsekracja należą do modlitwy eucharystycznej, po której następują obrzędy Komunii. Przyjęcie Komunii wymaga odpowiedniego przygotowania i dyspozycji. Dzieci przed Pierwszą Komunią mogą pozostać z rodziną i modlić się. O zwyczaje miejscowe zapytajcie księdza.
copy.privacy|Sin cuentas, anuncios ni seguimiento. El progreso dura esta visita y se reinicia al actualizar la página.|Bez kont, reklam i śledzenia. Postęp trwa podczas tej wizyty i zeruje się po odświeżeniu.
copy.review|Para revisión parroquial: lenguaje infantil sobre la Presencia Real, el sacrificio eucarístico, el arrepentimiento, la preparación para la Comunión, las omisiones según el tiempo litúrgico y las posturas o costumbres de paz locales.|Do przeglądu w parafii: język dla dzieci o rzeczywistej obecności, Ofierze Eucharystycznej, nawróceniu, przygotowaniu do Komunii, pomijanych modlitwach w roku liturgicznym oraz miejscowych postawach i zwyczajach znaku pokoju.
copy.quizIntro|Veamos lo que descubriste. ¡Tómate tu tiempo y vuelve a intentarlo cuando quieras!|Sprawdźmy Twoje odkrycia. Nie spiesz się — zawsze możesz spróbować ponownie!
copy.retry|¡Buena idea! Aquí tienes una pista. Prueba otra respuesta.|Dobry pomysł! Oto wskazówka. Spróbuj innej odpowiedzi.
copy.complete|¡Lo lograste!|Udało się!
copy.completeNote|Exploraste, escuchaste y aprendiste. Te espera una nueva pegatina en tu álbum.|Poznajesz, słuchasz i uczysz się. Nowa naklejka czeka w Twoim albumie.
copy.glossaryLabel|Palabra importante|Ważne słowo
copy.labels.home|Inicio|Start
copy.labels.map|Mapa de la aventura|Mapa przygody
copy.labels.stickers|Álbum de pegatinas|Album naklejek
copy.labels.parents|Rincón de padres|Kącik rodziców
sections.0.name|Nos reunimos|Gromadzimy się
sections.0.subtitle|Ritos iniciales|Obrzędy wstępne
sections.0.description|Nos reunimos como familia de Dios.|Gromadzimy się jako rodzina Boża.
sections.0.sticker|La familia de Dios|Rodzina Boża
sections.1.name|Escuchamos|Słuchamy
sections.1.subtitle|Liturgia de la Palabra|Liturgia słowa
sections.1.description|La Palabra de Dios habla a nuestro corazón.|Słowo Boże przemawia do naszych serc.
sections.1.sticker|Un corazón que escucha|Serce, które słucha
sections.2.name|Compartimos el don|Przyjmujemy Dar
sections.2.subtitle|Liturgia eucarística|Liturgia eucharystyczna
sections.2.description|Jesús nos regala su propia vida.|Jezus daje nam siebie.
sections.2.sticker|Un corazón agradecido|Wdzięczne serce
sections.3.name|Salimos al mundo|Idziemy w świat
sections.3.subtitle|Ritos de conclusión|Obrzędy zakończenia
sections.3.description|Llevamos el amor de Dios al mundo.|Niesiemy miłość Boga światu.
sections.3.sticker|Un pequeño mensajero de paz|Mały posłaniec pokoju
ui.headerNote|Un camino con Jesús|Podróż z Jezusem
ui.journeyEyebrow|TU CAMINO DE UN VISTAZO|TWOJA PODRÓŻ W SKRÓCIE
ui.journeyTitle|Una Misa. Cuatro paradas maravillosas.|Jedna Msza. Cztery wspaniałe przystanki.
ui.discover|¡Hay mucho por descubrir!|Tyle do odkrycia!
ui.explore|Explorar esta parada|Poznaj ten przystanek
ui.homeFooter|Un poco de aprendizaje hoy. Un amor más profundo por la Misa mañana.|Trochę nauki dziś. Głębsza miłość do Mszy jutro.
ui.welcomeTag|Aquí tienes tu lugar ♡|Tu jest Twoje miejsce ♡
ui.walkTag|Caminemos con Jesús|Chodźmy z Jezusem
ui.mapEyebrow|EXPLOREMOS JUNTOS|ODKRYWAJMY RAZEM
ui.stepHint|Paso a paso|Krok po kroku
ui.mapHint|Todas las paradas están abiertas. ¡Sigue el camino o elige tu propia ruta!|Wszystkie przystanki są otwarte. Podążaj ścieżką lub wybierz własną!
ui.again|Explorar de nuevo|Odkryj ponownie
ui.discoverStop|Vamos a descubrir|Odkrywajmy
ui.mapBack|Mapa de la aventura|Mapa przygody
ui.swipeHint|Desliza o usa las flechas para explorar|Przesuń palcem lub użyj strzałek
ui.back|Atrás|Wstecz
ui.nextPart|Siguiente parte|Następna część
ui.miniQuiz|Mini cuestionario|Mały quiz
ui.stopComplete|PARADA COMPLETADA|PRZYSTANEK UKOŃCZONY
ui.seeSticker|Ver mi pegatina|Zobacz moją naklejkę
ui.backAdventure|Volver a la aventura|Wróć do przygody
ui.checkTitle|Comprobemos lo que descubriste|Sprawdźmy Twoje odkrycia
ui.quizLovely|¡Muy bien! Lo entendiste.|Świetnie! Udało się.
ui.quizHint|Descubramos juntos.|Odkrywajmy razem.
ui.collect|Recoger mi pegatina|Odbierz moją naklejkę
ui.nextQuestion|Siguiente pregunta|Następne pytanie
ui.stickerEyebrow|COLECCIONA UN POCO DE ALEGRÍA|ZBIERAJ ODROBINĘ RADOŚCI
ui.stickerEarned|★ ¡La ganaste!|★ Ta naklejka jest Twoja!
ui.keepExploring|Seguir explorando|Odkrywaj dalej
ui.parentEyebrow|CREZCAMOS JUNTOS EN LA FE|WZRASTAJMY RAZEM W WIERZE
ui.companion|Una guía para tu familia|Pomoc dla Twojej rodziny
ui.referenceTitle|Guía de referencias del Catecismo|Przewodnik po odnośnikach do Katechizmu
ui.referenceNote|CCC = Catecismo de la Iglesia Católica. Los números se comprobaron con el Catecismo en inglés de la Santa Sede.|CCC = Katechizm Kościoła Katolickiego (KKK). Numery sprawdzono w angielskim Katechizmie Stolicy Apostolskiej.
ui.referenceLinkNote|Para adultos: pulsa una referencia CCC para abrir su sección en el sitio del Vaticano. Se abre una pestaña nueva; busca allí el número del párrafo. Las páginas enlazadas están en inglés.|Dla dorosłych: wybierz odnośnik CCC, aby otworzyć odpowiednią część na stronie Watykanu. Otworzy się nowa karta; znajdź w niej numer punktu. Strony są po angielsku.
ui.reviewTitle|Revisión parroquial|Przegląd w parafii
ui.companionLink|Para padres y adultos: Explorar At the Table (en inglés)|Dla rodziców i dorosłych: At the Table (po angielsku)
ui.parentLink|Una nota para padres|Wiadomość dla rodziców
ui.happening|¿Qué está pasando?|Co się dzieje?
ui.why|¿Por qué lo hacemos?|Dlaczego to robimy?
ui.try|¡Inténtalo!|Spróbuj!
ui.glossary|Palabra importante|Ważne słowo
ui.read|Leer en voz alta|Czytaj na głos
ui.stop|Detener|Zatrzymaj
ui.stopReading|Detener la lectura|Zatrzymaj czytanie
ui.audioUnavailable|Este navegador no puede leer en voz alta. Pide a un adulto que lea contigo.|Ta przeglądarka nie może czytać na głos. Poproś dorosłego, aby czytał z Tobą.
ui.voiceUnavailable|La voz no está disponible. Inténtalo de nuevo o lee con un adulto.|Głos jest niedostępny. Spróbuj ponownie lub czytaj z dorosłym.
ui.recordingFallback|No se pudo reproducir la grabación. Probemos la voz de tu dispositivo.|Nagrania nie udało się odtworzyć. Spróbujmy głosu urządzenia.
ui.referenceDefault|Esta referencia apoya la enseñanza de la tarjeta. Exploren juntos con su hijo.|Ten odnośnik wspiera naukę z tej karty. Odkrywajcie razem z dzieckiem.
activityCopy.responseTitle|¿Qué respondemos?|Co odpowiadamy?
activityCopy.responseHint|Escucha las palabras y elige nuestra respuesta. ¡Puedes volver a intentarlo!|Posłuchaj słów i wybierz naszą odpowiedź. Możesz spróbować ponownie!
activityCopy.listen|Escuchar las palabras|Posłuchaj słów
activityCopy.stop|Dejar de escuchar|Zatrzymaj słuchanie
activityCopy.correct|¡Sí! Digámoslo juntos:|Tak! Powiedzmy razem:
activityCopy.retry|Descubramos juntos. Escucha de nuevo y prueba otra respuesta.|Odkrywajmy razem. Posłuchaj ponownie i spróbuj innej odpowiedzi.
activityCopy.again|Practicar de nuevo|Poćwicz ponownie
activityCopy.replay|Repetir la escena|Odtwórz scenę ponownie
activityCopy.explorerTitle|Mira a tu alrededor|Rozejrzyj się
activityCopy.explorerHint|¡Explora nuestra iglesia! Pulsa un número o una etiqueta para conocer los objetos especiales que usamos en la Misa.|Rozejrzyj się po naszym kościele! Dotknij numeru lub nazwy, aby poznać szczególne przedmioty używane podczas Mszy.
activityCopy.explorerAlt|Un presbiterio ilustrado con altar, ambón, Biblia, velas y cáliz.|Ilustrowane prezbiterium z ołtarzem, amboną, Biblią, świecami i kielichem.
activityCopy.explorerChoose|¿Qué te gustaría explorar?|Co chcesz poznać?
activityCopy.explorerRead|Escuchar este descubrimiento|Posłuchaj o tym odkryciu
activityCopy.explorerStop|Detener la lectura|Zatrzymaj czytanie
narratorCopy.title|Una voz para tu aventura|Głos Twojej przygody
narratorCopy.description|Escucha a nuestro narrador cálido y pausado en español, o elige una voz de tu dispositivo. Las grabaciones usan una voz generada por IA.|Posłuchaj naszego ciepłego, spokojnego narratora po polsku lub wybierz głos urządzenia. Nagrania korzystają z głosu wygenerowanego przez AI.
narratorCopy.label|Voz del narrador|Głos narratora
narratorCopy.automatic|Narrador cálido (grabado en español)|Ciepły narrator (nagranie po polsku)
narratorCopy.device|Elegir automáticamente una voz del dispositivo|Wybierz automatycznie głos urządzenia
narratorCopy.noVoices|Tu dispositivo aún no muestra voces en español. Nuestro narrador grabado sigue disponible.|Urządzenie nie pokazuje jeszcze polskich głosów. Nasz nagrany narrator jest nadal dostępny.
narratorCopy.preview|Escuchar una muestra|Posłuchaj próbki
narratorCopy.stop|Detener la muestra|Zatrzymaj próbkę
narratorCopy.sample|¡Bienvenido a Mass Adventure! Caminemos juntos. En la Misa nos reunimos como familia de Dios, escuchamos su Palabra y nos acercamos a Jesús. Hay mucho por descubrir.|Witaj w Mass Adventure! Wyruszmy razem. Podczas Mszy gromadzimy się jako rodzina Boża, słuchamy Jego słowa i zbliżamy się do Jezusa. Jest wiele do odkrycia.
narratorCopy.note|Las grabaciones vienen con la aplicación y se reproducen solo al pulsar. No usamos micrófono ni cuentas de voz. Las voces del dispositivo son una alternativa; su calidad varía. Tu elección dura esta visita.|Nagrania są częścią aplikacji i odtwarzają się tylko po dotknięciu przycisku. Nie korzystamy z mikrofonu ani kont głosowych. Głosy urządzenia to opcja zastępcza; ich jakość jest różna. Wybór trwa podczas tej wizyty.
explorerReward.name|Explorador de la iglesia|Odkrywca kościoła
explorerReward.alt|Una pegatina de una iglesia por explorar todos los objetos.|Naklejka z kościołem za poznanie wszystkich przedmiotów.
explorerReward.hint|¡Explora todos los objetos y gana tu pegatina de Explorador de la iglesia!|Poznaj wszystkie przedmioty, aby zdobyć naklejkę Odkrywcy kościoła!
explorerReward.earned|¡Ganaste tu pegatina de Explorador de la iglesia!|Naklejka Odkrywcy kościoła jest Twoja!
explorerReward.note|Descubriste todos los objetos especiales de nuestra iglesia. ¡Muy bien!|Wszystkie szczególne przedmioty w naszym kościele są już Ci znane. Brawo!
explorerReward.locked|Explora todos los objetos de nuestra iglesia|Poznaj wszystkie przedmioty w naszym kościele
explorerReward.visited|Ya explorado|Już odkryte
explorerReward.openEarned|Explorador de la iglesia, ganado, explorar de nuevo|Odkrywca kościoła, zdobyta naklejka, odkryj ponownie
explorerReward.openLocked|Explorador de la iglesia, aún no ganado, explorar la iglesia|Odkrywca kościoła, naklejka jeszcze niezdobyta, poznaj kościół
artDescriptions.church|Una iglesia acogedora con cruz y ventanas arqueadas|Przyjazny kościół z krzyżem i łukowymi oknami
artDescriptions.cross|Una cruz dorada|Złoty krzyż
artDescriptions.hands|Manos juntas en oración|Dłonie złożone do modlitwy
artDescriptions.music|Notas musicales y una estrella dorada|Nuty i złota gwiazda
artDescriptions.bible|Una Biblia abierta|Otwarta Biblia
artDescriptions.scroll|Un pergamino|Zwój pergaminu
artDescriptions.dove|Una paloma blanca con una rama de olivo|Biały gołąb z gałązką oliwną
artDescriptions.altar|Un altar con mantel blanco y dos velas|Ołtarz z białym obrusem i dwiema świecami
artDescriptions.chalice|Pan y un cáliz dorado|Chleb i złoty kielich
artDescriptions.host|Una hostia blanca con cruz junto a un cáliz dorado|Biała Hostia z krzyżem obok złotego kielicha
artDescriptions.heart|Un corazón coral|Koralowe serce
artDescriptions.lamb|Un cordero blanco y tranquilo|Łagodny biały baranek
artDescriptions.sun|Un sol dorado|Złote słońce
parishArtwork.church.alt|Ilustración de una iglesia de ladrillo rojo con techos amplios, cruz, vidriera circular, árboles y un camino acogedor.|Ilustracja kościoła z czerwonej cegły, z szerokimi dachami, krzyżem, okrągłym witrażem, drzewami i ścieżką.
parishArtwork.altar.alt|Presbiterio ilustrado con altar cubierto de blanco, flores, velas, estandartes verdes y crucifijo. El sagrario es un corazón dorado con llama roja y dorada, rayos plateados y base negra.|Ilustrowane prezbiterium z ołtarzem nakrytym białym obrusem, kwiatami, świecami, zielonymi chorągwiami i krucyfiksem. Tabernakulum ma kształt złotego serca z czerwono-złotym płomieniem, srebrnymi promieniami i czarną podstawą.
parishArtwork.sanctuary.alt|Presbiterio amplio: a la izquierda hay un ambón con Biblia. Sobre el altar hay una patena con hostia blanca. Bajo el crucifijo está el sagrario de corazón dorado con llama y rayos plateados. Hay flores, estandartes verdes, cáliz y vela.|Szerokie prezbiterium: po lewej ambona z Biblią. Na ołtarzu jest patena z białą Hostią. Pod krucyfiksem stoi tabernakulum w kształcie złotego serca z płomieniem i srebrnymi promieniami. Obok są kwiaty, zielone chorągwie, kielich i świeca.
stickerDesigns.gathering.alt|La familia de Dios: un hombre, una mujer y un niño sonrientes junto a un corazón con cruz, en un medallón dorado.|Rodzina Boża: uśmiechnięty mężczyzna, kobieta i dziecko przy sercu z krzyżem, w złotym medalionie.
stickerDesigns.listening.alt|Un corazón que escucha: Biblia abierta, cinta y corazón coral en un medallón dorado.|Serce, które słucha: otwarta Biblia, wstążka i koralowe serce w złotym medalionie.
stickerDesigns.sharing.alt|Un corazón agradecido: cáliz dorado, hostia con cruz, trigo y uvas en un medallón dorado.|Wdzięczne serce: złoty kielich, Hostia z krzyżem, pszenica i winogrona w złotym medalionie.
stickerDesigns.going.alt|Un pequeño mensajero de paz: paloma blanca con rama de olivo al sol, en un medallón dorado.|Mały posłaniec pokoju: biały gołąb z gałązką oliwną w słońcu, w złotym medalionie.
stickerDesigns.explorer.alt|Explorador de la iglesia: iglesia, brújula, camino y lupa con cruz, en un medallón dorado.|Odkrywca kościoła: kościół, kompas, ścieżka i lupa z krzyżem w złotym medalionie.
lessonScenes.entrance.caption|Los ministros caminan hacia el altar|Posługujący idą do ołtarza
lessonScenes.entrance.alt|Un ministrante con la cruz guía a otro ministrante y a un sacerdote hacia el altar. Sus pies permanecen en el suelo.|Ministrant niosący krzyż prowadzi ministranta i księdza do ołtarza. Ich stopy pozostają na podłodze prezbiterium.
lessonScenes.gloria.caption|Cantamos o decimos nuestra alabanza a Dios|Śpiewamy lub odmawiamy uwielbienie Boga
lessonScenes.first.caption|Escuchamos la Palabra de Dios|Słuchamy słowa Bożego
lessonScenes.psalm.caption|Cantamos o decimos la respuesta del salmo|Śpiewamy lub mówimy refren psalmu
lessonScenes.second.caption|Escuchamos la lectura bíblica|Słuchamy czytania z Biblii
lessonScenes.alleluia.caption|Recibimos el Evangelio|Witamy Ewangelię
lessonScenes.gospel.caption|Escuchamos el Evangelio|Słuchamy Ewangelii
lessonScenes.offerings.caption|Nos unimos a la oración del sacerdote|Łączymy się z modlitwą księdza
lessonScenes.sanctus.caption|Alabamos a Dios con los ángeles|Wielbimy Boga z aniołami
lessonScenes.dismissal.caption|Salimos para amar a Dios y servir a los demás|Idziemy kochać Boga i służyć innym
signOfCrossCopy.alt|Un niño de frente hace la Señal de la Cruz con la mano derecha. Su hombro izquierdo está a la derecha de la imagen.|Dziecko zwrócone do nas pokazuje znak krzyża prawą ręką. Jego lewe ramię znajduje się po prawej stronie obrazka.
signOfCrossCopy.instruction|Usa la mano derecha. Sigue un gesto a la vez.|Używaj prawej ręki. Wykonuj jeden gest po drugim.
signOfCrossCopy.play|Mostrar los gestos|Pokaż gesty
signOfCrossCopy.pause|Pausar los gestos|Wstrzymaj gesty
signOfCrossCopy.next|Siguiente gesto|Następny gest
signOfCrossCopy.reset|Comenzar de nuevo|Zacznij ponownie
signOfCrossCopy.steps.0.label|Frente|Czoło
signOfCrossCopy.steps.0.words|En el nombre del Padre|W imię Ojca
signOfCrossCopy.steps.1.label|Pecho|Pierś
signOfCrossCopy.steps.1.words|y del Hijo|i Syna
signOfCrossCopy.steps.2.label|Hombro izquierdo|Lewe ramię
signOfCrossCopy.steps.2.words|y del Espíritu|i Ducha
signOfCrossCopy.steps.3.label|Hombro derecho|Prawe ramię
signOfCrossCopy.steps.3.words|Santo.|Świętego.
signOfCrossCopy.steps.4.label|Manos juntas|Złożone dłonie
signOfCrossCopy.steps.4.words|Amén.|Amen.`;
const translatedQuizzes: Record<"es" | "pl", string> = {
  es: `¿Qué hacemos al comenzar la Misa?|Nos reunimos y cantamos|Nos vamos a casa|Comemos algo|Nos reunimos como familia de Dios y le cantamos.
La Señal de la Cruz recuerda que pertenecemos a…|Un equipo deportivo|Dios|Un club|Comenzamos en el nombre del Padre, del Hijo y del Espíritu Santo.
¿Qué pedimos al decirle a Dios que lo sentimos?|Una pegatina|Un canto más largo|Misericordia y ayuda para amar|Dios nos ayuda a volver a él y a amar mejor.
¿De qué trata el Evangelio?|Las palabras y obras de Jesús|El tiempo|Una lista de compras|El Evangelio es la Buena Noticia de Jesús.
¿Qué nos ayuda a entender las lecturas?|La despedida|La homilía|La procesión de entrada|La homilía nos ayuda a vivir la Palabra de Dios.
¿Por quién podemos rezar?|Solo por nosotros|Solo por nuestros amigos|Por todos los que lo necesitan|Rezamos por la Iglesia y por todo el mundo.
¿Qué dones se llevan al altar?|Pan y vino|Juguetes|Solo flores|Se llevan pan y vino para la Eucaristía.
Después de la consagración, ¿quién está realmente presente?|Solo un recuerdo|Jesús, completo y entero|Un ángel|Jesús está realmente presente: Cuerpo, Sangre, alma y divinidad.
¿Quién nos enseñó el Padrenuestro?|Un lector|Un rey|Jesús|Jesús nos enseñó a rezar a nuestro Padre amoroso.
¿Qué recibimos antes de salir?|Una lista de compras|La bendición de Dios|Un nombre nuevo|La bendición de Dios nos ayuda a vivir nuestra fe.
¿A qué nos envía la Misa?|A amar y servir|A olvidar a todos|A guardar el amor solo para nosotros|Llevamos el amor de Cristo a nuestra vida diaria.
¿Cómo puedes compartir hoy el amor de Dios?|Ignorar a un amigo|Discutir con todos|Ayudar a alguien|Una pequeña acción amable puede compartir el amor de Dios.`,
  pl: `Co robimy na początku Mszy?|Gromadzimy się i śpiewamy|Idziemy do domu|Jemy przekąskę|Gromadzimy się jako rodzina Boża i śpiewamy Bogu.
Znak krzyża przypomina, że należymy do…|Drużyny sportowej|Boga|Klubu|Zaczynamy w imię Ojca i Syna, i Ducha Świętego.
O co prosimy, gdy przepraszamy Boga?|O naklejkę|O dłuższą pieśń|O miłosierdzie i pomoc w kochaniu|Bóg pomaga nam wrócić do Niego i lepiej kochać.
O czym jest Ewangelia?|O słowach i czynach Jezusa|O pogodzie|O liście zakupów|Ewangelia to Dobra Nowina o Jezusie.
Co pomaga nam zrozumieć czytania?|Rozesłanie|Homilia|Procesja na wejście|Homilia pomaga nam żyć słowem Bożym.
Za kogo możemy się modlić?|Tylko za siebie|Tylko za przyjaciół|Za wszystkich potrzebujących|Modlimy się za Kościół i cały świat.
Jakie dary przynosimy do ołtarza?|Chleb i wino|Zabawki|Tylko kwiaty|Chleb i wino przynosimy do Eucharystii.
Kto jest prawdziwie obecny po konsekracji?|Tylko wspomnienie|Cały Jezus|Anioł|Jezus jest prawdziwie obecny: Ciało, Krew, dusza i Bóstwo.
Kto nauczył nas modlitwy Ojcze nasz?|Lektor|Król|Jezus|Jezus nauczył nas modlić się do kochającego Ojca.
Co otrzymujemy przed wyjściem?|Listę zakupów|Boże błogosławieństwo|Nowe imię|Boże błogosławieństwo pomaga nam żyć wiarą.
Do czego posyła nas Msza?|Do miłości i służby|Do zapomnienia o innych|Do zatrzymania miłości dla siebie|Niesiemy miłość Chrystusa do codziennego życia.
Jak możesz dziś dzielić się miłością Boga?|Zignorować przyjaciela|Kłócić się ze wszystkimi|Pomóc komuś|Mały dobry uczynek może przekazać miłość Boga.`,
};
const moreTranslationRows = `churchDiscoveries.0.name|Altar|Ołtarz
churchDiscoveries.0.text|El altar es la mesa sagrada donde se celebra el sacrificio eucarístico. En la Misa nos reunimos a su alrededor para adorar a Dios.|Ołtarz jest świętym stołem, przy którym sprawowana jest Ofiara Eucharystyczna. Podczas Mszy gromadzimy się wokół niego, aby oddawać cześć Bogu.
churchDiscoveries.1.name|Ambón|Ambona
churchDiscoveries.1.text|El ambón es el lugar especial donde se proclaman las lecturas de la Biblia. Escuchamos con atención la Palabra de Dios.|Ambona to szczególne miejsce, z którego czyta się Biblię. Uważnie słuchamy słowa Bożego.
churchDiscoveries.2.name|Velas|Świece
churchDiscoveries.2.text|Las velas iluminan la iglesia. Su luz nos recuerda a Jesús, la Luz del mundo.|Świece dają światło w kościele. Ich światło przypomina nam Jezusa, Światłość świata.
churchDiscoveries.3.name|Cáliz|Kielich
churchDiscoveries.3.text|El cáliz es la copa que usamos en la Misa. Después de la consagración contiene la Preciosísima Sangre de Jesús.|Kielich to naczynie używane podczas Mszy. Po konsekracji zawiera Najdroższą Krew Jezusa.
churchDiscoveries.4.name|Sagrario|Tabernakulum
churchDiscoveries.4.text|El sagrario es el lugar donde se guardan las hostias consagradas. Jesús está realmente presente en la Eucaristía. Aquí podemos rezarle en silencio.|Tabernakulum to miejsce, w którym przechowuje się konsekrowane Hostie. Jezus jest prawdziwie obecny w Eucharystii. Możemy tu modlić się do Niego w ciszy.
churchDiscoveries.5.name|Crucifijo|Krucyfiks
churchDiscoveries.5.text|Un crucifijo es una cruz con la imagen de Jesús. Nos recuerda que Jesús dio su vida para salvarnos porque nos ama.|Krucyfiks to krzyż z wizerunkiem Jezusa. Przypomina, że Jezus oddał życie, aby nas zbawić, bo nas kocha.
churchDiscoveries.6.name|Patena|Patena
churchDiscoveries.6.text|Una patena es un pequeño plato para la hostia. Después de la consagración, la hostia es verdaderamente el Cuerpo de Jesús. Tratamos la Eucaristía con mucho amor y respeto.|Patena to mały talerzyk na Hostię. Po konsekracji Hostia jest prawdziwie Ciałem Jezusa. Traktujemy Eucharystię z wielką miłością i szacunkiem.
referenceSources.0.name|Celebración y estructura de la Eucaristía|Celebracja i struktura Eucharystii
referenceSources.1.name|Sacrificio eucarístico y Presencia Real|Ofiara Eucharystyczna i rzeczywista obecność
referenceSources.2.name|Sagrada Comunión y sus frutos|Komunia Święta i jej owoce
referenceSources.3.name|Signos litúrgicos, respuestas y música|Znaki liturgiczne, odpowiedzi i muzyka
referenceSources.4.name|La Señal de la Cruz|Znak krzyża
referenceSources.5.name|Arrepentimiento interior|Pokuta wewnętrzna
referenceSources.6.name|Oración de alabanza|Modlitwa uwielbienia
referenceSources.7.name|Bendición y adoración|Błogosławieństwo i adoracja
referenceSources.8.name|Los símbolos de la fe|Wyznania wiary
referenceSources.9.name|Jesús, el Cordero de Dios|Jezus, Baranek Boży
referenceSources.10.name|La oración del Señor|Modlitwa Pańska
referenceSources.11.name|La Misa y la misión|Msza i misja
referenceSources.12.name|Signos litúrgicos, incluida la luz|Znaki liturgiczne, w tym światło`;

export const languageCopy = {
  en: { pageTitle: "Mass Adventure · Little hearts, big faith", stopLabel: "STOP", label: "Language", skip: "Skip to content", home: "Mass Adventure home", navigation: "Main navigation", mobile: "Mobile navigation", progress: "Adventure progress", parts: "Parts in this stop", earned: "earned, explore again", locked: "not yet earned, explore", illustration: "illustration" },
  es: { pageTitle: "Mass Adventure · Corazones pequeños, gran fe", stopLabel: "PARADA", label: "Idioma", skip: "Saltar al contenido", home: "Inicio de Mass Adventure", navigation: "Navegación principal", mobile: "Navegación móvil", progress: "Progreso de la aventura", parts: "Partes de esta parada", earned: "ganada, explorar de nuevo", locked: "aún no ganada, explorar", illustration: "ilustración" },
  pl: { pageTitle: "Mass Adventure · Małe serca, wielka wiara", stopLabel: "PRZYSTANEK", label: "Język", skip: "Przejdź do treści", home: "Strona główna Mass Adventure", navigation: "Nawigacja główna", mobile: "Nawigacja mobilna", progress: "Postęp przygody", parts: "Części tego przystanku", earned: "zdobyta, odkryj ponownie", locked: "jeszcze niezdobyta, poznaj", illustration: "ilustracja" },
};
const englishContent = { copy, sections, ui, phrases, artDescriptions, parishArtwork, narratorCopy, activityCopy, responsePractice, churchDiscoveries, explorerReward, stickerDesigns, lessonScenes, signOfCrossCopy, referenceSources };
export type MassContent = typeof englishContent & {
  getCatechismLinks: typeof getCatechismLinks;
  getNarrationText: typeof getNarrationText;
  languageCopy: typeof languageCopy.en;
};
function cloneContent<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cloneContent) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cloneContent(v)])) as T;
  return value;
}
const contentCache = new Map<Language, MassContent>();
export function getMassContent(language: Language): MassContent {
  const cached = contentCache.get(language);
  if (cached) return cached;
  const content = cloneContent(englishContent);
  if (language !== "en") {
    for (const row of `${translationRows}\n${moreTranslationRows}`.split("\n")) {
      const [path, es, pl] = row.split("|");
      const keys = path.split(".");
      let target: Record<string, unknown> = content as unknown as Record<string, unknown>;
      for (const key of keys.slice(0, -1)) target = target[key] as Record<string, unknown>;
      if (!(keys.at(-1)! in target) || !es || !pl) throw new Error(`Invalid translation: ${path}`);
      target[keys.at(-1)!] = language === "es" ? es : pl;
    }
    const parts = content.sections.flatMap(section => section.parts);
    const rows = translatedLessons[language].split("\n");
    if (rows.length !== parts.length) throw new Error("Every lesson needs a translation");
    rows.forEach((row, index) => {
      const [name, happening, why, action, term, definition, note, rite] = row.split("|");
      const p = parts[index];
      Object.assign(p, { name, happening, why, action, alt: `${content.artDescriptions[p.art]}: ${name}` });
      if (p.glossary) p.glossary = [term, definition];
      if (p.note) p.note = note;
      if (p.rite) p.rite = rite;
    });
    const quizzes = content.sections.flatMap(section => section.quiz);
    const quizRows = translatedQuizzes[language].split("\n");
    if (quizRows.length !== quizzes.length) throw new Error("Every quiz needs a translation");
    quizRows.forEach((row, index) => {
      const [question, a, b, c, feedback] = row.split("|");
      Object.assign(quizzes[index], {question, options: [a, b, c], feedback});
    });
    const es = language === "es";
    const thanks = es ? "Te alabamos, Señor." : "Bogu niech będą dzięki.";
    const spirit = es ? "Y con tu espíritu." : "I z duchem twoim.";
    const amen = es ? "Amén." : "Amen.";
    content.responsePractice.greeting.cue = es ? "El sacerdote dice: El Señor esté con ustedes." : "Ksiądz mówi: Pan z wami.";
    content.responsePractice.first.cue = content.responsePractice.second.cue = es ? "Al terminar la lectura, el lector dice: Palabra de Dios." : "Na końcu czytania lektor mówi: Oto słowo Boże.";
    content.responsePractice.dismissal.cue = es ? "El sacerdote o el diácono nos envía con palabras como: Pueden ir en paz." : "Ksiądz lub diakon posyła nas słowami takimi jak: Idźcie w pokoju Chrystusa.";
    content.responsePractice.greeting.options = [es ? "Demos gracias a Dios." : thanks, spirit, amen];
    content.responsePractice.first.options = [thanks, spirit, amen];
    content.responsePractice.second.options = [amen, spirit, thanks];
    content.responsePractice.dismissal.options = [spirit, es ? "Demos gracias a Dios." : thanks, amen];
    content.phrases = {
      progress: count => es ? `${count} de 4 paradas completadas` : `${count} z 4 przystanków ukończonych`,
      mapStop: (index, count) => es ? `PARADA 0${index + 1} · ${count} PARTES` : `PRZYSTANEK 0${index + 1} · CZĘŚCI: ${count}`,
      lessonProgress: (index, total) => es ? `Parte ${index + 1} de ${total}` : `Część ${index + 1} z ${total}`,
      questionCount: index => es ? `PREGUNTA ${index + 1} DE 3` : `PYTANIE ${index + 1} Z 3`,
      stickerCount: count => es ? `${count} / 5 tesoros recogidos` : `Zebrane skarby: ${count} / 5`,
      explore: name => es ? `Explorar: ${name}` : `Poznaj: ${name}`,
      backTo: name => es ? `Volver a: ${name}` : `Wróć: ${name}`,
      parentReference: ccc => es ? `Para adultos · CCC ${ccc}` : `Dla dorosłych · CCC ${ccc}`,
      catechismLink: (ccc, part) => es ? `CCC ${ccc}: ${part}, en el sitio del Vaticano (abre una pestaña nueva, en inglés)` : `CCC ${ccc}: ${part}, na stronie Watykanu (nowa karta, po angielsku)`,
    };
    // Avoid Polish plural-case ambiguity by placing the count after the noun.
    (content.explorerReward as {progress: (count: number, total: number) => string}).progress = (count, total) => es ? `${count} de ${total} objetos explorados` : `Poznane przedmioty: ${count} z ${total}`;
  }
  const result: MassContent = {
    ...content,
    languageCopy: languageCopy[language],
    getNarrationText: p => `${p.name}. ${content.ui.happening} ${p.happening} ${content.ui.why} ${p.why} ${content.ui.try} ${p.action}${p.glossary ? `. ${content.ui.glossary}: ${p.glossary[0]}. ${p.glossary[1]}` : ""}`,
    getCatechismLinks: references => getCatechismLinks(references).map(link => ({...link, name: content.referenceSources.find(source => source.url === link.url)?.name})),
  };
  // Keep English narration identical to its existing recorded manifest.
  if (language === "en") result.getNarrationText = getNarrationText;
  contentCache.set(language, result);
  return result;
}
