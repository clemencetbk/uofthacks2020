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