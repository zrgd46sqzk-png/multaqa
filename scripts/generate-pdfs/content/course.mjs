const modules = [
  {
    badge: "Module 1",
    title: "How AI assistants actually work (and why it matters)",
    body: `
      <p>Before writing better prompts, it helps to understand what you're prompting. An AI assistant predicts likely next words based on patterns in its training data and the conversation so far. It has no memory between separate conversations, no access to your private context unless you provide it, and no certainty — it produces its best guess, phrased confidently either way.</p>
      <p>This explains three practical rules that the rest of this course builds on:</p>
      <ul>
        <li>Give it context — it can't infer what it wasn't told or shown.</li>
        <li>Verify anything that must be factually correct — confidence isn't the same as accuracy.</li>
        <li>Treat each reply as a draft to steer, not a final answer to accept.</li>
      </ul>
    `,
    exercise:
      "Ask an AI assistant to explain what it doesn't know about you. Notice how much context it's missing — that gap is exactly what your prompts need to fill.",
  },
  {
    badge: "Module 2",
    title: "The anatomy of a good prompt",
    body: `
      <p>A strong prompt usually has four parts, though not every prompt needs all four:</p>
      <ol>
        <li><strong>Task</strong> — the specific thing you want done ("summarize", "rewrite", "draft", "compare").</li>
        <li><strong>Context</strong> — the material or situation it needs (paste the actual text; describe the real constraint).</li>
        <li><strong>Format</strong> — how you want the answer shaped (length, bullet points vs. paragraph, tone).</li>
        <li><strong>Audience</strong> — who will read the output, which affects vocabulary and formality.</li>
      </ol>
      <p>Compare: <em>"Help with my presentation"</em> vs. <em>"Turn these 6 bullet points into 3 slide titles and one supporting sentence each, for a non-technical audience: [bullets]."</em> The second gives task, context, format, and audience in one line — and needs no follow-up round to fix.</p>
    `,
    exercise:
      "Take a request you'd normally type in one vague sentence. Rewrite it using all four parts: task, context, format, audience.",
  },
  {
    badge: "Module 3",
    title: "Iterating: the skill that matters more than the first prompt",
    body: `
      <p>Nobody writes the perfect prompt on the first try, and you don't need to. The real skill is steering a conversation: get a draft, then respond the way you would to a colleague's first pass — "good direction, but shorter" or "keep the structure, change the tone to more casual."</p>
      <p>Because the AI can see the whole conversation, each round of feedback compounds — you're not starting over, you're refining. This is faster than trying to perfect a single mega-prompt, and it produces better results because your feedback is concrete instead of hypothetical.</p>
      <p>A useful mental model: your first prompt gets you to 70%. Two short rounds of feedback get you to 95%. Trying to write one flawless prompt usually wastes more time than it saves.</p>
    `,
    exercise:
      "Ask for a first draft of something you need this week. Then give exactly one round of feedback using only 5 words or fewer (e.g. \"more direct, cut the intro\"). Notice how much the result improves for so little effort.",
  },
  {
    badge: "Module 4",
    title: "Prompts for five everyday task types",
    body: `
      <p>Most everyday AI use falls into five patterns. Learning the shape of each one lets you improvise instead of memorizing exact prompts:</p>
      <ul>
        <li><strong>Rewrite</strong> — "Rewrite this to be [shorter / more formal / friendlier]: [paste]." Always paste the original.</li>
        <li><strong>Summarize</strong> — "Summarize this into [3 bullets / one paragraph] covering [what to include]: [paste]."</li>
        <li><strong>Draft</strong> — "Draft a [thing] for [audience] that covers [points], in [tone]."</li>
        <li><strong>Explain</strong> — "Explain [topic] for someone who knows [X] but not [Y]."</li>
        <li><strong>Decide</strong> — "I'm choosing between [A] and [B] given [real constraint]. What's the actual trade-off?"</li>
      </ul>
    `,
    exercise:
      "Pick one pattern above you use least. Write one real prompt for it right now, using something from your actual week.",
  },
  {
    badge: "Module 5",
    title: "Building your own prompt library",
    body: `
      <p>The prompts you'll use most are the ones tied to tasks you repeat — weekly status updates, meeting notes, a certain kind of email, onboarding a client. Once you've written a prompt that works well for one of these, save it. Don't rewrite it from memory every time.</p>
      <p>A simple system: keep a note (or use the prompt pack that comes with this course as a starting point) with one saved prompt per recurring task, each with a placeholder like [paste notes] or [task list] where your specific input goes. Over a few weeks, this becomes a genuinely fast workflow — you're filling in a template, not starting from a blank page.</p>
    `,
    exercise:
      "List 3 tasks you do at least weekly. Write (and save) one reusable prompt for each, with a clear placeholder for the part that changes each time.",
  },
];

export function courseHtml() {
  const pages = modules
    .map(
      (m) => `<div class="page">
        <span class="module-badge">${m.badge}</span>
        <h2>${m.title}</h2>
        ${m.body}
        <div class="exercise"><div class="label">Exercise</div><p style="margin:0">${m.exercise}</p></div>
      </div>`
    )
    .join("\n");

  return `
  <div class="cover">
    <div class="kicker">Multaqa · Courses</div>
    <h1>Prompting 101<br/>A Practical Course</h1>
    <p>Five short modules that take you from "typing questions into a chat box" to prompting deliberately — with an exercise after each one.</p>
    <div class="brand">ملتقى — Multaqa</div>
  </div>
  ${pages}
  <div class="page">
    <h2>What's next</h2>
    <p>Once these five modules feel natural, the "30 AI Prompts for Work & Productivity" pack (also available on Multaqa) gives you 30 ready-to-use prompts built on exactly this structure — a good way to keep practicing with real tasks.</p>
    <div class="footer-note">© Multaqa. For personal use. Please don't resell or redistribute this file.</div>
  </div>
  `;
}
