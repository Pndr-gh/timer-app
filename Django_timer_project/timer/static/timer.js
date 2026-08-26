let timeIntervals = {};
let timesInSeconds;
let Selected_times;
let timerIdSaver;
let warning_selector = 0;
let isWarning = false;

let timerEndTimes = {};


let currentSessionId = null;
let currentCycleId = null;
let isFetchingSession = false;
let isFetchingCycle = false;


let alarmSound = null;






function format_time(timeInsecod){

        const seconds = timeInsecod % 60;
        const minutes = Math.floor(timeInsecod / 60) % 60;
        const hours = Math.floor(timeInsecod / 3600);
        const formattedTime = 
                (hours < 10 ? "0" + hours : hours) + ":" +
                (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                (seconds < 10 ? "0" + seconds : seconds);
        return formattedTime;
}

function handle_selector_exit() {
    let selectorHolder = document.getElementById('selector-overlay');
    selectorHolder.classList.toggle('editing-view');
}

function save_time(id){

    const minutes = parseInt(document.getElementById(('minute' + id)).value)  || 0;
    const seconds = parseInt(document.getElementById(('second' + id)).value) || 0;
    const hours = parseInt(document.getElementById(('hour' + id)).value) || 0;

    let totalSeconds = seconds + minutes * 60 + hours * 3600;
    if (totalSeconds < 0) totalSeconds = 0;

    timesInSeconds[id] = totalSeconds;
    Selected_times[id] = totalSeconds;
    
    const formattedTime = format_time(totalSeconds);

    timerNumber = document.querySelector(".timer_number" + id);
    timerNumber.innerHTML = formattedTime;


}

function save_all_times(){

    if (timesInSeconds[1] == 0){
        rest_skip_button();
        handle_session_pause();
    }

    save_time(0);
    save_time(1);

    currentSessionId = null;

    let selectorHolder = document.getElementById('selector-overlay');
    
    selectorHolder.classList.remove('editing-view');

    if (!isAuthenticated){
        return;
    }

    fetch("/save-time-prefrences/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: 
            JSON.stringify({
                'session_time': Selected_times[0],
                'cycle_time': Selected_times[1]
            })
            
        }
    )
    .then(responce => responce.json())
    .then(data => {
        console.log("prefrences saved successfully");
    })
    .catch(error => {
        console.error(error);
    });
    
}

