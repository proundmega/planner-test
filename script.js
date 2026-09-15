document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const columns = document.querySelectorAll('.column');

    // Add Task Functionality
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const task = document.createElement('div');
        task.classList.add('task');
        task.setAttribute('draggable', 'true');
        task.textContent = taskText;

        // Add drag events to the new task
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);

        // Add to the first column (To Do)
        const todoList = document.querySelector('.column[data-status="todo"] .task-list');
        todoList.appendChild(task);

        taskInput.value = '';
    }

    // Drag and Drop Functionality
    let draggedItem = null;

    function dragStart() {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function dragEnd() {
        this.classList.remove('dragging');
        draggedItem = null;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        const column = e.target.closest('.column');
        if (column) {
            column.classList.add('drag-over');
        }
    }

    function dragLeave(e) {
        const column = e.target.closest('.column');
        if (column && !column.contains(e.relatedTarget)) {
            column.classList.remove('drag-over');
        }
    }

    function drop(e) {
        e.preventDefault();
        const column = e.target.closest('.column');
        if (column && draggedItem) {
            column.classList.remove('drag-over');
            const taskList = column.querySelector('.task-list');
            
            // Find the closest task to insert before
            const afterElement = getDragAfterElement(taskList, e.clientY);
            
            if (afterElement == null) {
                taskList.appendChild(draggedItem);
            } else {
                taskList.insertBefore(draggedItem, afterElement);
            }
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Attach event listeners to columns
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('dragenter', dragEnter);
        column.addEventListener('dragleave', dragLeave);
        column.addEventListener('drop', drop);
    });
});