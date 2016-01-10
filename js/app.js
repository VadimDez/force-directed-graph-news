/**
 * Created by vadimdez on 10/01/16.
 */
(function () {
  var width = 960;
  var height = 500;
  var animationStep = 400;
  var force = null;
  var nodes = null;
  var links = null;

  var $svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var initForce = function () {
    var dataNodes = [
      { x:   width/3, y:   height/3 },
      { x: 2*width/3, y:   height/3 },
      { x:   width/2, y: 2*height/3 }
    ];
    var dataLinks = [
      { source: 0, target: 1, className: 'red'},
      { source: 1, target: 2},
      { source: 2, target: 0}
    ];

    $svg.selectAll('*').remove();

    force = d3.layout.force()
      .size([width, height])
      .nodes(dataNodes)
      .links(dataLinks);

    force
      .linkDistance(height / 2)
      .linkStrength(function (link) {
        if (link.className === 'link') {
          return 0.1;
        }

        return 1;
      });

    function setClass(defaultClass) {
      return function (d) {

        if (d.className) {
          return defaultClass + ' ' + d.className;
        }

        return defaultClass;
      }
    }

    links = $svg.selectAll('.link')
      .data(dataLinks)
      .enter()
      .append('line')
      .attr('class', setClass('link'))
      .attr('x1', function (d) {
        return dataNodes[d.source].x;
      })
      .attr('y1', function (d) {
        return dataNodes[d.source].y;
      })
      .attr('x2', function (d) {
        return dataNodes[d.target].x;
      })
      .attr('y2', function (d) {
        return dataNodes[d.target].y;
      });

    nodes = $svg.selectAll('.node')
      .data(dataNodes)
      .enter()
      .append('circle')
      .attr('class', setClass('node'))
      .attr('r', width / 25)
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y
      });

    force.on('tick', stepForce)
  };

  var stepForce = function () {
    if (force.fullSpeed) {
      nodes
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });

      links
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

    } else {
      nodes
        .transition()
        .ease('linear')
        .duration(animationStep)
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });

      links
        .transition()
        .ease('linear')
        .duration(animationStep)
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      force.stop();


      if (force.slowMotion) {
        setTimeout(function () {
          force.start();
        }, animationStep)
      }
    }
  };

  d3.select('#advance').on('click', function() {
    force.start();
  });

  d3.select('#slow').on('click', function() {
    force.slowMotion = true;
    force.fullSpeed  = false;
    force.start();
  });

  d3.select('#play').on('click', function() {
    force.slowMotion = false;
    force.fullSpeed  = true;
    force.start();
  });


  d3.select('#reset').on('click', function() {
    if (force) {
      force.stop();
    }
    initForce();
  });

  initForce();
}());