function start_timer(id){
    clearInterval(timeIntervals[id]);

    // 1. Calculate the exact real-world time this timer should end
    timerEndTimes[id] = Date.now() + (timesInSeconds[id] * 1000);

    timeIntervals[id] = setInterval(() => {

        if (id == 0 && currentSessionId === null){
            addEmptyCycleToTimeline();
            activeTimelineElement_cssChanger();
            startNewSession();
        }
        else if(id == 1 && currentCycleId === null){
            startCycleInDjango();
        }

        // 2. Calculate actual remaining time by comparing real-world clock to our end time
        let currentTime = Date.now();
        let remainingSeconds = Math.round((timerEndTimes[id] - currentTime) / 1000);

        // Prevent negative time if the tab was asleep for a long time
        if (remainingSeconds < 0) remainingSeconds = 0;

        timesInSeconds[id] = remainingSeconds;
        let timeInSeconds = timesInSeconds[id];

        if (timeInSeconds <= 0){
            clearInterval(timeIntervals[id]);

            if (alarmSound) {
                alarmSound.currentTime = 0;
                alarmSound.loop = true;
                alarmSound.play().catch(e => console.log("Audio play prevented", e));
                
                setTimeout(() => {
                    if (alarmSound) {
                        alarmSound.pause();
                        alarmSound.loop = false;
                    }
                }, 3500);
            }

            const timerNumber = document.querySelector(".timer_number" + id);
            timerNumber.innerHTML = "Time's up!";
            
            if (id == 0){
                timesInSeconds[1] = 0;
                sendEndSessionDataToDjango();
                handle_session_pause();
                SessionElementInTimeline();
            }

            if (id == 1){
                handle_pomo_pause();
                sendDataToDjango(Math.floor(Selected_times[1] / 60));
                timerNumber.innerHTML = format_time(Selected_times[1]);
                changeEmptyToDoneCycleInTimeline();
            }
            else if (id == 2){
                rest_skip_button();
                start_timer(1);
                change_restmode_css();
                activeTimelineElement_cssChanger();
            }
            
            return;
        }

        const seconds = timeInSeconds % 60;
        const minutes = Math.floor(timeInSeconds / 60) % 60;
        const hours = Math.floor(timeInSeconds / 3600);
        const formattedTime = 
                (hours < 10 ? "0" + hours : hours) + ":" +
                (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                (seconds < 10 ? "0" + seconds : seconds);
                
        let timerNumber = document.querySelector(".timer_number" + id);
        timerNumber.innerHTML = formattedTime;

    }, 1000);
}

function reset_timer(id){
    clearInterval(timeIntervals[id]);


    let second = Selected_times[id] % 60;
    let hour = Math.floor(Selected_times[id] / 3600);
    let minute = Math.floor(Selected_times[id] / 60) % 60;
    const formattedTime = 
        (hour < 10 ? "0" + hour : hour) + ":" +
        (minute < 10 ? "0" + minute : minute) + ":" + 
        (second < 10 ? "0" + second : second);
    timesInSeconds[id] = Selected_times[id];
    timerNumber = document.querySelector(".timer_number" + id);
    timerNumber.innerHTML = formattedTime;
}

function pause_timer(id){
  clearInterval(timeIntervals[id]);
}

function upper_arrow(selector, id){
        
    const container = document.getElementById(
        (selector === 0 ? 'hour' : selector === 1 ? 'minute' : 'second') + id);
    let value = parseInt(container.value) || 0;

    if (selector == 0){
        
        value = Math.min(99, value + 1);

        container.value = value;
            
    }
    else if (selector == 1){

        if (container != 60){
            
            value ++;
            container.value = value;
            }
        else{
            container.value = 0;
        }
    }
    else if(selector == 2){
        
        if (value != 60){
            value++;
            container.value = value;
            }
        else{
            container.value = 0;
        }
    }

}

function lower_arrow(selector, id) {
    const el = document.getElementById(
        (selector === 0 ? 'hour' : selector === 1 ? 'minute' : 'second') + id
    );
    let value = parseInt(el.value) || 0;

    if (selector === 0) { // hours
        value = Math.max(0, value - 1);
    } else { // minutes & seconds
        value = (value - 1 + 60) % 60;
    }
    el.value = value;
}


function handle_edit(){
    handle_session_pause();
    let selectorHolder = document.getElementById('selector-overlay');
    selectorHolder.classList.toggle('editing-view');
}



function handle_pomo_pause(){

    timesInSeconds[1] = 0;

    let SessionStartButton = document.getElementById('session-start-button');
    if (SessionStartButton.classList.contains('pressed-pause')) {
        handle_session_start();
    }

    

    pause_timer(1);

    timesInSeconds[2] = Selected_times[2];
    start_timer(2);

    let circleHolder = document.getElementById('pomo-timer-circle');
    let restDivHolder = document.getElementById('rest-timer-overlay-div');
    let restTimeDivHolder = document.getElementById('rest-timer-div');

    circleHolder.classList.add('rest-mode');
    restDivHolder.classList.add('rest-mode');
    restTimeDivHolder.classList.add('rest-mode');

    change_restmode_css();

}

function handle_pomo_reset(id) {
    if (id == 0){
       if ((timesInSeconds[1] != 0) && (timesInSeconds[1] != Selected_times[1])){

            isWarning = true;    

            handle_session_pause();
            let WarningHolder = document.getElementById("pause-warning-background");
            let WarningParagraph = document.getElementById("warning-p");
            let lostTime = Selected_times[1] - timesInSeconds[1];
 
            WarningHolder.classList.toggle('warning-view');
            WarningParagraph.innerHTML = `You will lose -<strong> ${format_time(lostTime)} </strong>- of your session progress.<br> Are you sure you want to continue?`;

            }  
    }else if(id == 1 && warning_selector == 0){

        let WarningHolder = document.getElementById("pause-warning-background");
        WarningHolder.classList.toggle('warning-view');

        isWarning = false;
        
        let lostTime = Selected_times[1] - timesInSeconds[1];
        timesInSeconds[0] += lostTime;
        reset_timer(1);
        handle_session_start();

    }else if(id == 1 && warning_selector == 1){
        let WarningHolder = document.getElementById("pause-warning-background");
        WarningHolder.classList.toggle('warning-view');



        handle_session_3c();
        
    }

    else if(id == 1 && warning_selector == 2){
        let WarningHolder = document.getElementById("pause-warning-background");
        WarningHolder.classList.toggle('warning-view');

        

        handle_session_4c();
                
    }

    else {
        let WarningHolder = document.getElementById("pause-warning-background");
        WarningHolder.classList.toggle('warning-view');

        isWarning = false;

        handle_session_start();
    }
  
}

function handle_session_start(){

    
    start_timer(0);
    let startButtonHolder = document.getElementById('session-start-button');
    let pauseButtonHolder = document.getElementById('session-pause-button');

    pauseButtonHolder.classList.add('pressed-start');
    startButtonHolder.classList.add('pressed-start');
    pauseButtonHolder.classList.remove('pressed-pause');
    startButtonHolder.classList.remove('pressed-pause');


    let PomoPlayButtonHolder = document.getElementById('pomo-play-button');
    let PomoPauseButtonHolder = document.getElementById('pomo-pause-button');
    PomoPlayButtonHolder.classList.toggle('pressed-pause');
    PomoPauseButtonHolder.classList.toggle('pressed-pause');

    if (timesInSeconds[1] != 0){
        start_timer(1);

    }
    else {
        start_timer(2);
    }

}

function handle_session_pause(){
    if (timesInSeconds[1] == 0){
        pause_timer(2);
    }
    
    pause_timer(1); 

    let startButtonHolder = document.getElementById('session-start-button');
    let pauseButtonHolder = document.getElementById('session-pause-button');
    pauseButtonHolder.classList.remove('pressed-start')
    startButtonHolder.classList.remove('pressed-start')
    pauseButtonHolder.classList.add('pressed-pause')
    startButtonHolder.classList.add('pressed-pause')


    let PomoPlayButtonHolder = document.getElementById('pomo-play-button');
    let PomoPauseButtonHolder = document.getElementById('pomo-pause-button');
    PomoPlayButtonHolder.classList.add('pressed-pause');
    PomoPauseButtonHolder.classList.add('pressed-pause');

    pause_timer(0);

}

function handle_session_reset(){

    if (timesInSeconds[1] == 0){
        rest_skip_button();
        handle_session_pause();
        

    }

    reset_timer(0);
    reset_timer(1);

    currentSessionId = null;



    let resetButtonHolder = document.getElementById('session-start-button');
    if (resetButtonHolder.classList.contains('pressed-start')){
        start_timer(0);
        start_timer(1);
    }

    
}

function rest_skip_button() {
    
    timesInSeconds[1] = Selected_times[1];

    pause_timer(2);
    start_timer(1);

    let startButtonHolder = document.getElementById('session-start-button');
    if (startButtonHolder.classList.contains('pressed-pause')){
        handle_session_start(); 
    }

    change_restmode_css();
    activeTimelineElement_cssChanger();
    


    let restDivHolder = document.getElementById('rest-timer-overlay-div');
    let restTimeDivHolder = document.getElementById('rest-timer-div');

    restDivHolder.classList.remove('rest-mode');
    restTimeDivHolder.classList.remove('rest-mode');
}

function plus5_button() {
    timesInSeconds[2] += 300;
    
    // Push the target end time forward by 5 minutes (300,000 milliseconds)
    if (timerEndTimes[2]) {
        timerEndTimes[2] += 300 * 1000;
    }

    let startButtonHolder = document.getElementById('session-start-button');
    if (startButtonHolder.classList.contains('pressed-pause')){
        handle_session_start();
    }
}


// session functions

function handle_session_3c() {

    let startButtonHolder = document.getElementById('session-start-button');
    if (startButtonHolder.classList.contains('pressed-start')){
        handle_session_pause();
    }

    

    if ((timesInSeconds[0] != 0) && (timesInSeconds[1] != Selected_times[1]) && (isWarning == false)){

        isWarning = true;

        let WarningHolder = document.getElementById("pause-warning-background");
        let WarningParagraph = document.getElementById("warning-p");
        let lostTime = Selected_times[0] - timesInSeconds[0];
        warning_selector = 1;

        WarningHolder.classList.toggle('warning-view');
        WarningParagraph.innerHTML = `You will lose  <strong>${format_time(lostTime)}</strong>  of your session progress. Are you sure you want to continue?`;

        } 
    else{

        if (timesInSeconds[1] == 0){
            rest_skip_button();
            handle_session_pause();
        }
        currentSessionId = null;

        isWarning = false;

    


        handle_edit_number_change(5100, 0);
        handle_edit_number_change(1500, 1);
        


        save_all_times();

        warning_selector = 0;
    }
        

}

function handle_session_4c(){
    let startButtonHolder = document.getElementById('session-start-button');
    if (startButtonHolder.classList.contains('pressed-start')){
        handle_session_pause();
    }

    if ((timesInSeconds[0] != 0) && (timesInSeconds[1] != Selected_times[1]) && (isWarning == false)){

        isWarning = true;

        let WarningHolder = document.getElementById("pause-warning-background");
        let WarningParagraph = document.getElementById("warning-p");
        let lostTime = Selected_times[1] - timesInSeconds[1];
        warning_selector = 2;

        WarningHolder.classList.toggle('warning-view');
        WarningParagraph.innerHTML = `You will lose  <strong>${format_time(lostTime)}</strong>  of your session progress. Are you sure you want to continue?`;

        } 
    else{

        currentSessionId = null;

        isWarning = false;

        if (timesInSeconds[1] == 0){
            rest_skip_button();
            handle_session_pause();
        }

        handle_edit_number_change(6900, 0);
        handle_edit_number_change(1500, 1);

        save_all_times();

        warning_selector = 0;
    }


}

// edit functions

function handle_edit_number_change(seconds, selector){
    let formatedSeconds = seconds % 60;
    let formatedMinutes = Math.floor(seconds / 60) % 60;
    let formatedHours = Math.floor(seconds / 3600);

    let editHourHolder = document.getElementById('hour' + selector);
    let editMinuteHolder = document.getElementById('minute' + selector);
    let editSecondHolder = document.getElementById('second' + selector);

    let mainTimerHolder = document.getElementById('timer_number' + selector);
    mainTimerHolder.innerHTML = format_time(seconds);

    editHourHolder.value = formatedHours;
    editMinuteHolder.value = formatedMinutes;
    editSecondHolder.value = formatedSeconds;
}

// backend-function

function startCycleInDjango(){

    if (!isAuthenticated){
        return;
    }

    if (currentCycleId !== null || isFetchingCycle){
        return;
    }

    isFetchingCycle = true;

    fetch('/start-cycle/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.cycle_id){
            currentCycleId = data.cycle_id;
            console.log("cycle started with ID:", currentCycleId);
        }
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        isFetchingCycle = false;
    });
}

