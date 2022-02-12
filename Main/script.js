var day = $("#currentDay");
var container = $(".container");

//needs to be in 24hr so later on you can add to current day to get those times in reference to today
var hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

function setTime() {
    //format and display current date
    day.text(moment().format("dddd, MMMM Do"));
};

function getColor(theHour) {
    //formats time into just hour with AM/PM
    let format = "hA"
    //get current hour
    let currentHour = moment().hour(format);
    //start at today and add hours to get to reference hour
    let lineHour = moment().startOf('day').add(theHour, 'hours');
    let tense;

    //check if the hour has passed, is passing, or will come to pass
    if (moment(lineHour).isBefore(currentHour, 'hour')) {
        tense = "past";
    }
    else if (moment(lineHour).isSame(currentHour, 'hour')) {
        tense = "present";
    }
    else {
        tense = "future";
    }
    return tense;
};

$(function () {
    //Grab any pre-existing events
    let events = JSON.parse(localStorage.getItem("storedEvents"));
    if (events === null) {
        //intialize new array if nothing exists in local storage
        events = new Array(hours.length);
    };

    //loop through array and make a slot for each time
    for (let i = 0; i < hours.length; i++) {
        //get the background color of the slot
        let bgColor = getColor(hours[i]);
        let timeText;

        //create new time slot row
        let newRow = $("<div></div>").attr({
            id: hours[i],
            class: "row time-block"
        });

        //create time label
        let time = $("<div></div>").attr({
            class: "hour col-2"
        });
        //convert time from 24 hr to 12 hr
        if (hours[i] > 12) {
            timeText = (hours[i] - 12) + "PM";
        }
        else if (hours[i] == 12) {
            timeText = "12PM";
        }
        else {
            timeText = hours[i] + "AM";
        };
        $(time).text(timeText);

        //create textarea for event
        let event = $("<textarea></textarea>").attr({
            class: "description col " + bgColor,
            id: "text" + hours[i]
        });
        //add pre-existing events if they're on local storage
        if (events[i] !== undefined) {
            $(event).val(events[i]);
        }

        //create button to save event
        let save = $("<button></button>").attr({
            class: "saveBtn col-2"
        });
        $(save).on("click", function () {
            //get event
            let newEvent = $("#text" + hours[i]).val();
            //add to storage array
            events[i] = newEvent;
            //store back in local storage
            localStorage.setItem("storedEvents", JSON.stringify(events));
        });
        //append new elements to doc
        $(newRow).append(time);
        $(newRow).append(event);
        $(newRow).append(save);
        $('.container').append(newRow);
    };
});

setInterval(setTime, 1000);