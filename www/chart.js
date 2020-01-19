export default function createChart(context, closenessOverTime) {
  return new Chart(context, {
    type: 'bar',
    data: {
      labels: closenessOverTime.map(([x]) => x),
      datasets: [{
        label: 'Closeness',
        data: closenessOverTime.map(([x, y]) => y),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    },
  });
}