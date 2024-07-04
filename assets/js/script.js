// $(document).ready(function () {
//     $(function() {
//         $('#calendar').datepicker();
//     })
// });

// {const today = dayjs();
// console.log(dayjs().format("MM/DD/YYYY"))
// };

// // Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks"));
// let nextId = JSON.parse(localStorage.getItem("nextId"));

// // Todo: create a function to generate a unique task id
// function generateTaskId() {

// }

// const btn = "primaryBtn"

// // Todo: create a function to create a task card
// function createTaskCard(task) {

// }

// // Todo: create a function to render the task list and make cards draggable
// function renderTaskList() {

// }

// // Todo: create a function to handle adding a new task
// function handleAddTask(event){

// }

// // Todo: create a function to handle deleting a task
// function handleDeleteTask(event){

// }

// // Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {

// }

// // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

// const name = "Sean"

// function greet(name) {
//     console.log("Hello, " + name + "!");
// }

// greet("Sean")

$(document).ready(function() {
    // Initialize datepicker
    $('#calendar').datepicker();

    // Retrieve tasks and nextId from localStorage
    let taskList = JSON.parse(localStorage.getItem("tasks"));
    if (!taskList) {
        taskList = [];
    }

    let nextId = JSON.parse(localStorage.getItem("nextId"));
    if (!nextId) {
        nextId = 1;
    }

    // Event listener for adding a task
    $('#primaryBtn').on('click', handleAddTask);

    // Function to handle adding a new task
    function handleAddTask(event) {
        event.preventDefault();
        
        // Get task details from the input fields
        const taskName = $('#taskName').val();
        const taskDescription = $('#taskDescription').val();
        const taskDueDate = $('#calendar').val();

        // Create a new task object
        const newTask = {
            id: nextId++,
            name: taskName,
            description: taskDescription,
            dueDate: taskDueDate,
            status: 'todo'
        };

        // Add new task to task list
        taskList.push(newTask);

        // Save tasks and next ID to local storage
        localStorage.setItem('tasks', JSON.stringify(taskList));
        localStorage.setItem('nextId', nextId);

        // Create a new task card HTML
        const taskCard = `
            <div class="card task-card" data-id="${newTask.id}">
                <div class="card-body">
                    <h5 class="card-title">${newTask.name}</h5>
                    <p class="card-text">${newTask.description}</p>
                    <p class="card-text"><small class="text-muted">${newTask.dueDate}</small></p>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            </div>
        `;

        // Append the new task card to the "To Do" column
        $('#todo-cards').append(taskCard);

        // Clear the input fields
        $('#taskName').val('');
        $('#taskDescription').val('');
        $('#calendar').val('');

        // Close the modal
        $('#formModal').modal('hide');
    }
});