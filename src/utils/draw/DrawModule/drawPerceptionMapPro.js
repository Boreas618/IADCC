import * as d3 from 'd3';
import {range} from 'd3';

const drawPerceptionMapPro = (svg, divX, divY, width, height, props) => {
    const dataset = props.neighborParallelCoordinatesData
    //const dataset = props.filteredTreeMapData;
    const allTypes = props.allTypes;
    const curID = props.clickID;

    const colorScale = d3.scaleOrdinal()
        .domain(allTypes)   //use allTypes to ensure the same legend in all timestamps
        .range(d3.schemePastel1);
    // "#fbb4ae" "#b3cde3" "#ccebc5" "#decbe4" "#fed9a6" "#ffffcc" "#e5d8bd" "#fddaec" "#f2f2f2"

    const tooltip = d3.select("#flow")
        .append("div")
        .style("opacity", 0)
        .attr("id", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    const dimensions = [];
    for (const i of range(Math.max(props.dataNumber - 1, 0), Math.min(props.dataNumber + 2, 104))) {
        dimensions.push(i);
    }



    const x = d3.scalePoint()
        .range([divX + 30, divX + width * 0.954])
        .domain(dimensions);

    var y = {};
    for (const i in dimensions) {
        console.log(d3.merge(dataset.map((d)=>d["importance"])));
        const index = dimensions[i];
        y[index] = d3.scaleLinear()
            .domain(d3.extent(d3.merge(dataset.map((d)=>d["importance"]))))
            .range([divY + height * 0.76 + 30, divY + 60]);
    }

    function path(d) {
        return d3.line()(dimensions.map(
            function (p) {
                //console.log(p);
                return [x(p), y[p](d.importance[p])];
            }));
    }

    svg
        .selectAll("myPath")
        .data(dataset)
        .enter().append("path")
        .attr("d", path)
        .attr("id",function(d){return "line"+d.id;})
        .style("fill", "none")
        .style("stroke", (d)=>colorScale(d.type))
        .style("opacity", 0.5)
        .style("stroke-width",2)
        .on("mouseover", (e,d) => showTooltip(e, d))
        .on("mousemove", (e,d) => moveTooltip(e, d))
        .on("mouseout", (e,d) => hideTooltip(e, d));

    const showTooltip = function (e, d) {
        tooltip
            .transition()
            .duration(100);
        tooltip
            .style("left", d3.pointer(e, d3.selectAll("mainView"))[0] + "px")
            .style("top", d3.pointer(e, d3.selectAll("mainView"))[1] + "px")
            .style("opacity", 1)
            .text("id: " + d.id)
            .attr("class", "active");

        d3.select("#line"+d.id).style("stroke","#1890ff")
    }

    const moveTooltip = function (e, d) {
        tooltip
            .style("left", d3.pointer(e, d3.selectAll("mainView"))[0] + "px")
            .style("top", d3.pointer(e, d3.selectAll("mainView"))[1] + "px")
            .attr("class", "active");
    }

    const hideTooltip = function (e, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
            .attr("class", "notActive");

        d3.select("#line"+d.id).style("stroke", (d)=>colorScale(d.type));
    }


    // draw the axis:
    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function (d) {
            return "translate(" + x(d) + divX + ")";
        })
        // And I build the axis with the call function
        .each(function (d) {
            d3.select(this).call(d3.axisLeft().scale(y[d]));
        })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", divY + 220)
        .text(function (d) {
            return d;
        })
        .style("fill", "black")

    const legendSVG = svg;

    //console.log(legendSVG);

    const legend = legendSVG.selectAll(".legend")
        .data(allTypes)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(" + (i * 85) + ", 30)";
        });

    legend.append("rect")
        .attr("x", 10 + divX)
        .attr("y", 0 + divY)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", d => colorScale(d));

    legend.append("text")
        .attr("x", 28 + divX)
        .attr("y", 11 + divY)
        .style("font-size", "9px")
        .text(function (d) {
            return d;
        });

}

export default drawPerceptionMapPro;