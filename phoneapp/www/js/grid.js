var init = function() {
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

    $("#inputsubmit").click(function() {
        login(function() {
            $("#footing").show();
            $("#headtitle").show();
            showGridPage();
        });
    });

    checkLogin(); // Check if the user is registered
}

$(document).ready(function() {
    init();
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

var getData = function(callback) {
    $.post(BASE_URL + "/user/signin", {userId: window.localStorage.getItem('token')}, function (data) {
        if (data.response == "OK") {
            callback(data);
        }
    });
}

var showGridPage = function() {
    $("#head-title-text").text("ShiftSwap");
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
    if ($("#users-choices").children().length > 0)
        $("#swap-view").css("border", "none");
    else
        $("#swap-view").css("border", "4px solid #444444");
    goToPage("swap-page");
}

var showLoginPage = function() {
    goToPage("login-page");
    $("#footing").hide();
    $("#headtitle").hide();
}

var sendSwap = function() {
    if ($(".ui-radio-on.userShifts").exists()) {
        getData(function(data) {
            var to = window.localStorage.getItem('json');
            var from = $("#json-button").attr("data-json");

            var myID = window.localStorage.getItem('token');
            var toID = null;

            var partnerName = $("#partner-name").text();
            var users = data.manager.users;
            for (var i = 0; i < users.length; i++) {
                if (users[i].name == partnerName) {
                    toID = users[i]._id;
                }
            }
            $.post(BASE_URL + "/user/addswap", {"toId": toID, "assignmentFrom": JSON.parse(from), "assignmentTo": JSON.parse(to), "fromId": myID}, function(data) {
                console.log(data.response);
            });
        });
        $("#send-swap-div").hide();
        $("#users-choices").empty();
    }

    if ($("#pending-swaps").children().length == 0 && $("#users-choices").children().length == 0)
        $("#swap-view").css("border", "none");
}

var getIDForName = function(name) {
    getData(function(data) {
        var users = data.manager.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == name) {
                window.localStorage.setItem("partner", users[i]._id);
            }
        }
    });
}

var showSettingsPage = function() {
    $("#head-title-text").text("ShiftSwap");
    $("#employeeID").text(window.localStorage.getItem("token"));
    $("#username").text(window.localStorage.getItem("name"));
    $("#useremail").text(window.localStorage.getItem("email"));
    $("#settingbox2").click(function () {
        window.localStorage.clear();
        $("#inputsubmit").parent().removeClass("ui-disabled");
        $("#name").val('');
        checkLogin();
    });
    goToPage("settings-page");
}

var nextDay = function() {
    if (dailyIndex < 6) {
        dailyIndex++;
        $("#previous-day").removeClass("ui-disabled");
    }

    if (dailyIndex == 6)
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
    var buttons = [$("#grid-link-button"), $("#swap-link-button"), $("#employees-link-button"), $("#settings-link-button"), null];

    var index = null;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i] == page) {
            index = i;
            if (i != 4) {
                buttons[i].addClass("ui-btn-active");
                buttons[i].addClass("ui-state-persist");
            }
        } else if (i != 4) {
            buttons[i].removeClass("ui-btn-active");
            buttons[i].removeClass("ui-state-persist");
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
    getData(function(data) {
        $("#employee-list").empty();
        $("#employee-list-view").show();
        $("#employee-schedule-view").hide();
        var head = document.getElementById("employee-list");

        var users = data.manager.users;

        for (var i = 0; i < users.length; i++) {
            var employee = document.createElement("li");
            var button = document.createElement("a");

            button.className = "employee ui-btn ui-btn-icon-right ui-icon-carat-r";
            button.appendChild(document.createTextNode(users[i].name));
            employee.appendChild(button);
            head.appendChild(employee);
        }
        $(".employee").click(showEmployeeSchedule);
    });
}

var showEmployeeSchedule = function() {
    var self = $(this);
    getData(function(data) {
        var users = data.manager.users;
        var schedules = data.manager.schedules;

        $("#head-title-text").text(self.text());
        $("#employee-schedule").empty();
        $("#employee-list-view").hide();
        $("#employee-schedule-view").show();

        var head = document.getElementById("employee-schedule");

        for (var i = 0; i < schedules.length; i++) {
            for (var k = 0; k < 7; k++) {

                var days = $.grep(schedules[i].assignments, function(item) {
                    return item.day == k;
                });

                if (days.length > 0) {
                    var day = document.createElement("li");
                    var date = getDateString(parseInt(schedules[i].startTime) + 1000 * 60 * 60 * 24 * k);

                    day.appendChild(document.createTextNode(date));
                    day.className = "ui-li-divider ui-bar-inherit";
                    day.setAttribute("data-role", "list-divider");
                    head.appendChild(day);
                }

                for (var a = 0; a < days.length; a++) {

                    var assignment = days[a];
                    var users = assignment.users;
                    var start = assignment.start_minute;
                    var end = assignment.end_minute;

                    var found = false;
                    for (var l = 0; l < users.length; l++) {
                        if (users[l].toLowerCase() == self.text().toLowerCase()) {
                            found = true;
                            var shift = document.createElement("li");
                            var button = document.createElement("a");

                            var text = get12HourTime(start) + " - " + get12HourTime(end);
                            button.className = "ui-btn ui-icon-forward ui-btn-icon-right ui-shadow ui-corner-all";
                            button.appendChild(document.createTextNode(text));
                            button.onclick = swap;
                            button.value = parseInt(schedules[i].startTime) + 1000 * 60 * 60 * 24 * assignment.day;
                            button.setAttribute("data-json", JSON.stringify(assignment));
                            button.id = "json-button";
                            shift.appendChild(button);
                            head.appendChild(shift);
                        }
                    }
                }
            }
        }
    });
}

