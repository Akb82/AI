// Точка входа: загрузка данных, переключатели аудитории/режима, категории.

import { loadData } from './data.js';
import { initCards, renderCard } from './cards.js';
import { initQuiz, startQuiz } from './quiz.js';

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
  quizActive: false,            // открыт ли режим квиза
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
      if (state.quizActive) startQuiz();
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
  if (state.quizActive) startQuiz();
}

function wireControls() {
  document.querySelectorAll('.aud').forEach(a => {
    a.onclick = () => {
      document.querySelectorAll('.aud').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      setAudience(a.dataset.aud === 'kids');
    };
  });

  document.querySelectorAll('.tab').forEach(t => {
    t.onclick = () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      state.quizActive = t.dataset.mode === 'quiz';
      document.getElementById('cardsView').style.display = state.quizActive ? 'none' : 'block';
      document.getElementById('quizView').classList.toggle('show', state.quizActive);
      if (state.quizActive) startQuiz(); else renderCard();
    };
  });
}

async function boot() {
  state.ALL = await loadData();
  initCards(state);
  initQuiz(state);
  wireControls();
  state.DATA = state.ALL.adult;
  state.curCat = Object.keys(state.DATA)[0];
  buildChips();
  renderCard();
}

boot();
