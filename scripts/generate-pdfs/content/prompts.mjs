const categories = [
  {
    label: "Writing & Email",
    items: [
      {
        prompt:
          "Rewrite this email so it sounds more [confident / friendly / concise] while keeping the same information: [paste email]",
        tip: "Paste your rough draft, not just a topic — the AI edits better than it invents from nothing.",
      },
      {
        prompt:
          "Turn these bullet points into a short, professional email to [recipient/role] asking for [outcome]: [bullets]",
        tip: "Name the recipient's role (client, manager, vendor) so the tone matches.",
      },
      {
        prompt:
          "Write 3 subject lines for this email, ranked from most to least direct: [paste email]",
        tip: "Ask for options, then pick — don't accept the first draft as final.",
      },
      {
        prompt:
          "I need to say no to this request without sounding harsh. Draft a reply: [paste request]",
        tip: "Add \"keep it under 80 words\" if you tend to get long, apologetic replies.",
      },
      {
        prompt:
          "Summarize this email thread in 3 bullet points: what happened, what's decided, what's still open. [paste thread]",
        tip: "Great before a meeting when you've lost track of a long thread.",
      },
      {
        prompt:
          "Proofread this for grammar and clarity only — don't change my tone or word choice: [paste text]",
        tip: "Say \"don't change my tone\" explicitly, or the AI will smooth out your voice too.",
      },
    ],
  },
  {
    label: "Meetings & Planning",
    items: [
      {
        prompt:
          "Turn these raw meeting notes into a clean summary with: decisions made, action items (with owners), and open questions. [paste notes]",
        tip: "Even messy, half-sentence notes work — the AI fills in structure, not facts.",
      },
      {
        prompt:
          "I have these tasks for the week: [list]. Help me group them into a realistic daily plan for Mon–Fri, assuming 6 focused hours a day.",
        tip: "Mention any fixed meetings/deadlines so the plan works around them.",
      },
      {
        prompt:
          "Draft a 30-minute meeting agenda for a call about [topic] with [attendees/roles]. Include time boxes.",
        tip: "Time-boxing each item is what keeps meetings from running over — always ask for it.",
      },
      {
        prompt:
          "I'm stuck between [option A] and [option B] for [decision]. List the real trade-offs, not generic pros/cons.",
        tip: "Give the actual constraint (budget, deadline, team size) so the trade-offs are specific to you.",
      },
      {
        prompt:
          "Write a short status update for my manager covering: what I finished, what's in progress, and what I need from them.",
        tip: "Keep this one as a saved template — reuse it weekly and just swap the details.",
      },
    ],
  },
  {
    label: "Research & Learning",
    items: [
      {
        prompt:
          "Explain [topic] like I'm smart but new to this specific field — no oversimplifying, no jargon left unexplained.",
        tip: "This phrasing avoids both a condescending answer and an overly technical one.",
      },
      {
        prompt:
          "Give me the 5 most important things to understand about [topic] before I start learning it in depth.",
        tip: "Use this before diving into a course or long article — it gives you a map first.",
      },
      {
        prompt:
          "Compare [tool/method/approach A] vs [B] for someone whose goal is [specific goal]. Skip the neutral \"it depends\" — give a real recommendation.",
        tip: "State your actual goal and constraints; a generic comparison is far less useful than one for your case.",
      },
      {
        prompt:
          "I just read this. Quiz me with 5 questions to check if I actually understood it: [paste article/notes]",
        tip: "Answering forces recall — much stickier than re-reading your notes.",
      },
      {
        prompt:
          "Summarize this in one paragraph for someone with zero background, then in one paragraph for an expert. [paste text]",
        tip: "Useful when you need to explain the same thing to two very different audiences.",
      },
    ],
  },
  {
    label: "Work Documents",
    items: [
      {
        prompt:
          "Turn this messy brain-dump into a structured one-page project brief with: goal, scope, out of scope, timeline, owner. [paste notes]",
        tip: "Works even from voice-to-text notes — don't clean it up yourself first.",
      },
      {
        prompt:
          "Write a polite follow-up message for something I sent [X days] ago with no response: [context]",
        tip: "Specify the relationship (client, colleague, vendor) — tone should differ a lot.",
      },
      {
        prompt:
          "Create a checklist I can reuse every time I [repeated task, e.g. \"onboard a new client\"].",
        tip: "Ask it to keep each item to one line — checklists fail when items are paragraphs.",
      },
      {
        prompt:
          "Simplify this document so someone outside our team could understand it in one read: [paste document]",
        tip: "Great for anything going to a client, new hire, or another department.",
      },
      {
        prompt:
          "Give me 3 versions of this pitch: a 1-sentence version, a 3-sentence version, and a 1-paragraph version. [paste pitch/idea]",
        tip: "Keep all three — different situations call for different lengths.",
      },
    ],
  },
  {
    label: "Problem-Solving",
    items: [
      {
        prompt:
          "I'm facing this problem: [describe it]. Ask me clarifying questions before suggesting a solution.",
        tip: "Forcing questions first stops the AI from guessing at context it doesn't have.",
      },
      {
        prompt:
          "Play devil's advocate on this plan and find the 3 weakest points: [paste plan]",
        tip: "Much more useful than asking \"is this good?\", which tends to get a polite yes.",
      },
      {
        prompt:
          "I need to explain a mistake I made to [manager/client] and what I'm doing to fix it. Help me draft this honestly, without over-apologizing.",
        tip: "Ask for \"no over-apologizing\" explicitly — first drafts tend to grovel.",
      },
      {
        prompt:
          "Break this big, vague goal into 5 concrete first steps I could start this week: [goal]",
        tip: "\"This week\" forces genuinely small, doable steps instead of another vague roadmap.",
      },
      {
        prompt:
          "Here's my draft reasoning for a decision: [paste reasoning]. Where is the logic weakest?",
        tip: "Use before a big decision you can't easily undo — cheap second opinion.",
      },
    ],
  },
  {
    label: "Personal Productivity",
    items: [
      {
        prompt:
          "Here's my to-do list: [list]. Tell me which 3 items actually matter this week and which are safe to drop or delay.",
        tip: "Be honest about your real deadline pressure — the AI can't know what's actually urgent otherwise.",
      },
      {
        prompt:
          "I keep procrastinating on [task]. Ask me why, then suggest the smallest possible first step.",
        tip: "\"Smallest possible step\" is the key phrase — it should feel almost too easy to skip.",
      },
      {
        prompt:
          "Turn this vague goal into a SMART goal: [goal]",
        tip: "Good for personal goals (fitness, saving, learning) as much as work ones.",
      },
      {
        prompt:
          "Help me write a short, kind message declining this invitation/request without over-explaining: [context]",
        tip: "Ask for \"without over-explaining\" — most first drafts justify too much.",
      },
      {
        prompt:
          "I have 90 minutes free and 3 tasks I could do: [list]. Which should I actually do, and why?",
        tip: "Give real context (energy level, deadlines) for a genuinely useful answer, not a coin flip.",
      },
    ],
  },
];

