// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null;

document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);
document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('statusFilter').addEventListener('change', renderTasks);
document.getElementById('dueDateFilter').addEventListener('change', renderTasks);

window.addEventListener('popstate', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute)

function navigate(path) {
  history.pushState({}, '', path);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;
  const app = document.getElementById('app');
  app.innerHTML = ''; // clear the previous content

  if (path === '/add') {
    showAddTaskForm();
  } else if (path.startsWith('/edit/')) {
    const id = parseInt(path.split('/edit/')[1]);
    openEditPopup(id);
  } else {
    showTaskList();
  }
}
function handleFormSubmit(event) {
  event.preventDefault();
  const app = document.getElementById('app');
  const titleInput = document.getElementById('taskTitle');
  const descInput = document.getElementById('taskDescription');
  const dueDateInput = document.getElementById('taskDueDate');

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const dueDate = dueDateInput.value;

  if (title && description && dueDate) {
    const newTask = {
      id: Date.now(), 
      title,
      description,
      dueDate,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    alert('Added New task sucessfully')
    renderTasks();

    // Clear form
    titleInput.value = '';
    descInput.value = '';
    dueDateInput.value = '';
  }
}
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';

  const keyword = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const selectedStatus = document.getElementById('statusFilter')?.value || '';
  const selectedDueDate = document.getElementById('dueDateFilter')?.value || '';

  let filteredTasks = tasks;
  if (keyword) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(keyword) ||
      task.description.toLowerCase().includes(keyword)
    );
  }
  if (selectedStatus) {
    filteredTasks = filteredTasks.filter(task =>
      selectedStatus === 'completed' ? task.completed : !task.completed
    );
  }
  if (selectedDueDate) {
    filteredTasks = filteredTasks.filter(task =>
      task.dueDate === selectedDueDate
    );
  }

  filteredTasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskCard', task.completed ? 'completed' : 'pending');

const taskTitle = document.createElement('h3');
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

taskTitle.innerText = capitalizeFirstLetter(task.title);
taskTitle.classList.add('task-title');
    const taskDesc = document.createElement('p');
    const fullText = task.description;
    const words = fullText.split(' ');
    
    if (words.length > 10) {
      const shortText = words.slice(0, 10).join(' ') + '...';
    
      taskDesc.innerText = shortText;
      taskDesc.classList.add('task-description');
    
      const readMore = document.createElement('span');
      readMore.innerText = ' Read more';
      readMore.classList.add('read-more');
    
      readMore.addEventListener('click', () => {
        const isExpanded = readMore.innerText === ' Read less';
        taskDesc.innerText = isExpanded ? shortText : fullText;
        readMore.innerText = isExpanded ? ' Read more' : ' Read less';
        taskDesc.appendChild(readMore);
      });
    
      taskDesc.appendChild(readMore);
    } else {
      taskDesc.innerText = fullText;
    }
    

    const infoRow = document.createElement('div');
    infoRow.style.display = 'flex';
    infoRow.style.justifyContent = 'space-between';
    infoRow.style.alignItems = 'center';
    infoRow.style.marginTop = '10px';
    infoRow.style.gap = '10px';  // Optional: adds space between elements
    
    const taskDue = document.createElement('p');
    taskDue.innerHTML = `<strong>Due:</strong> ${task.dueDate}`;
    taskDue.classList.add('task-due');
    taskDue.style.margin = '0';
    
    const taskStatus = document.createElement('p');
    taskStatus.classList.add('status');
    taskStatus.innerText = task.completed ? 'Completed' : 'Pending';
    taskStatus.style.margin = '0';
    infoRow.appendChild(taskDue);
    infoRow.appendChild(taskStatus);
    taskCard.appendChild(infoRow);
    


    const toggleButton = document.createElement('button');
    toggleButton.classList.add("button-box");
    const btnContentEl = document.createElement("span");
    btnContentEl.classList.add("green");
    btnContentEl.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
    toggleButton.appendChild(btnContentEl);
    toggleButton.addEventListener('click', () => {
      task.completed = !task.completed;
      renderTasks();
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const editButton = document.createElement('button');
    editButton.classList.add("button-box");
    const editBtnContentEl = document.createElement("span");
    editBtnContentEl.classList.add("blue");
    editBtnContentEl.innerText = 'Edit';
    editButton.appendChild(editBtnContentEl);
    editButton.addEventListener('click', () => {
      openEditPopup(index);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("button-box");
    const delBtnContentEl = document.createElement("span");
    delBtnContentEl.classList.add("red");
    delBtnContentEl.innerText = 'Delete';
    deleteButton.appendChild(delBtnContentEl);
    deleteButton.addEventListener('click', () => {
      indexToBeDeleted = index;
      confirmEl.style.display = "block";
      taskManagerContainer.classList.add("overlay");
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    taskCard.appendChild(taskTitle);
    taskCard.appendChild(taskDesc);
    taskCard.appendChild(taskDue);
    taskCard.appendChild(taskStatus);
    taskCard.appendChild(toggleButton);
    taskCard.appendChild(buttonContainer);
    taskContainer.appendChild(taskCard);
  });
}

renderTasks();

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

confirmedBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
  deleteTask(indexToBeDeleted)
});

cancelledBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
});

const dueDateInput = document.getElementById("taskDueDate");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  dueDateInput.setAttribute("min", minDate);



const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const toast = document.getElementById('toast');

let editIndex = null;

function openEditPopup(index) {
  const task = tasks[index];
  console.log('Editing task with ID:', task.id);
  editIndex = index;
  document.getElementById('editTitle').value = task.title;
  document.getElementById('editDescription').value = task.description;
  document.getElementById('editDueDate').value = task.dueDate;
  editModal.style.display = 'block';
  taskManagerContainer.classList.add("overlay");
}



editForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const updatedTitle = document.getElementById('editTitle').value.trim();
  const updatedDesc = document.getElementById('editDescription').value.trim();
  const updatedDueDate = document.getElementById('editDueDate').value;

  if (updatedTitle && updatedDueDate) {
    tasks[editIndex] = {
      ...tasks[editIndex],
      title: updatedTitle,
      description: updatedDesc,
      dueDate: updatedDueDate
    };
    saveTasks();
    renderTasks();
    editModal.style.display = 'none';
    taskManagerContainer.classList.remove("overlay");
    alert("Task updated successfully!");
  }
});

document.getElementById('editCancelBtn').addEventListener('click', () => {
  editModal.style.display = 'none';
  taskManagerContainer.classList.remove("overlay");
});
