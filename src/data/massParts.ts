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
  church: {
    src: `${import.meta.env.BASE_URL}artwork/parish-church-storybook.webp`,
    alt: "Storybook illustration of the red-brick parish church with broad peaked roofs, a rooftop cross, a circular stained-glass window, trees, and a welcoming walkway.",
  },
  altar: {
    src: `${import.meta.env.BASE_URL}artwork/parish-altar-storybook.webp`,
    alt: "Storybook illustration of the parish sanctuary: a white-clothed altar, flowers, green banners, candles, a tabernacle, and a crucifix of Jesus on the brick wall.",
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
    "Finish a stop to collect a sticker. Each one is a reminder of what you discovered!",
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
        "The priest greets everyone. We answer together as one family.",
        "Our words remind us that God is with us.",
        "Practice answering: “And with your spirit.”",
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
        "A reader shares words from the Bible. Often, we hear from the Old Testament.",
        "God teaches us through Sacred Scripture.",
        "Sit quietly and listen for one word you remember.",
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
        "On Sundays and special days, we hear another Bible reading. It usually comes from a letter in the New Testament.",
        "The apostles help us learn to live with Jesus.",
        "Listen for a way to love God or other people.",
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
        "hands",
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
        "The priest or deacon sends us out in peace. We are ready to love God and serve others.",
        "The Mass sends us to share Christ’s love.",
        "Choose one act of kindness to do today.",
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
    paragraphs: "1385–1387; 1391; 1396",
    url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_one/article_3/vi_the_paschal_banquet.html",
  },
];

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
  reviewTitle: "Parish review",
  footer: "♡ Learning with love. Growing in faith.",
  parentLink: "A note for parents",
  happening: "What is happening?",
  why: "Why do we do this?",
  try: "Try it!",
  glossary: "Big Word",
  read: "Read aloud",
  stop: "Stop",
  audioUnavailable:
    "Read aloud is unavailable in this browser. Ask a grown-up to read with you.",
  voiceUnavailable:
    "The voice is unavailable. Try again or read with a grown-up.",
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
  stickerCount: (count: number) => `${count} / 4 treasures collected`,
  explore: (name: string) => `Explore ${name}`,
  backTo: (name: string) => `Back to ${name}`,
  parentReference: (ccc: string) => `For grown-ups · CCC ${ccc}`,
};

export const narratorCopy = {
  title: "A voice for your adventure",
  description:
    "Choose the voice your family likes best. We automatically prefer natural or enhanced English voices when your device offers them.",
  label: "Narrator voice",
  automatic: "Choose automatically",
  noVoices:
    "Your browser has not listed its English voices yet. You can still try its default voice below.",
  preview: "Listen to a preview",
  stop: "Stop preview",
  sample:
    "Welcome to Mass Adventure! Let’s take a little journey together. At Mass, we gather as God’s family, listen to his Word, and grow closer to Jesus. Take your time. There is so much to discover.",
  note: "This choice lasts for this visit. Voices come from your browser or device; quality varies. If none sounds natural, a prerecorded narrator is the next step.",
} as const;
