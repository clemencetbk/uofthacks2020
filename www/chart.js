export default function createChart(canvas, closenessOverTime) {
  const datasetConfiguration = {
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 2,
    pointRadius: 0,
    fill: false,
  };

  const windowSize = 1000 * 60 * 60 * 24 * 31 * 12;
  const slidingSpeed = 1000 * 60 * 60 * 24 * 31;
  
  const chart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      datasets: [{
        data: closenessOverTime.map(([x, y]) => ({ x, y: y })),
        ...datasetConfiguration,
      }, {
        data: closenessOverTime.map(([x, y]) => ({ x, y: -y })),
        ...datasetConfiguration,
      }],
    },
    options: {
      responsive: true,
      animation: false,
      legend: false,
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            min: closenessOverTime[0][0],
            max: closenessOverTime[0][0] + windowSize,
            unit: 'month',
            displayFormats: {
              month: 'MMM YYYY',
            },
          },
          ticks: {
            autoSkip: false,
            source: 'auto',
            major: {
              enabled: true,
            },
          },
        }],
      },
    },
  });

  let prevPaint = Date.now();
  setInterval(() => {
    const now = Date.now();
    const dt = (now - prevPaint) / 1000;
    prevPaint = now;
    
    if (chart.options.scales.xAxes[0].time.max <= closenessOverTime[closenessOverTime.length - 1][0]) {
      chart.options.scales.xAxes[0].time.min += slidingSpeed * dt;
      chart.options.scales.xAxes[0].time.max += slidingSpeed * dt;
    } else if (chart.options.scales.xAxes[0].time.min >= closenessOverTime[0][0]) {
      chart.options.scales.xAxes[0].time.min -= slidingSpeed * dt;
    }
    chart.update();
  }, 1000 / 60);

  return chart;
}