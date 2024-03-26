import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import data from './geojson/peru.json'; // Asegúrate de que la ruta al archivo es correcta

const Peru = () => {

    const poblacionPorDepartamento = {
        'UCAYALI': 5600000,
        'LIMA': 6600000,
        'LA LIBERTAD': 4600000,
        // Añade aquí el resto de los departamentos
    };

    const color = d3.scaleOrdinal()
        .domain(Object.keys(poblacionPorDepartamento))
        .range(["#f0554d", "#ff7a54", "#ffad75"]);

    const ref = useRef();

    useEffect(() => {
        d3.select('#Peru').html("");

        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610])
            .style('background', '#1d6776')
            .style('border-radius', '5px');

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        const projection = d3.geoMercator()
            .center([-80.1000, -6])
            .scale(2300)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const g = svg.append('g');

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        const tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                console.log(d)
                const poblacion = poblacionPorDepartamento[d.NOMBDEP] || 'No disponible';
                return `<strong> ${d.NOMBDEP}</strong><br />Población: ${poblacion}`;
            });

        svg.call(tip);

        const departamentos = g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => poblacionPorDepartamento[d.properties.NOMBDEP] ? color(poblacionPorDepartamento[d.properties.NOMBDEP]) : '#fde7bd')
            .attr('stroke', 'black')  // Esto establece el color del borde
            .attr('stroke-width', 1)  // Esto establece el grosor del borde
            .on('mouseover', function(event, d) {
                d3.select(this).style('cursor', 'pointer');
                if (poblacionPorDepartamento[d.properties.NOMBDEP]) {
                    d3.select(this)
                        .transition()  // Inicia una transición
                        .duration(200)  // Duración de la transición en milisegundos
                        .attr('fill', '#ffc459');  // Color final de la transición
                    const paisData = event.srcElement.__data__.properties;
                    tip.show(paisData, this);
                } 
            })
            .on('mouseout', function(d) {
                if (poblacionPorDepartamento[d.srcElement.__data__.properties.NOMBDEP]) {
                    d3.select(this)
                    .transition()  // Inicia una transición
                    .duration(200)  // Duración de la transición en milisegundos
                    .attr('fill', d => color(poblacionPorDepartamento[d.properties.NOMBDEP] || 0));  // Color final de la transición
                }
                tip.hide();
            })
            .on('click', clicked);

            // Agrega las etiquetas de texto aquí
            g.selectAll("text")
            .data(data.features)
            .enter()
            .append("text")
            .text(function(d) {
                return poblacionPorDepartamento[d.properties.NOMBDEP] ? capitalize(d.properties.NOMBDEP) : '';
            })
            .attr("x", function(d) {
                return path.centroid(d)[0];
            })
            .attr("y", function(d) {
                return path.centroid(d)[1];
            })
            .attr("text-anchor","middle")
            .attr('font-size', d => poblacionPorDepartamento[d.properties.NOMBDEP] ? '1rem' : '0.75rem')
            .attr('font-weight', d => poblacionPorDepartamento[d.properties.NOMBDEP] ? 'bold' : '')
            .attr('fill', d => poblacionPorDepartamento[d.properties.NOMBDEP] ? '#000' : '#000');

            function clicked(event, d) {
                const [[x0, y0], [x1, y1]] = path.bounds(d);
                event.stopPropagation();
                departamentos.transition().style('fill', null);
                if (poblacionPorDepartamento[d.properties.NOMBDEP]) {
                    d3.select(this).transition().style('fill', '#ffc459');
                }
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(Math.min(2, 12 / Math.max((x1 - x0) / width, (y1 - y0) / height )))
                        .translate(-(x0 + x1) / 2.5, -(y0 + y1) / 2.5),
                    d3.pointer(event, svg.node())
                );
            }
 
            function capitalize(str) {
                return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            }
    }, []);

    
    return (
     <div style={{width: '100%', height: '100%', position: 'relative'}}>
        <svg id='Peru' ref={ref} style={{width: '100%', height: '100%', position: 'absolute'}} />
    </div>)
};

export default Peru;
