$(document).ready(function() {
    $("#employees-page").hide();
    $(".grid-link").click(showGridPage);
    $(".employees-link").click(showEmployeePage);
    showGridPage();
});

var scheduleData = {"schedule":[
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

var employeeData = {"employees":[
    {
        "name": "Aaron",
        "schedule": scheduleData.schedule
    },
    {
        "name": "Karolina",
        "schedule": scheduleData.schedule
    },
    {
        "name": "Setareh",
        "schedule": scheduleData.schedule
    },
    {
        "name": "Ryan",
        "schedule": scheduleData.schedule
    }
]};

var showGridPage = function() {
    goToPage("grid-page");
    showWeeklyGrid();
}

var showEmployeePage = function() {
    goToPage("employees-page");
    showEmployeeList();
}

var goToPage = function(page) {
    var pages = ["grid-page", "swap-page", "employees-page", "settings-page"];
    var domPages = [$("#grid-page"), $("#swap-page"), $("#employees-page"), $("#settings-page")];

    var index = null;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i] == page) {
            index = i;
        }
    }

    if (index != null) {
        for (var i = 0; i < pages.length; i++) {
            if (pages[i] != page) {
                domPages[i].hide();
            }
        }
        domPages[index].show();
    }
}

var showEmployeeList = function() {
    $("#employee-list").empty();
    $("#employee-list-view").show();
    $("#employee-schedule-view").hide();
    var head = document.getElementById("employee-list");

    for (var i = 0; i < employeeData.employees.length; i++) {
        var employee = document.createElement("li");
        var button = document.createElement("a");

        button.className = "ui-btn ui-btn-icon-right ui-icon-carat-r";
        button.appendChild(document.createTextNode(employeeData.employees[i].name));
        button.onclick = showEmployeeSchedule;

        employee.appendChild(button);
        head.appendChild(employee);
    }
}

var showEmployeeSchedule = function() {
    for (var i = 0; i < employeeData.employees.length; i++) {
        if (employeeData.employees[i].name == this.text) {
            $("#employee-schedule").empty();
            $("#employee-list-view").hide();
            $("#employee-schedule-view").show();

            var head = document.getElementById("employee-schedule");

            for (var z = 0; z < employeeData.employees[i].schedule.length; z++) {
                var day = document.createElement("li");
                var date = new Date(employeeData.employees[i].schedule[z].date);
                day.appendChild(document.createTextNode(date.toDateString()));
                day.className = "ui-li-divider ui-bar-inherit";
                day.setAttribute("data-role", "list-divider");
                head.appendChild(day);

                if (employeeData.employees[i].schedule[z].hasShift) {
                    for (var j = 0; j < employeeData.employees[i].schedule[z].shifts.length; j++) {
                        var shift = document.createElement("li");
                        var text = get12HourTime(employeeData.employees[i].schedule[z].shifts[j].startTime) + " - " + get12HourTime(scheduleData.schedule[z].shifts[j].endTime);
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
            break;
        }
    }
}

var showWeeklyGrid = function() {
    $("#schedule-list").empty();
    var head = document.getElementById("schedule-list");

    for (var i = 0; i < scheduleData.schedule.length; i++) {
        var day = document.createElement("li");
        var date = new Date(scheduleData.schedule[i].date);
        day.appendChild(document.createTextNode(date.toDateString()));
        day.className = "ui-li-divider ui-bar-inherit";
        day.setAttribute("data-role", "list-divider");
        head.appendChild(day);

        if (scheduleData.schedule[i].hasShift) {
            for (var j = 0; j < scheduleData.schedule[i].shifts.length; j++) {
                var shift = document.createElement("li");
                var text = get12HourTime(scheduleData.schedule[i].shifts[j].startTime) + " - " + get12HourTime(scheduleData.schedule[i].shifts[j].endTime);
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

var get24HourTime = function(minutesSinceMidnight) {
    var hours = Math.round(minutesSinceMidnight / 60);
    var minutes = minutesSinceMidnight % 60;
    return padZero(hours)+  ":" + padZero(minutes);
}

var padZero = function(number) {
    return number.toString().length == 1 ? "0" + number.toString() : number;
}

var get12HourTime = function(minutesSinceMidnight) {
    if (minutesSinceMidnight == 0) {
        return "12:00 am"
    } else if(minutesSinceMidnight == 12 * 60) {
        return "12:00 pm"
    }
    var militaryTime = get24HourTime(minutesSinceMidnight);
    var time = militaryTime.split(":");
    var amPm = "am";
    if (parseInt(time[0]) > 12) {
        amPm = "pm";
        time[0] = padZero(parseInt(time[0]) - 12);
    }
    return time[0] + ":" + time[1] + " " + amPm;
}