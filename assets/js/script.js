$(document).ready(function() {
    // Initialize datepicker
    $('#calendar').datepicker();

    // Retrieve tasks and nextId from localStorage
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

    // Event listener for adding a task
    $('#taskForm').on('submit', handleAddTask);

    // Make columns sortable
    $(".connectedSortable").sortable({
        connectWith: ".connectedSortable",
        cursor: "move",
        placeholder: "card-placeholder",
        start: function(event, ui) {
            ui.item.addClass('dragging');
        },
        stop: function(event, ui) {
            ui.item.removeClass('dragging');
            updateTaskStatus();
        }
    }).disableSelection();

    // Function to handle adding a new task
    function handleAddTask(event) {
        event.preventDefault();
        const taskName = $('#taskName').val().trim();
        const taskDescription = $('#taskDescription').val().trim();
        const taskDueDate = $('#calendar').val();

        if (!taskName || !taskDescription || !taskDueDate) {
            alert("Please fill all fields");
            return;
        }

        const newTask = {
            id: nextId++,
            name: taskName,
            description: taskDescription,
            dueDate: taskDueDate,
            status: 'todo'
        };

        taskList.push(newTask);
        saveTasksAndId();
        appendTaskCard(newTask);

        // Clear the input fields
        $('#taskName, #taskDescription, #calendar').val('');
        $('#formModal').modal('hide');
    }

    // Function to append task card to the correct column
    function appendTaskCard(task) {
        const currentDate = dayjs().format('YYYY-MM-DD');
        const taskDueDate = dayjs(task.dueDate).format('YYYY-MM-DD');
        let taskStatusClass = '';

        if (task.status !== 'done') {
            if (dayjs(taskDueDate).isBefore(currentDate)) {
                taskStatusClass = 'bg-danger';
            } else if (taskDueDate === currentDate) {
                taskStatusClass = 'bg-warning';
            }
        }

        const taskCard = $(`
            <div class="task-card ${taskStatusClass}" data-id="${task.id}">
                <div class="card-body">
                    <h5 class="card-title">${task.name}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">${task.dueDate}</small></p>
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            </div>
        `);

        $(`#${task.status}-cards`).append(taskCard);
        taskCard.find('.delete-btn').on('click', handleDeleteTask);
        $(".connectedSortable").sortable('refresh');
    }

    // Function to handle deleting a task
    function handleDeleteTask() {
        const taskId = $(this).closest('.task-card').data('id');
        taskList = taskList.filter(task => task.id !== taskId);
        saveTasksAndId();
        $(this).closest('.task-card').remove();
    }

    // Function to update task status when moved
    function updateTaskStatus() {
        $('.lane').each(function() {
            const status = $(this).find('.connectedSortable').attr('id').split('-')[0];
            $(this).find('.task-card').each(function() {
                const taskId = $(this).data('id');
                const task = taskList.find(t => t.id === taskId);
                if (task) {
                    task.status = status;

                    // Remove color classes and add appropriate class based on status
                    $(this).removeClass('bg-danger bg-warning');
                    if (status !== 'done') {
                        const currentDate = dayjs().format('YYYY-MM-DD');
                        const taskDueDate = dayjs(task.dueDate).format('YYYY-MM-DD');
                        if (dayjs(taskDueDate).isBefore(currentDate)) {
                            $(this).addClass('bg-danger');
                        } else if (taskDueDate === currentDate) {
                            $(this).addClass('bg-warning');
                        }
                    }
                }
            });
        });

        saveTasksAndId();
    }

    // Function to save tasks and nextId to localStorage
    function saveTasksAndId() {
        localStorage.setItem('tasks', JSON.stringify(taskList));
        localStorage.setItem('nextId', nextId);
    }

    // Load existing tasks
    taskList.forEach(appendTaskCard);
});