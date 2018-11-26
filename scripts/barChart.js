function makeBarChart() {
  d3.json('dataset/age.json').then(function(data) {

    // manipulate the data into stacked series
    var stack = d3.stack()
      .keys(Object.keys(data[0]).filter(function(k) { return k !== 'state' && k != 'year'; }));

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

    var series = stack(finaldata);

    var color = d3.scaleOrdinal()
      .domain(series.map(function(s) {
        return s.key;
      }))
      .range(['#cff09e', '#a8dba8', '#79bd9a', '#3b8686', '#0b486b']);

    var legend = d3.legendColor()
      .shapeWidth(70)
      .orient('horizontal')
      .scale(color);

    var barSeries = fc.seriesSvgBar()
      .orient('horizontal')
      .bandwidth(40)
      .crossValue(function(d) { return d.data.state; })
      .mainValue(function(d) { return d[1]; })
      .baseValue(function(d) { return d[0]; });

    var multi = fc.seriesSvgMulti()
      .mapping(function(data, index) { return data[index]; })
      .series(series.map(function() { return barSeries; }))
      .decorate(function(selection) {
        selection.each(function(data, index, nodes) {
          d3.select(this)
            .selectAll('g.bar')
            .attr('fill', color(series[index].key))
        });
      })

    var xExtent = fc.extentLinear()
      .accessors([function(a) {
        return a.map(function(d) { return d[1]; });
      }])
      .pad([0, 1])
      .padUnit('domain');

    var chart = fc.chartSvgCartesian(
        d3.scaleLinear(),
        d3.scalePoint())
      .xDomain([0,1])
      .yDomain(finaldata.map(function(entry) {
        return entry.state;
      }))
      .yOrient('left')
      .yPadding([0.5])
      .plotArea(multi)
      .decorate(function(selection, finaldata, index) {
        // append an svg for the d3-legend
        selection.enter()
          .append('svg')
          .attr('class', 'legend');

        // render the legend
        selection.select('svg.legend')
          .call(legend);
      });

    var this_chart = d3.select('#stacked-chart');
    this_chart.selectAll('*').remove();

    d3.select('#stacked-chart')
      .text(null) // Remove the loading text from the container
      .datum(series)
      .call(chart);
  });
}