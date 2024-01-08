let map = L.map('map', {
    center: [24,4],
    zoom: 2
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Declare global variables
let geoLayer;
let passportData;
let geoData;
let popupTimeout;

// Load paths
const passport_db = '/data/passport_data'
const geoDataPath = '/data/geo_data'

// Read geoJSON into geoData
d3.json(geoDataPath).then(data => {
    console.log(data);
    geoData = data;
    init();
})

// Add a legend to map
let legend = L.control({ position: 'bottomleft' });
legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let entry = ['Selected Country', 'Visa Free', 'Visa on Arrival', 'e-visa', 'Visa Required', 'No Admission', 'Other']
    let labels = [];
    let legendInfo = "<h3>Legend</h3>";
    div.innerHTML = legendInfo;
    entry.forEach(function(entry, index) {
      labels.push("<li style=\"background-color: " + requirementColor(entry) + "\">" + entry + "</li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

// Initialize
function init() {
    let dropdownMenu = d3.select('#countrySel');
    d3.json(passport_db).then(data=>{   
        passportData = data;
        console.log(passportData)
        let countries = [];
        data.forEach(function(row) {
            if (!countries.includes(row[0])) {
                countries.push(row[0]);
            }
        });
        countries.forEach(name => {
            dropdownMenu.append('option').text(name).property('value', name);
        });
        let selection = countries[0];
        console.log(selection);
        updateMap(selection);
        legend.addTo(map);
    });
};

// Update map with selection
function updateMap(selection) {
    let selectionData = passportData.filter(row => row[0] === selection);
    let requirements = entryRequirement(selectionData);
    vfd = visaFreeDays(selectionData);

    if (geoLayer) {
        map.removeLayer(geoLayer);
    }
    geoLayer = L.geoJson(geoData, {
        style: feature => {
            console.log(feature);
            let requirement = requirements[feature.properties.ISO_A2_EH];
            console.log(requirement);
            return {
                fillColor: requirementColor(requirement),
                weight: 2,
                opacity: 1,
                color: 'grey',
                fillOpacity: 0.7
            }
        },
        onEachFeature: (feature, layer)=> {
            clickFeature(feature, layer);
            layer.on({
                mouseover: hover=> {
                    clearTimeout(popupTimeout);
                    popupTimeout = setTimeout( function() {
                        let layer = hover.target;
                        let entryReq = '';
                        if (requirements[feature.properties.ISO_A2_EH] !== 'Selected Country') {
                            entryReq = `Entry Requirement: ${requirements[feature.properties.ISO_A2_EH]}`
                        } else {
                            entryReq = '</br>Selected Country'
                        }
                        let days = '';
                        if (vfd[feature.properties.ISO_A2_EH]) {
                            days = `Visa Free Days: ${vfd[feature.properties.ISO_A2_EH]}`;
                        }
                        layer.bindPopup(`${feature.properties.NAME} </br> ${entryReq} </br> ${days}`)
                            .openPopup(hover.latlng);
                    }, 500);
                },
                mouseout: hover=> {
                    clearTimeout(popupTimeout);
                    hover.target.closePopup();
                }
            });
    }}).addTo(map);
    updatePieChart(selection);
};

// Return the requirement based on destination code
function entryRequirement(data) {
    let requirements = {};
    data.forEach(row=>{
            requirements[row[3]] = row[4]
            });
    console.log(requirements)
    return requirements;
};

// Return the number of visa free days allowed 
function visaFreeDays(data) {
    let days = {};
    data.forEach(row => {
        if (row[4] === 'Visa Free') {
            days[row[3]] = row[5];
        }
    });
    return days;
};

// Add clickFeature function for when map is clicked
function clickFeature(feature, layer) {
    layer.on({
        click: click=> {
            // Map dropdown country name to iso code
            let codeToName = {};
            passportData.forEach(row => {
                codeToName[row[1]] = row[0];
            });
            let clickedCountry = feature.properties.ISO_A2_EH;
            let clickedCountryName = codeToName[clickedCountry];
            updateDropdownMenu(clickedCountryName);
        }
    })
};

// Run optionChanged() with the clicked selection
function updateDropdownMenu(clickedCountry) {
    let dropdownMenu = d3.select('#countrySel');
    dropdownMenu.property('value', clickedCountry);
    optionChanged(clickedCountry); 
};

// Create and update pie chart
function updatePieChart(selection) {
    let selectionData = passportData.filter(row => row[0] === selection);
    let requirementSums = {};
    selectionData.forEach(row => {
        let requirement = row[4];
        if (requirement !== 'Selected Country') {
            if (requirementSums[requirement]) {
                requirementSums[requirement]++;
            } else {
                requirementSums[requirement] = 1;
            }
        };
    });
    let trace = [{
        values: Object.values(requirementSums),
        labels: Object.keys(requirementSums),
        type: 'pie',
        marker: {colors: Object.keys(requirementSums).map(requirementColor)}
    }];
    let layout = {
        title: `Entry Requirement Distribution for ${selection}`,
        height: 600,
        width: 700,
        paper_bgcolor: 'rgba(255, 255, 255, 0.7)',
        legend: {x: 1, y:0}
    };
    Plotly.newPlot('pieChart', trace, layout)
};

// Return a color based on requirement
function requirementColor(requirement) {
    switch (requirement) {
        case 'Selected Country':
            return 'white';
        case 'e-visa':
            return '#f2c14e'; // yellow
        case 'Visa Required':
            return '#f78154'; // orange
        case 'Visa on Arrival':
            return '#4d9078'; // green
        case 'Visa Free':
            return '#5fad56'; // green
        case 'No Admission':
            return '#b4436c'; // red
        default:
            return '#d3d3d3'; // grey
    }
};

// Add the dropdown selection
function optionChanged(selection) {
    console.log(selection);
    updateMap(selection);
};

