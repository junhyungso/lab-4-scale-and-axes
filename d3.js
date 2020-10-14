d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{

    const margin = {top: 20, right: 20, bottom: 20, left: 20}
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('.chart').append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d=>d.Income))
                    .range([0, width]);
    const yScale = d3.scaleLinear()
                    .domain(d3.extent(data, d=>d.LifeExpectancy))
                    .range([height, 0]);

    const xAxis = d3.axisBottom().scale(xScale)
        .ticks(5, "s");

    const yAxis = d3.axisLeft().scale(yScale)
        .ticks(5, "s");    

    const uniqueRegion = [...new Set(data.map(d=>d.Region))];

    const colorScale =  d3.scaleOrdinal(d3.schemeTableau10)
        .domain(uniqueRegion);

    svg.append("g")
			.attr("class", "axis x-axis")
			.call(xAxis)
			.attr("transform", `translate(0, ${height})`);
    
    svg.append("g")
			.attr("class", "axis y-axis")
			.call(yAxis)
			.attr("transform", `translate(0 , 0)`);
    
    svg.append("text")
        .attr('x', width - 70)
        .attr('y', height - 10)
        .text("Income")  
        .attr("font-size", "14px")
        
    svg.append("text")
        .attr('x', -10)
        .attr('y', -10)
        .attr('text-anchor', 'front')
        .text("Life Expectancy")
        .attr("transform", d => "rotate(90)")
        .attr("font-size", "14px")
		        
    svg.selectAll('.income')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', d=>colorScale(d.Region))
        .attr('stroke', 'black')
        .attr('opacity', 0.7)
        .attr('class', 'income')
        .attr('r', d=>d.Population >1000000000 ? 20 : d.Population < 31000000 ? 4 : 8)
        .attr('cx', d=> xScale(d.Income))
				.attr('cy', d=> yScale(d.LifeExpectancy))

        .on("mouseenter", (event, d) => {

            const pos = d3.pointer(event, window);

            d3.select("#tooltip")
            .style("left", pos[0] + "px")
            .style("top", pos[1] + "px")
            .select("#value")
            .html(
                "Country: " + d.Country + "<br>" +
                "Region: " + d.Region + "<br>" +
                "Population: " + d.Population + "<br>" +
                "Income: " + d.Income + "<br>" +
                "Life Expectancy: " + d.LifeExpectancy)
            d3.select("#tooltip").classed("hidden", false);
        })

        .on("mouseleave", (event, d) => {
            d3.select("#tooltip").classed("hidden", true);

		})

    svg.selectAll("rectangle")
    .data(uniqueRegion)
    .enter()
    .append('rect')
    .attr('x', width-200)
    .attr('y', (d,i) => 270 + i*(25))
    .attr("width", 20)
    .attr("height", 20)
    .attr('fill', d=>colorScale(d))

    svg.selectAll("labels")
    .data(uniqueRegion)
    .enter()
    .append('text')
    .attr('x', width-170)
    .attr('y', (d,i) => 285 + i*(25))
    .text(d=>d)

});