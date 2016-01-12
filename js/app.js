/**
 * Created by vadimdez on 11/01/16.
 */
(function () {
  var authors = [];
  var urls = [];
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
    var height = 960;
    var $chart = d3.select('.chart')
      .attr('width', width)
      .attr('height', height);

    setDataAndLinks(news);

    var force = d3.layout.force()
      .gravity(0.04)
      .distance(40)
      .charge(-40)
      .size([width, height])
      .nodes(authors.concat(urls))
      .links(links)
      .on('tick', tick);

    force.linkDistance(60);

    var $links = $chart.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link');

    var $urlNodes = $chart.selectAll('.node.url')
      .data(urls)
      .enter()
      .append('circle')
      .attr('class', 'node  url')
      .attr('r', function (d) {
        return 10 + d.quantity;
      })
      .call(force.drag);

    var $authorNodes = $chart.selectAll('.node.author')
      .data(authors)
      .enter()
      .append('g')
      .attr('class', 'node author')
      .call(force.drag)
      .append('image')
      .attr('xlink:href', function (d) {
        return d.picture;
      })
      .attr('width', 30)
      .attr('height', 30)


    function tick() {
      $urlNodes
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });
      $authorNodes
        .attr('x', function (d) {
          return d.x - 15;
        })
        .attr('y', function (d) {
          return d.y - 15;
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
    var urlsTmp = {};
    var authorsTmp = {};

    news.forEach(function (object) {
      if (!authorsTmp[object.author.userId]) {
        authorsTmp[object.author.userId] = object.author;
      }

      var domain = getDomain(object.link);
      if (!urlsTmp[domain]) {
        urlsTmp[domain] = {domain: domain, quantity: 1};
      } else {
        urlsTmp[domain].quantity++;
      }

      links.push({source: urlsTmp[domain], target: authorsTmp[object.author.userId]});
    });

    for (var key in authorsTmp) {
      authors.push(authorsTmp[key]);
    }

    for (var key in urlsTmp) {
      urls.push(urlsTmp[key]);
    }
  }
}());