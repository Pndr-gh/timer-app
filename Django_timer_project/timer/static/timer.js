let timeIntervals = {};
let timesInSeconds = {0: 5100, 1: 1500, 2: 300};
let Selected_times = {0: 5100, 1: 1500, 2: 300 };
let timerIdSaver;
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
    let selectorHolder = document.getElementById('selector-holder');
    selectorHolder.classList.toggle('editing-view');
}

function save_time(id){

    const minutes = Number(document.getElementById(('minute' + id)).innerHTML);
    const seconds = Number(document.getElementById(('second' + id)).innerHTML);
    const hours = Number(document.getElementById(('hour' + id)).innerHTML);

    timesInSeconds[id] = seconds + minutes*60 + hours*3600;
    Selected_times[id] = seconds + minutes*60 + hours*3600;

    
    const formattedTime = 
        (hours < 10 ? "0" + hours : hours) + ":" +
        (minutes < 10 ? "0" + minutes : minutes) + ":" + 
        (seconds < 10 ? "0" + seconds : seconds);
    timerNumber = document.querySelector(".timer_number" + id);
    timerNumber.innerHTML = formattedTime;
    let selectorHolder = document.getElementById('selector-overlay');
    selectorHolder.classList.toggle('editing-view');
}

function start_timer(id){
    clearInterval(timeIntervals[id]);
    if (timesInSeconds[id] === undefined){
        timesInSeconds[id] = 0;
    }


    timeIntervals[id] = setInterval(() => {
        timesInSeconds[id]--;
        let timeInSeconds = timesInSeconds[id];
        if (timeInSeconds <= 0){
            clearInterval(timeIntervals[id]);
            const timerNumber = document.querySelector(".timer_number" + id);
            timerNumber.innerHTML = "Time's up!";
            if (id == 1){
                handle_pomo_pause();
            }

            else if (id == 2){
                rest_skip_button();
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
        timerNumber = document.querySelector(".timer_number" + id);
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
    if (selector == 0){
        let container = document.getElementById('hour' + id).innerHTML;
        container++;
        document.getElementById('hour' + id).innerHTML = container;
            
    }
    else if (selector == 1){
        let container = document.getElementById('minute' + id).innerHTML;
        if (container != 60){
            container++;
            document.getElementById('minute' + id).innerHTML = container;
            }
        else{
            document.getElementById('minute' + id).innerHTML = 0;
        }
    }
    else if(selector == 2){
        let container = document.getElementById('second' + id).innerHTML;
        if (container != 60){
            container++;
            document.getElementById('second' + id).innerHTML = container;
            }
        else{
            document.getElementById('second' + id).innerHTML = 0;
        }
    }

}

function lower_arrow(selector){
    if (selector == 0){
        let container = document.getElementById('hour').innerHTML;
        if (container != 0){
            container--;
            document.getElementById('hour').innerHTML = container;
        }
        else{
            document.getElementById('hour').innerHTML = 60;
        }

            
    }
    else if (selector == 1){
        let container = document.getElementById('minute').innerHTML;
        if (container != 0){
            container--;
            document.getElementById('minute').innerHTML = container;
            }
        else{
            document.getElementById('minute').innerHTML = 60;
        }
    }
    else if(selector == 2){
        let container = document.getElementById('second').innerHTML;
        if (container != 0){
            container--;
            document.getElementById('second').innerHTML = container;
            }
        else{
            document.getElementById('second').innerHTML = 60;
        }
    }

}

function handle_hamburger(){
    let navHolder = document.getElementById('navbar');
    navHolder.classList.toggle("mobile-view");
}

function handle_edit(){
    let selectorHolder = document.getElementById('selector-overlay');
    selectorHolder.classList.toggle('editing-view');
}

function handle_pomo_pause(){
    let SessionStartButton = document.getElementById('session-start-button');
    if (SessionStartButton.classList.contains('pressed-pause')) {
        handle_session_start();
    }

    

    pause_timer(1);
    timesInSeconds[1] = Selected_times[1];

    timesInSeconds[2] = Selected_times[2];
    start_timer(2);

    let circleHolder = document.getElementById('pomo-timer-circle');
    let restDivHolder = document.getElementById('rest-timer-overlay-div');
    let restTimeDivHolder = document.getElementById('rest-timer-div');

    circleHolder.classList.add('rest-mode');
    restDivHolder.classList.add('rest-mode');
    restTimeDivHolder.classList.add('rest-mode');

}

function handle_pomo_reset(id) {
    if (id == 0){
        handle_session_pause();
        if ((timesInSeconds[1] != 0) && (timesInSeconds[1] != Selected_times[1])){
            let WarningHolder = document.getElementById("pause-warning-background");
            let WarningParagraph = document.getElementById("warning-p");
            let lostTime = Selected_times[1] - timesInSeconds[1];

            WarningHolder.classList.toggle('warning-view');
            WarningParagraph.innerHTML = `You will lose  <strong>${format_time(lostTime)}</strong>  of your session progress. Are you sure you want to continue?`;

    }  
    }else if(id == 1){

        let WarningHolder = document.getElementById("pause-warning-background");
        WarningHolder.classList.toggle('warning-view');
        
        let lostTime = Selected_times[1] - timesInSeconds[1];
        timesInSeconds[0] += lostTime;
        reset_timer(1);
        handle_session_start();

    }else {
        let WarningHolder = document.getElementById("pause-warning-background");
        WarningHolder.classList.toggle('warning-view');
        handle_session_start()
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
    start_timer(1);
}

function handle_session_pause(){
    pause_timer(1);
    let startButtonHolder = document.getElementById('session-start-button');
    let pauseButtonHolder = document.getElementById('session-pause-button');

    pauseButtonHolder.classList.toggle('pressed-start')
    startButtonHolder.classList.toggle('pressed-start')
    pauseButtonHolder.classList.toggle('pressed-pause')
    startButtonHolder.classList.toggle('pressed-pause')

    pause_timer(0);

}

function handle_session_reset(){
    reset_timer(0);
    reset_timer(1);

    let resetButtonHolder = document.getElementById('session-start-button');
    if (resetButtonHolder.classList.contains('pressed-start')){
        start_timer(0);
        start_timer(1);
    }
}

function rest_skip_button() {
    pause_timer(2);
    start_timer(1);

    let restDivHolder = document.getElementById('rest-timer-overlay-div');
    let restTimeDivHolder = document.getElementById('rest-timer-div');

    restDivHolder.classList.remove('rest-mode');
    restTimeDivHolder.classList.remove('rest-mode');
}

function plus5_button() {
    timesInSeconds[2] += 300;
}