function sendDataToDjango(totalMinute){

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const cycleData = {
        minute_amount: totalMinute,
        session_id: currentSessionId,
        cycle_id: currentCycleId
    };


    fetch('/save-cycle/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(cycleData)
    })
    .then(responce => responce.json())
    .then(data => {
        console.log("Cycle saved successfully", data);
    })
    .catch(error => {
        console.error("Error saving cycle:", error);
    });

    currentCycleId = null;

}

function startNewSession() {

    if (!isAuthenticated){
        return;
    }

    if (currentSessionId !== null || isFetchingSession){
        return;
    }

    isFetchingSession = true;

    fetch('/start-session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.session_id){
            currentSessionId = data.session_id;
            console.log("Session started with ID:", currentSessionId);
        }
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        isFetchingSession = false;
    });
}

function sendEndSessionDataToDjango() {
    
    const sessionData = {
        'minute_amount': Math.floor(Selected_times[0] / 60),
        'session_id': currentSessionId
    }

    console.log(sessionData.minute_amount);
    

    fetch('/end-session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify(sessionData)

    })
    .then(responce => responce.json())
    .then(data => {
        console.log("session saved successfully", data)
    })
    .catch(error => {
        console.log("Error saving session", error)
    })

    currentSessionId = null;

}


// the functions bellow are for the timeline part

