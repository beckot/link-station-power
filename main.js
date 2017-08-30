// Initiate the link station list.
const linkStations = [];


// ############################################
// Main Functions:
// ############################################

// Function - Add link station.
// --------------------------------

function addLinkStation() {

    // Clear status message.
    let statusNode = document.getElementById("status-message");
    statusNode.innerHTML = "";

    // Validate inputs.                
    let inputs = document.forms["link-station-info"].getElementsByTagName("input");
    for (i = 0; i < inputs.length; i++) {

        // Check non-button inputs only.
        if (inputs[i].type != "button") {

            // If a field does not pass validation, print the error message on page.
            if (inputs[i].checkValidity() == false) {
                let node = document.createElement("div");
                node.id = "message";
                node.classList.add("alert");
                node.classList.add("alert-danger");
                node.innerHTML = "<strong>Error:</strong> Enter a positive numerical value for each link station field.";
                statusNode.appendChild(node);
                return;
            }
        }

    }

    // Formulate a JSON object including the link station stats to add to the array.
    let linkStation = {
        "id": linkStations.length + 1,
        "x": document.getElementById("link-x").value,
        "y": document.getElementById("link-y").value,
        "reach": document.getElementById("link-reach").value
    }
    linkStations.push(linkStation);

    // Print the link station on the page and return.
    const p = document.createElement('p');
    p.innerHTML = "<strong>Station #" + linkStation.id + "</strong><br>" +
        "X: " + linkStation.x + "<br>" +
        "Y: " + linkStation.y + "<br>" +
        "Reach: " + linkStation.reach;
    document.getElementById('link-stations').appendChild(p)
    return;
}

// Function - Get the best link station.
// --------------------------------

function getBestLinkStationForDevice() {

    // Clear status message and set related variables up to print a suitable status message later on.
    const statusNode = document.getElementById("status-message");
    statusNode.innerHTML = "";
    const node = document.createElement("div");
    node.id = "message";

    // Validate form inputs.   
    let inputs = document.forms["device-coordinates"].getElementsByTagName("input");
    for (i = 0; i < inputs.length; i++) {

        // check non-button inputs only.
        if (inputs[i].type != "button") {

            // If a field does not pass validation, print the error message on page.
            if (inputs[i].checkValidity() == false) {
                node.classList.add("alert");
                node.classList.add("alert-danger");
                node.innerHTML = "<strong>Error:</strong> Enter a positive numerical value for each device coordinate.";
                statusNode.appendChild(node);
                return;
            }
        }
    }

    // Formulate a JSON object including the link station stats to add to the array.
    const deviceCoordinates = {
        "x": document.getElementById("device-x").value,
        "y": document.getElementById("device-y").value
    }

    //  Step #1: Calculate the best station
    // Extract power that each link station gives to the device.
    const devicePowers = linkStations.map(s => calculateDevicePowerFromStation(s, deviceCoordinates));

    //  Step #2:Calculate the best station 
    // Get the maximum power from all powers.
    const powerMax = Math.max(...devicePowers);

    // Reset the status message - accoun for possible errors in entries. 
    let statusHTML = "";
    node.classList.remove("alert-danger");
    node.classList.add("alert");

    // Maximum power of 0 means no stations are within reach. In that case we want to end here and print out a suitable message.
    if (powerMax === 0) {
        node.classList.add("alert-warning");
        statusHTML = "No link station within reach for point " +
            deviceCoordinates.x + "," +
            deviceCoordinates.y

        // Step #3: Calculate the best station 
        // Otherwise we have at least one suitable station and need to get its' coordinates and power.    
    } else {

        // Initiate an empty object where we gather all viable link stations.
        let viableLinkStations = {};

        // Filter the original array using the Max power to get a list of viable stations.
        viableLinkStations = linkStations.filter(s => calculateDevicePowerFromStation(s, deviceCoordinates) === powerMax);

        console.log(viableLinkStations);

        // Print a message on the page depending on the status.

        // Determine the message to print based on found link stations.
        if (viableLinkStations.length > 0) {

            node.classList.add("alert-success");

            // Print relevant coordinates.
            statusHTML = "Best link station for point " +
                deviceCoordinates.x + "," +
                deviceCoordinates.y + " is " +
                viableLinkStations[0].x + "," +
                viableLinkStations[0].y + " with power " +
                powerMax

            // Also print additional note in case there are several matches.
            if (viableLinkStations.length > 1) {
                statusHTML += "<br>" +
                    "<br>" +
                    "<strong>Note:</strong> there are several viable stations. All of the following link station ID's match these stats: " +
                    viableLinkStations.map(x => x.id).join();

            }
        }

        // Update the status message.
        node.innerHTML = statusHTML;
        statusNode.appendChild(node);
        return;
    }
}

// ############################################
// Helper functions
// ############################################

// Function - Distance calculation between two points (X,Y).
function calculateDistance(p, q) {
    var dx = p.x - q.x;
    var dy = p.y - q.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
}

//  Function - Power calculation to a device from a link station at a certain distance.
function calculatePower(reach, distance) {
    if (distance > reach) return 0;
    return Math.pow(reach - distance, 2);
}

//  Function - Power calculation using distance and device coordinates.
function calculateDevicePowerFromStation(stationStats, deviceStats) {
    return calculatePower(stationStats.reach, calculateDistance(stationStats, deviceStats));
}