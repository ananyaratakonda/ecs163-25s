d3.csv("cosmetics.csv").then(rawData => {
    console.log("rawData", rawData);
    console.log("hehe it works");
    const svg = d3.select("svg"); // used to call the DOM so it connects to html and shows up 

//     svg.append("circle") 
//    .attr("cx", 100)
//    .attr("cy", 100)
//    .attr("r", 50)
//    .attr("fill", "pink");
  
    // const heatMapData = rawData.map(d => ({
    //   Brand: d.Brand,
    //   Rank: +d.Rank,  // ensure numeric
    //   Label: d.Label
    // }));
  
    // console.log("Parsed heatmap data:", heatMapData);
  
    // const plot = Plot.plot({
    //   x: { label: "Label" },
    //   y: { label: "Brand" },
    //   marks: [
    //     Plot.cell(heatMapData, {
    //       x: "Label",
    //       y: "Brand",
    //       fill: "Rank"
    //     })
    //   ],
    //   width: 1100,
    //   height: 600,
    //   marginLeft: 150,
    //   marginBottom: 50,
    //   color: {
    //     legend: true,
    //     scheme: "PuRd",
    //     label: "Rank"
    //   }
    // });
  
  }).catch(function(error) {
    console.error("CSV load error:", error);
  });
  