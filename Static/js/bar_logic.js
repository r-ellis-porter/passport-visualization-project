// Load paths
const passport_db = 'data/passport_data'
const geoDataPath = 'data/geo_data'

// Read geoJSON into geoData
d3.json(geoDataPath).then(data => {
    console.log(data);
    geoData = data;
    init();
});

// Declare global variables
let passportData;
let geoData;

// initialize
function init() {
    let dropdownMenu = d3.select('#requierementSel');
    d3.json(passport_db).then(data=>{   
        passportData = data;
        console.log(passportData)
        let requirements = [];
        data.forEach(function(row) {
            if (!requirements.includes(row[4])) {
                requirements.push(row[4]);
            }
        });
        requirements.forEach(requirement => {
            dropdownMenu.append('option').text(requirement).property('value', requirement);
        });
        let selection = requirements[0];
        console.log(selection);
        topBarChart(selection);
        bottomBarChart(selection);
    });
};

// Add the dropdown selection
function optionChanged(selection) {
    console.log(selection);
    topBarChart(selection);
    bottomBarChart(selection);
};
// ---- ^^ should be good ------

// top 20 bar chart
function topBarChart(requirement) {
    d3.json(url).then((data)=>{
        let selection = data[4].filter(match=>match[4] === requirement);
        let trace = {
            x: selection,
            y: selection,

            text: selection,
            type: 'bar',
            orientation: 'h'
        };
        Plotly.newPlot('bar', [trace]);
    })
};

// bottom 20 bar chart
function bottomBarChart(requirement) {
    d3.json(url).then((data)=>{
        let selection = data[4].filter(match=>match[4] === requirement);
        let trace = {
            x: selection,
            y: selection,

            text: selection,
            type: 'bar',
            orientation: 'h'
        };
        Plotly.newPlot('bar', [trace]);
    })
};

