$(document).ready(function() {
    populate();
});

var data = {"schedule":[
    {
        "date": "4/12/2014",
        "hasShift": true,
        "shifts":[
            {
                "startTime": 0,
                "endTime": 120
            },
            {
                "startTime": 600,
                "endTime": 660
            }
        ],
        "notes": null
    },
    {
        "date": "4/12/2014",
        "hasShift": false,
        "shifts":[],
        "notes": null
    },
    {
        "date": "4/13/2014",
        "hasShift": true,
        "shifts":[
            {
                "startTime": 328,
                "endTime": 984
            }
        ],
        "notes": null
    },
    {
        "date": "4/14/2014",
        "hasShift": true,
        "shifts":[
            {
                "startTime": 142,
                "endTime": 438
            },
            {
                "startTime": 579,
                "endTime": 800
            }
        ],
        "notes": null
    }
]};

function populate() {
    var head = document.getElementById("schedule-list");

    for (var i = 0; i < data.schedule.length; i++) {
        var day = document.createElement("li");
        var date = new Date(data.schedule[i].date);
        day.appendChild(document.createTextNode(date.toDateString()));
        day.className = "ui-li-divider ui-bar-inherit";
        day.setAttribute("data-role", "list-divider");
        head.appendChild(day);

        if (data.schedule[i].hasShift) {
            for (var j = 0; j < data.schedule[i].shifts.length; j++) {
                var shift = document.createElement("li");
                var text = get12HourTime(data.schedule[i].shifts[j].startTime) + " - " + get12HourTime(data.schedule[i].shifts[j].endTime);
                shift.appendChild(document.createTextNode(text));
                shift.className = "ui-li-static ui-body-inherit";
                head.appendChild(shift);
            }
        } else {
                var shift = document.createElement("li");
                shift.appendChild(document.createTextNode("Nothing"));
                shift.className = "ui-li-static ui-body-inherit";
                head.appendChild(shift);
        }
    }
}

function get24HourTime(minutesSinceMidnight) {
    var hours = Math.round(minutesSinceMidnight / 60);
    var minutes = minutesSinceMidnight % 60;
    return padZero(hours)+  ":" + padZero(minutes);
}

function padZero(number) {
    return number.toString().length == 1 ? "0" + number.toString() : number;
}

function get12HourTime(minutesSinceMidnight) {
    var militaryTime = get24HourTime(minutesSinceMidnight);
    var time = militaryTime.split(":");

    var amPm = "am";
    if (parseInt(time[0]) > 12) {
        amPm = "pm";
        time[0] = padZero(parseInt(time[0]) - 12);
    }
    return time[0] + ":" + time[1] + " " + amPm;
}