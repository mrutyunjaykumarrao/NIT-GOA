/**
 * Loads the Google Charts library dynamically.
 * @param {function} callback - The function to call after the library is loaded.
 */
function loadGoogleCharts(callback) {
  // Check if the script is already present
  if (document.querySelector('script[src="https://www.gstatic.com/charts/loader.js"]')) {
    // If script exists, check if 'google.charts' is loaded
    if (window.google && window.google.charts) {
      callback();
    } else {
      // If script is there but not loaded, set the callback
      window.google.charts.setOnLoadCallback(callback);
    }
    return;
  }

  // If script does not exist, create and append it
  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/charts/loader.js';
  script.onload = () => {
    window.google.charts.load('current', {
      packages: ['corechart']
    });
    window.google.charts.setOnLoadCallback(callback);
  };
  document.head.appendChild(script);
}

/**
 * Draws the placement statistics column chart.
 * @param {string} targetId - The ID of the div where the chart will be rendered.
 * @param {boolean} isDark - A boolean to indicate if dark mode is active.
 */
function drawPlacementChart(targetId, isDark = false) {
  if (!window.google || !window.google.visualization) {
    console.error("Google Charts is not loaded yet.");
    return;
  }

  const data = window.google.visualization.arrayToDataTable([
    ['Batch', 'Highest Package', 'Average Package'],
    ['UG 2021', 20, 7.61],
    ['UG 2022', 44, 13.10],
    ['UG 2023', 26, 11.34],
    ['PG 2022', 21.69, 11.35],
    ['PG 2023', 37, 15.94]
  ]);

  const isSmallScreen = window.innerWidth < 768;
  const chartHeight = isSmallScreen ? 300 : 400;

  // Define styles for light and dark themes
  const lightTheme = {
    backgroundColor: 'transparent',
    colors: ['#2E86C1', '#1B4F72'],
    titleColor: '#1B4F72',
    axisTextColor: '#555',
    legendTextColor: '#555',
    gridlineColor: '#e0e0e0'
  };

  const darkTheme = {
    backgroundColor: 'transparent',
    colors: ['#64B5F6', '#42A5F5'],
    titleColor: '#64B5F6',
    axisTextColor: '#CCCCCC',
    legendTextColor: '#CCCCCC',
    gridlineColor: '#555555'
  };

  const currentTheme = isDark ? darkTheme : lightTheme;

  const options = {
    title: 'Placement & Statistics',
    width: '100%',
    height: chartHeight,
    isStacked: false,
    vAxis: {
      title: 'Lakhs Per Annum (LPA)',
      minValue: 0,
      titleTextStyle: {
        fontSize: isSmallScreen ? 12 : 14,
        color: currentTheme.axisTextColor
      },
      textStyle: {
        color: currentTheme.axisTextColor
      },
      gridlines: {
        color: currentTheme.gridlineColor
      }
    },
    hAxis: {
      title: 'Batch',
      titleTextStyle: {
        fontSize: isSmallScreen ? 12 : 14,
        color: currentTheme.axisTextColor
      },
      textStyle: {
        color: currentTheme.axisTextColor
      },
      gridlines: {
        color: currentTheme.gridlineColor
      }
    },
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: isSmallScreen ? 10 : 12,
        auraColor: 'none',
        color: currentTheme.axisTextColor
      }
    },
    backgroundColor: currentTheme.backgroundColor,
    legend: {
      position: 'bottom',
      alignment: 'center',
      textStyle: {
        fontSize: isSmallScreen ? 11 : 13,
        color: currentTheme.legendTextColor
      }
    },
    colors: currentTheme.colors,
    titleTextStyle: {
      fontSize: isSmallScreen ? 16 : 18,
      color: currentTheme.titleColor,
      bold: true,
    }
  };

  const chartElement = document.getElementById(targetId);
  if (chartElement) {
    const chart = new window.google.visualization.ColumnChart(chartElement);
    chart.draw(data, options);
  }
}

/**
 * Initializes the chart and sets up listeners for theme changes and window resizing.
 * @param {string} targetId - The ID of the div for the chart.
 * @param {boolean} initialIsDark - The initial theme state.
 */
export function initializeChart(targetId, initialIsDark) {
  let isDark = initialIsDark;

  // Initial drawing
  loadGoogleCharts(() => drawPlacementChart(targetId, isDark));

  // Redraw on resize
  window.addEventListener('resize', () => {
    // A small delay can help ensure the container has resized before redrawing
    setTimeout(() => {
        loadGoogleCharts(() => drawPlacementChart(targetId, isDark));
    }, 100);
  });
  
  // Example of how to handle theme change from outside this module
  document.body.addEventListener('themeChanged', (event) => {
    isDark = event.detail.isDark;
    loadGoogleCharts(() => drawPlacementChart(targetId, isDark));
  });
}