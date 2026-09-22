const sections = [
  {
    title: "1. What an AI assistant actually is",
    body: `
      <p>An AI assistant (like ChatGPT or Claude) is a text-prediction system trained on huge amounts of writing. It doesn't "know" facts the way a database does — it generates the most plausible next words based on your prompt and its training. That single idea explains most of its strengths and weaknesses.</p>
      <p><strong>What this means in practice:</strong> it's excellent at rephrasing, structuring, summarizing, and drafting — tasks about language. It's less reliable at precise facts, recent events, or math it hasn't "shown its work" on. Treat it like a very well-read, very fast colleague who sometimes misremembers a detail — useful, but worth double-checking on anything that matters.</p>
    `,
  },
  {
    title: "2. The one habit that changes everything: be specific",
    body: `
      <p>The single biggest difference between a useless answer and a great one isn't which AI you use — it's how specific your prompt is.</p>
      <p><strong>Vague:</strong> "Write me an email about the project."</p>
      <p><strong>Specific:</strong> "Write a 100-word email to my manager explaining the project is 2 days behind because of a vendor delay, and that I don't need help yet but wanted to flag it early. Keep the tone calm, not apologetic."</p>
      <p>The second version tells the AI the length, audience, situation, and tone. You'll get something close to usable on the first try — the first version forces you into 3–4 rounds of "no, more like this."</p>
    `,
  },
  {
    title: "3. Give it the material, not just the topic",
    body: `
      <p>If you're editing, summarizing, or replying to something, paste the actual text in. Don't describe it and ask the AI to guess. "Summarize this email thread" plus the pasted thread will always beat "summarize my email thread about the Johnson account" with nothing attached.</p>
      <p>This sounds obvious written down, but it's the single most common mistake beginners make — describing content instead of providing it.</p>
    `,
  },
  {
    title: "4. Iterate — don't restart",
    body: `
      <p>Your first prompt rarely needs to be perfect. Treat the conversation like editing with a colleague: ask for a draft, then give short, direct feedback — "shorter", "less formal", "keep paragraph 2 but rewrite the ending" — instead of writing a new, longer prompt from scratch each time.</p>
      <p>This is faster and gets better results, because each reply carries the context of everything said before it.</p>
    `,
  },
  {
    title: "5. Where it shines — everyday use cases",
    body: `
      <ul>
        <li><strong>Email &amp; messages</strong> — drafting, shortening, adjusting tone, replying to something you're avoiding.</li>
        <li><strong>Summarizing</strong> — long threads, articles, meeting notes, documents.</li>
        <li><strong>Planning</strong> — turning a messy list of tasks into a realistic schedule.</li>
        <li><strong>Learning</strong> — explaining a topic at exactly your level, then quizzing you on it.</li>
        <li><strong>First drafts</strong> — of anything: a pitch, a plan, a difficult conversation, a checklist.</li>
        <li><strong>A sounding board</strong> — "play devil's advocate on this plan" or "what am I missing here?"</li>
      </ul>
    `,
  },
  {
    title: "6. Where to be careful",
    body: `
      <ul>
        <li><strong>Facts, dates, statistics, citations</strong> — verify anything you'll rely on publicly or professionally.</li>
        <li><strong>Very recent events</strong> — the model's knowledge has a cutoff; ask it directly if it's unsure, or check yourself.</li>
        <li><strong>Sensitive or private information</strong> — don't paste passwords, ID numbers, or anything you wouldn't want stored.</li>
        <li><strong>Anything with legal, medical, or financial consequences</strong> — use it to understand options and draft questions, not as a final authority.</li>
      </ul>
    `,
  },
  {
    title: "7. Common beginner mistakes",
    body: `
      <ol>
        <li><strong>Being too polite instead of being clear.</strong> "Could you maybe possibly help me think about..." wastes words the AI doesn't need. Just state what you want.</li>
        <li><strong>Accepting the first answer.</strong> The real value is in the second and third pass, after you say what's wrong with the first.</li>
        <li><strong>Not giving constraints.</strong> Length, tone, audience, format — say them upfront and you'll save several rounds of editing.</li>
        <li><strong>Asking one giant question.</strong> Break a big task ("plan my whole week") into the actual list of inputs (your tasks, your fixed meetings, your energy patterns).</li>
      </ol>
    `,
  },
  {
    title: "8. Your first-week checklist",
    body: `
      <ul>
        <li>☐ Rewrite one email you're dreading using the "specific prompt" method from Section 2.</li>
        <li>☐ Paste in a messy set of notes and ask for a structured summary.</li>
        <li>☐ Practice iterating: ask for a draft, then give one round of short feedback instead of rewriting your prompt.</li>
        <li>☐ Use it to explain one thing you've been meaning to learn, at your level.</li>
        <li>☐ Try the "devil's advocate" prompt on a decision you're currently facing.</li>
      </ul>
      <p>By the end of the week, specific and iterative prompting should start feeling automatic — that's the whole skill.</p>
    `,
  },
];

export function guideHtml() {
  const pages = sections
    .map(
      (s) => `<div class="page"><div class="eyebrow">The Beginner's Guide</div><h2>${s.title}</h2>${s.body}</div>`
    )
    .join("\n");

  return `
  <div class="cover">
    <div class="kicker">Multaqa · AI Digital Products</div>
    <h1>The Beginner's Guide<br/>to Using AI Every Day</h1>
    <p>A short, practical guide to getting real, everyday value out of an AI assistant — no hype, no technical background required.</p>
    <div class="brand">ملتقى — Multaqa</div>
  </div>
  ${pages}
  <div class="page">
    <div class="footer-note">© Multaqa. For personal use. Please don't resell or redistribute this file.</div>
  </div>
  `;
}
