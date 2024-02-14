import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import data from './geojson/paises.json'; // Asegúrate de que la ruta al archivo es correcta

const Paises = () => {
    const poblacionPorPais = {
        'Peru': 33000000,
        'Ecuador': 17000000,
        'Colombia': 50000000,
        // Agrega más países según sea necesario
    };

    const color = d3.scaleSequential()
        .domain([0, d3.max(Object.values(poblacionPorPais))])  // El dominio va desde 0 hasta la población máxima
        .interpolator(d3.interpolateOranges);  // Usa el interpolador que prefieras
    
    console.log(data)
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', [0, 0, 975, 610]);

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        const projection = d3.geoMercator()
            .center([-90.4678, 4.911])
            .scale(1000)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);


        const tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                const poblacion = poblacionPorPais[d.name] || 'No disponible';
                return `<strong>${d.name}</strong><br />Beneficiarios: ${poblacion}`;
              });

        svg.call(tip);

        svg.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => color(poblacionPorPais[d.properties.name] || 0))  // Usa la población del país para determinar el color
            .attr('stroke', 'black')  // Esto establece el color del borde
            .attr('stroke-width', 1)  // Esto establece el grosor del borde
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', 'blue');
                const paisData = event.srcElement.__data__.properties;
                tip.show(paisData, this);
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', d => color(poblacionPorPais[d.properties.name] || 0));
                tip.hide();
            });

    }, []);

    return <svg ref={ref} style={{width: '100%', height: 'auto'}} />;
};

export default Paises;
