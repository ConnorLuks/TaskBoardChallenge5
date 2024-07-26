// $(document).ready(function () {
//     // Reference to Save button on Add Task Modal Dialog
//     const saveTaskButtonEl = $('#save-task-button');
//     // Reference to close icon from modal dialog
//     const closeButtonEl = $('.modal-close');
//     // Initiate cardsSwimLaneEl
//     let cardsSwimLaneEl = '';
//     // Reference of swim lanes element
//     const swimLanesEl = $('.swim-lanes');

//     // Function to generate a unique task id
//     function generateTaskId() {
//         // Generate ID by appending unique timestamp
//         return "ID-" + new Date().getTime();
//     }

//     // Function to create a task card
//     function createTaskCard(task) {
//         // Create div for card
//         const cardEl = $('<div>');

//         const dueDate = dayjs(task.dueDate).format('YYYY-MM-DD');
//         const currentDate = dayjs().format('YYYY-MM-DD');
//         const taskStatus = task.status;
//         let cardElClass = '';

//         // Set card class based on dueDate and task status
//         if (dueDate < currentDate) {
//             if (taskStatus === 'done') {
//                 cardElClass = 'card text-dark text-center bg-light mb-3 task-card';
//             } else {
//                 cardElClass = 'card text-dark text-center bg-danger mb-3 task-card';
//             }
//         } else if (dueDate === currentDate) {
//             if (taskStatus === 'done') {
//                 cardElClass = 'card text-dark text-center bg-light mb-3 task-card';
//             } else {
//                 cardElClass = 'card text-dark text-center bg-warning mb-3 task-card';
//             }
//         } else {
//             cardElClass = 'card text-dark text-center bg-light mb-3 task-card';
//         }

//         cardEl.addClass(`${cardElClass}`);

//         // Add generated id as a data attribute to task
//         cardEl.attr('data-id', task.id);

//         // Create div for Card Header
//         const cardHeaderEl = $('<div>');
//         cardHeaderEl.addClass('card-header');
//         cardHeaderEl.text(task.title);

//         // Append Card Header to Card
//         cardEl.append(cardHeaderEl);

//         // Create div for Card Body
//         const cardBodyEl = $('<div>');
//         cardBodyEl.addClass('card-body');

//         // Create Paragraph for Due Date
//         const pElDate = $('<p>');
//         pElDate.addClass('card-text');
//         pElDate.text(task.dueDate);

//         // Append Paragraph element to Card Body to display task Due Date
//         cardBodyEl.append(pElDate);

//         // Create Paragraph for task description
//         const pElDesc = $('<p>');
//         pElDesc.addClass('card-text');
//         pElDesc.text(task.description);

//         // Append Paragraph element to Card Body to display Task Description
//         cardBodyEl.append(pElDesc);

//         // Create element for Delete button
//         const deleteButtonEl = $('<button>');
//         deleteButtonEl.addClass('btn btn-danger btn-outline-light');
//         deleteButtonEl.text('Delete');

//         // Append Delete Button to Card Body El
//         cardBodyEl.append(deleteButtonEl);

//         // Append Card Body to Card El
//         cardEl.append(cardBodyEl);

//         // Get swimlane based on task status
//         if (taskStatus === 'to-do') {
//             cardsSwimLaneEl = $('#to-do-cards');
//         } else if (taskStatus === 'in-progress') {
//             cardsSwimLaneEl = $('#in-progress-cards');
//         } else {
//             cardsSwimLaneEl = $('#done-cards');
//         }

//         // Append card to respective swimlane
//         cardsSwimLaneEl.append(cardEl);

//         // Make cards draggable
//         $('.task-card').draggable();
//     }

//     // Function to render the task list and make cards draggable
//     function renderTaskList() {
//         taskList = JSON.parse(localStorage.getItem('taskList'));
//         if (taskList !== null) {
//             for (let i = 0; i < taskList.length; i++) {
//                 const task = taskList[i];
//                 createTaskCard(task);
//             }
//         }

//         // Make cards draggable
//         $('.task-card').draggable();
//     }

//     // Function to handle adding a new task
//     function handleAddTask(event) {
//         // Get user entered information from form fields
//         const taskTitle = $('#taskTitle').val();
//         const taskDueDate = $('#taskDueDate').val();
//         const taskDescription = $('#taskDescription').val();

