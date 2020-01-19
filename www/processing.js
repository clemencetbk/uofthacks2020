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
    let i2 = 0; // curr index in locations2
    let prev_date = 0;
    for (var i = 0; i < locations1.length; i++) {
        let loc1 = locations1[i];
        let loc2 = locations2[i2];
        let curr_date1 = ms_to_days(loc1["timestampMs"]);
        if (i == 0) {
            prev_date = curr_date1;
        }
        let curr_date2 = ms_to_days(loc2["timestampMs"]);
        while (curr_date2 != curr_date1) { // Iterate through locations2 until dates match
            i2++;
            loc2 = locations2[i2];
            curr_date2 = ms_to_days(loc2["timestampMs"]);
        }
        // Sample location for curr day
        let distance = getDistance(loc1["latitudeE7"], loc1["longitudeE7"], 
                                   loc2["latitudeE7"], loc2["longituteE7"]);
        points.push([curr_date1, distance]);
        // Iterate until finding new day
        while (curr_date1 == prev_date) {
            i++;
            loc1 = locations1[i];
            curr_date1 = ms_to_days(loc1["timestampMs"]);
        }
        prev_date = curr_date1
    }
    return points;
}

function ms_to_days(millis) {
    return Math.floor(millis.timestamp_ms / (1000 * 60 * 60 * 24));

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