function addEmptyCycleToTimeline() {

    // const restAmount = Math.floor( ((Math.floor(Selected_times[0]) / 60) + 5) / ((Math.floor(Selected_times[1]) / 60) + 5) );
    
    let everyEmptyElement = document.getElementsByClassName('notDone-timeline-elements');

    for (let i = everyEmptyElement.length - 1; i >= 0; i --){
        everyEmptyElement[i].remove();
    }





    const cycleAmount = Math.floor( (Math.floor(Selected_times[0]) / 60) / ((Math.floor(Selected_times[1]) / 60) + 5) ) + 1;
    const restAmount = cycleAmount - 1;


    const timelineElement = document.getElementById('timeline_flex');
    

    for(let x = 0; x <cycleAmount; x++){

        const div = document.createElement("div");
        div.className = "timeline-elements notDone-timeline-elements";

        if (x == cycleAmount - 1){
            div.textContent = ((Math.floor(Selected_times[0]/ 60)) - ((cycleAmount - 1) * (Math.floor(Selected_times[1] / 60))) - (restAmount * 5) + 'm');
        }
        
        else{
            div.textContent = ((Selected_times[1] / 60) % 60) + 'm';
        }

        timelineElement.appendChild(div);
    }
    

}

function changeEmptyToDoneCycleInTimeline() {
    let firstTimelineElement = document.querySelector('.notDone-timeline-elements');
    const tc = firstTimelineElement.textContent;
    let new_element = document.createElement('div');
    new_element.className = "timeline-elements done-timeline-elements";
    new_element.textContent = tc;
    firstTimelineElement.replaceWith(new_element);

}

