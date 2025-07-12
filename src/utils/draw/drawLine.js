import * as d3 from 'd3';

const drawLine = (svg, x1, y1, x2, y2, rateWidth, rateHeight) => {
    const start = {x: x1 * rateWidth, y: y1 * rateHeight};
    const end = {x: x2 * rateWidth, y: y2 * rateHeight};
    const numPoints = 20;

    const data = Array.from({length: numPoints}, (_, i) => {
        const x = start.x + i * (end.x - start.x) / (numPoints - 1);
        const y = start.y - (Math.cos((x - start.x) * Math.PI / (end.x - start.x)) - 1) * (end.y - start.y) / 2; // 50 controls the amplitude
        return {x, y};
    });

    const line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#DDDFE0")
        .attr("stroke-width", "5px")

    /*svg.append("marker")
    .attr("id", "resolved")
    .attr("markerUnits", "strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
    .attr("markerUnits", "userSpaceOnUse")
    .attr("viewBox", "-8 -5 10 10")//坐标系的区域
    .attr("refX", 2)//箭头坐标
    .attr("refY", 0)
    .attr("markerWidth", 12)//标识的大小
    .attr("markerHeight", 12)
    .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
    // .attr("stroke", "#bebada")
    // .attr("stroke-width", 1)//箭头宽度
    .append("path")
    .attr("d", "M-8,-5 L2,0 L-8,5 L-8,-5")//箭头的路径
    .attr('fill', 'black');//箭头颜色*/

    /*svg.append("line")
        .attr("x1", x1 * rateWidth)
        .attr("y1", y1 * rateHeight)
        .attr("x2", x2 * rateWidth)
        .attr("y2", y2 * rateHeight)
        .attr("stroke", "#DDDFE0")
        .attr("stroke-width", "5px")
        .attr("marker-end", "url(#resolved)")
        .attr("opacity", "0.5")*/
    //.style("stroke-dasharray", '5,5');
}

export default drawLine;