import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import ecuadorData from './geojson/ecuador.json'; // Asegúrate de que la ruta al archivo es correcta
import { formatter } from '../monitoring/goal/helper';

const Ecuador = ({mapData, beneficiariosData}) => {
    // Combina los datos de ubicación y beneficiarios
    const combinedData = mapData.map(ubicacion => {
        const beneficiario = beneficiariosData.find(b => b.ubiNom === ubicacion.ubiNom);
        return {
            ...ubicacion,
            cantidad: beneficiario ? beneficiario.cantidad : 0
        };
    });

    // Crea un objeto con los datos de población por provincia
    const poblacionPorProvincia = combinedData.reduce((obj, item) => {
        obj[item.ubiNom] = item;
        return obj;
    }, {});

    const color = d3.scaleOrdinal()
        .domain(Object.keys(poblacionPorProvincia))
        .range(["#f0554d", "#ff7a54", "#ffad75"]);

    const ref = useRef();

    function formatNumber(num) {
        num = parseFloat(num);
        if (isNaN(num)) return "0.00";
    
        let [whole, decimal] = num.toFixed(2).split(".");
        whole = whole.padStart(2, '0');
        return `${whole}.${decimal}`;
    }

    useEffect(() => {
        d3.select('#Ecuador').html("");

        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610])
            .style('background', '#1d6776')
            .style('border-radius', '5px');

            const width = ref.current.clientWidth;
            const height = ref.current.clientHeight;

        const projection = d3.geoMercator()
            .center([-81.1000, -0.6])
            .scale(5800)
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
                const data = poblacionPorProvincia[d.province.toUpperCase()] || {};
                const { cantidad, metMetTec, metEjeTec, metMetPre, metEjePre, metPorAvaTec, metPorAvaPre } = data;
                return `
                <div style="z-index: 100;">
                    <p class="center Large-f1_25 bold">${d.province.toUpperCase()}</p>
                    <p>Beneficiarios: ${formatter.format(Number(cantidad))} </p>
                    <p>Atenciones: ${formatter.format(metEjeTec)}</p>
                    <hr style="border:1px solid #fff;margin: 0.5rem 0" />
                    <p class="" style="text-decoration: underline;">Técnico</p>
                    <p>Meta: ${formatter.format(metMetTec)} </p>
                    <p>Ejecución: ${formatter.format(metEjeTec)} </p>
                    <p>Avance: ${formatNumber(metEjeTec/metMetTec*100)}% </p>
                    <hr style="border:1px solid #fff;margin: 0.5rem 0" />
                    <p style="text-decoration: underline;">Presupuesto</p>
                    <p>Meta: $${formatter.format(metMetPre)} </p>
                    <p>Ejecución: $${formatter.format(metEjePre)} </p>
                    <p>Avance: ${formatNumber(metEjePre/metMetPre*100)}% </p>
                </div>
                `;
            });

        svg.call(tip);

        const provincias = g.selectAll('path')
            .data(ecuadorData.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => poblacionPorProvincia[d.properties.province.toUpperCase()] ? color(poblacionPorProvincia[d.properties.province.toUpperCase()]) : '#fde7bd')
            .attr('stroke', 'black')  // Esto establece el color del borde
            .attr('stroke-width', 1)  // Esto establece el grosor del borde
            .on('mouseover', function(event, d) {
                d3.select(this).style('cursor', 'pointer');
                if (poblacionPorProvincia[d.properties.province.toUpperCase()]) {
                    d3.select(this)
                        .transition()  // Inicia una transición
                        .duration(200)  // Duración de la transición en milisegundos
                        .attr('fill', '#ffc459');  // Color final de la transición
                    const paisData = event.srcElement.__data__.properties;
                    tip.show(paisData, this);
                } 
            })
            .on('mouseout', function(d) {
                if (poblacionPorProvincia[d.srcElement.__data__.properties.province.toUpperCase()]) {
                    d3.select(this)
                    .transition()  // Inicia una transición
                    .duration(200)  // Duración de la transición en milisegundos
                    .attr('fill', d => color(poblacionPorProvincia[d.properties.province.toUpperCase()] || 0));  // Color final de la transición
                }
                tip.hide();
            })
            .on('click', clicked);

            // Agrega las etiquetas de texto aquí
            g.selectAll("text")
            .data(ecuadorData.features)
            .enter()
            .append("text")
            .text(function(d) {
                return poblacionPorProvincia[d.properties.province.toUpperCase()] ? capitalize(d.properties.province.toUpperCase()) : '';
            })
            .attr("x", function(d) {
                return path.centroid(d)[0];
            })
            .attr("y", function(d) {
                return path.centroid(d)[1];
            })
            .attr("text-anchor","middle")
            .attr('font-size', d => poblacionPorProvincia[d.properties.province.toUpperCase()] ? '1rem' : '0.75rem')
            .attr('font-weight', d => poblacionPorProvincia[d.properties.province.toUpperCase()] ? 'bold' : '')
            .attr('fill', d => poblacionPorProvincia[d.properties.province.toUpperCase()] ? '#000' : '#000');

            function clicked(event, d) {
                const [[x0, y0], [x1, y1]] = path.bounds(d);
                event.stopPropagation();
                provincias.transition().style('fill', null);
                if (poblacionPorProvincia[d.properties.province.toUpperCase()]) {
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
    }, [mapData, beneficiariosData]);

    return (
        <div className='Small-relative' style={{width: '100%', height: '100%'}}>
           <svg id='Ecuador' ref={ref} style={{width: '100%', height: '100%', position: 'absolute'}} />
       </div>)
};

export default Ecuador;
