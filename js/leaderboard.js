// Лидерборд результатов квиза.
//
// СЕЙЧАС: хранилище — localStorage (только на этом устройстве).
// ТОЧКА РАСШИРЕНИЯ: чтобы сделать счёт общим для всех друзей, достаточно
// заменить тела getScores()/addScore() на вызовы Firebase/Supabase —
// остальной код (renderBoard, quiz.js) трогать не нужно.

import { escapeHtml } from './util.js';

const KEY = 'cb_scores';

export function getScores() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

export function addScore(entry) {
  const all = getScores();
  all.push(entry);
  localStorage.setItem(KEY, JSON.stringify(all));
  return entry;
}

// Лучший результат на каждого игрока (по проценту, затем по очкам).
function bestPerPlayer(scores) {
  const best = new Map();
  for (const s of scores) {
    const key = (s.name || '—').toLowerCase();
    const cur = best.get(key);
    if (!cur || s.pct > cur.pct || (s.pct === cur.pct && s.score > cur.score)) {
      best.set(key, s);
    }
  }
  return [...best.values()].sort((a, b) => b.pct - a.pct || b.score - a.score);
}

let boardBody;

export function initBoard() {
  boardBody = document.getElementById('boardBody');
}

export function renderBoard() {
  const rows = bestPerPlayer(getScores());
  if (!rows.length) {
    boardBody.innerHTML = '<div class="board-empty">Пока пусто. Пройди квиз — и попадёшь в таблицу! 🎯</div>';
    return;
  }
  const medal = ['🥇', '🥈', '🥉'];
  boardBody.innerHTML = '<div class="board-list">' + rows.map((s, i) => `
    <div class="board-row">
      <span class="board-rank">${medal[i] || (i + 1)}</span>
      <span class="board-name">${escapeHtml(s.name)}</span>
      <span class="board-meta">${escapeHtml(s.category)}</span>
      <span class="board-score">${s.score}/${s.total}</span>
    </div>`).join('') + '</div>';
}