function activeTimelineElement_cssChanger() {
    const activeTimelineElement = document.querySelector('.notDone-timeline-elements');
    activeTimelineElement.classList.add('active-timeline-element');
    console.log('active-timeline-cssChanger ran!')
}

function SessionElementInTimeline(){
    const timelineElement = document.getElementById('timeline_flex');

    let everyEmptyElement = document.getElementsByClassName('done-timeline-elements');

    for (let i = everyEmptyElement.length - 1; i >= 0; i--) {
        everyEmptyElement[i].remove();
    }

    const cycleAmount = Math.floor( (Math.floor(Selected_times[0]) / 60) / ((Math.floor(Selected_times[1]) / 60) + 5) ) + 1;
    const allSessionDiv = document.createElement('div');
    allSessionDiv.className = "timeline-elements timeline-session-element";
    allSessionDiv.textContent = ((Selected_times[0] / 60)) + "m session done";

    timelineElement.append(allSessionDiv);
}

// other functions

function handle_hamburger(){
    let navHolder = document.getElementById('navbar');
    navHolder.classList.toggle("mobile-view");
}

function change_restmode_css(){
    let headElement = document.querySelector('head');
    let playButtonElement = document.getElementById('session-start-button');
    let restDivHolder = document.getElementById('rest-timer-div');
    const existingCss = document.getElementById('rest-css');


    if (!existingCss){

        const restCss = document.createElement('link');
        restCss.rel = 'stylesheet';
        restCss.id = 'rest-css';
        restCss.href = restDivHolder.dataset.restCss;
        headElement.append(restCss);

        console.log('css changed');
    }
    
    else {
        if (existingCss){
            existingCss.remove();

            console.log('css not changed');
        }
    }
    
}


