import React, { useEffect } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ percentage }) => {
    const width = 120;
    const height = 120;
    const radius = Math.min(width, height) / 2;

    useEffect(() => {
        const color = d3.scaleOrdinal()
            .range(["#20737B", "transparent"]); // El primer color es para el porcentaje, el segundo es transparente

        const data = [
            { value: percentage },
            { value: 100 - percentage }
        ];

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius - 25)
            .outerRadius(radius);

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.selectAll("path")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("fill", "#20737B")
            .text(percentage + "%");
    }, [percentage]);

    return <div className='Large_3 Large-f2' id="chart"></div>;
};

export default DonutChart;
