// script.js

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

function addTask() {
    const taskTitle = document.getElementById("taskTitle").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!taskTitle) {
        alert("Judul tugas tidak boleh kosong.");
        return;
    }

    const task = {
        id: Date.now(),
        title: taskTitle,
        dueDate: dueDate,
        priority: priority,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    // Reset input
    document.getElementById("taskTitle").value = '';
    document.getElementById("dueDate").value = '';
    document.getElementById("priority").value = 'Tinggi';
}

function renderTasks(filter = 'all') {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span style="flex: 1">${task.title} (${task.priority}) - ${task.dueDate || 'Tidak ada tanggal'}</span>
            <button onclick="toggleTask(${task.id})">${task.completed ? 'Belum Selesai' : 'Selesai'}</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Hapus</button>
        `;
        listItem.style.textDecoration = task.completed ? 'line-through' : 'none';
        taskList.appendChild(listItem);
    });

    updateStatistics();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newTitle = prompt("Edit Judul Tugas", task.title);
    if (newTitle) {
        task.title = newTitle;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function filterTasks(status) {
    renderTasks(status);
}

function updateStatistics() {
    document.getElementById("totalTasks").innerText = tasks.length;
    document.getElementById("completedTasks").innerText = tasks.filter(task => task.completed).length;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
