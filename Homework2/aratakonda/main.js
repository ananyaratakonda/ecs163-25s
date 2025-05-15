/*
Refernces: All references were from d3 examples/ Graph Gallery
For the lolipop Chart used: https://d3-graph-gallery.com/graph/lollipop_basic.html 
Scatter Plot: https://d3-graph-gallery.com/graph/scatter_basic.html 
Parallel: https://d3-graph-gallery.com/graph/parallel_basic.html

Chatgpt was used to understand the code from the d3.js examples above and for parsing data. 
I commented out which part of the code was help from chatgpt. 

This is to help users understand more about different Cosmetics products 
Important: I didn't add anything to showcase what color represents what because I plan to do that with animation
*/

// geting the dataset 
d3.csv("cosmetics.csv").then(rawData => {
    console.log("rawData", rawData);
    console.log("hehe it works");
  
    // https://d3-graph-gallery.com/graph/lollipop_basic.html 
    let margin = {top: 40, right: 30, bottom: 100, left: 100},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    const brandMap = new Map();

    rawData.forEach(d => {
      // making sure to only include the Moisturizer and ranks above 4.7 data points 
        if (d.Label === "Moisturizer" && parseFloat(d.Rank) > 4.7) { 
          const brand = d.Brand;
          const price = parseFloat(d.Price); // needed to google the parseFloat function 
      
          // Check if we already stored this brand
          // this part was used to have onle one brand show up for lolipop chart 
          if ( !brandMap.has(brand) || price > parseFloat(brandMap.get(brand).price)) {
            brandMap.set(brand, { // will have the label, brand and prrice that are mositurizer and ranked high 
              label: d.Label,
              brand: brand,
              price: d.Price
            });
          }
        }
      });
      
      const loliGraphData = Array.from(brandMap.values()); // needed help here as well just works better as an array later on than a map 

    console.log("loli", loliGraphData);

    const svg = d3.select("svg") // used to call the DOM so it connects to html and shows up 
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // where to move them to 

        // code learnt from the example 
        // this is from the x-axis example 
    var x = d3.scaleBand()
    // want the domain to showcase different brands so mapping them 
      .domain(loliGraphData.map(function(d) { return d.brand; })) 
      .range([ 0, width ]) // want it as long as the width 
      .padding(1); // space padding away from the axis 

    svg.append("g") // adding the x axis to making sure it shows up 
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text") 
        .attr("transform", "translate(-10,0)rotate(-45)") // makes it readable here 
        .style("text-anchor", "end") // makes it come after the axis 
        .style("font-size", "7px");

    // here is all the 
    var y = d3.scaleLinear()
      .domain([0, 400]) // the max is like 350 so just added 400 
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

      // to draw the lines 
  svg.selectAll()
  .data(loliGraphData)
  .enter()
  .append("line")
  // all the coordinates to draw the lines 
    .attr("x1", function(d) { return x(d.brand); })
    .attr("x2", function(d) { return x(d.brand); })
    .attr("y1", function(d) { return y(d.price); })
    .attr("y2", y(0))
    .attr("stroke", "#DAA520")
    .attr("stroke-width", 2.5); // made it pink and played aroung with the lines sie 


    // added the circles to finish the graph 
  svg.selectAll()
    .data(loliGraphData)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.brand); })
    .attr("cy", function(d) { return y(d.price); })
    .attr("r", 8) 
    .style("fill", "#DAA520")
    .attr("stroke", "white");

   // adding all the names for the loli graph
   // this is for the X-axis 
    svg.append("text")
    .attr("x", 220)           
    .attr("y", height + 55)  
    .text("Brand");

// name for the y axis 
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)          
      .attr("x", -140)         
      .text("Price");

      // main Title here 
  svg.append("text")
  .attr("x", 10+ (width / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .text("Moisturizers Ranked More Than 4.7");


// This is for the scatter plots :


// These were made eyeballing it 
    let marginScatter = {top: 80, right: 20, bottom: 30, left: 100};
    let scatterW = 900 - marginScatter.left - marginScatter.right;
    let scatterH = 750 - marginScatter.top - marginScatter.bottom;

// connecting it to html so it will show up 
    let svgScatter = d3.select("#scatter")
      .append("svg")
      .attr("width", scatterW + marginScatter.left + marginScatter.right)
      .attr("height", scatterH + marginScatter.top + marginScatter.bottom)
      .append("g")
      .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")");


      // setting up the x-axis and adding it to the svg 
    x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, scatterW]);
      svgScatter.append("g")
      .attr("transform", "translate(0," + scatterH + ")") 
      .call(d3.axisBottom(x));

      // y-axis stuff where it shows the different ranks from 0 to max 
     y = d3.scaleLinear()
      .domain([0, d3.max(rawData, d => +d.Rank)])  
      .range([scatterH, 0]);
    svgScatter.append("g")
      .call(d3.axisLeft(y));

      // this is to add a color scheme here 
    let color = d3.scaleOrdinal()
    .domain(["Moisturizer", "Cleanser", "Face Mask", "Treatment", "Eye cream", "Sun Protect"])
    .range(d3.schemeBrBG[6]);
  //.range(["blue", "pink", "yellow", "red", "green", "black", "cyan"]);

