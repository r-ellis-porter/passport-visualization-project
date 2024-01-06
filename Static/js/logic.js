let map = L.map('map', {
    center: [24,4],
    zoom: 3
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Declare global variables
let geoLayer;
let passportData;
let geoData;

// Load paths
const passport_db = 'data/passport_data'
const geoDataPath = 'data/geo_data'

// Read geoJSON into geoData
d3.json(geoDataPath).then(data => {
    console.log(data);
    geoData = data;
    init();
})

// Add a legend to map
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let entry = ['Selected Country', 'Visa Free', 'Visa on Arrival', 'e-visa', 'Visa Required', 'No Admission', 'Other']
    let labels = [];

    // Add the legend title.
    let legendInfo = "<h3>Entry Requirements</h3>";

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

    if (geoLayer) {
        map.removeLayer(geoLayer);
    }
    geoLayer = L.geoJson(geoData, {
        style: feature => {
            let requirement = requirements[feature.properties.ISO_A2_EH];
            return {
                fillColor: requirementColor(requirement),
                weight: 2,
                opacity: 1,
                color: 'grey',
                fillOpacity: 0.7
            }
        },
        onEachFeature: clickFeature
    }).addTo(map);
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

// Add clickFeature function for when map is clicked
function clickFeature(feature, layer) {
    layer.on({
        click: click=> {
            // map dropdown country name to iso code
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

// Return a color based on requirement
function requirementColor(requirement) {
    switch (requirement) {
        case 'Selected Country':
            return 'white';
        case 'e-visa':
            return '#f59120'; // orange
        case 'Visa Required':
            return '#9078b6'; // purple
        case 'Visa on Arrival':
            return '#e1a2c9'; // pink
        case 'Visa Free':
            return '#94c23d'; // green
        case 'No Admission':
            return '#f1553d'; // red
        default:
            return '#d3d3d3'; // grey
    }
};

// Add the dropdown selection
function optionChanged(selection) {
    console.log(selection);
    updateMap(selection);
};


