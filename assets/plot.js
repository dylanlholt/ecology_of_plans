var width = 1000,
    height = 700;

var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(40)
    .on("tick", tick);

var drag = force.drag()
    .on("dragstart", dragstart);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("graph.json", function(error, graph) {
  if (error) throw error;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  link = link.data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  node1 = node.data(graph.nodes.filter(function(d,i){return i != 23 && i != 11 && i != 59}))
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .on("click", function(d,i){console.log(i)})
      .on("dblclick", dblclick)
      .call(drag);

  node2 = node.data(graph.nodes.filter(function(d,i){return i == 23 || i == 11 || i == 59}))
    .enter().append("polygon")
      .attr("class", "node")
      .attr("fill","blue")
      //.attr("points", function(d){return d.x+','+d.y+' '(d.x+5)+','+(d.y-10)+' '+(d.x+10)+','+d.y})
      .on("click", function(d,i){console.log(i)})
});

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node1.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  node2.attr("points", function(d){return (d.x-12)+','+(d.y+12)+' '+(d.x)+','+(d.y-12)+' '+(d.x+12)+','+(d.y+12);})
       .classed("fixed", function(d){d.fixed = true})
}

function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}