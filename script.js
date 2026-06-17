const planButtons = document.querySelectorAll(".plan-btn");
const planTitle = document.getElementById("planTitle");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const startDayBtn = document.getElementById("startDayBtn");
const rating = document.getElementById("rating");

let currentPlan = "day";

let starsEarned =
Number(localStorage.getItem("stars")) || 0;

let tasks =
JSON.parse(localStorage.getItem("ticktrackTasks")) || {
    day: [],
    week: [],
    month: [],
    year: []
};

updateStars();
renderTasks();
generateCalendar2026();

/* PLAN SWITCH */

planButtons.forEach(button => {

    button.addEventListener("click", () => {

        planButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentPlan = button.dataset.plan;

        planTitle.textContent = button.textContent;

        renderTasks();

    });

});

/* ADD TASK */

addTaskBtn.addEventListener("click", () => {

    const taskText = taskInput.value.trim();

    if(taskText === "") return;

    tasks[currentPlan].push({
        text: taskText,
        completed: false
    });

    saveTasks();

    taskInput.value = "";

    renderTasks();
    
    updateCalendarColor();
});

/* START DAY */

startDayBtn.addEventListener("click", () => {

    speak(
        "Let's Start. Have a productive day."
    );

});

/* RENDER TASKS */

function renderTasks(){

    taskList.innerHTML = "";

    tasks[currentPlan].forEach((task,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <div>
                <button class="done-btn">✔</button>
                <button class="delete-btn">✖</button>
            </div>
        `;

        const doneBtn =
            li.querySelector(".done-btn");

        const deleteBtn =
            li.querySelector(".delete-btn");

        /* COMPLETE TASK */

        doneBtn.addEventListener("click",()=>{

            task.completed = !task.completed;

            saveTasks();

            renderTasks();

            updateCalendarColor();

            const allCompleted =
                tasks[currentPlan].every(
                    task => task.completed
                );

            if(
                allCompleted &&
                tasks[currentPlan].length > 0
            ){

                if(starsEarned < 5){

                    starsEarned++;

                    localStorage.setItem(
                        "stars",
                        starsEarned
                    );

                    updateStars();

                }

                speak(
                    "Well Done. You completed all your tasks."
                );

            }

        });

        /* DELETE TASK */

        deleteBtn.addEventListener("click",()=>{

            tasks[currentPlan].splice(
                index,
                1
            );

            saveTasks();

            renderTasks();

            updateCalendarColor();

        });

        taskList.appendChild(li);

    });

}

/* SAVE TASKS */

function saveTasks(){

    localStorage.setItem(
        "ticktrackTasks",
        JSON.stringify(tasks)
    );

}

/* STAR RATING */

function updateStars(){

    let stars = "";

    for(let i = 1; i <= 5; i++){

        if(i <= starsEarned){
            stars += "★ ";
        }
        else{
            stars += "☆ ";
        }

    }

    rating.textContent = stars;

}

/* VOICE */

function speak(text){

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);

}

/* CALENDAR 2026 */

function generateCalendar2026(){

    const calendarGrid =
        document.getElementById("calendarGrid");

    if(!calendarGrid) return;

    const months = [
        "January","February","March",
        "April","May","June",
        "July","August","September",
        "October","November","December"
    ];

    calendarGrid.innerHTML = "";

    for(let month = 0; month < 12; month++){

        const monthBox =
            document.createElement("div");

        monthBox.classList.add("month-box");

        const monthTitle =
            document.createElement("h4");

        monthTitle.textContent =
            months[month];

        monthBox.appendChild(monthTitle);

        const daysContainer =
            document.createElement("div");

        daysContainer.classList.add(
            "days-container"
        );

        const daysInMonth =
            new Date(
                2026,
                month + 1,
                0
            ).getDate();

        for(
            let day = 1;
            day <= daysInMonth;
            day++
        ){

            const dayBox =
                document.createElement("div");

            dayBox.classList.add(
                "day-box"
            );

            dayBox.textContent = day;
            dayBox.setAttribute(
    "data-date",
    `${month + 1}-${day}`
);

            daysContainer.appendChild(
                dayBox
            );

        }

        monthBox.appendChild(
            daysContainer
        );

        calendarGrid.appendChild(
            monthBox
        );

    }

}

function updateCalendarColor(){

    const today = new Date();

    const key =
        `${today.getMonth()+1}-${today.getDate()}`;

    const dayBox =
        document.querySelector(
            `[data-date="${key}"]`
        );

    if(!dayBox) return;

    const totalTasks =
        tasks[currentPlan].length;

    const completedTasks =
        tasks[currentPlan].filter(
            task => task.completed
        ).length;

    const percentage =
        totalTasks === 0
        ? 0
        : (completedTasks / totalTasks) * 100;

    dayBox.classList.remove(
        "green",
        "yellow",
        "red"
    );

    if(percentage === 100){

        dayBox.classList.add("green");

    }
    else if(percentage >= 50){

        dayBox.classList.add("yellow");

    }
    else{

        dayBox.classList.add("red");

    }

}