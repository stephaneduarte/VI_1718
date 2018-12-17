function makeLineChart() {
    d3.json('dataset/line.json').then(function(data) {
        var finaldata = [];
        for (i in data) {
            if (data[i].measure == currMeasure && selectedStates.indexOf(data[i].state) > -1){
                finaldata.push(data[i]);
            }
            if (data[i].measure == currMeasure && data[i].state == "USA"){
                finaldata.push(data[i]);
            }
        }
        data = finaldata;
        
        var width = 650;
        var height = 220;
        var margin = 30;
        var marginy = 100;
        var duration = 250;
        
        var lineOpacity = "0.25";
        var lineOpacityHover = "0.85";
        var otherLinesOpacityHover = "0.25";
        var lineStroke = "3px";
        var lineStrokeHover = "4px";
        
        var circleOpacity = '0.85';
        var circleOpacityOnLineHover = "0.25"
        var circleRadius = 3;
        var circleRadiusHover = 6;
        
        
        /* Format Data */
        var parseDate = d3.timeParse("%Y");
        data.forEach(function(d) { 
            d.values.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value;    
            });
        });
        /* Scale */
        var xScale = d3.scaleTime()
            .domain(d3.extent(data[0].values, d => d.date))
            .range([0, width-marginy]);
        
        var max = 0;
        for (i in data) {
            for (e in data[i].values){
                if (data[i].values[e].value > max) max = data[i].values[e].value;
            }
        }
        var yScale = d3.scaleLinear()
            .domain([0, max])
            .range([height-margin, 0]);
        
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var this_chart = d3.select('#lineChart');
        this_chart.selectAll('*').remove();
        
        /* Add SVG */
        var svg = d3.select("#lineChart").append("svg")
            .attr("width", (width+marginy)+"px")
            .attr("height", (height+margin)+"px")
            .append('g')
            .attr("transform", `translate(${marginy}, ${margin})`);
        
        
        /* Add line into SVG */
        var line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));
        
        let lines = svg.append('g')
            .attr('class', 'lines');

        function tooltipHtml(arg1, arg2){	/* function to create html content string in tooltip div. */
            if (arg2) return "<table>"+
            "<tr><td>"+currMeasure.charAt(0).toUpperCase() + currMeasure.slice(1)+"</td><td>"+arg2+"</td></tr>"+
            "</table>";
            return "<h4>"+arg1+"</h4>"
        }

        lines.selectAll('.line-group')
            .data(data).enter()
            .append('g')
            .attr('class', 'line-group')  
            .on("mouseover", function(d, i) {
                /*svg.append("text")
                .attr("class", "title-text")
                .style("fill", color(i))        
                .text(d.state)
                .attr("text-anchor", "middle")
                .attr("x", (width-marginy)/2)
                .attr("y", 5);*/
                d3.select("#linechartTooltip").transition().duration(200).style("opacity", .9);
                d3.select("#linechartTooltip").html(tooltipHtml(d.state, null))  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select("#linechartTooltip").transition().duration(500).style("opacity", 0); 
                //svg.select(".title-text").remove();
            })
            .append('path')
            .attr('class', 'line')  
            .attr('d', d => line(d.values))
            .style('stroke', (d, i) => color(i))
            .style('opacity', lineOpacity)
            .on("mouseover", function(d) {
                d3.selectAll('.line')
                            .style('opacity', otherLinesOpacityHover);
                d3.selectAll('.circle')
                            .style('opacity', circleOpacityOnLineHover);
                d3.select(this)
                .style('opacity', lineOpacityHover)
                .style("stroke-width", lineStrokeHover)
                .style("cursor", "default");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".line")
                            .style('opacity', lineOpacity);
                d3.selectAll('.circle')
                            .style('opacity', circleOpacity);
                d3.select(this)
                .style("stroke-width", lineStroke)
                .style("cursor", "none");
            });
        
        
        /* Add circles in the line */
        lines.selectAll("circle-group")
            .data(data).enter()
            .append("g")
            .style("fill", (d, i) => color(i))
            .selectAll("circle")
            .data(d => d.values).enter()
            .append("g")
            .attr("class", "circle")  
            .on("mouseover", function(d) {
                d3.select(this)     
                .style("cursor", "default");
                /*.append("text")
                .attr("class", "text")
                .text(`${d.value}`)
                .attr("x", d => xScale(d.date) + 5)
                .attr("y", d => yScale(d.value) - 10);*/
                d3.select("#linechartTooltip").transition().duration(200).style("opacity", .9);
                d3.select("#linechartTooltip").html(tooltipHtml(d.state, d.value))  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this)
                .style("cursor", "none"); 
                /*.transition()
                .duration(duration)
                .selectAll(".text").remove();*/
                d3.select("#linechartTooltip").transition().duration(500).style("opacity", 0); 
            })
            .append("circle")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.value))
            .attr("r", circleRadius)
            .style('opacity', circleOpacity)
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadiusHover);
                })
            .on("mouseout", function(d) {
                d3.select(this) 
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadius);  
                });
        
        
        /* Add Axis into SVG */
        var xAxis = d3.axisBottom(xScale).ticks(5);
        var yAxis = d3.axisLeft(yScale).ticks(5);
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height-margin})`)
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append('text')
            .attr("y", 15)
            .attr("transform", "rotate(-90)")
            .attr("fill", "#000")
            .text("Total values");
    });
}