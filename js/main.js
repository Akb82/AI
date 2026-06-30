// Точка входа: онбординг, профиль, переключатели аудитории/режима, категории.

import { loadData } from './data.js';
import { initCards, renderCard } from './cards.js';
import { initQuiz, startQuiz } from './quiz.js';
import { getProfile, askProfile, audienceForAge } from './profile.js';
import { initBoard, renderBoard } from './leaderboard.js';
import { escapeHtml } from './util.js';

const SUB_TEXT = {
  adult: 'Самый нужный минимум. Слева испанский, рядом каталанский (то, что на вывесках).',
  kids: 'Учим слова с картинками! Нажми 🔊 и повтори.',
};

// Общий объект состояния, который видят cards.js и quiz.js.
const state = {
  ALL: { adult: {}, kids: {} }, // все слова, сгруппированные по аудитории/категории
  DATA: {},                     // группы текущей аудитории
  curCat: '',                   // активная категория
  idx: 0,                       // индекс карточки
  mode: 'cards',                // 'cards' | 'quiz' | 'board'
  profile: null,                // { name, age }
};

const catBar = document.getElementById('catBar');

function buildChips() {
  catBar.innerHTML = '';
  Object.keys(state.DATA).forEach((c) => {
    const b = document.createElement('button');
    b.className = 'chip' + (c === state.curCat ? ' active' : '');
    b.textContent = c;
    b.onclick = () => {
      state.curCat = c;
      state.idx = 0;
      [...catBar.children].forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderCard();
      if (state.mode === 'quiz') startQuiz();
    };
    catBar.appendChild(b);
  });
}

function setAudience(kids) {
  document.body.classList.toggle('kids', kids);
  state.DATA = kids ? state.ALL.kids : state.ALL.adult;
  state.curCat = Object.keys(state.DATA)[0];
  state.idx = 0;
  document.getElementById('sub').textContent = kids ? SUB_TEXT.kids : SUB_TEXT.adult;
  document.querySelector('.kids-only').style.display = kids ? 'inline' : 'none';
  buildChips();
  renderCard();
  if (state.mode === 'quiz') startQuiz();
}

// Применить аудиторию и синхронизировать кнопки-переключатели.
function applyAudience(aud) {
  document.querySelectorAll('.aud').forEach(x => x.classList.toggle('active', x.dataset.aud === aud));
  setAudience(aud === 'kids');
}

function renderGreeting() {
  const g = document.getElementById('greet');
  const p = state.profile;
  if (p && p.name) {
    g.innerHTML = `Привет, <b>${escapeHtml(p.name)}</b>! <button id="editProfile" class="greet-edit">сменить</button>`;
    g.style.display = '';
    document.getElementById('editProfile').onclick = editProfile;
  } else {
    g.style.display = 'none';
  }
}

async function editProfile() {
  const p = await askProfile(state.profile);
  state.profile = p;
  renderGreeting();
  applyAudience(audienceForAge(p.age));
}

function wireControls() {
  document.querySelectorAll('.aud').forEach(a => {
    a.onclick = () => applyAudience(a.dataset.aud);
  });

  document.querySelectorAll('.tab').forEach(t => {
    t.onclick = () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      state.mode = t.dataset.mode;
      document.getElementById('cardsView').style.display = state.mode === 'cards' ? 'block' : 'none';
      document.getElementById('quizView').classList.toggle('show', state.mode === 'quiz');
      document.getElementById('boardView').classList.toggle('show', state.mode === 'board');
      if (state.mode === 'quiz') startQuiz();
      else if (state.mode === 'board') renderBoard();
      else renderCard();
    };
  });
}

async function boot() {
  state.ALL = await loadData();
  initCards(state);
  initQuiz(state);
  initBoard();
  wireControls();

  state.profile = getProfile();
  if (!state.profile) {
    state.profile = await askProfile(null);
  }
  renderGreeting();
  applyAudience(audienceForAge(state.profile.age));
}

boot();
