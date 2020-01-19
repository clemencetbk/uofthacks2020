const msg_per_day = 10; // Arbitrary # of messages that close friends send per day
const max_dist = 1000; // Arbitrary max # of kilometers for proximity to have a positive impact
const ms_in_day = 1000 * 60 * 60 * 24;

export default function getCloseness(msg_json, loc_json1, loc_json2) {
    let points = getDigitalCloseness(msg_json);
    let physical_pts = getPhysicalCloseness(loc_json1, loc_json2);
    let j = 0; // index for physical_pts
    for (var i = 0; i < points.length; i++) {
        while (j < physical_pts.length - 1 && physical_pts[j][0] < points[i][0]) {
            j++;
        }
        while (i < points.length - 1 && points[i][0] < physical_pts[j][0]) {
            i++;
        }
        points[i][1] = points[i][1] * physical_pts[j][1] / max_dist;
    }
    return points;
}

function getDigitalCloseness(msg_json) {
    let points = [];
    let messages = msg_json["messages"];
    let prev_date = 0;
    let msg_count = 0;
    for (var i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];
        let curr_date = ms_to_days(message.timestamp_ms);
        if (i == messages.length - 1) {
            prev_date = curr_date;
        }
        if (curr_date != prev_date) {
            while (prev_date + ms_in_day != curr_date) { // Missing some days in between
                prev_date += ms_in_day;
                points.push([prev_date, 1]);
            }
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
    for (var i = 0; i < locations1.length && i2 < locations2.length; i++) {
        let loc1 = locations1[i];
        let loc2 = locations2[i2];
        let curr_date1 = ms_to_days(loc1["timestampMs"]);
        if (i == 0) {
            prev_date = curr_date1;
        }
        let curr_date2 = ms_to_days(loc2["timestampMs"]);
        // Iterate through locations2 until dates match
        while (curr_date2 != curr_date1 && i2 < locations2.length) {
            loc2 = locations2[i2];
            curr_date2 = ms_to_days(loc2["timestampMs"]);
            i2++;
        }
        // Sample location for curr day
        let distance = getDistance(loc1["latitudeE7"], loc1["longitudeE7"], 
                                   loc2["latitudeE7"], loc2["longituteE7"]);
        if (distance < max_dist) {
            points.push([curr_date1, distance]);
        } else {
            points.push([curr_date1, max_dist]);
        }
        // Iterate until finding new day
        while (curr_date1 == prev_date && i < locations1.length) {
            loc1 = locations1[i];
            curr_date1 = ms_to_days(loc1["timestampMs"]);
            i++;
        }
        prev_date = curr_date1
    }
    return points;
}

function ms_to_days(millis) {
    return Math.floor(millis / (ms_in_day)) * ms_in_day;
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