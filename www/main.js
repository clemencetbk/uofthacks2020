import attachDropListener from './drop.js';
import getCloseness from './processing.js';
import createChart from './chart.js';

window.addEventListener('load', () => {
  window.addEventListener('dragover', (event) => event.preventDefault());
  window.addEventListener('drop', (event) => event.preventDefault());

  const dropTarget = document.getElementById('drop');
  const chartContext = document.getElementById('chart').getContext('2d');
  attachDropListener(dropTarget, (messages, locationHistory1, locationHistory2) => {
    console.log(messages, locationHistory1, locationHistory2)
    const closenessOverTime = getCloseness(messages, locationHistory1, locationHistory2)
    createChart(chartContext, closenessOverTime)
  });
});
