// Квиз (multiple-choice): угадай русский перевод по испанскому слову.
// Работает с общим объектом состояния (ctx): ctx.DATA, ctx.curCat, ctx.profile.

import { addScore } from './leaderboard.js';

let ctx;
let quizBody;
let qOrder = [], qPos = 0, qScore = 0;

export function initQuiz(context) {
  ctx = context;
  quizBody = document.getElementById('quizBody');
}

function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.random() * (i + 1) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function startQuiz() {
  qOrder = shuffle(ctx.DATA[ctx.curCat]);
  qPos = 0;
  qScore = 0;
  renderQuiz();
}

function renderQuiz() {
  if (qPos >= qOrder.length) { renderResult(); return; }
  const item = qOrder[qPos];
  const pool = ctx.DATA[ctx.curCat].filter(x => x.ru !== item.ru);
  const opts = shuffle([item, ...shuffle(pool).slice(0, 3)]);
  quizBody.innerHTML = `
    <div class="q-card">
      <div class="q-label">Что это значит?</div>
      <div class="q-emoji">${item.emoji || ''}</div>
      <div class="q-word">${item.es}</div>
      <div class="q-phon">[${item.phon}]</div>
      <div id="opts"></div>
      <button class="q-next" id="qNext">Дальше ›</button>
    </div>
    <div class="score-bar"><span>${ctx.curCat}</span><span>✔ ${qScore} / ${qOrder.length}</span></div>
    <div class="progress"><i style="width:${qPos / qOrder.length * 100}%"></i></div>`;
  const box = document.getElementById('opts');
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.textContent = o.ru;
    b.onclick = () => {
      if (o.ru === item.ru) { b.classList.add('correct'); qScore++; }
      else { b.classList.add('wrong'); [...box.children].forEach(x => { if (x.textContent === item.ru) x.classList.add('correct'); }); }
      [...box.children].forEach(x => x.disabled = true);
      document.getElementById('qNext').classList.add('show');
      document.querySelector('.score-bar span:last-child').textContent = '✔ ' + qScore + ' / ' + qOrder.length;
    };
    box.appendChild(b);
  });
  document.getElementById('qNext').onclick = () => { qPos++; renderQuiz(); };
}

function renderResult() {
  const pct = Math.round(qScore / qOrder.length * 100);
  const kids = document.body.classList.contains('kids');

  // записываем результат в лидерборд
  const prof = ctx.profile || {};
  addScore({
    name: prof.name || 'Гость',
    age: prof.age || null,
    audience: kids ? 'kids' : 'adult',
    category: ctx.curCat,
    score: qScore,
    total: qOrder.length,
    pct,
    date: Date.now(),
  });

  let msg = kids
    ? (pct === 100 ? "Молодец! Ты настоящий чемпион! 🏆" : pct >= 60 ? "Здорово получается! 🌟" : "Попробуй ещё разок! 🙂")
    : (pct === 100 ? "¡Perfecto! Можно заказывать paella вслепую." : pct >= 70 ? "¡Muy bien! Почти готовы к Tossa de Mar." : "Неплохо для начала — прогоните карточки ещё раз.");
  quizBody.innerHTML = `
    <div class="q-card result">
      <div class="big">${qScore}/${qOrder.length}</div>
      <div class="msg">${msg}</div>
      <button class="restart" id="restart">${kids ? 'Ещё! 🔁' : 'Ещё раз'}</button>
    </div>`;
  document.getElementById('restart').onclick = startQuiz;
}
