// Import methods
import { getToDos } from "./data/todoManager.js";
import { getProject } from "./data/projectManager.js";

// Import variables
const EditIcon = "../images/edit.svg";
const DeleteIcon = "../images/delete.svg";
const InfoIcon = "../images/info.svg";
const StarIcon = "../images/star.svg";
const StarGoldIcon = "../images/star-gold.svg";
const CircleIcon = "../images/circle.svg";
const CheckGreenIcon = "../images/check-circle.svg";
const AddIcon = "../images/plus-circle-black.svg";

// Declarations
const clickItems = [];
const hoverItems = [];

const printToDoTable = (contentBox, type) => {
    let tableItem = document.createElement("table");
    let tableCaption = document.createElement("caption")
    
    if(type === "home")
    {
        tableCaption.textContent = "Todas las Tareas";
    }

    if(type === "today")
    {
        tableCaption.textContent = "Tareas de Hoy";
    }

    if(type === "week")
    {
        tableCaption.textContent = "Tareas de la Semana";
    }

    if(type === "favorite")
    {
        tableCaption.textContent = "Tareas Favoritas";
    }

    if(type === "completed")
    {
        tableCaption.textContent = "Tareas Completadas";
    }

    if(type.startsWith("project-"))
    {
        let projectId = +(type.split("-")[1]);
        let selectedProject = getProject(projectId);
        if(selectedProject !== null)
        {
            tableCaption.textContent = selectedProject.name;
        } else {
            tableCaption.textContent = "Proyecto Desconocido";
        }
    }

    let appendTodo = document.createElement("div");
    appendTodo.classList.add("append-todo");

    let addImage = new Image();
    addImage.src = AddIcon;
    addImage.setAttribute("id", "add-todo");
    clickItems.push(addImage);

    appendTodo.appendChild(addImage);
    tableCaption.appendChild(appendTodo);
    tableItem.appendChild(tableCaption);

    let tableHead = document.createElement("thead");
    let tableRow = document.createElement("tr");

    let tableHeader = document.createElement("th");
    tableHeader.textContent = "Nombre";
    tableHeader.classList.add("nameColumn");
    tableRow.appendChild(tableHeader);

    tableHeader = document.createElement("th");
    tableHeader.textContent = "Fecha de vencimiento";
    tableRow.appendChild(tableHeader);

    tableHeader = document.createElement("th");
    tableHeader.textContent = "Prioridad";
    tableRow.appendChild(tableHeader);

    tableHeader = document.createElement("th");
    tableHeader.textContent = "Opciones";
    tableRow.appendChild(tableHeader);

    tableHead.appendChild(tableRow);
    tableItem.appendChild(tableHead);

    let tableBody = document.createElement("tbody");

    getToDos().forEach((todo) => {
        appendToDo(type, tableBody, todo);             
    });

    tableItem.appendChild(tableBody);

    contentBox.appendChild(tableItem);
};

const appendToDo = (type, tableBody, todo) =>
{
    let currentDate = new Date();

    if(type === "home")
    {
        _printRowLayout(tableBody, todo);   
    }

    if(type === "today")
    {
        if(todo.getDueDate().getFullYear() === currentDate.getFullYear() &&
        todo.getDueDate().getMonth() === currentDate.getMonth() &&
        +todo.getDueDate().getDate() === +currentDate.getDate())
        {
            _printRowLayout(tableBody, todo);  
        } 
    }

    if(type === "week")
    {
        if(todo.getDueDate().getFullYear() === currentDate.getFullYear() &&
        todo.getDueDate().getMonth() === currentDate.getMonth() &&
        todo.getDueDate().getWeek() === currentDate.getWeek())
        {
            _printRowLayout(tableBody, todo);  
        }   
    }

    if(type === "favorite")
    {
        if(todo.favorite)
        {
            _printRowLayout(tableBody, todo);   
        }
    }

    if(type === "completed")
    {
        if(todo.completed)
        {
            _printRowLayout(tableBody, todo);   
        }
    }

    if(type.startsWith("project-"))
    {
        let projId = +(type.split("-")[1]);
        if((+todo.projectId) === projId)
        {
            _printRowLayout(tableBody, todo);
        }
    }
}

const _printRowLayout = (tableBody, todo) => {
    let tableRow = document.createElement("tr");
    tableRow.setAttribute("data-id", todo.id);

    let tableCell = document.createElement("td");
    tableCell.classList.add("nameColumn");
    tableCell.textContent = todo.title;
    tableRow.appendChild(tableCell);

    tableCell = document.createElement("td");
    tableCell.classList.add("dateColumn");
    let day = todo.getDueDate().getDate()+"";
    if(day.length === 1)
    {
        day = "0" + day;
    }
    tableCell.textContent = `${day}/${(1+todo.getDueDate().getMonth())}/${todo.getDueDate().getFullYear()}`;
    tableRow.appendChild(tableCell);

    tableCell = document.createElement("td");
    tableCell.classList.add("priorityColumn");
    let priorityDiv = document.createElement("div");
    priorityDiv.classList.add(todo.priority);
    priorityDiv.textContent = (todo.priority == "low") ? "Baja" : (todo.priority == "medium") ? "Media" : "Alta";
    tableCell.appendChild(priorityDiv);
    tableRow.appendChild(tableCell);

    tableCell = document.createElement("td");

    let editImage = new Image();
    editImage.src = EditIcon;
    editImage.setAttribute("id", "edit-todo-" + todo.id);
    clickItems.push(editImage);
    tableCell.appendChild(editImage);

    let deleteImage = new Image();
    deleteImage.src = DeleteIcon;
    deleteImage.setAttribute("id", "delete-todo-" + todo.id);
    clickItems.push(deleteImage);
    tableCell.appendChild(deleteImage);

    let infoImage = new Image();
    infoImage.src = InfoIcon;
    infoImage.setAttribute("id", "info-todo-" + todo.id);
    clickItems.push(infoImage);
    tableCell.appendChild(infoImage);

    let circleImage = new Image();
    if(todo.completed)
    {
        circleImage.src = CheckGreenIcon;
        circleImage.setAttribute("data-status", "check");
    } else {
        circleImage.src = CircleIcon;
        circleImage.setAttribute("data-status", "none");
    }
    circleImage.setAttribute("id", "check-todo-" + todo.id);
    clickItems.push(circleImage);
    hoverItems.push(circleImage);
    tableCell.appendChild(circleImage);

    let starImage = new Image();
    if(todo.favorite)
    {
        starImage.src = StarGoldIcon;
        starImage.setAttribute("data-status", "check");
    } else {
        starImage.src = StarIcon;
        starImage.setAttribute("data-status", "none");
    }
    starImage.setAttribute("id", "fav-todo-" + todo.id);
    clickItems.push(starImage);
    hoverItems.push(starImage);
    tableCell.appendChild(starImage);

    tableRow.appendChild(tableCell);

    tableBody.appendChild(tableRow);
}

const addListeners = (clickHandler, mouseInHandler, mouseOutHandler) => {
    clickItems.forEach((node) => {
        node.addEventListener("click", clickHandler);
    });

    hoverItems.forEach((node) => {
        node.addEventListener("mouseover", mouseInHandler);
        node.addEventListener("mouseout", mouseOutHandler);
    });
}

export { printToDoTable, addListeners, appendToDo }