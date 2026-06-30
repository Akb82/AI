// Карточки-перевёртыши + навигация.
// Работает с общим объектом состояния (ctx): ctx.DATA, ctx.curCat, ctx.idx.

import { speak } from './speech.js';

let ctx;
const els = {};

export function initCards(context) {
  ctx = context;
  els.card = document.getElementById('card');
  els.emoji = document.getElementById('emoji');
  els.esWord = document.getElementById('esWord');
  els.phon = document.getElementById('phon');
  els.ruWord = document.getElementById('ruWord');
  els.catLine = document.getElementById('catLine');
  els.cur = document.getElementById('cur');
  els.total = document.getElementById('total');
  els.prev = document.getElementById('prev');
  els.next = document.getElementById('next');

  els.card.onclick = () => els.card.classList.toggle('flipped');
  els.prev.onclick = (e) => {
    e.stopPropagation();
    if (ctx.idx > 0) { ctx.idx--; renderCard(); }
  };
  els.next.onclick = (e) => {
    e.stopPropagation();
    const l = ctx.DATA[ctx.curCat];
    if (ctx.idx < l.length - 1) { ctx.idx++; renderCard(); }
  };
  document.getElementById('speakBtn').onclick = (e) => {
    e.stopPropagation();
    speak(ctx.DATA[ctx.curCat][ctx.idx].es);
  };
}

export function renderCard() {
  const list = ctx.DATA[ctx.curCat];
  const item = list[ctx.idx];
  els.card.classList.remove('flipped');
  els.emoji.textContent = item.emoji || '';
  els.esWord.textContent = item.es;
  els.phon.textContent = '[' + item.phon + ']';
  els.ruWord.textContent = item.ru;
  els.catLine.innerHTML = '🗣️ по-каталански: <b>' + item.cat + '</b>';
  els.cur.textContent = ctx.idx + 1;
  els.total.textContent = list.length;
  els.prev.disabled = ctx.idx === 0;
  els.next.disabled = ctx.idx === list.length - 1;
}
