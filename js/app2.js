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
  var force2 = null;
  var nodes2 = null;
  var links2 = null;

  var $svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var initForce = function () {
    var dataNodes1 = [
      {},
      {},
      {},
      {},
      {},
      {}
    ];

    var dataNodes2 = [
      {},
      {},
      {},
      {},
      {},
      {}
    ];

    var dataLinks1 = [
      { source: 0, target: 1},
      { source: 1, target: 2},
      { source: 2, target: 0}
    ];

    var dataLinks2 = [
      { source: 0, target: 1},
      { source: 1, target: 2},
      { source: 2, target: 0}
    ];

    $svg.selectAll('*').remove();

    force = d3.layout.force()
      .size([width, height])
      .nodes(dataNodes1)
      .links(dataLinks1);

    force2 = d3.layout.force()
      .size([width, height])
      .nodes(dataNodes2)
      .links(dataLinks2);

    force
      .linkDistance(height / 2);

    force2
      .linkDistance(height / 2)
      .gravity(0)
      .friction(0.1);

    links = $svg.selectAll('.link1')
      .data(dataLinks1)
      .enter()
      .append('line')
      .attr('class', 'link1')
      .attr('x1', function (d) {
        return dataNodes1[d.source].x;
      })
      .attr('y1', function (d) {
        return dataNodes1[d.source].y;
      })
      .attr('x2', function (d) {
        return dataNodes1[d.target].x;
      })
      .attr('y2', function (d) {
        return dataNodes1[d.target].y;
      });

    nodes = $svg.selectAll('.node1')
      .data(dataNodes1)
      .enter()
      .append('circle')
      .attr('class', 'node1')
      .attr('r', width / 40)
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y
      })
      .call(force.drag);

    // Same code but for the second layout.

    links2 = $svg.selectAll('.link2')
      .data(dataLinks2)
      .enter().append('line')
      .attr('class', 'link2')
      .attr('x1', function (d) {
        return dataNodes2[d.source].x;
      })
      .attr('y1', function (d) {
        return dataNodes2[d.source].y;
      })
      .attr('x2', function (d) {
        return dataNodes2[d.target].x;
      })
      .attr('y2', function (d) {
        return dataNodes2[d.target].y;
      });

    nodes2 = $svg.selectAll('.node2')
      .data(dataNodes2)
      .enter().append('circle')
      .attr('class', 'node2')
      .attr('r', width/40)
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y
      });

    force.on('tick', stepForce(force, nodes, links));
    force2.on('tick', stepForce(force2, nodes2, links2));
  };

  var stepForce = function (force, nodes, links) {
    return function () {
      if (force.fullSpeed) {
        nodes
          .attr('cx', function (d) {
            return d.x;
          })
          .attr('cy', function (d) {
            return d.y;
          });

        links
          .attr('x1', function (d) {
            return d.source.x;
          })
          .attr('y1', function (d) {
            return d.source.y;
          })
          .attr('x2', function (d) {
            return d.target.x;
          })
          .attr('y2', function (d) {
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
          .attr('x1', function (d) {
            return d.source.x;
          })
          .attr('y1', function (d) {
            return d.source.y;
          })
          .attr('x2', function (d) {
            return d.target.x;
          })
          .attr('y2', function (d) {
            return d.target.y;
          });

        force.stop();
      }

      if (force.slowMotion) {
        setTimeout(function () {
          force.start();
        }, animationStep)
      }
    };
  };

  d3.select('#advance').on('click', function() {
    force.start();
    force2.start();
  });

  d3.select('#slow').on('click', function() {
    force.slowMotion = force2.slowMotion = true;
    force.fullSpeed  = force2.fullSpeed = false;
    force.start();
    force2.start();
  });

  d3.select('#play').on('click', function() {
    force.slowMotion = force2.slowMotion = false;
    force.fullSpeed  = force2.fullSpeed = true;
    force.start();
    force2.start();
  });


  d3.select('#reset').on('click', function() {
    if (force) {
      force.stop();
    }

    if (force2) {
      force2.stop();
    }
    initForce();
  });

  initForce();
}());