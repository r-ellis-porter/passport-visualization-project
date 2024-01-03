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
const geoDataPath = 'Resources/country_borders.json'

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
            let requirement = requirements[feature.properties.ISO_A2];
            return {
                fillColor: requirementColor(requirement),
                weight: 2,
                opacity: 1,
                color: 'grey',
                fillOpacity: 0.7
            };
        }
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
        case '-1':
            return 'white';
        case 'e-visa':
            return 'orange';
        case 'visa required':
            return 'yellow';
        case 'visa on arrival':
            return 'blue';
        case 'visa free':
            return 'green';
        case 'no admission':
            return 'red';
        default:
            return 'gray';
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
    let entry = ['-1', 'e-visa', 'visa required', 'visa on arrival', 'visa free', 'no admission']
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

