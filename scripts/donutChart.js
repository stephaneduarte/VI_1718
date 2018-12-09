function donutChart() {
    var width,
        height,
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
        variable, // value in data that will dictate proportions on chart
        category, // compare data by
        padAngle, // effectively dictates the gap between slices
        floatFormat = d3.format('.4r'),
        cornerRadius, // sets how rounded the corners are on each slice
        percentFormat = d3.format(',.2%');

    function genderColour(gender) {
        if (gender == "Male") return '#0b486b';
        else if (gender == "Female") return '#DE3163';
    }

    function chart(selection){
        selection.each(function(data) {
            //for (i in data) {
            // generate chart

            // ===========================================================================================
            // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
            var radius = Math.min(width, height) / 2;

            // creates a new pie generator
            var pie = d3.pie()
                .value(function(d) { return floatFormat(d[variable]); })
                .sort(null);

            // contructs and arc generator. This will be used for the donut. The difference between outer and inner
            // radius will dictate the thickness of the donut
            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.6)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // ===========================================================================================

            // ===========================================================================================
            // append the svg object to the selection
            var svg = selection.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
            // ===========================================================================================

            // ===========================================================================================
            svg.append('g').attr('class', 'slices');
            // ===========================================================================================

            // ===========================================================================================
            // add and colour the donut slices
            /*USA*/
            var finaldata = [];
            for (e in data){
                if (data[e].State == "USA"){
                    finaldata.push(data[e]);
                }
            }
            var path = svg.select('.slices')
                .datum(finaldata).selectAll('path')
                .data(pie)
                .enter().append('path')
                .attr('fill', function(d) { return genderColour(d.data[category]); })
                .attr('d', arc);

            for (i in selectedStates){
                var finaldata = [];
                for (e in data){
                    if (data[e].State == selectedStates[i]){
                        finaldata.push(data[e]);
                    }
                }
                var path = svg.select('.slices')
                    .datum(finaldata).selectAll('path')
                    .data(pie)
                    .enter().append('path')
                    .attr('fill', function(d) { return genderColour(d.data[category]); })
                    .attr('d', arc);
            }
            
            // ===========================================================================================
            // add tooltip to mouse events on slices and labels
            d3.selectAll('.labelName text, .slices path').call(toolTip);
            // ===========================================================================================
            //}
            // ===========================================================================================
            // Functions

            // calculates the angle for the middle of a slice
            //function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

            // function that creates and adds the tool tip to a selected element
            function toolTip(selection) {

                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', function (data) {

                    svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html(toolTipHTML(data)) // add text to the circle.
                        .style('font-size', '.9em')
                        .style('text-anchor', 'middle'); // centres text in tooltip

                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.4) // radius of tooltip circle
                        .style('fill', genderColour(data.data[category])) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);

                });

                // remove the tooltip when mouse leaves the slice/label
                selection.on('mouseout', function () {
                    d3.selectAll('.toolCircle').remove();
                });
            }

            // function to create the HTML string for the tool tip. Loops through each key in data object
            // and returns the html string key: value
            function toolTipHTML(data) {

                var tip = '',
                    i   = 0;

                for (var key in data.data) {

                    // if value is a number, format it as a percentage
                    var value = (!isNaN(parseFloat(data.data[key]))) ? percentFormat(data.data[key]) : data.data[key];

                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                    else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                    i++;
                }

                return tip;
            }
            // ===========================================================================================

        });
    }

    // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function(value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function(value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.colour = function(value) {
        if (!arguments.length) return colour;
        colour = value;
        return chart;
    };

    chart.variable = function(value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function(value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}

function treatData(finaldata, data) {
    finaldata.push({"State":data.state, "Gender":"Male", "Percentage":data.male.replace(/,/g, '.') / 100},
                    {"State":data.state, "Gender":"Female","Percentage":data.female.replace(/,/g, '.') / 100});
}

var donut = donutChart()
        .width(Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2)
        .height(400)
        .cornerRadius(3) // sets how rounded the corners are on each slice
        .padAngle(0.015) // effectively dictates the gap between slices
        .variable('Percentage')
        .category('Gender');

function drawChart(data) {
    d3.select("#donutChart")
        .datum(data) // bind data to the div
        .call(donut); // draw chart in div
}

function makeDonutChart() {
    var this_chart = d3.select('#donutChart');
    this_chart.selectAll('*').remove();

    d3.json('dataset/gender.json').then(function (data)  {
        var finaldata = [];
    
        for (i in data) {
            if (data[i].year == currYear) {
                if (data[i].state == "USA"){
                    this.treatData(finaldata, data[i]);
                }
                for (e in selectedStates) {
                    if (data[i].state == selectedStates[e]) {
                        this.treatData(finaldata, data[i]);
                    }
                }
            }
        }
        drawChart(finaldata);
    });
}