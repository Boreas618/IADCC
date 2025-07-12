import * as d3 from 'd3';

const drawPerceptionMap = (svg, divX, divY, width, height, props) => {
    const dataset = props.filteredTreeMapData;
    const allTypes = props.allTypes;
    const curID = props.clickID;

    const hierarchy = d3.hierarchy(dataset)
        .sum(d => d.importance)  //sums every child values
        .sort((a, b) => b.importance - a.importance); // and sort them in descending order 

    const treemap = d3.treemap()
        .size([width * 0.954, height * 0.85])
        .padding(1);

    const root = treemap(hierarchy);

    const categories = dataset.children.map(d => d.name);


    const colorScale = d3.scaleOrdinal()
        .domain(allTypes)   //use allTypes to ensure the same legend in all timestamps
        .range(d3.schemePastel1);

    const legendSVG = svg;
    
    const legend = legendSVG.selectAll('.legend') 
        .data(categories)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { return 'translate(' + (i * 85) + ', 30)'; });

    legend.append('rect')
        .attr('x', 10 +divX)
        .attr('y', 0 +divY)
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', d => colorScale(d));

    legend.append('text')
        .attr('x', 28 +divX)
        .attr('y', 11 +divY)
        .style('font-size', '10px')
        .text(function(d) { 
            return d;
        });

    const cell = svg.selectAll('.treeMap')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class','treeMap');

    cell.append('rect')
        .attr('x', d => d.x0 +divX +8)
        .attr('y', d => d.y0 +divY +50)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => colorScale(d.data.type))
        .on('click', (e, d) => {
            if(curID === d.data.id) {
                props.changeClickID(-1);
            }
            else {
                props.changeClickID(d.data.id);
            }
        })
        .attr('stroke', d => {
            if(d.data.id === props.clickID)
                {return 'black';}
            else {return 'none';}
        })
        .attr('stroke-width', '1px');

    cell.append('text')
        .attr('x', function (d) { return d.x0 +divX +8; })
        .attr('y', function (d) { return d.y0 +divY +50; })
        .attr('dx', '0.5em')
        .attr('dy', '1.5em')
        .attr('fill', 'black')
        .attr('font-size', 0.5)
        .text(function (d) {
            return ('id: ' + d.data.id);
        });
    
    cell.append('text')
        .attr('x', function (d) { return d.x0 +divX +8; })
        .attr('y', function (d) { return d.y0 +divY +50; })
        .attr('dx', '0.5em')
        .attr('dy', '3.0em')
        .attr('fill', '#3E3E3E')
        .attr('font-size', 0.5)
        .text(function (d) {
            return Math.round(d.data.importance*1000)/1000;
        });
};

export default drawPerceptionMap;