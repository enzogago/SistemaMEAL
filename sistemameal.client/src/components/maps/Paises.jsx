import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import data from './geojson/paises.json';

const Paises = () => {
    const poblacionPorPais = {
        'Peru': 33000000,
        'Ecuador': 17000000,
        'Colombia': 50000000,
    };

    const color = d3.scaleSequential()
        .domain([0, d3.max(Object.values(poblacionPorPais))])
        .interpolator(d3.interpolateGreens);
    
    const ref = useRef();

    useEffect(() => {
        d3.select('#Paises').html("");

        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610]);
        
        const width = ref.current.clientWidth;
        const height = ref.current.clientHeight;

        const projection = d3.geoMercator()
            .center([-88.4678, 4.911])
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
                return `<strong>${d.name}</strong><br />Beneficiarios: ${poblacion}`;
            });

        svg.call(tip);

        const countries = g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => color(poblacionPorPais[d.properties.name] || 0))  // Usa la población del país para determinar el color
            .attr('stroke', 'black')  // Esto establece el color del borde
            .attr('stroke-width', 1)  // Esto establece el grosor del borde
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#20737b').style('cursor', 'pointer');
                const paisData = event.srcElement.__data__.properties;
                tip.show(paisData, this);
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', d => color(poblacionPorPais[d.properties.name] || 0));
                tip.hide();
            })
            .on('click', clicked);

        function clicked(event, d) {
            const [[x0, y0], [x1, y1]] = path.bounds(d);
            event.stopPropagation();
            countries.transition().style('fill', null);
            d3.select(this).transition().style('fill', '#20737b');
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(2, 10 / Math.max((x1 - x0) / width, (y1 - y0) / height )))
                    .translate(-(x0 + x1) / 3, -(y0 + y1) / 3),
                d3.pointer(event, svg.node())
            );
        }
    }, []);

    return <svg id='Paises' ref={ref} />;
};

export default Paises;
