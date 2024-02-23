import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DivergingBarChart = ({ maleData, femaleData, id, ageRanges, maleColor, femaleColor }) => {
    const ageRangeLabels = ageRanges.map(range => range.min != 65 ? `${range.min} - ${range.max}` : `65+`);

    const ref = useRef();

    useEffect(() => {
        const margin = { top: 20, right: 10, bottom: 20, left: 60 };
        const width = ref.current.clientWidth - (margin.left + margin.right)*2;
        const height = Math.max(maleData.length, femaleData.length) * 40;

        // Limpia el div antes de añadir el nuevo gráfico
        d3.select(`#${id}`).html("");

        const svg = d3.select(`#${id}`)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max([...maleData, ...femaleData], d => d.count)])
            .range([0, width / 2]);

        const y = d3.scaleBand()
            .domain(d3.range(Math.max(maleData.length, femaleData.length)))
            .range([0, height])
            .padding(0.1);

        // Añade un eje vertical a la izquierda del gráfico
        const yAxis = d3.axisLeft(y)
            .tickFormat((d, i) => ageRangeLabels[i]);

        svg.append("g")
            .call(yAxis)
            .selectAll("text")
            .style("font-size", "1rem");


        const barsGroup = svg.append("g")
            .attr("transform", `translate(${margin.left / 2}, 0)`); // Añade un margen a las barras

        barsGroup.append("g")
            .selectAll("rect")
            .data(maleData)
            .join("rect")
            .attr("fill", maleColor)
            .attr("x", d => width / 2 - x(d.count))
            .attr("y", (d, i) => y(i))
            .attr("width", d => x(d.count))
            .attr("height", y.bandwidth());
            
        barsGroup.append("g")
            .selectAll("rect")
            .data(femaleData)
            .join("rect")
            .attr("fill", d => femaleColor)
            .attr("x", width / 2)
            .attr("y", (d, i) => y(i))
            .attr("width", d => x(d.count))
            .attr("height", y.bandwidth());

        // Añade etiquetas de texto para los valores de las barras
        svg.append("g")
            .selectAll("text")
            .data(maleData)
            .join("text")
            .attr("x", d => width / 2 - x(d.count) + margin.left/2 - 5)
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2) // Usa el índice en lugar de d.age
            .attr("text-anchor", "end")
            .attr("dy", "0.35em")
            .text(d => d.count);
            
            svg.append("g")
            .selectAll("text")
            .data(femaleData)
            .join("text")
            .attr("x", d => width / 2 + x(d.count) + margin.left/2 + 5)
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2) // Usa el índice en lugar de d.age
            .attr("dy", "0.35em")
            .text(d => d.count);
            
    }, [maleData, femaleData]);

    return <div id={id} ref={ref}></div>;
};

export default DivergingBarChart;
