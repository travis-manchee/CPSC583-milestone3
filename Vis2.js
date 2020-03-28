var width = 1000,
    height = 1000,
    radius = Math.min(width, height) / 2,
    innerRadius = 0 //0.3 * radius;


var color = d3.scaleOrdinal()
    .domain(["Lost SCF", "Won SCF"])
    .range(["red", "green"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(function (d) {
        return (d.data.normPDO*100);
    });

var outlineArc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(function(d) {
        return (normMeanPDO*100);
    });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var MeanPointsE = 0;
var MeanPDO = 0;
var normMeanPDO = 0;

d3.csv('dataFull.csv').then(function(data) {
    data.forEach(function(d) {
        d.label = d.Team + ": " + d.Season;
        d.outcome = d.SeasonOutcome;
        d.width  = 1; // can set width to a value, leaving it "1" gives even slices
        d.PointsE = +d.PointsE;
        d.PDO = +d.PDO;
        let tempMeanPointsE = 0;
        let  tempMeanPDO = 0;
        let tempMinPDO = data[0].PDO;
        let tempMaxPDO = data[0].PDO;
        for (let i = 0; i < data.length; i++){
            tempMeanPointsE += data[i].PointsE;
            tempMeanPDO += data[i].PDO;
            if(data[i].PDO < tempMinPDO){ tempMinPDO = data[i].PDO;}
            if(data[i].PDO > tempMaxPDO){ tempMaxPDO = data[i].PDO;}
        }
        MeanPDO = tempMeanPDO/data.length;
        d.normPDO = ((d.PDO - tempMinPDO)/tempMaxPDO)*100;//normalized from 0 to 100
        MeanPointsE = tempMeanPointsE/data.length;
        normMeanPDO = ((MeanPDO - tempMinPDO)/tempMaxPDO)*100;
    });
   for (var i = 0; i < data.length; i++) { console.log(data[i].outcome) }

    var g = svg.selectAll(".solidArc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "solidArc")
        .attr("stroke", "black")

    g.append("path")
        .attr("d", arc)
        .attr("fill", function(d) { return  color(d.data.outcome); })

    var outerPath = svg.selectAll(".outlineArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("class", "outlineArc")
        .attr("d", outlineArc);

    g.append("text")
        .attr("transform", function(d) {
            var c = outlineArc.centroid(d);
            return "translate(" + c[0]*2.25 +"," + c[1]*2.1 + ")";
        })
        .attr("class", "slice-text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // text-align: right
        .text(function(d) {return d.data.label;});

    svg.append("svg:text")
        .attr("class", "center-text")
        .attr("dy", "-18em")
        .attr("text-anchor", "middle") // text-align: right
        .text("Normalized PDO");

});
