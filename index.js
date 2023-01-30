let totalTime = 0;
let remainingTime = 0;

let endTime = 0;

let currentTimer = 0;
let timerList;

let isPaused = false;
let isStopped = true;

let currentActivityTag = "";

const beep = new Audio('audio.wav');



window.addEventListener("load", async () => {
    await loadJsonFile();
    onAppLoad();
});

const loadJsonFile = async () =>
{
    try {
        const response = await fetch(`./activity.json`);
        const data = await response.json();

        console.log(data.activities[0]);

        var name = data.activities[0].name;
        var timer_list = data.activities[0].timer;

        var total_time = 0;

        timerList = timer_list;
        var index_activity = 0;
        timer_list.forEach(e => {
            //console.log(e.tag + " " + e.time + " min");
            index_activity++;
            addRow(index_activity, e.tag.toUpperCase(), e.time);
            total_time += e.time;
        });

        addRow("", name.toUpperCase()  + " TOTAL TIME", total_time);
        totalTime = total_time;
        //remainingTime = totalTime;
    }
    catch (error) {
        console.log(error);
    }
}

function addRow(n, activity_tag, activity_lenght) {
    var table = document.getElementById("table_activities_list");

    let row = table.insertRow(-1);

    // Create table cells
    let c0 = row.insertCell(0);
    let c1 = row.insertCell(1);
    let c2 = row.insertCell(2);

    // Add data
    c0.innerHTML = n;
    c1.innerHTML = activity_tag;
    c2.innerText = activity_lenght;
}

startButton.addEventListener('click',() => {
    if(totalTime == 0) return;
    isStopped = false;
    pauseButton.style.display = "block";
    startButton.style.display = "none";
    stopButton.style.display = "block";

    if(remainingTime == 0)
    {
        remainingTime = timerList[currentTimer].time;
        endTime = calculateEndTime(remainingTime);

        //Tag text : current activity
        activityTag.innerHTML = timerList[currentTimer].tag.toUpperCase() + " [" + (currentTimer + 1) + "]";
        //Reproduce sound beep
        playBeep();
    }

    executeTimers();
});

pauseButton.addEventListener('click',() => {
    pauseButton.style.display = "none";
    resumeButton.style.display = "block";
    isPaused = true;
});
resumeButton.addEventListener('click',() => {
    pauseButton.style.display = "block";
    resumeButton.style.display = "none";
    isPaused = false;
    recalculateEndTime();
});
stopButton.addEventListener('click',() => {
    resetAll();
});

function resetAll()
{
    isStopped = true;
    pauseButton.style.display = "none";
    resumeButton.style.display = "none";
    stopButton.style.display = "none";
    startButton.style.display = "block";

    remainingTime = 0;
    endTime = 0;
    currentTimer = 0;
    timerList;
    isPaused = false;
    currentActivityTag = "-";    
    activityTag.innerHTML = currentActivityTag;
    timerClock.innerHTML = "00:00:00";
}

function calculateEndTime(rTime) //In minutes
{
    var currentDate = new Date();
    var timestamp = currentDate.getTime();
    console.log('Current Time ' + new Date(timestamp).getHours() + ' : ' + new Date(timestamp).getMinutes() + ' : ' + new Date(timestamp).getSeconds());

    currentDate.setMinutes(currentDate.getMinutes() + rTime);
    timestamp = currentDate.getTime();
    console.log('End Time ' + new Date(timestamp).getHours() + ' : ' + new Date(timestamp).getMinutes() + ' : ' + new Date(timestamp).getSeconds());

    return timestamp;
}

function recalculateEndTime()
{
    var currentDate = new Date();
    var timestamp = currentDate.getTime();
    endTime = timestamp + remainingTime;
    console.log('End Time ' + new Date(endTime).getHours() + ':' + new Date(endTime).getMinutes() + ':' + new Date(endTime).getSeconds() + " Recalculated");
}

function executeTimers()
{
    if(isStopped) return;
    if(isPaused)
    {
        setTimeout("executeTimers()", 400);
        return;
    } 
    if(currentTimer >= timerList.length)
    {
        console.log("Timer Finished!");
        resetAll();
        activityTag.innerHTML = "ACTIVITY COMPLETED!";
        return;
    }    

    var currentDate = new Date();
    var timestamp = currentDate.getTime();

    remainingTime = endTime - timestamp;

    if(remainingTime <= 0)
    {
        currentTimer++;
        remainingTime = timerList[currentTimer].time;
        endTime = calculateEndTime(remainingTime);
        executeTimers();
        //Tag text : current activity
        activityTag.innerHTML = timerList[currentTimer].tag.toUpperCase() + " [" + (currentTimer + 1) + "]";
        //Reproduce sound beep
        playBeep();
    }

    var hours = Math.floor(remainingTime / 1000 / 60 / 60);
    var minutes = Math.floor(remainingTime /1000 / 60) - (hours * 60);
    var seconds = Math.floor((remainingTime / 1000) % 60);

    var dateFormat = (hours.toString().length == 1 ? "0" + hours.toString() : hours) +":"+ (minutes.toString().length == 1 ? "0" + minutes.toString() : minutes) +":"+ (seconds.toString().length == 1 ? "0" + seconds.toString() : seconds);
    timerClock.innerHTML = dateFormat;

    setTimeout("executeTimers()", 1000);
}

async function playBeep()
{
    beep.play();
}

function onAppLoad()
{
    pauseButton.style.display = "none";
    stopButton.style.display = "none";
    resumeButton.style.display = "none";
}