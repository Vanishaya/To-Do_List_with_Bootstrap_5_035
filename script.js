// ======================
// DOM ELEMENTS
// ======================
const taskInput = document.querySelector('.add-task input[type="text"]');
const prioritySelect = document.querySelector('.add-task select');
const addBtn = document.querySelector('.add-task button');

const searchInput = document.querySelector('.search-task input');
const filterRadios = document.querySelectorAll('input[name="filter"]');

const taskPanel = document.querySelector('.task-panel');
const taskCounter = document.getElementById('task-counter');
const clearCompletedBtn = document.querySelector('.dropdown-item.text-danger');

// container สำหรับ task list
const listContainer = document.createElement('div');
taskPanel.insertBefore(listContainer, taskPanel.querySelector('.text-center'));

// ======================
// STATE
// ======================
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ======================
// UTILITIES
// ======================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateCounter() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    taskCounter.textContent = `${total} total · ${active} active`;
}

function getPriorityBadge(priority) {
    if (priority === 'High') return 'bg-danger';
    if (priority === 'Low') return 'bg-success';
    return 'bg-warning text-dark';
}

// ======================
// RENDER
// ======================
function renderTasks() {
    listContainer.innerHTML = '';

    const keyword = searchInput.value.toLowerCase();

    let filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(keyword)
    );

    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    }
    if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    filtered.forEach(task => {
        const item = document.createElement('div');
        item.className =
            'd-flex align-items-center justify-content-between bg-secondary bg-opacity-25 rounded-3 p-3 mb-3 mt-3';
        item.dataset.id = task.id;

        item.innerHTML = `
            <div class="d-flex align-items-center gap-3 ">
                <input class="form-check-input toggle" type="checkbox" ${task.completed ? 'checked' : ''}>
                <div class="fw-semibold ${task.completed ? 'text-decoration-line-through opacity-50' : ''}">
                    ${task.title}
                </div>
                <span class="badge ${getPriorityBadge(task.priority)}">
                    ${task.priority}
                </span>
            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-light edit">✏️</button>
                <button class="btn btn-sm btn-outline-danger delete">🗑️</button>
            </div>
        `;

        listContainer.appendChild(item);
    });

    updateCounter();
}

// ======================
// ADD TASK
// ======================
function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    const priority = prioritySelect.value.split(' ')[0];

    tasks.push({
        id: Date.now(),
        title,
        priority,
        completed: false
    });

    taskInput.value = '';
    saveTasks();
    renderTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});

// ======================
// EVENT DELEGATION (toggle / edit / delete)
// ======================
listContainer.addEventListener('click', e => {
    const item = e.target.closest('[data-id]');
    if (!item) return;

    const id = Number(item.dataset.id);
    const task = tasks.find(t => t.id === id);

    // TOGGLE
    if (e.target.classList.contains('toggle')) {
        task.completed = e.target.checked;
    }

    // DELETE
    if (e.target.classList.contains('delete')) {
        tasks = tasks.filter(t => t.id !== id);
    }

    // EDIT
    if (e.target.classList.contains('edit')) {
        const newTitle = prompt('Edit task', task.title);
        if (newTitle !== null && newTitle.trim() !== '') {
            task.title = newTitle.trim();
        }
    }

    saveTasks();
    renderTasks();
});

// ======================
// SEARCH
// ======================
searchInput.addEventListener('input', renderTasks);

// ======================
// FILTER
// ======================
filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        currentFilter = radio.id;
        renderTasks();
    });
});

// ======================
// CLEAR COMPLETED
// ======================
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

// ======================
// INIT
// ======================
renderTasks();
