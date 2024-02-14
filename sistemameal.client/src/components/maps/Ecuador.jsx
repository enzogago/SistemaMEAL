import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import ecuadorData from './geojson/ecuador.json'; // Asegúrate de que la ruta al archivo es correcta

const Ecuador = () => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610]);

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        const projection = d3.geoMercator()
            .center([-81.1000, -0.5])
            .scale(5000)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const color = d3.scaleOrdinal(d3.schemeCategory10); // Puedes cambiar esto por la escala de colores que prefieras

        const tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                const rawNumber = 123; // Reemplaza esto con el número en crudo que quieras mostrar
                return `<strong> ${d.province}</strong><br />${rawNumber}`;
              });

        svg.call(tip);

        svg.selectAll('path')
            .data(ecuadorData.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => color(d.properties.province))
            .attr('stroke', 'black')  // Esto establece el color del borde
            .attr('stroke-width', 1)  // Esto establece el grosor del borde
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#4682b4');
                const provinceData = event.srcElement.__data__.properties;
                tip.show(provinceData, this);
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', d => color(d.properties.province));
                tip.hide();
            });
    }, []);

    return <svg ref={ref} style={{width: '100%', height: 'auto'}} />;
};

export default Ecuador;