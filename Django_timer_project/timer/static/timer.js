let timeIntervals = {};
let timesInSeconds = {};
let Selected_times = {};
let timerIdSaver;

function save_time(){

    const minutes = Number(document.getElementById('minute').innerHTML);
    const seconds = Number(document.getElementById('second').innerHTML);
    const hours = Number(document.getElementById('hour').innerHTML);

    timesInSeconds[timerIdSaver] = seconds + minutes*60 + hours*3600;
    Selected_times[timerIdSaver] = seconds + minutes*60 + hours*3600;

    
    const formattedTime = 
        (hours < 10 ? "0" + hours : hours) + ":" +
        (minutes < 10 ? "0" + minutes : minutes) + ":" + 
        (seconds < 10 ? "0" + seconds : seconds);
    timerNumber = document.querySelector(".timer_number" + timerIdSaver);
    timerNumber.innerHTML = formattedTime;
    let selectorHolder = document.getElementById('selector-holder');
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
    // let minute = document.getElementById('minute').innerHTML;
    // let second = document.getElementById('second').innerHTML;
    // let hour = document.getElementById('hour').innerHTML;

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

function upper_arrow(selector){
    if (selector == 0){
        let container = document.getElementById('hour').innerHTML;
        container++;
        document.getElementById('hour').innerHTML = container;
            
    }
    else if (selector == 1){
        let container = document.getElementById('minute').innerHTML;
        if (container != 60){
            container++;
            document.getElementById('minute').innerHTML = container;
            }
        else{
            document.getElementById('minute').innerHTML = 0;
        }
    }
    else if(selector == 2){
        let container = document.getElementById('second').innerHTML;
        if (container != 60){
            container++;
            document.getElementById('second').innerHTML = container;
            }
        else{
            document.getElementById('second').innerHTML = 0;
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

function handle_edit(id){
    timerIdSaver = id;
    let selectorHolder = document.getElementById('selector-holder');
    selectorHolder.classList.toggle('editing-view');
}
