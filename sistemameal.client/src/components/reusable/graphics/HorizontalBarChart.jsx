import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HorizontalBarChart = ({ data, id, barColor }) => { // Añade barColor a las props
    const ref = useRef();

    useEffect(() => {
        const margin = { top: 30, right: 30, bottom: 0, left: 100 }; // Aumenta el margen inferior para hacer espacio para el eje x
        const width = ref.current.clientWidth;
        const barHeight = 50; // Aumenta la altura de la barra para más espacio entre barras
        const height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;

        // Limpia el div antes de añadir el nuevo gráfico
        d3.select(`#${id}`).html("");

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleBand()
            .domain(d3.range(data.length))
            .rangeRound([margin.top, height - margin.bottom])
            .padding(0.3);

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(i => data[i].name.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())));
        

        const svg = d3.select(`#${id}`)
            .append("svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .attr("fill", barColor) // Usa barColor para el color de las barras
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", d => x(d.value) - x(0))
            .attr("height", y.bandwidth());
            

        svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("class", "Large-f1 Medium-f_75 Small-f_75")
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("x", d => x(d.value) - 4)
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => d.value);


        svg.append("g")
            .call(yAxis)
            .attr("class", "Large-f1 Medium-f_75 Small-f_75");

    }, [data, barColor]); // Añade barColor a la lista de dependencias de useEffect

    return <div id={id} ref={ref} style={{position: 'relative'}}></div>;
};

export default HorizontalBarChart;
