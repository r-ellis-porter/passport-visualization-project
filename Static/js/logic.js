let map = L.map('map', {
    center: [14,0],
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
const passport_db = 'Resources/passport_db.csv'
const geoDataPath = 'Resources/country_boundaries_large.json'

// Read geoJSON into geoData
d3.json(geoDataPath).then(data => {
    console.log(data);
    geoData = data;
    init();
})

// initialize
function init() {
    let dropdownMenu = d3.select('#countrySel');
    d3.csv(passport_db).then(data=>{
        passportData = data;
        console.log(passportData)
        let countries = [];
        data.forEach(function(row) {
            if (!countries.includes(row.passport)) {
                countries.push(row.passport);
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
    let selectionData = passportData.filter(row => row.passport === selection);
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
            };
        }
        // ------------- dont forget this part ------------------
    // }).bindPopup(function (layer) {
    //     let origin = ;
    //     let entryRequirement = layer.feature.properties.place;
    //     let visaFreeDays = new Date(layer.feature.properties.time).toLocaleString();
    //     return `<h3>${place}<br>${date}<br>Magnitude: ${mag}</h3>`;
    }).addTo(map);
};

function entryRequirement(data) {
    let requirements = {};
    data.forEach(row=>{
            requirements[row.destination_code] = row.requirement;
    })
    console.log(requirements)
    return requirements;
};

function requirementColor(requirement) {
    // Return a color based on the requirement
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

// dropdown selection
function optionChanged(selection) {
    console.log(selection);
    updateMap(selection);
};

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