export function promptsHtml() {
  let n = 0;
  const sections = categories
    .map((cat) => {
      const cards = cat.items
        .map((item) => {
          n += 1;
          return `<div class="card">
            <span class="num">${n}</span><span class="label">${cat.label}</span>
            <div class="prompt">${item.prompt}</div>
            <div class="tip">💡 ${item.tip}</div>
          </div>`;
        })
        .join("\n");
      return `<div class="page"><h2>${cat.label}</h2>${cards}</div>`;
    })
    .join("\n");

  return `
  <div class="cover">
    <div class="kicker">Multaqa · AI Digital Products</div>
    <h1>30 AI Prompts<br/>for Work &amp; Productivity</h1>
    <p>Copy-paste prompts for email, meetings, planning, research, and everyday decisions — each one tested for a specific, common situation, not a generic template.</p>
    <div class="brand">ملتقى — Multaqa</div>
  </div>
  ${sections}
  <div class="page">
    <h2>How to use this pack</h2>
    <p>Every prompt has a bracket like <strong>[paste text]</strong> or <strong>[topic]</strong> — replace it with your real content before sending. The more specific your replacement, the better the result.</p>
    <p>If the first answer isn't quite right, don't start over — reply with what's wrong: "shorter", "less formal", "keep the second paragraph but redo the first". AI assistants are much better at revising than guessing your preferences upfront.</p>
    <div class="footer-note">© Multaqa. For personal use. Please don't resell or redistribute this file.</div>
  </div>
  `;
}
