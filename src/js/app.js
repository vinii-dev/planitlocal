document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[contenteditable]').forEach(node => {
    node.setAttribute('spellcheck', 'false');
  });
});
