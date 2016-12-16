//Application Object

var app;

d3.json("graph.json", function(error, json) {
  if (error) return console.warn(error);
  app.init(json)
});

app = {
  data: {
    nodes: [],
    links: []
  },
  dataHistory: {
    nodes: [],
    links: []
  },

  btnData:[{'value':'Live'}],

  components: [],

  step: 0,

  init: function(data){

    //console.log(data)

    id = 0;

    app.data.nodes = data.nodes.map(function(d){
      return {x:d.x,y:d.y,id:id++,step:app.step,r:Math.floor(Math.random() * 10) + 10}
    });
    app.data.links = data.links;
    app.dataHistory.links = data.links

    //console.log(app.data.nodes[70].id)

    //console.log(app.data.nodes)

    app.components = [new controls('#controls')];
    app.components.push(new forceGraph('#forceGraph'));
    app.components.push(new forceGraphReview('#forceGraphReview'));

    //console.log(app.components)

  },

  createBtns: function(){
    app.components.forEach(function(c){if (c.create) {c.create();}});
  },

  jumpToReview: function(){
  if($('.live').hasClass('active')==false){
    $('#fg').addClass('hide');
    $('#fgReview').removeClass('hide');
    //$('.active').removeClass('active');
    app.components.forEach(function(c){if (c.launch) {c.launch();}});
  }
  else{
    $('.active').removeClass('active');
    $('#fgReview').addClass('hide');
    $('#fg').removeClass('hide');
  }
  }

}

controls = function(el){
  this.create();
}

controls.prototype = {

create: function(){

var mainButtons = d3.select('#controls')
        .selectAll('button')
        .data(app.btnData, function(d,i){return i})

mainButtons.enter()
        .append('button')
        .text(function(d,i){return d.value})
        .attr('class', function(d){if(d.value=='Live'){return 'btn btn-default live'} else {return 'btn btn-default'}})
        .on('click', function(){
          $(this).toggleClass('active');
          app.jumpToReview()});
  }

}

forceGraph = function(el){
  this.setup();
}

forceGraph.prototype = {

setup: function(){

var width = 1200
    height = 600

    this.update()

},

update: function(){

var width = 1200
    height = 600

var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(40)
    .on("tick", tick);

var drag = force.drag()
    .on("dragstart", dragstart);

var svg = d3.select("#fg").append("svg")
    .attr('id', 'liveGraph')
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

//console.log(app.data)

graph = app.data

console.log(graph.links)

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  link = link.data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  node1 = node.data(graph.nodes.filter(function(d,i){return i != 3}), function(d){return d.id})
    
  node1.enter().append("circle")
      .attr("class", "node pri")
      .attr("r", function(d){return d.r})
      .on("click", function(d,i){console.log(i)})
      .on("dblclick", dblclick)
      .call(drag);

  node2 = node.data(graph.nodes.filter(function(d,i){return i == 3}))
    .enter().append("polygon")
      .attr("class", "node pub")
      //.attr("points", function(d){return d.x+','+d.y+' '(d.x+5)+','+(d.y-10)+' '+(d.x+10)+','+d.y})
      .on("click", function(d,i){console.log(i)})

//console.log(graph.nodes.length);

function tick() {

  console.log('Inside Tick Function')
  //console.log(force.alpha())
  var colors = d3.scale.category10()

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node1.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  node2.attr("points", function(d){return (d.x-12)+','+(d.y+12)+' '+(d.x)+','+(d.y-12)+' '+(d.x+12)+','+(d.y+12);})
       .classed("fixed", function(d){d.fixed = true})

  if (force.alpha() < 0.05){
      force.stop();

      app.step += 1

      console.log(app.step)

      if(app.step==1){
  
      app.dataHistory.nodes = graph.nodes.map(function(d){
         return {x:d.x,y:d.y,id:d.id,step:app.step,r:d.r}
       })

      app.dataHistory.links = graph.links.map(function(d){
         return {x1:d.source.x,y1:d.source.y,x2:d.target.x,y2:d.target.y,step:app.step}
        })
      }

      else{
      app.dataHistory.nodes = app.dataHistory.nodes.concat(graph.nodes.map(function(d){
         return {x:d.x,y:d.y,id:d.id,step:app.step,r:d.r}
       }))
      app.dataHistory.links = app.dataHistory.links.concat(graph.links.map(function(d){
         return {x1:d.source.x,y1:d.source.y,x2:d.target.x,y2:d.target.y,step:app.step}
        }))
      }
   
      app.btnData.push({'value': app.step})

      app.createBtns();

      console.log(app.btnData)

      //console.log(app.dataHistory.nodes)
      //console.log(app.dataHistory.links)

      //console.log(app.data.nodes)

      console.log('DONE!!!')

    }
}

function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}
}
}

forceGraphReview = function(el){
  this.setup();
}

forceGraphReview.prototype = {

setup: function(){

var width = 1200
    height = 600

},

launch: function(){

var width = 1200
    height = 600

d3.select('#fgReview').select('svg').remove();

var colors = ["red", "blue", "green", "yellow", "purple", "orange"]

var selected = []

$('.active').each(function(){selected.push(parseInt($(this).text()))});

console.log(selected);

var svg = d3.select("#fgReview").append("svg")
    .attr('id', 'Review')
    .attr("width", width)
    .attr("height", height);

var fgrlink = svg.selectAll(".fgrlink"),
    fgrnode = svg.selectAll(".fgrnode");

  fgrlink = fgrlink.data(app.dataHistory.links.filter(function(d){return (selected.indexOf(d.step) > -1) }))
    .enter().append("line")
      .attr("class", "fgrlink");

  fgrnode1 = fgrnode.data(app.dataHistory.nodes.filter(function(d,i){return d.id != 3 && (selected.indexOf(d.step) > -1) }))
    
  fgrnode1.enter().append("circle")
      .attr("class", "fgrnode")
      .attr("r", function(d){return d.r;})
      .attr('fill',function(d){return colors[d.step]})
      .on("click", function(d,i){console.log(i)})

  fgrnode2 = fgrnode.data(app.dataHistory.nodes.filter(function(d,i){return d.id == 3 && (selected.indexOf(d.step) > -1) }))
    .enter().append("polygon")
      .attr("class", "node pub")
      //.attr("points", function(d){return d.x+','+d.y+' '(d.x+5)+','+(d.y-10)+' '+(d.x+10)+','+d.y})
      .on("click", function(d,i){console.log(d.id)})

  //console.log(force.alpha())
  var colors = d3.scale.category10()

  fgrlink.attr("x1", function(d) { return d.x1; })
      .attr("y1", function(d) { return d.y1; })
      .attr("x2", function(d) { return d.x2; })
      .attr("y2", function(d) { return d.y2; });

  fgrnode1.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  fgrnode2.attr("points", function(d){return (d.x-12)+','+(d.y+12)+' '+(d.x)+','+(d.y-12)+' '+(d.x+12)+','+(d.y+12);})

}
}
