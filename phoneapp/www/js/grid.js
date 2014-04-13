$(document).ready(function() {
    $.support.cors = true;
    $(".grid-link").click(showGridPage);
    $(".employees-link").click(showEmployeePage);
    $(".swap-link").click(showSwapPage);
    $(".settings-link").click(showSettingsPage);

    $("#daily-view-button").click(showDailyGrid);
    $("#weekly-view-button").click(showWeeklyGrid);

    $("#next-day").click(nextDay);
    $("#previous-day").click(previousDay);
    $("#previous-day").addClass("ui-disabled");

    $("#send-swap").click(sendSwap);
    $("#send-swap-div").hide();

    $("#inputsubmit").click(login);

    checkLogin(); // Check if the user is registered
});

var BASE_URL = "http://ec2-54-187-51-202.us-west-2.compute.amazonaws.com:3000";

var checkLogin = function() {
    if (!window.localStorage.getItem("token")) { // User is not registered
        showLoginPage();
    } else {
        login(function() {
            $("#footing").show();
            $("#headtitle").show();
            showGridPage();
        });

    }
}

var login = function(callback) {
    var token = $("#name").val();
    if (window.localStorage.getItem("token")) {
        token = window.localStorage.getItem("token");
    }
    $.post(BASE_URL + "/user/signin", {userId: token}, function (data) {
        if (data.response == "OK") {
            window.localStorage.setItem('token', data.myUser._id);
            window.localStorage.setItem('name', data.myUser.name);
            window.localStorage.setItem('email', data.myUser.email);
            callback();
        }
        $("#inputsubmit").parent().removeClass("ui-disabled");
    }).fail(function() { // Failed
        $("#inputsubmit").parent().removeClass("ui-disabled");
    });
    $("#inputsubmit").parent().addClass("ui-disabled");
}

