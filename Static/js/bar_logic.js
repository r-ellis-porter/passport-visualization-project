// Load paths
const passport_db = 'data/passport_data'
// const geoDataPath = 'data/geo_data'              // delete

// // Read geoJSON into geoData                     // delete
// d3.json(geoDataPath).then(data => {
//     console.log(data);
//     geoData = data;
//     init();
// });

// Declare global variables
let passportData;
// let geoData;                                     // delete

// initialize
function init() {
    let dropdownMenu = d3.select('#selRequirement');
    d3.json(passport_db).then(data=>{   
        passportData = data;
        console.log(passportData)
        let requirements = [];
        data.forEach(function(row) {
            if (!requirements.includes(row[4]) && row[4] !== 'Selected Country') {
                requirements.push(row[4]);
            }
        });
        requirements.forEach(requirement => {
            dropdownMenu.append('option').text(requirement).property('value', requirement);
        });
        let selection = requirements[0];
        console.log(selection);
        sortedData(selection).then(data => {
            topBarChart(data.top10);
            bottomBarChart(data.bottom10);
        });
    });
};

// Add the dropdown selection
function optionChanged(selection) {
    console.log(selection);
    sortedData(selection).then(data=>{
        topBarChart(data.top10);
        bottomBarChart(data.bottom10);
    })
};

// ---- ^^ should be good ------                            // delete

// Return slice of top/bottom 10 countries with selected requirement
function sortedData(requirement) {
    return d3.json(passport_db).then((data) => {
        let filteredData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i][4] === requirement) {
                filteredData.push(data[i]);
            }
        }
        let countrySums = {};
        for (let i = 0; i < filteredData.length; i++) {
            let country = filteredData[i][0];
            if (countrySums[country]) {
                countrySums[country]++;
            } else {
                countrySums[country] = 1;
            }
        }
        let countrySumDict = [];
        for (let country in countrySums) {
            countrySumDict.push([country, countrySums[country]]);
        }
        countrySumDict.sort(function(a, b) {
            return b[1] - a[1];
        });

        let topTen = countrySumDict.slice(0, 10).reverse();
        let bottomTen = countrySumDict.slice(-10).reverse();
        console.log(topTen);
        console.log(bottomTen);
        return {top10: topTen, bottom10: bottomTen};
    });
};


// ################################## working below                             // delete


// top 10 bar chart
function topBarChart(data) {
    let xValues = [];
    let yValues = [];

    for (let i = 0; i < data.length; i++) {
        xValues.push(data[i][1]);
        yValues.push(data[i][0]);
    };

    let trace = {
        x: xValues,
        y: yValues,
        type: 'bar',
        orientation: 'h'
    };

    let layout = {
        title: 'Top 10 Countries',
        xaxis: { 
            title: 'Total Destinations' 
        }
    };

    Plotly.newPlot('topBar', [trace], layout);
};

// bottom 10 bar chart
function bottomBarChart(data) {
    let xValues = [];
    let yValues = [];

    for (let i = 0; i < data.length; i++) {
        xValues.push(data[i][1]);
        yValues.push(data[i][0]);
    }

    let trace = {
        x: xValues,
        y: yValues,
        type: 'bar',
        orientation: 'h'
    };

    let layout = {
        title: 'Bottom 10 Countries',
        xaxis: { 
            title: 'Total Destinations' 
        }
    };

    Plotly.newPlot('bottomBar', [trace], layout);
};

init();