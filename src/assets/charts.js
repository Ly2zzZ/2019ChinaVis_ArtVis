var charts = {};
charts.init = function(){
    var width = document.getElementById("earth").offsetWidth,
    height = document.getElementById("earth").offsetHeight;
    let step = width/100;
    var autoR;
    var Description = [];
    Description.push({
        localtype:'earth',
        local: [138.302001, 35.456019],
        name: 'Whale',
        lineLocal:[
            [9,-9],
            [15,-9]
        ],
        decline:{
            lastRecord:{
                number:0,
                year:2019
            },
            danwei:"km2",
            speed:0
        }
    },{
        localtype:'earth',
        local: [20, 90],
        name: 'Polar_Bear',
        lineLocal:[
            [15,-15],
            [20,-15]
        ],
        decline:{
            lastRecord:{
                number:0,
                year:2019
            },
            danwei:"km2",
            speed:0
        }
    },{
        localtype:'earth',
        local: [3.4653, 62.2159],
        name:'Amazon_Rainforest',
        lineLocal:[
            [-25,-5],
            [-45,-5]
        ],
        decline:{
            lastRecord:{
                number:7000000,
                year:1978
            },
            danwei:"km2",
            speed:-0.00055
        }
    },{
        localtype:'earth',
        local: [-133.611696, -26.201145],
        name:'Sea_Level',
        lineLocal:[
            [-10,10],
            [-20,10]
        ],
        decline:{
            lastRecord:{
                number:0,
                year:2019
            },
            danwei:"km2",
            speed:0
        }
    },{
        localtype:'earth',
        local: [79.185509, -21.263971],
        name:'Marine_Pollution',
        lineLocal:[
            [15,10],
            [20,10]
        ],
        decline:{
            lastRecord:{
                number:0,
                year:2019
            },
            danwei:"km2",
            speed:0
        }
    },{
        localtype:'Entire',
        local: [width/2 - step*10, height/2 - step*20],
        name:'Air_Quality',
        lineLocal:[
            [-9,-9],
            [-20,-9]
        ],
        decline:{
            lastRecord:{
                number:0,
                year:1979
            },
            danwei:"km2",
            speed:0.0164
        }
    },{
        localtype:'Entire',
        local: [width/2, height/4*3 + step],
        name:'Ozonosphere_Hole',
        lineLocal:[
            [-9,5],
            [-20,5]
        ],
        decline:{
            lastRecord:{
                number:0,
                year:1979
            },
            danwei:"km2",
            speed:0.0164
        }
    })

    this.step = step;
    this.width = width;
    this.height = height;
    this.Description = Description;
}

charts.drawEarth = function(world){
    const width = this.width
    const height = this.height
    const step = this.step

    var options = {name: "Natural Earth", projection: d3.geoNaturalEarth()}

    var svg = d3.select("#earth_svg")
    var earththsvg=svg.append('g')
    earththsvg.attr('transform',"translate(" +  (width/4 + 10) + "," + height/4 + ")")
    
    var projection = options.projection
    .rotate([0, 0])
    .center([width/2, height/2])
    .fitSize([width/2-20, height/2], world);

    var path = d3.geoPath(projection);
    var graticule = d3.geoGraticule();

    var tile = d3.tile()
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .zoomDelta((window.devicePixelRatio || 1) - .5);

    earththsvg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path)

    earththsvg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

    earththsvg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

    console.log(world.features)

    earththsvg.selectAll(".block")
    .data(world.features)
    .enter().append("path")
    .attr("d", path)
    .attr("class",'block')
    .on("mouseover",function(d) {
        d3.select(this)
        .classed("active",true)
    })
    .on("mouseout",function(d){
        d3.select(this)
        .classed("active",false)
    })   
    // .call(d3.drag()
    // .subject(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
    // .on("drag", function() {
    // clearTimeout(autoR);
    // var rotate = projection.rotate();
    // projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
    // earththsvg.selectAll("path.block").attr("d", path);

    // earththsvg.selectAll('.animals')
    // .attr("x", function(d){ return projection([d.long, d.lat])[0] })
    // .attr("y", function(d){ return projection([d.long, d.lat])[1] })
    // }))

    //  var tiles = tile();
    //  earththsvg.append("g")
    //     .attr("clip-path", "url(#clip)")
    //     .selectAll("image")
    //     .data(tiles)
    //      .enter().append("image")
    //     .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/mapbox.natural-earth-2/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
    //     .attr("width", Math.round(tiles.scale))
    //     .attr("height", Math.round(tiles.scale))
    //     .attr("x", function(d) { return Math.round((d[0] + tiles.translate[0]) * tiles.scale); })
    //     .attr("y", function(d) { return Math.round((d[1] + tiles.translate[1]) * tiles.scale); });

    earththsvg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)

    this.svg = svg;
    this.earththsvg = earththsvg;
    this.projection = projection;
    this.path = path;
}

charts.drawanimals = function(local,symbol){
    const earththsvg = this.earththsvg
    const projection = this.projection

    earththsvg
    .selectAll("animals")
    .data(local)
    .enter()
    .append("text")
    .attr('class','animals object')
    .html(symbol)
    .attr("x", function(d){ return projection([d.long, d.lat])[0] })
    .attr("y", function(d){ return projection([d.long, d.lat])[1] })
}