var dailyIndex = 0;

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
        "date": "4/13/2014",
        "hasShift": false,
        "shifts":[],
        "notes": null
    },
    {
        "date": "4/14/2014",
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
        "date": "4/15/2014",
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

var loginPage = function() {
    goToPage("login-page")
}

var showGridPage = function() {
    $("#head-title-text").text("ShiftSwap");
    $.post(BASE_URL + "/user/getmyschedule", {userId: "5349f92d72088bf96304ecfa"}, function(data) {
        console.log(data.response);
    });
    goToPage("grid-page");
    showDailyGrid();
}

var showEmployeePage = function() {
    $("#head-title-text").text("ShiftSwap");
    goToPage("employees-page");
    showEmployeeList();
}

var showSwapPage = function() {
    $("#head-title-text").text("ShiftSwap");
    if ($("#pending-swaps").children().length == 0 && $("#users-choices").children().length == 0)
        $("#swap-view").css("border", "none");
    else
        $("#swap-view").css("border", "4px solid #444444");
    // Load Swaps HERE
    goToPage("swap-page");
}

var showLoginPage = function() {
    goToPage("login-page");
    $("#footing").hide();
    $("#headtitle").hide();
}

var loadSwapPage = function(time, date, partner) {
    scheduleData = getScheduleData();
    $("#partner-name").text(partner);
    $("#partner-choice-text").text(date + ": " + time);

    var head = document.getElementById("users-choices");
    for (var i = 0; i < scheduleData.schedule.length; i++) {
        if (scheduleData.schedule[i].hasShift) {
            for (var j = 0; j < scheduleData.schedule[i].shifts.length; j++) {
                var date = scheduleData.schedule[i].date;
                var startTime = get12HourTime(scheduleData.schedule[i].shifts[j].startTime);
                var endTime = get12HourTime(scheduleData.schedule[i].shifts[j].endTime);
                $("#users-choices").append("<div class='ui-radio'><input type='radio' name='shift' id='shift-" + i + "-" + j + "' /><label date='" + date + "' startTime='" + startTime + "' endTime='" + endTime + "' class='userShifts' for='shift-" + i + "-" + j + "'>" + date + ": " + startTime + " - " + endTime + "</label></div>").trigger("create");
            }
        }
    }

    $("#send-swap-div").show();
    showSwapPage();
}

var sendSwap = function() {
    if ($(".ui-radio-on.userShifts").exists()) {
        console.log($(".ui-radio-on.userShifts").attr("date"));
        console.log($(".ui-radio-on.userShifts").attr("startTime"));
        console.log($(".ui-radio-on.userShifts").attr("endTime"));

        // SEND TO SERVER
        $("#send-swap-div").hide();
        $("#users-choices").empty();
    } else {
        console.log("Select an element");
    }

    if ($("#pending-swaps").children().length == 0 && $("#users-choices").children().length == 0)
        $("#swap-view").css("border", "none");
}

var showSettingsPage = function() {
    $("#head-title-text").text("ShiftSwap");
    $("#employeeID").text(window.localStorage.getItem("token"));
    $("#username").text(window.localStorage.getItem("name"));
    $("#useremail").text(window.localStorage.getItem("email"));
    $("#settingbox2").click(function () {
        window.localStorage.clear();
        $("#name").val('');
        checkLogin();
    });
    goToPage("settings-page");

}

var getEmployeeData = function() {
    return employeeData;
}

var getScheduleData = function() {
    return scheduleData;
}

var nextDay = function() {
    scheduleData = getScheduleData();

    if (dailyIndex < scheduleData.schedule.length - 1) {
        dailyIndex++;
        $("#previous-day").removeClass("ui-disabled");
    }

    if (dailyIndex == scheduleData.schedule.length - 1)
        $("#next-day").addClass("ui-disabled");

    showDailyGrid();
}

var previousDay = function() {
    if (dailyIndex >= 1) {
        dailyIndex--;
        $("#next-day").removeClass("ui-disabled");
    }

    if (dailyIndex == 0)
        $("#previous-day").addClass("ui-disabled");

    showDailyGrid();
}

var goToPage = function(page) {
    var pages = ["grid-page", "swap-page", "employees-page", "settings-page", "login-page"];
    var domPages = [$("#grid-page"), $("#swap-page"), $("#employees-page"), $("#settings-page"), $("#login-page")];

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

    employeeData = getEmployeeData();

    for (var i = 0; i < employeeData.employees.length; i++) {
        var employee = document.createElement("li");
        var button = document.createElement("a");

        button.className = "employee ui-btn ui-btn-icon-right ui-icon-carat-r";
        button.appendChild(document.createTextNode(employeeData.employees[i].name));

        employee.appendChild(button);
        head.appendChild(employee);
    }
    $(".employee").click(showEmployeeSchedule);
}

var showEmployeeSchedule = function() {
    employeeData = getEmployeeData();
    scheduleData = getScheduleData();
    $("#head-title-text").text(this.text);

    for (var i = 0; i < employeeData.employees.length; i++) {
        if (employeeData.employees[i].name.toLowerCase() == this.text.toLowerCase()) {
            $("#employee-schedule").empty();
            $("#employee-list-view").hide();
            $("#employee-schedule-view").show();

            var head = document.getElementById("employee-schedule");

            for (var z = 0; z < employeeData.employees[i].schedule.length; z++) {
                var day = document.createElement("li");
                var date = getDateString(employeeData.employees[i].schedule[z].date);
                day.appendChild(document.createTextNode(date));
                day.className = "ui-li-divider ui-bar-inherit";
                day.setAttribute("data-role", "list-divider");
                head.appendChild(day);

                if (employeeData.employees[i].schedule[z].hasShift) {
                    for (var j = 0; j < employeeData.employees[i].schedule[z].shifts.length; j++) {
                        var shift = document.createElement("li");
                        var button = document.createElement("a")

                        var text = get12HourTime(employeeData.employees[i].schedule[z].shifts[j].startTime) + " - " + get12HourTime(scheduleData.schedule[z].shifts[j].endTime);
                        button.className = "ui-btn ui-icon-forward ui-btn-icon-right ui-shadow ui-corner-all";
                        button.appendChild(document.createTextNode(text));
                        button.value = employeeData.employees[i].schedule[z].date;
                        button.onclick = swap;

                        shift.appendChild(button);
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

var swap = function() {
    var time = this.text;
    var date = this.value;
    var partner = $("#head-title-text").text();

    loadSwapPage(time, date, partner);
}

var showDailyGrid = function () {
    $("#week-view").hide();
    $("#day-view").show();
    $("#daily-times").empty();
    $("#daily-view-button").addClass("ui-btn-active ui-state-persist");
    $("#weekly-view-button").removeClass("ui-btn-active ui-state-persist");

    scheduleData = getScheduleData();

    var currentDay = scheduleData.schedule[dailyIndex];
    $("#daily-title").text(getDateString(currentDay.date));

    var head = document.getElementById("daily-times");

    for (var i = 0; i < currentDay.shifts.length; i++) {
        var shift = document.createElement("li");
        shift.className = "ui-li-static ui-body-inherit";
        var text = get12HourTime(currentDay.shifts[i].startTime) + " - " + get12HourTime(currentDay.shifts[i].endTime);
        shift.appendChild(document.createTextNode(text));

        head.appendChild(shift);
    }

    $("#daily-notes").text(currentDay.notes ? currentDay.notes : "None");
}

var showWeeklyGrid = function() {
    $("#day-view").hide();
    $("#week-view").show();
    $("#schedule-list").empty();
    var head = document.getElementById("schedule-list");

    scheduleData = getScheduleData();

    for (var i = 0; i < scheduleData.schedule.length; i++) {
        var day = document.createElement("li");
        day.appendChild(document.createTextNode(getDateString(scheduleData.schedule[i].date)));
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

var getDateString = function(dateString) {
    var date = new Date(dateString);
    return date.toDateString();
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

$.fn.exists = function () {
    return this.length !== 0;
}
