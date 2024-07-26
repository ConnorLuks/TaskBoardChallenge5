// Load tasks and nextId from local storage or initialize defaults
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate unique task IDs
function generateTaskId() {
    return "ID-" + nextId++;
}

// Function to create HTML for a task card
function createTaskCard(task) {
    const duedate = dayjs(task.duedate);
    const today = dayjs();
    const fiveDaysFromNow = today.add(5, 'day');
    let cardColorClass = '';

    if (duedate.isBefore(today)) {
        cardColorClass = task.status === 'done' ? 'card text-dark text-center bg-white mb-3 task-card' : 'card text-dark text-center bg-danger';
    } else if (duedate.isBefore(fiveDaysFromNow)) {
        cardColorClass = task.status === 'done' ? 'card text-dark text-center bg-white mb-3 task-card' : 'card text-dark text-center bg-warning mb-3 task-card';
    } else {
        cardColorClass = 'bg-white';
    }

    return `
        <div class='card task-card mb-2 ${cardColorClass}' id='task-${task.id}'>
            <div class='card-body'>
                <h4 class='card-title'>${task.title}</h4>
                <p class='card-description'>${task.description}</p>
                <p class='card-duedate'>Date Due: ${task.duedate}</p>
                <button class='btn btn-dark delete-task' data-task-id='${task.id}'>Delete</button>
            </div>
        </div>`;
}

// Render tasks into their respective columns
function renderTaskList() {
    $('.lane .task-card').remove();
    if (taskList.length > 0) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            $(`#${task.status}-cards`).append(taskCard);
        });
    }
    // Save the updated task list to local storage
    localStorage.setItem('tasks', JSON.stringify(taskList));
    $('.task-card').draggable({
        zIndex: 1000,
        revert: 'invalid'
    });
}

// Handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let taskId = generateTaskId();
    let newTask = {
        id: taskId,
        title: $('#taskTitle').val(),
        duedate: $('#taskDueDate').val(),
        description: $('#taskDescription').val(),
        status: 'to-do',
    };

    if (!newTask.title || !newTask.description || !newTask.duedate) {
        alert('Please make sure to fill out all empty fields.');
        return;
    }

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
    $('#taskTitle, #taskDueDate, #taskDescription').val('');
    $('#formModal').modal('hide');
}

// Handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
    let taskId = $(event.target).data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Handle dropping a task into a new column
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr('id').split('-')[1];
    let newStatus = $(this).attr('id').replace('-cards', '');
    let task = taskList.find(task => task.id === taskId);
    if (task) {
        task.status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
    }
}

// Initialize the page
$(document).ready(() => {
    renderTaskList();
    $('#taskForm').submit(handleAddTask);
    $(document).on('click', '.delete-task', handleDeleteTask);
    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });
});
