import attachDropListener from './drop.js';
import getCloseness from './processing.js';
import createChart from './chart.js';

window.addEventListener('load', () => {
  window.addEventListener('dragover', (event) => event.preventDefault());
  window.addEventListener('drop', (event) => event.preventDefault());

  const dropTarget = document.getElementById('drop');
  const chartCanvas = document.getElementById('chart');
  attachDropListener(dropTarget, (messages, locationHistory1, locationHistory2) => {
    console.log(messages, locationHistory1, locationHistory2)

    dropTarget.style.display = 'none';
    chartCanvas.style.display = '';

    const closenessOverTime = getCloseness(messages, locationHistory1, locationHistory2)
    console.log(closenessOverTime)
    
    createChart(chartCanvas, closenessOverTime)
  });
});