charts.addDescription = function(local, str){
    var counting = [];
    const earth = this.earththsvg.append('g')
    const Entire = this.svg.append('g')
    const step = this.step
    const projection = this.projection

    let color = '#ff9a9a'
    for (let i=0;i<local.length;i++){
        let svg = local[i].localtype == 'earth'?earth:Entire;
        let locals = local[i].localtype == 'earth'? projection(local[i].local):local[i].local;

        let x = locals[0]
        let y = locals[1]

        svg.append('circle')
            .attr('class',function(){
                if (local[i].localtype == 'earth'){
                    return 'eventDot earth_eventDot_circle '
                }else{
                    return 'eventDot eventDot_circle'
                }
            })
            .attr("cx", x)
            .attr("cy", y)
            .attr('r', 5)
            .attr('fill',color)

        svg.append('line')
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x + step*local[i].lineLocal[0][0])
            .attr("y2", y + step*local[i].lineLocal[0][1])
            .attr('stroke',color)
            .attr("class","move_line")

        svg.append('line')
            .attr("x1", x + step*local[i].lineLocal[0][0])
            .attr("y1", y + step*local[i].lineLocal[0][1])
            .attr("x2", x + step*local[i].lineLocal[1][0])
            .attr("y2", y + step*local[i].lineLocal[1][1])
            .attr('stroke',color)
        
        svg.append('text')
            .html(local[i].name + ":" + local[i].decline.lastRecord.number)   
            .attr("x", x + step*local[i].lineLocal[1][0])
            .attr("y", y + step*local[i].lineLocal[1][1])
            .attr('class', "inf_" + local[i].name)
        counting.push({
            name:"inf_" + local[i].name,
            obj:local[i]
        })
    }
    return counting;
}

charts.counting = function(obj){
    var text;
    return function(){
        text = d3.select('.' + obj.name).text().split(":");
        if (obj.obj.decline != undefined){
            text[1] = +text[1] + obj.obj.decline.speed
        }
        d3.select('.' + obj.name).html(text.join(":"))
    }
}

charts.earthMove = function(projection,svg,path){    
    const that = this
    var ro=0;
    return function(){
        const earth = that.earththsvg
        const Description = that.Description
        // console.log(that)
        ro+=0.15;
        projection.rotate([ro,0]);
        svg.selectAll("path.block").attr("d", path);

        svg.selectAll('.animals')
        .attr("x", function(d){return projection([d.long, d.lat])[0] })
        .attr("y", function(d){ return projection([d.long, d.lat])[1] })

        earth.selectAll('.earth_eventDot_circle')
        .attr("cx", function(d,i){return projection(Description[i].local)[0] })
        .attr("cy", function(d,i){return projection(Description[i].local)[1] })

        earth.selectAll('.move_line')
        .attr("x1", function(d,i){return projection(Description[i].local)[0] })
        .attr("y1", function(d,i){return projection(Description[i].local)[1] })
    }
}

charts.addEvents = function(){
    const that = this;
    const svg = this.svg
    const step = this.step;
    const width = this.width;
    const height = this.height;

    svg.selectAll('.block').on('click',function(d){
        console.log(d)

        svg.append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("width",width)
        .attr("height",height)
        .attr("stroke","#6c05ff0a")
        .attr("class","waller")
        .attr("fill","white")

        svg.append("circle")
        .attr("class","waller_circle")
        .attr("cx",width/2)
        .attr("cy",height/2)
        .attr("r",0)
        .attr("fill","white")
        .attr("r",width/4)

        setTimeout(()=>{
            charts.drawForce(d.properties.CONTINENT.split(" ").join("_"));
        },1000)

        svg.append("text")
            .text(d.properties.CONTINENT)
            .attr("class","waller")
            .attr("font-size",step*4)
            .attr("font-weight","bolder")
            .attr("x", function(d){
                return width/2 - this.getComputedTextLength() / 2;
            })
            .attr("y",height/4)
            .on('click',function(d){
                svg.selectAll(".item_circle")                
                    .transition()
                    .duration(1000)
                    .attr("r",0)
                    .remove()
                
                    setTimeout(()=>{
                        svg.selectAll(".waller").remove()

                        svg.selectAll('.waller_circle')
                        .attr("r",width/2)
                        .attr("stroke","none")
                        .transition()
                        .duration(1000)
                        .attr("r",0)
                        .remove()
                    },1000)

            })
            .transition()
            .duration(1000)
            .attr("y",height/2 - step*15)
    })
}

