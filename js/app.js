/**
 * Created by vadimdez on 11/01/16.
 */
(function () {
  var authors = [];
  var links = [];

  d3.json('http://www.freecodecamp.com/news/hot', function (err, data) {
    if (err) {
      console.warn('error');
      return;
    }

    authors = [];
    links = [];

    drawGraph(data);
  });

  function drawGraph(news) {
    var width = 960;
    var height = 600;
    var $chart = d3.select('.chart')
      .attr('width', width)
      .attr('height', height);

    setDataAndLinks(news);

    var force = d3.layout.force()
      .gravity(0.04)
      .distance(30)
      .charge(-40)
      .size([width, height])
      .nodes(authors)
      .links(links)
      .on('tick', tick);

    force.linkDistance(60);

    var $links = $chart.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link');

    var $nodes = $chart.selectAll('.node')
      .data(authors)
      .enter()
      .append('circle')
      .attr('class', function (d) {
        return 'node ' + ((d.hasOwnProperty('quantity')) ? 'url' : 'author');
      })
      .attr('r', function (d) {
        if (d.hasOwnProperty('quantity')) {
          return 10 + d.quantity;
        }

        return 10;
      })
      .call(force.drag);


    function tick() {
      $nodes
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });

      $links
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
    }

    force.start();
  }

  function getDomain(url) {
    var index = (url.indexOf('://') !== -1) ? 2 : 0;
    var domain = url.split('/')[index];

    return domain.split(':')[0];
  }

  function setDataAndLinks(news) {
    var urls = {};
    var authorsTmp = {};

    news.forEach(function (object) {
      if (!authorsTmp[object.author.userId]) {
        authorsTmp[object.author.userId] = object.author;
      }

      var domain = getDomain(object.link);
      if (!urls[domain]) {
        urls[domain] = {domain: domain, quantity: 1};
      } else {
        urls[domain].quantity++;
      }

      links.push({source: urls[domain], target: authorsTmp[object.author.userId]});
    });

    for (var key in authorsTmp) {
      authors.push(authorsTmp[key]);
    }

    for (var key in urls) {
      authors.push(urls[key]);
    }
  }
}());