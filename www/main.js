import attachDropListener from './drop.js';

window.addEventListener('load', () => {
  window.addEventListener('dragover', (event) => event.preventDefault());
  window.addEventListener('drop', (event) => event.preventDefault());

  const dropTarget = document.getElementById('drop');
  attachDropListener(dropTarget, (messages, locationHistory) => {
    console.log(messages, locationHistory)
  });
});
