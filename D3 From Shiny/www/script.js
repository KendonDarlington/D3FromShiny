//Code comes from https://bl.ocks.org/mbostock/1389927

//Wrap the entire D3 script in this function. It is looking for a jsondata message sent from Shinys server session object.
Shiny.addCustomMessageHandler('jsondata', function(message) {
    //Lets nuke out any thing on our page with the id of "d3Graph". This will prevent 
    //our app from making a new graph each time a parameter is changed
    d3.select("#d3Graph").remove();

    //The message comes from shiny, it is the json payload from our session
    var data = message;

    //Set the margin, width, and height of the D3 SVG
    var m = [30, 10, 10, 100],
        w = 960 - m[1] - m[3],
        h = 600 - m[0] - m[2];

    var format = d3.format(",.0f");

    //Set the axis
    var x = d3.scale.linear().range([0, w]),
        y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

    var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h),
        yAxis = d3.svg.axis().scale(y).orient("left");//.tickSize(0);

    //This is the shell of the SVG. It gets the id of "d3Graph". Every time this script is called
    //it will nuke out any svg named d3graph and create a new one.     
    var svg = d3.select("body").append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .attr("id", "d3Graph")
        .append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    //We have a d3 graph, but we need to bind data to it. 
    data.forEach(function(d) {
        d.name  =  d.name;
        d.value = +d.value;
      });

    data.sort(function(a, b) { return b.value - a.value; });

    //Set the scale.
    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return d.name; }));

    //Make the chart
    var bar = svg.selectAll("g.bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

    bar.append("rect")
        .attr("width", function(d) { return x(d.value); })
        .attr("height", y.rangeBand());

    //Labels are good.         
    bar.append("text")
        .attr("class", "value")
        .attr("x", function(d) { return x(d.value); })
        .attr("y", y.rangeBand() / 2)
        .attr("dx", -3)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return format(d.value); });

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
});