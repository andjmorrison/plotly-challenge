function buildMetadata(sample) {

  // fetch the metadata for sample
    d3.json(`/metadata/${sample}`).then(individual => {
    
    // select the panel id `#sample-metadata`
      let metadata = d3.select('#sample-metadata')

    // clear existing metadata
      metadata.html('')

    // add each key and value pair to panel
      for (let [key, value] of Object.entries(individual)) {
        console.log(`${key}: ${value}`)
        metadata.append('tr').text(`${key}: ${value}`)
      }
  })
}

function buildCharts(sample) {

  // fetch sample data for plots
    d3.json(`/samples/${sample}`).then(individual => {
        
        console.log(individual)
        console.log(individual['sample_values'])

    // Bubble Chart for sample data
        let traceBubble = {
            x: individual['otu_ids'],
            y: individual['sample_values'],
            text: individual['otu_labels'],
            mode: 'markers',
            marker: {
                size: individual['sample_values'],
                color: individual['otu_ids'],
                colorscale: 'Jet',
                colorbar: {
                    title: 'ID',
                },
            },
        }

        console.log(traceBubble)

        let dataBubble = [traceBubble]

        let layoutBubble = {
            title: `Sample ${sample}`,
            xaxis: {
              title: {
                text: 'OTU IDs'
              }
            },
            yaxis: {
              title:{
                text: 'Sample Values'
              }
            },
            height: 600,
            width: 800
        }

        Plotly.newPlot('bubble', dataBubble, layoutBubble)


    // Pie Chart

        // slice 10 values
        individual['sample_values'] = individual['sample_values'].slice(0,11)
        individual['otu_ids'] = individual['otu_ids'].slice(0,11)

        let tracePie = {
          values: individual['sample_values'],
          labels: individual['otu_ids'],
          hovertext: individual['otu_labels'],
          type: 'pie',
          hole: .4,
          colorscale: 'jet'
          }
      

      console.log(tracePie)

      let dataPie = [tracePie]

      let layoutPie = {
          title: `Sample ${sample}`,
          // height: 500,
          // width: 500
          }

      Plotly.newPlot('pie', dataPie, layoutPie)

    })
  }
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