//         // Assign id to task
//         const taskID = generateTaskId.call();

//         // Clear user entered form inputs
//         $('#taskTitle').val('');
//         $('#taskDueDate').val('');
//         $('#taskDescription').val('');

//         // Close the modal
//         $('#add-task-modal').modal('hide');

//         // Initiate the task info object
//         const taskInfo = {
//             id: taskID,
//             title: taskTitle,
//             dueDate: taskDueDate,
//             description: taskDescription,
//             status: 'to-do'
//         };

//         // Check if taskList Array exist in localStorage

//         const taskListArray = JSON.parse(localStorage.getItem('taskList'));
//         if (taskListArray !== null) {
//             taskList = taskListArray;
//             taskList.push(taskInfo);
//             localStorage.setItem('taskList', JSON.stringify(taskList));
//         } else {
//             let taskList = [];
//             taskList.push(taskInfo);
//             localStorage.setItem('taskList', JSON.stringify(taskList));
//         }

//         // call createTaskCard function
//         createTaskCard(taskInfo);
//     }

//     // Function to handle deleting a task
//     function handleDeleteTask(event) {
//         // Traverse DOM until card element is reached
//         const buttonEl = $(event.target)
//         const bodyEl = $(buttonEl.parent());
//         const cardEl = $(bodyEl.parent());

//         // Retrieve ID before removing the card
//         const cardElId = cardEl.attr('data-id');

//         // Remove card element
//         cardEl.remove();

//         // Remove the task object from localStorage array
//         taskList = JSON.parse(localStorage.getItem('taskList'));
//         if (taskList !== null) {
//             for (let i = 0; i < taskList.length; i++) {
//                 const removeTaskRef = taskList[i];
//                 const arrayIndex = i;
//                 if (removeTaskRef.id === cardElId) {
//                     taskList = taskList.filter(function (el) {
//                         return el.id !== cardElId;
//                     })
//                     localStorage.setItem('taskList', JSON.stringify(taskList));
//                 }
//             }
//         }

//     }

//     // Function to handle dropping a task into a new status lane
//     function handleDrop(event, ui) {
//         // Dragged element id
//         const draggedElementId = ui.draggable.attr('data-id');
//         // Retrieve the list of tasks from localstorage
//         taskList = JSON.parse(localStorage.getItem('taskList'));
//         // Get id of dropped container where element was dragged into
//         let droppedSwimLaneEl = ($(this).attr("id"));
//         for (i = 0; i < taskList.length; i++) {
//             const taskRef = taskList[i];
//             const id = taskRef.id;
//             if (id === draggedElementId) {
//                 // update status
//                 taskRef.status = droppedSwimLaneEl;
//                 // if dropped into done swimlane, update the card background
//                 if (droppedSwimLaneEl === 'done') {
//                     // find dragged element by data attribute data-id
//                     const draggedElement = $(`[data-id="${draggedElementId}"]`);
//                     // remove class that begins with 'bg'
//                     $(draggedElement).removeClass(function (index, className) {
//                         return (className.match(/\bbg-\x0S+/g) || []).join(' ');
//                     });
//                     // add class bg-light
//                     $(draggedElement).addClass('bg-light');
//                 }
//             }
//         }
//         localStorage.setItem('taskList', JSON.stringify(taskList));
//     }

//     // when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
//     $(document).ready(function () {
//         // call function to render tasks
//         renderTaskList();

//         // Make swim lanes droppable

//         $('#to-do').droppable({
//             accept: ".task-card",
//             drop: handleDrop
//         });

//         $('#in-progress').droppable({
//             accept: ".task-card",
//             drop: handleDrop
//         });

//         $("#done").droppable({
//             accept: ".task-card",
//             drop: handleDrop
//         });

//         // Event Listener on save button of modal dialog
//         saveTaskButtonEl.on('click', handleAddTask);

//         // Delegate event listener to parent container element '.swim-lanes'
//         swimLanesEl.on('click', '.btn-danger', handleDeleteTask);

//         // Event listener to close modal on click of close button
//         closeButtonEl.on('click', () => {
//             $('#add-task-modal').modal('hide');
//         })
//     });
// });
