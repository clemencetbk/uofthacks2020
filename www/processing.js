const msg_per_day = 10; // Arbitrary # of messages that close friends send per day

export default function getCloseness(msg_json, loc_json) {
    return getDigitalCloseness(msg_json);
}

function getDigitalCloseness(msg_json) {
    let points = [];
    let messages = msg_json["messages"];
    let prev_date = 0;
    let msg_count = 0;
    for (var i = 0; i < messages.length; i++) {
        let message = messages[i];
        let curr_date = Math.floor(message.timestamp_ms / (1000 * 60 * 60 * 24));
        if (i == 0) {
            prev_date = curr_date;
        }
        if (curr_date != prev_date) {
            let score = 1 - Math.min(1, msg_count / msg_per_day);
            points.push([prev_date, score]);
            msg_count = 0;
            prev_date = curr_date;
        }
        msg_count += 1;
    }
    return points;
}

function getPhysicalCloseness(loc_json1, loc_json2) {
    let points = [];
    let locations1 = loc_json1["locations"];
    let locations2 = loc_json2["locations"];
    // Sample location for all days available
    // Get distance between points
    // Return array of (days, distance)
    return points;
}


// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistance(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}