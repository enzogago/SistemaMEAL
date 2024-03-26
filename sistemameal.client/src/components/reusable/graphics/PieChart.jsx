import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { formatter } from '../../monitoring/goal/helper';

const PieChart = ({ data, id }) => {
    const colorMapping = {
        "MASCULINO": "#FFC65860",
        "FEMENINO": "#F87C56"
    };
    const ref = useRef();

    useEffect(() => {
        const width = ref.current.clientWidth;
        const height = width;
        const radius = Math.min(width, height) / 2;

        // Calcula el total de todos los valores
        const total = data.reduce((sum, d) => sum + Number(d.value), 0);
        // Limpia el div antes de añadir el nuevo gráfico de pastel
        d3.select(`#${id}`).html("");
    
        const color = d3.scaleOrdinal()
            .domain(Object.keys(colorMapping))
            .range(Object.values(colorMapping));
    
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);
    
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
    
        const svg = d3.select(`#${id}`)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Crea el tooltip y añádelo al cuerpo del documento
        const tooltip = d3.select(`#${id}`)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
        const path = svg.selectAll("path")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", d => color(d.data.name)) // Utiliza el nombre de la categoría para seleccionar el color
            .attr("d", arc)
            .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave);
    
        svg.append("g")
            .attr("text-anchor", "middle")
            .selectAll()
            .data(pie(data))
            .join("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .style("font-size", "1.25rem")
            .style("fill", d => d.data.name === 'MASCULINO' ? '#000' : '#fff') // Cambia 'color1' y 'color2' por los colores que quieras
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("fill-opacity", 1)
                .text(d => `${(d.data.value / total * 100).toFixed(2)}%`));
        

        function onMouseEnter(event, d) {
            const [x, y] = arc.centroid(d);
            const tooltipBox = tooltip.node().getBoundingClientRect();
            tooltip.style("opacity", 1);
            tooltip.style("left", (x + width / 2) + "px");
            tooltip.style("top", (y + height / 2) + "px");
            tooltip.style("transform", `translate(calc( -50% + ${x/2}px), calc(-100% + ${y/2}px))`);
            tooltip.html(`
                <div class="tooltip-name">
                    <span style="text-transform: capitalize;">${d.data.name.toLowerCase()}</span>
                </div>
                <div class="tooltip-value">
                    <span>${formatter.format(Number(d.data.value))}</span>
                </div>
            `);
        }

        function onMouseLeave() {
            tooltip.style("opacity", 0);
        }
        
    }, [data]);

    return <div id={id} ref={ref} style={{position: 'relative'}}></div>;
};

export default PieChart;
