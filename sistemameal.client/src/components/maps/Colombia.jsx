import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import data from './geojson/colombia.json'; // Asegúrate de que la ruta al archivo es correcta

const Colombia = () => {
    const ref = useRef();

    useEffect(() => {
        d3.select('#Colombia').html("");

        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610]);

        const width = ref.current.clientWidth;
        const height = ref.current.clientHeight;

        const projection = d3.geoMercator()
            .center([-80.1000, 8])
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

        const color = d3.scaleOrdinal(d3.schemeCategory10); // Puedes cambiar esto por la escala de colores que prefieras

        const tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                const rawNumber = 123; // Reemplaza esto con el número en crudo que quieras mostrar
                return `<strong> ${d.NOMBRE_DPT}</strong><br />Beneficiarios: ${rawNumber}`;
              });

        svg.call(tip);

        const colombias = g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => color(d.properties.NOMBRE_DPT))
            .attr('stroke', 'black')  // Esto establece el color del borde
            .attr('stroke-width', 1)  // Esto establece el grosor del borde
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#4682b4').style('cursor', 'pointer');
                const provinceData = event.srcElement.__data__.properties;
                tip.show(provinceData, this);
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', d => color(d.properties.NOMBRE_DPT));
                tip.hide();
            })
            .on('click', clicked);

            function clicked(event, d) {
                const [[x0, y0], [x1, y1]] = path.bounds(d);
                event.stopPropagation();
                colombias.transition().style('fill', null);
                d3.select(this).transition().style('fill', '#20737b');
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(Math.min(2, 12 / Math.max((x1 - x0) / width, (y1 - y0) / height )))
                        .translate(-(x0 + x1) / 3, -(y0 + y1) / 3),
                    d3.pointer(event, svg.node())
                );
            }
    }, []);

    return <svg id='Colombia' ref={ref} />;
};

export default Colombia;