// added the circles here 
svgScatter.append('g').selectAll().data(rawData).enter()
  .append("circle")
  .attr("cx", function(d) { return x(d.Price); }) 
  .attr("cy", function(d) { return y(d.Rank); })
  .attr("r", 4) 
  .style("fill", function(d) { return color(d.Label); }); // I wanted to make each point represent a label like if it's cleanser or face mask, etc. 

// adding the names again x axis here 
  svgScatter.append("text")
  .attr("x", 400)           
  .attr("y", scatterH + 30)   
  .text("Price");

// Y Axis Label
svgScatter.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -30)             // Move to the left of the y-axis
  .attr("x", -350)             // Adjust positioning
  .text("Brand");

  svgScatter.append("text")
  .attr("x", width -50)
  .attr("y", -25) // adjust based on your margin.top
  .attr("text-anchor", "middle")
  .style("font-size", "25px")
  .text("Cosmetic Products: Price ($0–$100) vs. Ranked ");


  // parallel coordinates Startes here 
  let marginP = {top: 35, right: 140, bottom: 40, left: -40};
  let parallelW = 900 - marginP.left - marginP.right;
  let parallelH = 430 - marginP.top - marginP.bottom;


  // connecting to html 
  let svgParallel = d3.select("#parallel")
  .append("svg")
  .attr("width", parallelW + marginP.left + marginP.right)
  .attr("height", parallelH + marginP.top + marginP.bottom)
  .append("g")
  .attr("transform", "translate(" +  marginP.left + "," + marginP.top + ")");

  // the data - I only want are brands, price, label and what skin type 
  const processedData = [];
  
  rawData.forEach(d => {
    // needed help here 
    const skinTypes = ["Combination", "Dry", "Normal", "Oily", "Sensitive"];

    skinTypes.forEach(type => {
      if (d[type] === "1"  && parseFloat(d.Rank) >= 4.7) {
        processedData.push({
          skinType: type, // made a new column here 
          label: d.Label,
          brand: d.Brand,
          price: +d.Price,
          rank: +d.Rank
        });
      }
    });
  });

console.log("new data: ", processedData);

dimensions = ['skinType', 'price', 'rank']; // only want these as y axis in the parallel chart 
console.log("dim ", dimensions);

// x axis stuff here 
x = d3.scalePoint()
  .range([0, parallelW])
  .padding(1)
  .domain(dimensions);

  // y axis here, need like 3 here 
var y = {}; // need 3 
dimensions.forEach(function(dim) {
  if (dim === "skinType") { // special for the skin type cause it's not numbers so need to assign it differently 
    y[dim] = d3.scalePoint()
      .domain(["Combination", "Dry", "Normal", "Oily", "Sensitive"])
      .range([parallelH, 0]);
  } else {
    y[dim] = d3.scaleLinear()
      .domain(d3.extent(processedData, d => +d[dim]))
      .range([parallelH, 0]);
  }
}); // did this in hw 1 as well 

// for the colors 
 color = d3.scaleOrdinal()
  .domain(["Moisturizer", "Cleanser", "Face Mask", "Treatment", "Eye cream", "Sun Protect"])
  //.range(["#F679D5", "#D05BB1", "#A03683", "#89256E", "#eacff8"]); 
  .range(d3.schemeBrBG[6]);


// this was from the reference website 
function path(d) {
  return d3.line()(dimensions.map(p => [x(p), y[p](d[p])]));
}

// the paths 
svgParallel
  .selectAll().data(processedData).enter().append("path")
  .attr("d", path)
  .style("fill", "none")
  .style("stroke", d => color(d.label))  
  .style("opacity", 0.5);

  svgParallel.selectAll()
  .data(dimensions).enter()
  .append("g").attr("transform", function(d) { return "translate(" + x(d) + ")"; })
  .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })

  // adding the title here 
    svgParallel.append("text")
    .attr("x", (parallelW /3)-30)
    .attr("y", -20) // adjust based on your margin.top
    .style("font-size", "20px")
    .text("Cosmetic Products: Ranked above 4.7");
  
  
  }).catch(function(error) {
    console.error("CSV load error:", error);
  });
  
