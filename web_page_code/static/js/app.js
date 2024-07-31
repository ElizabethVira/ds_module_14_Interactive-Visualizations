// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    
    // Filter the metadata for the object with the desired sample number
    let resultsArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultsArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// --------------------------------------------------------------
// --------------------------------------------------------------

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let info = sample_data.filter(x => x.id === sample)[0];
    console.log(info);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids;
    let otu_labels = info.otu_labels;
    let sample_values = info.sample_values;

// --------------------------------------------------------------
// --------------------------------------------------------------

    // Build a Bubble Chart
    let trace_bubble = [{
      x: otu_ids,
      y: sample_values,
      text : otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale : 'Picnic'
        }
    }
  ];

    // Render the Bubble Chart
    let bubble_layout = {
      title: {text :"Bacteria Cultures Per Sample", font: { size: 24 }},
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
  };

  Plotly.newPlot("bubble", trace_bubble, bubble_layout);


// --------------------------------------------------------------
// --------------------------------------------------------------

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
    console.log(bar_y);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      // Need to add the slice 0 -10 to show only the 1st 10s and reverse to move positon of the bars 
      x: sample_values.slice(0, 10).reverse(), 
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        color: "#da627d"
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };
    
    // Render the Bar Chart
    let traces = [trace1];

    // Add the title to the layout
    let layout = {
      title: {text: "Top 10 Bacteria Cultures Found", font: { size: 24 }},
      xaxis: {title: "Number of Bacteria"}
    };

  // Render the plo to de div tag with id "plot"
  Plotly.newPlot("bar", traces, layout);

  });
}

// --------------------------------------------------------------
// --------------------------------------------------------------

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      let name = names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let default_name = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(parseInt(default_name));
    buildCharts(default_name);
  });
}

// --------------------------------------------------------------
// --------------------------------------------------------------

// Function for event listener
function optionChanged(newSample) { 
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
