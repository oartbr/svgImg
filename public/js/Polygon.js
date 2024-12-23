/*
    Plygon extends D3.js to create a polygon with n sides, and a radius.
*/

d3.polygon = function(sides, centerX, centerY, size) {
    var points = [];
    for (var i = 0; i < sides; i++) {
      var degree = (360 / sides) * i + 30;
      var radian = Math.PI / 180 * degree;
      points.push([
        centerX + size * Math.cos(radian),
        centerY + size * Math.sin(radian)
      ].join(","));
    }
    return "M" + points.join("L") + "Z";
  }

export default d3.polygon;

/* Create a new instance of Polygon with 6 sides and a radius of 50, located at 100,100

d3.select('#my-svg')
     .append("path")
     .attr("d", d3.polygon(6, 100, 100, 50))
     .attr("stroke", "black")
     .attr("fill", "none");

*/
