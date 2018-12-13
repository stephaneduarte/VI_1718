function makeBarChart() {
    d3.json('dataset/age.json').then(function(data) {

        var finaldata = [];
        for (i in data) {
            if (data[i].year == currYear){
                if (data[i].state == "USA") finaldata.push(JSON.parse(JSON.stringify(data[i])));
                for (e in selectedStates) {
                    if (selectedStates[e] == data[i].state) finaldata.push(JSON.parse(JSON.stringify(data[i])));
                }
            }
        }

        for (i in finaldata) {
            var temp_data = finaldata[i];
            var temp_total = temp_data.child + temp_data.teenager + temp_data.earlyadult + temp_data.adult + temp_data.senior;
            temp_data.child /= temp_total;
            temp_data.teenager /= temp_total;
            temp_data.earlyadult /= temp_total;
            temp_data.adult /= temp_total;
            temp_data.senior /= temp_total;
        }

        var initStackedBarChart = {
            draw: function(config) {
                me = this,
                domEle = config.element,
                stackKey = config.key,
                data = config.data,
                margin = {top: 0, right: 20, bottom: 30, left: 80},
                width = 700 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom,
                xScale = d3.scaleLinear().rangeRound([0, width]),
                yScale = d3.scaleBand().rangeRound([height, 0]).padding(0.1),
                xAxis = d3.axisBottom(xScale),
                yAxis =  d3.axisLeft(yScale),
                svg = d3.select("#"+domEle).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
                var stack = d3.stack()
                    .keys(stackKey)
                    .offset(d3.stackOffsetNone);
            
                var layers= stack(data);
                    yScale.domain(data.map(function(d) { return d.state; }));
                    xScale.domain([0, 1]).nice();

                function selectColor(key) {
                    if (key == "child") return '#cff09e';
                    else if (key == "teenager") return '#a8dba8';
                    else if (key == "earlyadult") return '#79bd9a';
                    else if (key == "adult") return '#3b8686';
                    else if (key == "senior") return '#0b486b';
                }
        
                var layer = svg.selectAll(".layer")
                    .data(layers)
                    .enter().append("g")
                    .attr("class", "layer")
                    .style("fill", function(d, i) { return selectColor(d.key); });
        
                layer.selectAll("rect")
                    .data(function(d) { return d; })
                    .enter().append("rect")
                    .attr("y", function(d) { return yScale(d.data.state); })
                    .attr("x", function(d) { return xScale(d[0]); })
                    .attr("height", yScale.bandwidth())
                    .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) });
            
                    /*svg.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + (height+5) + ")")
                    .call(xAxis);*/
        
                    svg.append("g")
                    .attr("class", "axis axis--y")
                    .attr("transform", "translate(0,0)")
                    .call(yAxis);							
            }
        }

        var key = ["child","teenager", "earlyadult", "adult","senior"];

        var this_chart = d3.select('#stacked-bar');
        this_chart.selectAll('*').remove();
        
        initStackedBarChart.draw({
            data: finaldata,
            key: key,
            element: 'stacked-bar'
        });
    });
}