let timeInterval;
let timeInSeconds = 0;

function save_time(){

    const minutes = Number(document.getElementById('minute').innerHTML);
    const seconds = Number(document.getElementById('second').innerHTML);
    const hours = Number(document.getElementById('hour').innerHTML);

    timeInSeconds = seconds + minutes*60 + hours*3600;
    
    const formattedTime = 
        (hours < 10 ? "0" + hours : hours) + ":" +
        (minutes < 10 ? "0" + minutes : minutes) + ":" + 
        (seconds < 10 ? "0" + seconds : seconds);
    console.log(minutes);
    document.getElementById("timer_number").innerHTML = formattedTime;
}

function start_timer(){
    clearInterval(timeInterval);
    timeInSeconds = timeInSeconds

    timeInterval = setInterval(() => {
        timeInSeconds--;
        if (timeInSeconds <= 0){
            clearInterval(timeInterval);
            document.getElementById('timer_number').innerHTML = "Time's up!"
            return;
        }

        const seconds = timeInSeconds % 60;
        const minutes = Math.floor(timeInSeconds / 60) % 60;
        const hours = Math.floor(timeInSeconds / 3600);
        const formattedTime = 
                (hours < 10 ? "0" + hours : hours) + ":" +
                (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                (seconds < 10 ? "0" + seconds : seconds);
        document.getElementById("timer_number").innerHTML = formattedTime;

    }, 1000);
}

function reset_timer(){
    clearInterval(timeInterval);
    let minute = document.getElementById('minute').innerHTML;
    let second = document.getElementById('second').innerHTML;
    let hour = document.getElementById('hour').innerHTML;
    const formattedTime = 
        (hour < 10 ? "0" + hour : hour) + ":" +
        (minute < 10 ? "0" + minute : minute) + ":" + 
        (second < 10 ? "0" + second : second);
    timeInSeconds = Number(second) + (Number(minute) * 60) + (Number(hour) * 3600);
    document.getElementById('timer_number').innerHTML = formattedTime;
}

function pause_timer(){
  clearInterval(timeInterval);  
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
    navHolder = document.getElementByIdy("navbar").innerHTML;
}