import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import data from './geojson/paises.json';

const Paises = () => {
    const poblacionPorPais = {
        'Peru': 33000000,
        'Ecuador': 17000000,
        'Colombia': 48000000,
    };

    const color = d3.scaleOrdinal()
        .domain(Object.keys(poblacionPorPais))
        .range(["#f0554d", "#ff7a54", "#ffad75"]);

    const ref = useRef();

    useEffect(() => {
        d3.select('#Paises').html("");

        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610])
            .style('background', '#1d6776')
            .style('border-radius', '5px');
        
        const width = ref.current.clientWidth;
        const height = ref.current.clientHeight;

        const projection = d3.geoMercator()
            .center([-84.4678, 2.911])
            .scale(1200)
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
            .offset([0, 0])
            .html(function(d) {
                const poblacion = poblacionPorPais[d.name] || 'No disponible';
                return `
                <div style="z-index: 100;">
                    <p class="center Large-f1_25 bold">${d.name}</p><br />
                    <p>Beneficiarios: ${poblacion} </p>
                    <p>Atenciones:</p>
                    <hr style="border:1px solid #fff;" />
                    <p class="" style="text-decoration: underline;">Técnico</p>
                    <p>Meta:</p>
                    <p>Ejecución:</p>
                    <p>Avance:</p>
                    <hr style="border:1px solid #fff;" />
                    <p style="text-decoration: underline;">Presupuesto</p>
                    <p>Meta:</p>
                    <p>Ejecución:</p>
                    <p>Avance:</p>
                </div>
                `;
            });

        svg.call(tip);

        const countries = g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => poblacionPorPais[d.properties.name] ? color(poblacionPorPais[d.properties.name]) : '#fde7bd')
            .attr('stroke', 'black')  // Esto establece el color del borde
            .attr('stroke-width', 1)  // Esto establece el grosor del borde
            .on('mouseover', function(event, d) {
                d3.select(this).style('cursor', 'pointer');
                if (poblacionPorPais[d.properties.name]) {
                    d3.select(this)
                        .transition()  // Inicia una transición
                        .duration(200)  // Duración de la transición en milisegundos
                        .attr('fill', '#ffc459');  // Color final de la transición
                    const paisData = event.srcElement.__data__.properties;
                    tip.show(paisData, this);
                } 
            })
            .on('mouseleave', function(d) {
                if (poblacionPorPais[d.srcElement.__data__.properties.name]) {
                    d3.select(this)
                    .transition()  // Inicia una transición
                    .duration(200)  // Duración de la transición en milisegundos
                    .attr('fill', d => color(poblacionPorPais[d.properties.name] || 0));  // Color final de la transición
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
            return d.properties.name;
        })
        .attr("x", function(d) {
            return path.centroid(d)[0];
        })
        .attr("y", function(d) {
            return path.centroid(d)[1];
        })
        .attr("text-anchor","middle")
        .attr('font-size', d => poblacionPorPais[d.properties.name] ? '1.25rem' : '1rem')
        .attr('font-weight', d => poblacionPorPais[d.properties.name] ? 'bold' : '')
        .attr('fill', d => poblacionPorPais[d.properties.name] ? '#000' : '#000');


        function clicked(event, d) {
            const [[x0, y0], [x1, y1]] = path.bounds(d);
            event.stopPropagation();
            countries.transition().style('fill', null);
            if (poblacionPorPais[d.properties.name]) {
                d3.select(this).transition().style('fill', '#ffc459');
            }
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(1.7, 8 / Math.max((x1 - x0) / width, (y1 - y0) / height )))
                    .translate(-(x0 + x1) / 3, -(y0 + y1) / 3),
                d3.pointer(event, svg.node())
            );
        }
    }, []);

    return <svg id='Paises' ref={ref} />;
};

export default Paises;
