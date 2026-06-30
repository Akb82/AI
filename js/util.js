// Мелкие утилиты.

// Экранирование пользовательского ввода (имя) перед вставкой в innerHTML.
export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