charts.drawForce = function(CONTINENT){
    const PicView = this.PicView
    const svg = this.svg
    const width = this.width;
    const height = this.height;
    const step = this.step;

    var nodes = this.CONTINENT_Data[CONTINENT].animals.concat(this.CONTINENT_Data[CONTINENT].plantes)
    svg.selectAll(".nodes").remove()

    nodes.forEach((d,i)=>{
        d.radius = step*3;
        d.index = i;
    })

    var root = {
        index: 0,
        radius: height / 4
    };

    nodes.unshift(root);

    var simulation = d3
            .forceSimulation()
            .force("forceX",d3.forceX().strength(0.1).x(width * 0.5))
            .force("forceY",d3.forceY().strength(0.1).y(height * 0.5))
            .force("center",d3.forceCenter().x(width * 0.5).y(height * 0.5))
            .force("charge", function(d, i) {
            return i ? 0 : -2000;
            });

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    simulation
        .nodes(nodes)
        .force("collide",d3.forceCollide().strength(0.5).radius(function(d) {
                if (d.index == 0) return d.radius + step*5;
                return d.radius + 5;
            })
            .iterations(1)
            .strength(0.3)
        )
        .on("tick", ticked);

        node = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("none")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class","item_circle")
            .attr("stroke", "black")
            .attr("stroke-dasharray", "5,5")
            .attr("fill", function(d,i){
                if (d.index != 0){
                    console.log(d.name.split(" ").join("_"))
                    return "url(#" + d.name.split(" ").join("_") + ")";
                }else{
                    return "none";
                }
            })           
            .attr("r", function(d) {
                return d.radius;
              })
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            })
            .on("mouseover", function(d) {
                d3.select(this)
                  .attr("stroke-width", "2px")
                  .attr("r", d.radius + 20)
                  .attr("stroke-dasharray", "0,0");
              })
              .on("mouseleave", function(d) {
                d3.select(this)
                  .attr("stroke-width", "1px")
                  .attr("r", d.radius)
                  .attr("stroke-dasharray", "5,5");
              })
            .on("click",function(d){
                PicView.showMe(nodes.slice(1,nodes.length), d.index - 1);
            })

    
    function ticked() {
            node.attr("cx", function(d) {
            if (d.x - d.radius < 0) {
                d.x += 10;
                return d.x;
            } else if (d.x + d.radius > width) {
                d.x -= 10;
                return d.x;
            }

            if (d.index == "0") {
                d.fy = height / 2;
                d.fx = width / 2;
            }

            return d.x;
            })
            .attr("cy", function(d) {
            if (d.y - d.radius < 0) {
                d.y += 10;
                return d.y;
            } else if (d.y + d.radius > height) {
                d.y -= 10;
                return d.y;
            }

            if (d.index == "0") {
                d.fy = height / 2;
                d.fx = width / 2;
            }
            return d.y;
            });
        }
}

charts.CONTINENT_Data_change = function(){
    var that = this;
    return function (){
        for (let k in that.CONTINENT_Data){
            if (that.CONTINENT_Data[k].animals != undefined){
                that.CONTINENT_Data[k].animals.forEach(d=>{
                    d.population - d.ExtinctSpeed;
                })
            }
            if (that.CONTINENT_Data[k].plantes != undefined){
                that.CONTINENT_Data[k].plantes.forEach(d=>{
                    d.population - d.ExtinctSpeed;
                })
            }
        }
    }
}

charts.Air_change = function(){
    d3.select(".satic-area")
    .style("transition","all 10s")
    .style("background","#8080806b")
}

charts.Ozonosphere_change = function(){
    const height = this.height;
    d3.select("#ozone_shield")
        .transition()
        .duration(20000)
        .attr("cy",height/2)
}

charts.requestAnimationFrame = function(fns){
    this.AnimationFrame = setInterval(()=>{
        fns.forEach(d=>{
            d()
        })
    },1000)
}

charts.on = function(Vue, CONTINENT_Data){
    const that = this;
    that.PicView = Vue.$refs.ViewPic;
    that.CONTINENT_Data = CONTINENT_Data;
    
    d3.json("../../static/map.json").then(world=>{
        var Whalelocal = [
            {long: 139.485582, lat: 34.078783}, 
            {long: 133.671016, lat: 36.170561}, 
            {long: 143.372315, lat: 38.371926},
            {long: 133.176260, lat: 41.141973},
        ];

        var Bearlocal = [
            {long: -10.0000, lat: 90.0000},
            {long: -20.0000, lat: 90.0000},
            {long: 20.0000, lat: 90.0000},
            {long: 40.0000, lat: 90.0000},
            {long: 60.0000, lat: 90.0000},
        ];

        var Pollutionlocal = [
            {long: 79.185509, lat: -21.263971},
            {long: 85.185509, lat: -15.263971},
            {long: 70.185509, lat: -25.263971},
            {long: 90.185509, lat: -21.263971},
        ];
        charts.init()
        charts.drawEarth(world);

        charts.drawanimals(Whalelocal,'&#128011');
        charts.drawanimals(Bearlocal,'&#128059');
        charts.drawanimals(Pollutionlocal,'&#x2622');

        const projection = that.projection
        const Description = that.Description
        
        var counts = charts.addDescription(Description)
        charts.addEvents()

        charts.Air_change()
        charts.Ozonosphere_change()

        charts.requestAnimationFrame(counts.map(v=>charts.counting(v)).concat([
                charts.earthMove(projection,that.svg,that.path),
                charts.CONTINENT_Data_change()
            ]
        ))
    })
}

module.exports = charts;