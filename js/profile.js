// Профиль пользователя (имя + возраст) и онбординг.
// Хранится локально. Возраст определяет режим по умолчанию.

const KEY = 'cb_profile';
export const KIDS_MAX_AGE = 9; // до этого возраста включительно — режим «Детям»

export function getProfile() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}

export function saveProfile(p) {
  localStorage.setItem(KEY, JSON.stringify(p));
  return p;
}

export function audienceForAge(age) {
  return (age && age <= KIDS_MAX_AGE) ? 'kids' : 'adult';
}

// Показать экран онбординга. Promise резолвится профилем после сохранения.
// initial — текущий профиль при редактировании (или null при первом запуске).
export function askProfile(initial) {
  return new Promise((resolve) => {
    const ov = document.getElementById('onboarding');
    const nameI = document.getElementById('obName');
    const ageI = document.getElementById('obAge');
    const go = document.getElementById('obGo');
    const err = document.getElementById('obErr');

    nameI.value = initial?.name || '';
    ageI.value = initial?.age || '';
    err.textContent = '';
    ov.classList.add('show');
    nameI.focus();

    function submit() {
      const name = nameI.value.trim();
      const age = parseInt(ageI.value, 10);
      if (!name) { err.textContent = 'Введи имя 🙂'; nameI.focus(); return; }
      if (!age || age < 1 || age > 120) { err.textContent = 'Сколько тебе лет?'; ageI.focus(); return; }
      const p = saveProfile({ name, age });
      ov.classList.remove('show');
      go.onclick = null;
      ageI.onkeydown = null;
      resolve(p);
    }

    go.onclick = submit;
    ageI.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
  });
}
