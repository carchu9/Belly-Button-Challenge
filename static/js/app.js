// using D3 library to select dropdown menu and add sample to the the menu
function init() {
    let dropdown = d3.select('#selDataset');

    d3.json('samples.json').then((data) => {
        let sampleNames = data.names;
        
        sampleNames.forEach((sample) => {

            // loop through data
            dropdown
            .append("option")
            .text(sample)
            .property("value", sample);

        });
        // Using first sample to create initial plots
        let initialSample = sampleNames[0];

        // log the value of the data
        console.log(initialSample);

        // build the initial plot
        buildCharts(initialSample);
        buildMetadata(initialSample);
    });
};

// intialize dashboard
init();

// update dashboard when sample changes
function optionChanged(newData) {
    buildMetadata(newData);
    buildCharts(newData);
};

// Demographic Panel
function buildMetadata(sample) {
    d3.json('samples.json').then((data) => {
        let metaData = data.metadata;
        let metadataResult = metaData.filter(sampleObj => sampleObj.id == sample);

        // log data
        console.log(metadataResult)

        let results = metadataResult[0];

        // Select panel with the id of the sample-metadata
        let PANEL = d3.select('#sample-metadata');

        // clear existing metadata
        PANEL.html("");

        // Using Object.entries to add key and value to the panel
        Object.entries(results).forEach(([key, value]) => {
            console.log(key, value);

            PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Create function to build bar charts
function buildCharts(sample) {
    // retrieve data to build charts
    d3.json('samples.json').then((data) => {
        let sampleData = data.samples;

        // add desired values to variable
        let sampleDatafilter = sampleData.filter(sampleObj => sampleObj.id == sample);
        let SampleData = sampleDatafilter[0];

        // using desired data as values for the charts
        let sample_values = SampleData.sample_values;
        let otu_ids = SampleData.otu_ids;
        let otu_labels = SampleData.otu_labels;

        // display labels and values in descending value
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0, 10).reverse();
        let labels = otu_labels.slice(0, 10).reverse();

        // set variable for bar graph
        let bardata = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Use plotly to create bar chart
        Plotly.newPlot("bar", [bardata]);

        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_ids,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Use plotly to create bubble chart
        Plotly.newPlot("bubble", [bubbleData]);
    });
}