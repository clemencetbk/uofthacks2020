export default function createChart(canvas, closenessOverTime) {
  canvas.width = closenessOverTime.length * 10
  const datasetConfiguration = {
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1,
    pointRadius: 0,
    fill: false,
  }
  const chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: closenessOverTime.map(([x]) => x),
      datasets: [{
        label: 'Person 1',
        data: closenessOverTime.map(([x, y]) => y),
        ...datasetConfiguration,
      }, {
        label: 'Person 2',
        data: closenessOverTime.map(([x, y]) => -y),
        ...datasetConfiguration,
      }],
    },
    options: {
      responsive: false,
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    },
  });
  return chart;
}