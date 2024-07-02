// edit name Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// edit name Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    if (!nextId || isNaN(nextId)) {
        nextId = 1;
    }
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
};

// done: create a function to create a task card //compare other ones
function createTaskCard(task) {
    let cardColorClass = "";
    let duedate = new Date(task.duedate);
    let today = new Date();
    let fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(today.getDate() + 5);
    if (duedate < today) { // card box will be red if near overdue, technically the day of //
        cardColorClass = "bg-danger";
    }

    else if (duedate < fiveDaysFromNow) { // card box will be yellow if 5 days from due date //
        cardColorClass = "bg-warning";
    }

    else {
        cardColorClass = "bg-white"; // any date further than 5 days from due date will appear white //
    }
// adds a card with all details title, description, date due, space between cards and delete option. required for text input to display in the boxes //
    let taskCardsHtml =
    `<div class="card task-card mb-2 ${cardColorClass}" id=task-${task.id}">
        <div class="card-body">
            <h4 class="card-title">${task.title}</h4> 
            <p class="card-description">${task.description}</p>
            <p class="card-duedate">Date Due: ${task.duedate}</p>
            <button class="btn btn-dark delete-task" data-task-id="${task.id}">Delete</button>
        </div>
    </div>`;
    return taskCardsHtml;
}

// do: create a function to render the task list and make draggable cards //
function renderTaskList() {
    $(".lane .task-card").remove();
    if (taskList.length > 0) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            $(`#${task.status}-cards`).append(taskCard);
        });
    }
    localStorage.setItem("tasks", JSON.stringify(taskList)); //check, saves the task to local storage //

    $(".task-card").draggable({ // allows the cards to be dragged //
        zIndex: 100,
    });
}

// do: create a function to handle adding a new task.
function handleAddTask(event){
    event.preventDefault();
    let taskId = generateTaskId();
    let newTask = {
        id: taskId,
        title: $("#taskTitle").val(),
        description: $("#taskDescription").val(),
        status: "to-do",
        duedate: $("#taskDueDate").val(),
    };

    if (!newTask.title || !newTask.description || !newTask.duedate) { //maybe not include, rename . parts //
        alert("Please make sure to fill out all empty fields."); // alert if any sections are not filled in //
        return;
    }

    taskList.push(newTask);
    renderTaskList();
    $("#taskTitle, #taskDueDate, #taskDescription").val("");
    $("#formModal").modal("hide");

}; 

// do: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    let taskId = $(event.target).data("task-id"); 
    let task = taskList.find(task => task.id === taskId);
    if (task) {
        taskList = taskList.filter(task => task.id !== taskId);
        renderTaskList(); // removes the selected task post //
        localStorage.setItem("tasks", JSON.stringify(taskList)); // updates the current task list //
    }
}

// do: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = parseInt(ui.draggable.attr("id").split("-")[1]);
    let newStatus = $(this).attr("id").replace("-cards", "");
    let task = taskList.find(task => task.id === taskId);
    if (task) { // updates current task //
        task.status = newStatus;
        renderTaskList();
    }
}

// do: title check in original, when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(() => {
    renderTaskList();
    $("#taskForm").submit(handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
});
