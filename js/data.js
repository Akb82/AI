// Загрузка слов из words.json и группировка по аудитории и категориям.
// Возвращает { adult: { "Категория": [слова…] }, kids: { … } }
// Порядок категорий и слов сохраняется как в файле (важно для навигации).

export async function loadData() {
  const res = await fetch(new URL('../words.json', import.meta.url));
  if (!res.ok) throw new Error('Не удалось загрузить words.json: ' + res.status);
  const rows = await res.json();
  return groupByAudience(rows);
}

function groupByAudience(rows) {
  const out = { adult: {}, kids: {} };
  for (const w of rows) {
    const bucket = out[w.audience] || (out[w.audience] = {});
    (bucket[w.category] || (bucket[w.category] = [])).push(w);
  }
  return out;
}
