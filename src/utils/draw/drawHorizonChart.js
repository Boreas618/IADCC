import * as d3 from 'd3';
import HorizonTSChart from 'horizon-timeseries-chart';

function drawHorizonChart(d) {
    d3.select('#horizon-chart').select('svg').remove();
    const myChart = HorizonTSChart();
    myChart(document.getElementById('horizon-chart'))
        .data(d)
        .height(window.innerHeight * 0.25)
        .width(1440)
        .series('series')
        .horizonBands(8)
        .positiveColors(['white', '#ff99aa'])
        .negativeColors(['white', '#448EF7'])
        .transitionDuration(50)
        .enableZoom(true);
}

export default drawHorizonChart;