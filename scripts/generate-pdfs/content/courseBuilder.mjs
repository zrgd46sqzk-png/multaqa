// Shared renderer for all "10-module course" products — keeps the page
// template (cover, intro, TOC, module concept+example pages, closing) in
// one place instead of duplicated per course file.

function conceptPage(m) {
  return `<div class="page">
    <span class="module-badge">الوحدة ${m.n}</span>
    <h2>${m.title}</h2>
    ${m.body}
    <div class="exercise"><div class="label">تمرين</div><p style="margin:0">${m.exercise}</p></div>
  </div>`;
}

function examplePage(m) {
  const ex = m.example;
  return `<div class="page example-page">
    <div class="eyebrow">الوحدة ${m.n} · مثال عملي</div>
    <h2>${m.title}</h2>
    <p>${ex.context}</p>
    <div class="transcript">
      <div class="bubble prompt-bubble">
        <span class="who">${ex.inputLabel}</span>
        <p>${ex.input}</p>
      </div>
      <div class="bubble response-bubble">
        <span class="who">${ex.outputLabel}</span>
        <p>${ex.output}</p>
      </div>
    </div>
    <div class="takeaway"><strong>الخلاصة:</strong> ${ex.takeaway}</div>
  </div>`;
}

export function buildCourseHtml({ kicker, title, coverSub, introTitle, introBody, introTip, modules, closingTitle, closingBody }) {
  const toc = modules
    .map(
      (m) => `<div class="toc-item">
        <span class="toc-num">${m.n}</span>
        <span class="toc-title">${m.title}</span>
      </div>`
    )
    .join("\n");

  const body = modules.map((m) => conceptPage(m) + examplePage(m)).join("\n");
  const introParas = introBody.map((p) => `<p>${p}</p>`).join("\n");

  return `
  <div class="cover">
    <div class="kicker">${kicker}</div>
    <h1>${title}</h1>
    <p>${coverSub}</p>
    <div class="brand">ملتقى — Multaqa</div>
  </div>

  <div class="page">
    <div class="eyebrow">مقدمة</div>
    <h2>${introTitle}</h2>
    ${introParas}
    <div class="takeaway"><strong>نصيحة:</strong> ${introTip}</div>
  </div>

  <div class="page">
    <div class="eyebrow">المحتويات</div>
    <h2>الوحدات العشر</h2>
    ${toc}
  </div>

  ${body}

  <div class="page">
    <h2>${closingTitle}</h2>
    <p>${closingBody}</p>
    <div class="footer-note">© ملتقى. للاستخدام الشخصي فقط. يُرجى عدم إعادة بيع أو توزيع هذا الملف.</div>
  </div>
  `;
}
