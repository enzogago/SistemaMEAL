import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import data from './geojson/colombia.json'; // Asegúrate de que la ruta al archivo es correcta

const Colombia = () => {
    const poblacionPorDepartamento = {
        'ANTIOQUIA': 6600000,
        'CUNDINAMARCA': 7700000,
        'VALLE DEL CAUCA': 4600000,
        'SANTAFE DE BOGOTA D.C': 4600000,
        'VICHADA': 4600000,
        'GUAINIA': 1000,
        // Añade aquí el resto de los departamentos
    };

    const color = d3.scaleOrdinal()
        .domain(Object.keys(poblacionPorDepartamento))
        .range(["#f0554d", "#ff7a54", "#ffad75"]);

    const ref = useRef();

    useEffect(() => {
        d3.select('#Colombia').html("");

        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610])
            .style('background', '#1d6776')
            .style('border-radius', '5px');

        const width = ref.current.clientWidth;
        const height = ref.current.clientHeight;

        const projection = d3.geoMercator()
            .center([-78.1000, 7])
            .scale(3000)
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
                const poblacion = poblacionPorDepartamento[d.NOMBRE_DPT] || 'No disponible';
                return `<strong> ${d.NOMBRE_DPT}</strong><br />Población: ${poblacion}`;
            });

        svg.call(tip);

        const departamentos = g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => poblacionPorDepartamento[d.properties.NOMBRE_DPT] ? color(poblacionPorDepartamento[d.properties.NOMBRE_DPT]) : '#fde7bd')
            .attr('stroke', 'black') 
            .attr('stroke-width', 1) 
            .on('mouseover', function(event, d) {
                d3.select(this).style('cursor', 'pointer');
                if (poblacionPorDepartamento[d.properties.NOMBRE_DPT]) {
                    d3.select(this)
                        .transition()  // Inicia una transición
                        .duration(200)  // Duración de la transición en milisegundos
                        .attr('fill', '#ffc459');  // Color final de la transición
                    const paisData = event.srcElement.__data__.properties;
                    tip.show(paisData, this);
                } 
            })
            .on('mouseout', function(d) {
                if (poblacionPorDepartamento[d.srcElement.__data__.properties.NOMBRE_DPT]) {
                    d3.select(this)
                    .transition()  // Inicia una transición
                    .duration(200)  // Duración de la transición en milisegundos
                    .attr('fill', d => color(poblacionPorDepartamento[d.properties.NOMBRE_DPT] || 0));  // Color final de la transición
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
                return capitalize(d.properties.NOMBRE_DPT);
            })
            .attr("x", function(d) {
                return path.centroid(d)[0];
            })
            .attr("y", function(d) {
                return path.centroid(d)[1];
            })
            .attr("text-anchor","middle")
            .attr('font-size', d => poblacionPorDepartamento[d.properties.NOMBRE_DPT] ? '1rem' : '0.75rem')
            .attr('font-weight', d => poblacionPorDepartamento[d.properties.NOMBRE_DPT] ? 'bold' : '')
            .attr('fill', d => poblacionPorDepartamento[d.properties.NOMBRE_DPT] ? '#000' : '#000');

            function clicked(event, d) {
                const [[x0, y0], [x1, y1]] = path.bounds(d);
                event.stopPropagation();
                departamentos.transition().style('fill', null);
                if (poblacionPorDepartamento[d.properties.NOMBRE_DPT]) {
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

    return <svg id='Colombia' ref={ref} />;
};

export default Colombia;
