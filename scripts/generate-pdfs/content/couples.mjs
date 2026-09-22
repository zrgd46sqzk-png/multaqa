const rounds = [
  {
    title: "Round 1 — Icebreakers",
    intro: "Light, easy ones to start the night and get you both talking without any pressure.",
    items: [
      "What's a small thing I do that always makes you smile?",
      "What's your favorite memory from our first month together?",
      "If we could teleport anywhere for dinner tonight, where would we go?",
      "What song always reminds you of us?",
      "What's one thing you've learned from me?",
      "What's your go-to comfort food, and why that one?",
      "What's a habit of mine you secretly find endearing?",
      "If today were a movie, what would its title be?",
      "What's something you're looking forward to this month?",
      "What's your favorite way to spend a lazy Sunday with me?",
      "What's a compliment you received recently that you loved?",
      "What's one thing that instantly puts you in a good mood?",
      "If we adopted a pet tomorrow, what would we name it?",
      "What's a word or phrase I say a lot?",
      "What's your favorite thing to do together that we don't do enough?",
      "What's the last thing that made you laugh really hard?",
    ],
  },
  {
    title: "Round 2 — Getting Deeper",
    intro: "Slow down for these. No rushing to the next one — let the answers breathe.",
    items: [
      "What does feeling truly loved look like to you, day to day?",
      "What's something you've never told me because it never came up, not because it's a secret?",
      "What's a fear you have about the future that we haven't talked about?",
      "When do you feel most understood by me?",
      "What's something I do that helps you feel calmer on a hard day?",
      "What's a belief you held years ago that you no longer hold?",
      "What does \"home\" mean to you beyond the physical place?",
      "What's something you need more of from me right now — not because I'm failing, just because life changes?",
      "What's a moment you felt proud of yourself this year?",
      "What's something about your family that shaped how you love?",
      "What do you think is our biggest strength as a couple?",
      "What's one thing you wish I understood about you more?",
      "What does support look like for you when you're stressed — talking, space, or something else?",
      "What's a dream you haven't said out loud in a while?",
      "What's something you're grateful for about this relationship right now?",
      "What does a good apology look like to you?",
    ],
  },
  {
    title: "Round 3 — Fun Challenges",
    intro: "Do these together, right now — no overthinking, just play.",
    items: [
      "Recreate the photo from our first date, as close as you can, right now.",
      "Slow dance to one song, no phones, lights low.",
      "Each write down 3 words to describe the other — compare without explaining first.",
      "Cook or order something neither of you has tried before.",
      "Give each other a 2-minute hand or shoulder massage, no talking.",
      "Take turns drawing each other in 60 seconds — no peeking until done.",
      "Write a one-sentence \"headline\" for your relationship this year.",
      "Swap one household task for a week — decide right now which one.",
      "Plan a full day together with zero phones — pick the date.",
      "Each name one thing on your bucket list you haven't shared before.",
      "Try to guess each other's answer to \"what's my current favorite song?\" before saying it.",
      "Take a selfie doing your most ridiculous face together.",
      "Handwrite one thing you appreciate about the other and trade notes.",
      "Pick a place neither of you has been within an hour's drive and plan to go this month.",
      "Each share one skill you'd want to learn together.",
      "End the night by saying one thing you're excited about for the two of you next year.",
    ],
  },
  {
    title: "Round 4 — Would You Rather",
    intro: "Quick picks — answer fast, then talk about why if you want to.",
    items: [
      "Would you rather travel every month with less savings, or travel once a year with more?",
      "Would you rather always know what I'm thinking, or always know what I'm feeling?",
      "Would you rather we lived near family or somewhere completely new, just the two of us?",
      "Would you rather have more free time together or more money for fewer, bigger trips?",
      "Would you rather I always tell you the full truth immediately, or give you time to ask?",
      "Would you rather we celebrate big occasions loudly with others, or quietly, just us?",
      "Would you rather live somewhere with perfect weather or somewhere with your favorite people nearby?",
      "Would you rather have a home that's always tidy or always full of guests?",
      "Would you rather learn a new language together or a new sport together?",
      "Would you rather have one long vacation a year or several short ones?",
      "Would you rather we argue it out immediately or take space and revisit later?",
      "Would you rather retire early with a simple lifestyle or work longer for a bigger one?",
      "Would you rather I plan the surprises or you plan the surprises?",
      "Would you rather we host every holiday or travel for every holiday?",
      "Would you rather have a big wedding-style celebration for an anniversary or a quiet weekend away?",
      "Would you rather always have the last word or always get the last laugh?",
    ],
  },
  {
    title: "Round 5 — Memory Lane & Future",
    intro: "Close the night looking both back and forward.",
    items: [
      "What's your favorite memory of us from this past year?",
      "What's something that was hard for us that we handled well together?",
      "What's a small tradition you'd like us to start?",
      "Where do you picture us five years from now — paint the scene.",
      "What's something you want to make sure we don't lose as life gets busier?",
      "What's a version of \"us\" from earlier in the relationship you miss a little?",
      "What's one thing you want to do together before the year ends?",
      "What's a piece of advice you'd give to the version of us from our first date?",
      "What's something new you'd like to try together next year?",
      "What's a goal — big or small — you'd like us to work toward together?",
      "If you could relive one day with me exactly as it happened, which one?",
      "What's something about \"us\" that you're most proud of?",
      "What's one way you'd like us to grow closer this year?",
      "What's a place you'd love for us to return to someday?",
      "What's something you want future-us to remember about tonight?",
      "In one sentence: what does \"us\" mean to you right now?",
    ],
  },
];

export function couplesHtml() {
  const pages = rounds
    .map((round) => {
      const items = round.items
        .map((item, i) => `<div class="deck-item"><span class="n">${i + 1}.</span>${item}</div>`)
        .join("\n");
      return `<div class="page">
        <div class="round-title">${round.title}</div>
        <p style="color:#55504a">${round.intro}</p>
        ${items}
      </div>`;
    })
    .join("\n");

  return `
  <div class="cover">
    <div class="kicker">Multaqa · Couple Games</div>
    <h1>Date Night Deck<br/>80 Questions &amp; Challenges</h1>
    <p>Five rounds — from light icebreakers to deep questions, playful challenges, quick-fire choices, and looking back and forward together. Pick a round that fits the mood, or work through them all.</p>
    <div class="brand">ملتقى — Multaqa</div>
  </div>
  <div class="page">
    <h2>How to use this deck</h2>
    <p>Put your phones away. Take turns picking a question — either go in order or jump to whichever round fits your mood. There are no wrong answers; the point is the conversation, not a "correct" response.</p>
    <p>Round 3 is different from the others — those are things to actually do together, not just discuss. Feel free to skip any question that doesn't fit your relationship stage; there's no pressure to go through every one in a single night.</p>
  </div>
  ${pages}
  <div class="page">
    <div class="footer-note">© Multaqa. For personal use. Please don't resell or redistribute this file.</div>
  </div>
  `;
}