var loadSwapPage = function(time, date, partner) {
    $("#partner-name").text(partner);
    $("#partner-choice-text").text(date + ": " + time);
    $("#users-choices").empty();
    $.post(BASE_URL + "/user/getmyschedule", {userId: window.localStorage.getItem('token')}, function(data) {
        if (data.response == 'OK') {
            var schedules = data.schedules;
            for (var i = 0; i < schedules.length; i++) {
                for (var k = 0; k < 7; k++) {
                    var z = k;
                    var days = $.grep(schedules[i].assignments, function(item) {
                        return item.day == z;
                    });

                    var date = getAbrevDateString(parseInt(schedules[i].startTime) + 1000 * 60 * 60 * 24 * k);
                    for (var a = 0; a < days.length; a++) {
                        var startTime = get12HourTime(days[a].start_minute);
                        var endTime = get12HourTime(days[a].end_minute);
                        var x = Math.random() * 100000;
                        $("#users-choices").append("<div class='ui-radio'><input type='radio' name='shift' id='shift-" + i + "-" + k + '-' + a + '-' + x + "' /><label class='userShifts' for='shift-" + i + "-" + k + '-' + a + '-' + x + "'>" + date + ": " + startTime + " - " + endTime + "</label></div>").trigger("create");
                        window.localStorage.setItem('json', JSON.stringify(days[a]));
                    }
                }
            }
            $("#send-swap-div").show();
            showSwapPage();
        }
    });
}

var swap = function() {
    var time = $(this).text();
    var date = getAbrevDateString(this.value);
    var partner = $("#head-title-text").text();
    loadSwapPage(time, date, partner);
}

var showDailyGrid = function () {
    $.post(BASE_URL + "/user/getmyschedule", {userId: window.localStorage.getItem('token')}, function(data) {
        if (data.response == 'OK') {
            $("#week-view").hide();
            $("#day-view").show();
            $("#daily-times").empty();
            $("#daily-view-button").addClass("ui-btn-active ui-state-persist");
            $("#weekly-view-button").removeClass("ui-btn-active ui-state-persist");

            var head = document.getElementById("daily-times");

            schedules = data.schedules;
            for (var i = 0; i < schedules.length; i++) {
                for (var k = dailyIndex; k < dailyIndex + 1; k++) {
                    var z = k;
                    var days = $.grep(schedules[i].assignments, function(item) {
                        return item.day == z;
                    });

                    $("#daily-title").text(getDateString(parseInt(schedules[i].startTime) + 1000 * 60 * 60 * 24 * k));

                    for (var a = 0; a < days.length; a++) {
                        var shift = document.createElement("li");
                        shift.className = "ui-li-static ui-body-inherit";
                        var text = get12HourTime(days[a].start_minute) + " - " + get12HourTime(days[a].end_minute);
                        shift.appendChild(document.createTextNode(text));
                        head.appendChild(shift);
                    }
                }
            }
        }
    });
}

var showWeeklyGrid = function() {
    $.post(BASE_URL + "/user/getmyschedule", {userId: window.localStorage.getItem('token')}, function(data) {
        if (data.response == 'OK') {
            $("#day-view").hide();
            $("#week-view").show();
            $("#schedule-list").empty();
            var head = document.getElementById("schedule-list");

            schedules = data.schedules;
            for (var i = 0; i < schedules.length; i++) {
                for (var k = 0; k < 7; k++) {
                    var z = k;
                    var days = $.grep(schedules[i].assignments, function(item) {
                        return item.day == z;
                    });

                    var day = document.createElement("li");
                    day.appendChild(document.createTextNode(getDateString(parseInt(schedules[i].startTime) + 1000 * 60 * 60 * 24 * k)));
                    day.className = "ui-li-divider ui-bar-inherit";
                    day.setAttribute("data-role", "list-divider");
                    head.appendChild(day);


                    for (var a = 0; a < days.length; a++) {
                        var shift = document.createElement("li");
                        var text = get12HourTime(days[a].start_minute) + " - " + get12HourTime(days[a].end_minute);
                        shift.appendChild(document.createTextNode(text));
                        shift.className = "ui-li-static ui-body-inherit";
                        head.appendChild(shift);
                    }
                }
            }
        }
    });
}

var getAbrevDateString = function(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString("en-US");
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
