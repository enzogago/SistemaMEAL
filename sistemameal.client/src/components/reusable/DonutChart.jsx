import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ percentage, wh, rad, newId, colorText, colorPc, colorSpc }) => {
    const width = wh;
    const height = wh;
    const radius = Math.min(width, height) / 2;
    const prevPercentage = useRef(0); // Almacena el valor anterior

    useEffect(() => {
        // Limpia el div antes de añadir el nuevo gráfico de rosquilla
        d3.select(`#${newId}`).html("");
    
        const color = d3.scaleOrdinal()
            .range([colorPc, colorSpc]); 
    
        const data = [
            { value: (percentage == 0 ? 0.00001 : percentage) },
            { value: 0 }
        ];
    
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);
    
        const arc = d3.arc()
            .innerRadius(radius - rad)
            .outerRadius(radius);
    
        const svg = d3.select(`#${newId}`)
            .append("svg")
            .attr("width", width+5)
            .attr("height", height+5)
            .append("g")
            .attr("transform", "translate(" + (width+5) / 2 + "," + (height+5) / 2 + ")");
    
        const path = svg.selectAll("path")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("stroke", colorPc) // Color del borde
            .attr("stroke-width", 1); // Ancho del borde
    
        path.transition() // Inicia la transición
            .duration(1000) // Duración de la transición en milisegundos
            .attrTween("d", function(d) { // Interpola los valores de 'd' para la transición
                var interpolate = d3.interpolate(prevPercentage.current / 100 * 2 * Math.PI, (percentage > 100 ? 100 : percentage) / 100 * 2 * Math.PI);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                }
            });
    
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("fill", colorText)
            .text(percentage + "%");

    }, [percentage]);

    return <div className='Large-f1_5 p_5' id={newId}></div>;
};

export default DonutChart;
