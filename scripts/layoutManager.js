// Import methods
import { printToDoTable, addListeners, appendToDo as loadToDo } from './todoLayout.js';
import { getProjects, deleteProject, appendNewProject, getProject } from './data/projectManager.js';
import { appendNewToDo, alternateToDoCompleted, alternateToDoFavorite, deleteToDo, getToDo } from './data/todoManager.js';
import { updateToDo, removeToDo, appendToDo, updateProject, removeProject, appendProject } from './data/dataManager.js';

// Import images
const MenuImage = '../images/menu.svg';
const EditIcon = "../images/edit.svg";
const DeleteIcon = "../images/delete.svg";
const EditIconWhite = "../images/edit-white.svg";
const DeleteIconWhite = "../images/delete-white.svg";
const StarIcon = "../images/star.svg";
const StarGoldIcon = "../images/star-gold.svg";
const CircleIcon = "../images/circle.svg";
const CheckCircleIcon = "../images/check-circle-black.svg";
const CheckGreenIcon = "../images/check-circle.svg";
const AddIcon = "../images/plus-circle-black.svg";

// Declare variables
let sidebarObject = null;
let sidebarBackground = null;
let currentlySelected = "linkHome";
let dialogObject = null;

const printBasicLayout = () => {
    let headerMenuImage = document.querySelector(".menu-image-holder");
    headerMenuImage.addEventListener("click", _clickHandler);

    let menuImage = new Image();
    menuImage.src = MenuImage;
    headerMenuImage.appendChild(menuImage);
}

const appendContent = (content) => {
    let contentBox = document.querySelector(".content");

    let previousContentBox = document.querySelector(".main-content");

    if(previousContentBox !== null)
    {
        previousContentBox.remove();
    }

    let mainContentBox = document.createElement("div");
    mainContentBox.classList.add("main-content");
    
    // handle each layout
    printToDoTable(mainContentBox, _getLinkType(content));
    addListeners(_clickHandler, _mouseInHandler, _mouseOutHandler);
    
    contentBox.appendChild(mainContentBox);

}

const _getLinkType = (content) => {
    if(content === "linkHome")
    {
        return "home";
    }

    if(content === "linkWeek")
    {
        return "week";
    }

    if(content === "linkToday")
    {
        return "today";
    }

    if(content === "linkFavorites")
    {
        return "favorite";
    }

    if(content === "linkCompleted")
    {
        return "completed";
    }

    if(content.startsWith("linkProject-"))
    {
        let projectId = content.split("-")[1];
        return "project-" + projectId;
    }

    return "unknown";
}

const _mouseInHandler = (event) => {
    // id selectors
    if(event.target.id.startsWith("check-todo-"))
    {
        if(event.target.getAttribute("data-status") !== null && event.target.getAttribute("data-status") !== "check")
        {
            event.target.src = CheckCircleIcon;
        }
    }
    
    if(event.target.id.startsWith("fav-todo-"))
    {
        if(event.target.getAttribute("data-status") !== null && event.target.getAttribute("data-status") !== "check")
        {
            event.target.src = StarGoldIcon;
        }
    }

}

const _mouseOutHandler = (event) => {
    // id selectors
    if(event.target.id.startsWith("check-todo-"))
    {
        if(event.target.getAttribute("data-status") !== null && event.target.getAttribute("data-status") !== "check")
        {
            event.target.src = CircleIcon;
        }
    }

    if(event.target.id.startsWith("fav-todo-"))
    {
        if(event.target.getAttribute("data-status") !== null && event.target.getAttribute("data-status") !== "check")
        {
            event.target.src = StarIcon;
        }
    }

}

const _clickHandler = (event) => {
    // id selectors
    if(event.target.id === "linkHome" || event.target.id === "linkToday" ||
    event.target.id === "linkWeek" || event.target.id == "linkFavorites" ||
    event.target.id == "linkCompleted")
    {
        _menuSelected(event.target);
    }

    if(event.target.id.startsWith("linkProject-"))
    {
        _menuSelected(event.target);
    }

    if(event.target.id.startsWith("check-todo-"))
    {
        event.stopPropagation();
        let todoID = +(event.target.id.split("-")[2]);
        alternateToDoCompleted(todoID);
        if(event.target.getAttribute("data-status") !== null && event.target.getAttribute("data-status") !== "check")
        {
            event.target.setAttribute("data-status", "check");
            event.target.src = CheckGreenIcon;
        } else {
            event.target.setAttribute("data-status", "none");
            event.target.src = CircleIcon;
        }

        updateToDo(getToDo(todoID));
    }

    if(event.target.id.startsWith("fav-todo-"))
    {
        event.stopPropagation();
        let todoID = +(event.target.id.split("-")[2]);
        alternateToDoFavorite(todoID);
        if(event.target.getAttribute("data-status") !== null && event.target.getAttribute("data-status") !== "check")
        {
            event.target.setAttribute("data-status", "check");
            event.target.src = StarGoldIcon;
        } else {
            event.target.setAttribute("data-status", "none");
            event.target.src = StarIcon;
        }

        updateToDo(getToDo(todoID));
    }

    if(event.target.id.startsWith("delete-todo-"))
    {
        event.stopPropagation();
        let todoID = +(event.target.id.split("-")[2]);
        let rowComponent = document.querySelector(`tr[data-id="${todoID}"]`);
        if(rowComponent !== null)
        {
            rowComponent.remove();
        }
        removeToDo(getToDo(todoID));        
        deleteToDo(todoID);        
    }

    if(event.target.id.startsWith("delete-project-"))
    {
        event.stopPropagation();
        let projectID = +(event.target.id.split("-")[2]);
        let projectComponent = document.querySelector(`.projectItem[data-id="${projectID}"]`);
        if(projectComponent !== null)
        {
            projectComponent.remove();
        }
        removeProject(getProject(projectID));
        deleteProject(projectID);

        let projectCaption = document.querySelector(".project-heading");
        if(projectCaption !== null)
        {
            projectCaption.textContent = `My Projects (${getProjects().length})`;
        }
    }

    if(event.target.id === "add-project" || event.target.id === "add-todo" ||
    event.target.id.startsWith("info-todo-") || event.target.id.startsWith("edit-todo-") ||
    event.target.id.startsWith("edit-project-"))
    {
        _createDialog(event.target.id);
    }

    if(event.target.id === "dialog-main" || event.target.id === "todo-cancel" || event.target.id === "project-cancel")
    {
        event.stopPropagation();
        if(dialogObject !== null)
        {
            dialogObject.close();
            dialogObject.remove();

            dialogObject = null;
            return;
        }
    }

    if(event.target.id === "todo-send")
    {
        if(dialogObject !== null)
        {
            event.stopPropagation();
            let todoName = document.querySelector('#todoName');
            if(todoName !== null)
            {
                if(todoName.classList.contains("error"))
                {
                    todoName.classList.remove("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "";
                    }
                }

                if(todoName.value == '' || todoName.value.length === 0)
                {
                    // error
                    todoName.classList.add("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "Por favor, introduce un título para la tarea.";
                    }
                } else {
                    // todoName, todoDescription, todoDate, todoPriority, todoProject
                    let todoDescription = document.querySelector("#todoDescription");
                    let todoDate = document.querySelector("#todoDate");
                    let todoPriority = document.querySelector("#todoPriority");
                    let todoProject = document.querySelector("#todoProject");

                    let dueDate = "";
                    if(todoDate.value.length > 0)
                    {
                        let dateSplit = todoDate.value.split("-");
                        dueDate = `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
                    } else {
                        let date = new Date();
                        dueDate = `${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}`;
                    }
                    let newTodo = appendNewToDo(todoName.value, todoDescription.value, dueDate, todoPriority.value, todoProject.value);
                    appendToDo(newTodo);
                    loadToDo(_getLinkType(currentlySelected), document.querySelector("tbody"), newTodo);

                    if(dialogObject !== null)
                    {
                        dialogObject.close();
                        dialogObject.remove();

                        dialogObject = null;
                        return;
                    }

                }
            }
        }
    }

    if(event.target.id.startsWith("todo-save-"))
    {
        let todoId = +(event.target.id.split("-")[2]);
        let editTodo = getToDo(todoId);
        if(dialogObject !== null && editTodo !== null)
        {
            event.stopPropagation();
            let todoName = document.querySelector('#todoName');
            if(todoName !== null)
            {
                if(todoName.classList.contains("error"))
                {
                    todoName.classList.remove("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "";
                    }
                }

                if(todoName.value == '' || todoName.value.length === 0)
                {
                    // error
                    todoName.classList.add("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "Por favor, introduce un título para la tarea.";
                    }
                } else {
                    if(todoName.value !== editTodo.title)
                    {
                        editTodo.title = todoName.value;
                        let editValue = document.querySelector(`tr[data-id="${todoId}"] td.nameColumn`);
                        if(editValue !== null)
                        {
                            editValue.textContent = editTodo.title;
                        }  
                    }

                    let todoDescription = document.querySelector("#todoDescription");

                    if(todoDescription.value !== editTodo.description)
                    {
                        editTodo.description = todoDescription.value;                        
                    }

                    let todoPriority = document.querySelector("#todoPriority");
                    
                    if(todoPriority.value !== editTodo.priority)
                    {
                        editTodo.priority = todoPriority.value;    
                        let editValue = document.querySelector(`tr[data-id="${todoId}"] td.priorityColumn`);
                        if(editValue !== null)
                        {
                            editValue.innerHTML = "";
                            let prio = document.createElement("div");
                            prio.classList.add(editTodo.priority.toLowerCase());
                            prio.textContent = (editTodo.priority.toLowerCase() == "low") ? "Baja" : (editTodo.priority.toLowerCase() == "medium") ? "Media" : "Alta";
                            editValue.appendChild(prio);
                        }                                            
                    }

                    let todoProject = document.querySelector("#todoProject");

                    if(todoProject.value !== editTodo.projectId)
                    {
                        editTodo.projectId = todoProject.value;                        
                    }

                    let todoDate = document.querySelector("#todoDate");
                    
                    let dDate = "";
                    if(todoDate.value.length > 0)
                    {
                        let dateSplit = todoDate.value.split("-");
                        dDate = `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
                    } else {
                        let date = new Date();
                        dDate = `${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}`;
                    }

                    if(editTodo.dueDate !== dDate)
                    {
                        editTodo.dueDate = dDate;
                        let editValue = document.querySelector(`tr[data-id="${todoId}"] td.dateColumn`);
                        if(editValue !== null)
                        {
                            editValue.textContent = dDate;
                        } 
                    }

                    updateToDo(editToDo);

                    if(dialogObject !== null)
                    {
                        dialogObject.close();
                        dialogObject.remove();

                        dialogObject = null;
                        return;
                    }

                }
            }
        }
    }

    if(event.target.id.startsWith("project-save-"))
    {
        let projId = +(event.target.id.split("-")[2]);
        let editProject = getProject(projId);
        if(dialogObject !== null && editProject !== null)
        {
            event.stopPropagation();
            let projectName = document.querySelector('#projectName');
            if(projectName !== null)
            {
                if(projectName.classList.contains("error"))
                {
                    projectName.classList.remove("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "";
                    }
                }

                if(projectName.value == '' || projectName.value.length === 0)
                {
                    // error
                    projectName.classList.add("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "Por favor, introduce un nombre para el proyecto.";
                    }
                } else {
                    if(editProject.name !== projectName.value)
                    {
                        editProject.name = projectName.value;

                        if(sidebarObject !== null)
                        {
                            let projectCaption = document.querySelector(`.projectItem[data-id="${projId}"] .projectItem-text`);
                            if(projectCaption !== null)
                            {
                                projectCaption.textContent = projectName.value;
                            }
                        }

                    }

                    updateProject(editProject);

                    if(dialogObject !== null)
                    {
                        dialogObject.close();
                        dialogObject.remove();

                        dialogObject = null;
                        return;
                    }

                }
            }
        }
    }

    if(event.target.id === "project-send")
    {
        if(dialogObject !== null)
        {
            event.stopPropagation();
            let projectName = document.querySelector('#projectName');
            if(projectName !== null)
            {
                if(projectName.classList.contains("error"))
                {
                    projectName.classList.remove("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "";
                    }
                }

                if(projectName.value == '' || projectName.value.length === 0)
                {
                    // error
                    projectName.classList.add("error");
                    let errorInput = document.querySelector(".input-error");
                    if(errorInput !== null)
                    {
                        errorInput.textContent = "Por favor, introduce un nombre para el proyecto.";
                    }
                } else {
                    let newProject = appendNewProject(projectName.value);
                    appendProject(newProject);

                    if(sidebarObject !== null)
                    {
                        _appendProject(sidebarObject, newProject);
                    }

                    if(dialogObject !== null)
                    {
                        dialogObject.close();
                        dialogObject.remove();

                        dialogObject = null;
                        return;
                    }

                }
            }
        }
    }

    // class selectors
    if(event.target.classList.contains("sidebarBackground"))
    {
        event.stopPropagation();
        _removeSidebar();
        return;
    }

    if(event.target.classList.contains("menu-image-holder") || event.target.parentElement.classList.contains("menu-image-holder"))
    {
        _createSidebar();
    }
}

const _menuSelected = (target) => {
    if(target.id === "secondaryLinkMenu")
    {
        currentlySelected = "linkMenu";
        // Handle layout modification logic
        appendContent("linkMenu");

    } else {
        if(sidebarObject != null)
        {
            _removeSidebar();

            if(!target.classList.contains("selected"))
            {
                let allMenus = document.querySelectorAll(".menuItem");
                allMenus.forEach((menu) => {
                    if(menu.classList.contains("selected"))
                    {
                        menu.classList.remove("selected");
                    }
                });

                target.classList.add("selected");

                currentlySelected = target.id;
                // Handle layout modification logic
                appendContent(target.id);
            }
        }
    }
}

const _removeSidebar = () => {
    if(sidebarObject !== null)
    {
        if(sidebarBackground !== null)
        {
            sidebarBackground.remove();
            sidebarBackground = null;
        }

        if(sidebarObject.classList.contains("slide-in"))
        {
            sidebarObject.classList.remove("slide-in");
        }
        sidebarObject.classList.add("slide-out");
        setTimeout(() => {
            sidebarObject.remove();     
            sidebarObject = null;       
        }, 375);
    }
}

const _createSidebar = () => {

    if(sidebarObject === null)
    {
        let contentBox = document.querySelector(".content");

        sidebarBackground = document.createElement("section");
        sidebarBackground.classList.add("sidebarBackground");
        sidebarBackground.addEventListener("click", _clickHandler);
        contentBox.appendChild(sidebarBackground);

        sidebarObject = document.createElement("section");
        sidebarObject.classList.add("sidebarMenu");
        sidebarObject.classList.add("slide-in");

        let sidebarMenuHolder = document.createElement("div");
        sidebarMenuHolder.classList.add("menuHolder");

        let sidebarMenu = document.createElement("div");
        sidebarMenu.classList.add("menuItem");
        if(currentlySelected === "linkHome")
        {
            sidebarMenu.classList.add("selected");
        }
        sidebarMenu.textContent = "Mostrar Todo";
        sidebarMenu.setAttribute("id", "linkHome");
        sidebarMenu.addEventListener("click", _clickHandler);
        sidebarMenuHolder.appendChild(sidebarMenu);

        sidebarMenu = document.createElement("div");
        sidebarMenu.classList.add("menuItem");
        if(currentlySelected === "linkToday")
        {
            sidebarMenu.classList.add("selected");
        }
        sidebarMenu.textContent = "Hoy";
        sidebarMenu.setAttribute("id", "linkToday");
        sidebarMenu.addEventListener("click", _clickHandler);
        sidebarMenuHolder.appendChild(sidebarMenu);

        sidebarMenu = document.createElement("div");
        sidebarMenu.classList.add("menuItem");
        if(currentlySelected === "linkWeek")
        {
            sidebarMenu.classList.add("selected");
        }
        sidebarMenu.textContent = "Esta Semana";
        sidebarMenu.setAttribute("id", "linkWeek");
        sidebarMenu.addEventListener("click", _clickHandler);
        sidebarMenuHolder.appendChild(sidebarMenu);

        sidebarMenu = document.createElement("div");
        sidebarMenu.classList.add("menuItem");
        if(currentlySelected === "linkFavorites")
        {
            sidebarMenu.classList.add("selected");
        }
        sidebarMenu.textContent = "Tareas Favoritas";
        sidebarMenu.setAttribute("id", "linkFavorites");
        sidebarMenu.addEventListener("click", _clickHandler);
        sidebarMenuHolder.appendChild(sidebarMenu);

        sidebarMenu = document.createElement("div");
        sidebarMenu.classList.add("menuItem");
        if(currentlySelected === "linkCompleted")
        {
            sidebarMenu.classList.add("selected");
        }
        sidebarMenu.textContent = "Tareas Completadas";
        sidebarMenu.setAttribute("id", "linkCompleted");
        sidebarMenu.addEventListener("click", _clickHandler);
        sidebarMenuHolder.appendChild(sidebarMenu);

        sidebarObject.appendChild(sidebarMenuHolder);
        

        let projectHeading = document.createElement("div");
        projectHeading.classList.add("project-heading");
        projectHeading.textContent = `Mis proyectos (${getProjects().length})`;
        
        let appendProject = document.createElement("div");
        appendProject.classList.add("append-project");

        let addImage = new Image();
        addImage.src = AddIcon;
        addImage.setAttribute("id", "add-project");
        addImage.addEventListener("click", _clickHandler);
        appendProject.appendChild(addImage);

        projectHeading.appendChild(appendProject);
        sidebarObject.appendChild(projectHeading);

        let hrItem = document.createElement("div");
        hrItem.classList.add("hr-item");
        hrItem.innerHTML = "<hr />";
        sidebarObject.appendChild(hrItem);

        getProjects().forEach((project) => {
            _appendProject(sidebarObject, project);
        });

        contentBox.appendChild(sidebarObject);
    }
}

const _appendProject = (sidebarObject, project) => {
    let sidebarMenu = document.createElement("div");
    sidebarMenu.classList.add("menuItem");
    sidebarMenu.classList.add("projectItem");
    sidebarMenu.setAttribute("data-id", project.id);
    if(currentlySelected === "linkProject-" + project.id)
    {
        sidebarMenu.classList.add("selected");
    }
    sidebarMenu.setAttribute("id", "linkProject-" + project.id);
    sidebarMenu.addEventListener("click", _clickHandler);

    let sidebarMenuText = document.createElement("div");
    sidebarMenuText.textContent = project.name;
    sidebarMenuText.classList.add("projectItem-text")
    sidebarMenu.appendChild(sidebarMenuText);

    let sidebarMenuOptions = document.createElement("div");
    
    let editImage = new Image();
    editImage.src = EditIcon;
    if(currentlySelected === "linkProject-" + project.id)
    {
        editImage.src = EditIconWhite;
    }
    editImage.addEventListener("click", _clickHandler);
    editImage.setAttribute("id", "edit-project-" + project.id);
    sidebarMenuOptions.appendChild(editImage);

    let deleteImage = new Image();
    deleteImage.src = DeleteIcon;
    if(currentlySelected === "linkProject-" + project.id)
    {
        deleteImage.src = DeleteIconWhite;
    }
    deleteImage.addEventListener("click", _clickHandler);
    deleteImage.setAttribute("id", "delete-project-" + project.id);
    sidebarMenuOptions.appendChild(deleteImage);

    sidebarMenu.appendChild(sidebarMenuOptions);

    sidebarObject.appendChild(sidebarMenu);
}

const _createDialog = (type) => {

    if(dialogObject !== null)
    {
        dialogObject.close();
        dialogObject.remove();
        dialogObject = null;
    }

    dialogObject = document.createElement("dialog");
    dialogObject.setAttribute("id", "dialog-main");
    dialogObject.addEventListener("click", _clickHandler);

    let dialogContainer = document.createElement("div");
    dialogContainer.setAttribute("id", "dialog-container");

    let dialogTitle = document.createElement("div");
    dialogTitle.classList.add("dialog-title");
    dialogTitle.textContent = type;

    if(type === "add-todo")
    {
        dialogTitle.textContent = "Añadir una nueva tarea";
    }

    if(type === "add-project")
    {
        dialogTitle.textContent = "Añadir un nuevo proyecto";
    }

    if(type.startsWith("edit-project-"))
    {
        dialogTitle.textContent = "Editar proyecto";
    }

    if(type.startsWith("edit-todo-"))
    {
        dialogTitle.textContent = "Editar tarea";
    }

    if(type.startsWith("info-todo-"))
    {
        dialogTitle.textContent = "Información de la tarea";
    }

    dialogContainer.appendChild(dialogTitle);

    let dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog-content");
    
    if(type === "add-todo")
    {
        appendNewToDoForm(dialogContent);        
    }

    if(type === "add-project")
    {
        appendNewProjectForm(dialogContent);
    }

    if(type.startsWith("edit-project-"))
    {
        let projId = +(type.split('-')[2]);
        let editProject = getProject(projId);
        if(editProject != null)
        {
            editProjectForm(dialogContent, editProject);
        }
    }

    if(type.startsWith("edit-todo-"))
    {
        let todoId = +(type.split('-')[2]);
        let editToDo = getToDo(todoId);
        if(editToDo != null)
        {
            editToDoForm(dialogContent, editToDo);
        }
    }

    if(type.startsWith("info-todo-"))
    {
        let todoId = +(type.split('-')[2]);
        let editToDo = getToDo(todoId);
        if(editToDo != null)
        {
            infoToDo(dialogContent, editToDo);
        }
    }

    dialogContainer.appendChild(dialogContent);

    dialogObject.appendChild(dialogContainer);
    (document.querySelector("body")).appendChild(dialogObject);
    dialogObject.showModal();

}

const appendNewToDoForm = (dialogContent) => {
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "todoName");
    nameLabel.textContent = "Título: ";
    dialogContent.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "todoName");
    nameInput.setAttribute("name", "todo_name");
    nameInput.setAttribute("maxlength", "32");
    nameInput.setAttribute("required", "");
    dialogContent.appendChild(nameInput);

    let errorLabel = document.createElement("div");
    errorLabel.classList.add("input-error");
    dialogContent.appendChild(errorLabel);

    let descLabel = document.createElement("label");
    descLabel.setAttribute("for", "todoDescription");
    descLabel.textContent = "Descripción: ";
    dialogContent.appendChild(descLabel);

    let descInput = document.createElement("textarea");
    descInput.setAttribute("id", "todoDescription");
    descInput.setAttribute("name", "todo_description");
    descInput.setAttribute("rows", "6");
    dialogContent.appendChild(descInput);

    let dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "todoDate");
    dateLabel.textContent = "Fecha de vencimiento: ";
    dialogContent.appendChild(dateLabel);

    let dateInput = document.createElement("input");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("id", "todoDate");
    dateInput.setAttribute("name", "todo_date");
    dialogContent.appendChild(dateInput);

    let priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "todoPriority");
    priorityLabel.textContent = "Prioridad: ";
    dialogContent.appendChild(priorityLabel);

    let priorityInput = document.createElement("select");
    priorityInput.setAttribute("id", "todoPriority");
    priorityInput.setAttribute("name", "todo_priority");

    let priorityOption = document.createElement("option");
    priorityOption.setAttribute("value", "low");
    priorityOption.setAttribute("selected", "");
    priorityOption.textContent = "Baja";
    priorityInput.appendChild(priorityOption);

    priorityOption = document.createElement("option");
    priorityOption.setAttribute("value", "medium");
    priorityOption.textContent = "Media";
    priorityInput.appendChild(priorityOption);

    priorityOption = document.createElement("option");
    priorityOption.setAttribute("value", "high");
    priorityOption.textContent = "Alta";
    priorityInput.appendChild(priorityOption);

    dialogContent.appendChild(priorityInput);

    let projectLabel = document.createElement("label");
    projectLabel.setAttribute("for", "todoProject");
    projectLabel.textContent = "Proyecto: ";
    dialogContent.appendChild(projectLabel);

    let projectInput = document.createElement("select");
    projectInput.setAttribute("id", "todoProject");
    projectInput.setAttribute("name", "todo_project");

    let projectOption = document.createElement("option");
    projectOption.setAttribute("value", "-1");
    projectOption.setAttribute("selected", "");
    projectOption.textContent = "Ninguno";
    projectInput.appendChild(projectOption);

    getProjects().forEach((project) => {
        projectOption = document.createElement("option");
        projectOption.setAttribute("value", project.id);
        projectOption.textContent = project.name;
        projectInput.appendChild(projectOption);
    });        
    
    dialogContent.appendChild(projectInput);

    let projectButtons = document.createElement("div");
    projectButtons.classList.add("project-buttons");

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.setAttribute("id", "todo-cancel");
    cancelButton.textContent = "Cancelar";
    cancelButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(cancelButton);

    let sendButton = document.createElement("button");
    sendButton.classList.add("send-button");
    sendButton.setAttribute("id", "todo-send");
    sendButton.textContent = "Añadir";
    sendButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(sendButton);

    dialogContent.appendChild(projectButtons);
}

const editToDoForm = (dialogContent, todo) => {
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "todoName");
    nameLabel.textContent = "Título: ";
    dialogContent.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "todoName");
    nameInput.setAttribute("name", "todo_name");
    nameInput.setAttribute("maxlength", "32");
    nameInput.setAttribute("required", "");
    nameInput.setAttribute("value", todo.title);
    dialogContent.appendChild(nameInput);

    let errorLabel = document.createElement("div");
    errorLabel.classList.add("input-error");
    dialogContent.appendChild(errorLabel);

    let descLabel = document.createElement("label");
    descLabel.setAttribute("for", "todoDescription");
    descLabel.textContent = "Descripción: ";
    dialogContent.appendChild(descLabel);

    let descInput = document.createElement("textarea");
    descInput.setAttribute("id", "todoDescription");
    descInput.setAttribute("name", "todo_description");
    descInput.setAttribute("rows", "6");
    descInput.textContent = todo.description;
    dialogContent.appendChild(descInput);

    let dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "todoDate");
    dateLabel.textContent = "Fecha de vencimiento: ";
    dialogContent.appendChild(dateLabel);

    let dateInput = document.createElement("input");
    let dateSplit = todo.dueDate.split("/");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("id", "todoDate");
    dateInput.setAttribute("name", "todo_date");
    dateInput.setAttribute("value", `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`);
    dialogContent.appendChild(dateInput);

    let priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "todoPriority");
    priorityLabel.textContent = "Prioridad: ";
    dialogContent.appendChild(priorityLabel);

    let priorityInput = document.createElement("select");
    priorityInput.setAttribute("id", "todoPriority");
    priorityInput.setAttribute("name", "todo_priority");

    let priorityOption = document.createElement("option");
    priorityOption.setAttribute("value", "low");
    if(todo.priority.toLowerCase() === "low")
    {
        priorityOption.setAttribute("selected", "");
    } else {
        priorityOption.removeAttribute("selected");
    }
    priorityOption.textContent = "Baja";
    priorityInput.appendChild(priorityOption);

    let priorityOption2 = document.createElement("option");
    priorityOption2.setAttribute("value", "medium");
    if(todo.priority.toLowerCase() === "medium")
    {
        priorityOption2.setAttribute("selected", "");
    } else {
        priorityOption2.removeAttribute("selected");
    }
    priorityOption2.textContent = "Media";
    priorityInput.appendChild(priorityOption2);

    let priorityOption3 = document.createElement("option");
    priorityOption3.setAttribute("value", "high");
    if(todo.priority.toLowerCase() === "high")
    {
        priorityOption3.setAttribute("selected", "");
    } else {
        priorityOption3.removeAttribute("selected");
    }
    priorityOption3.textContent = "Alta";
    priorityInput.appendChild(priorityOption3);

    dialogContent.appendChild(priorityInput);

    let projectLabel = document.createElement("label");
    projectLabel.setAttribute("for", "todoProject");
    projectLabel.textContent = "Proyecto: ";
    dialogContent.appendChild(projectLabel);

    let projectInput = document.createElement("select");
    projectInput.setAttribute("id", "todoProject");
    projectInput.setAttribute("name", "todo_project");

    let projectOption = document.createElement("option");
    projectOption.setAttribute("value", "-1");
    if(+todo.projectId === -1)
    {
        priorityOption.setAttribute("selected", "");
    }
    projectOption.textContent = "Ninguno";
    projectInput.appendChild(projectOption);

    getProjects().forEach((project) => {
        let eProjectOption = document.createElement("option");
        eProjectOption.setAttribute("value", project.id);
        if(+todo.projectId === +project.id)
        {
            eProjectOption.setAttribute("selected", "");
        }
        eProjectOption.textContent = project.name;
        projectInput.appendChild(eProjectOption);
    });        
    
    dialogContent.appendChild(projectInput);

    let projectButtons = document.createElement("div");
    projectButtons.classList.add("project-buttons");

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.setAttribute("id", "todo-cancel");
    cancelButton.textContent = "Cancelar";
    cancelButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(cancelButton);

    let sendButton = document.createElement("button");
    sendButton.classList.add("send-button");
    sendButton.setAttribute("id", "todo-save-" + todo.id);
    sendButton.textContent = "Guardar";
    sendButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(sendButton);

    dialogContent.appendChild(projectButtons);
}

const infoToDo = (dialogContent, todo) => {
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "todoName");
    nameLabel.textContent = "Título: ";
    nameLabel.style['font-weight'] = 'bold';
    dialogContent.appendChild(nameLabel);

    let nameInput = document.createElement("div");
    nameInput.textContent = todo.title;
    dialogContent.appendChild(nameInput);

    let descLabel = document.createElement("label");
    descLabel.setAttribute("for", "todoDescription");
    descLabel.textContent = "Descripción: ";
    descLabel.style['font-weight'] = 'bold';
    dialogContent.appendChild(descLabel);

    let descInput = document.createElement("div");
    descInput.textContent = todo.description;
    dialogContent.appendChild(descInput);

    let dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", "todoDate");
    dateLabel.textContent = "Fecha de vencimiento: ";
    dateLabel.style['font-weight'] = 'bold';
    dialogContent.appendChild(dateLabel);

    let dateInput = document.createElement("div");
    let dateSplit = todo.dueDate.split("/");
    dateInput.textContent =  `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
    dialogContent.appendChild(dateInput);

    let priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "todoPriority");
    priorityLabel.textContent = "Prioridad: ";
    priorityLabel.style['font-weight'] = 'bold';
    dialogContent.appendChild(priorityLabel);

    let priorityInput = document.createElement("div");
    priorityInput.textContent = todo.priority;
    dialogContent.appendChild(priorityInput);

    let projectLabel = document.createElement("label");
    projectLabel.setAttribute("for", "todoProject");
    projectLabel.textContent = "Proyecto: ";
    projectLabel.style['font-weight'] = 'bold';
    dialogContent.appendChild(projectLabel);

    let projectInput = document.createElement("div");
    if(+todo.projectId === -1)
    {
        projectInput.textContent = "Ninguno";
    } else {
        let currentProj = getProject(+todo.projectId);
        if(currentProj !== null)
        {
            projectInput.textContent = currentProj.name;
        } else {
            projectInput.textContent = "Desconocido";
        }
    }
    dialogContent.appendChild(projectInput);

    let projectButtons = document.createElement("div");
    projectButtons.classList.add("project-buttons");

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.setAttribute("id", "todo-cancel");
    cancelButton.textContent = "Salir";
    cancelButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(cancelButton);
    dialogContent.appendChild(projectButtons);
}

const appendNewProjectForm = (dialogContent) => {
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "projectName");
    nameLabel.textContent = "Nombre: ";
    dialogContent.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "projectName");
    nameInput.setAttribute("name", "project_name");
    nameInput.setAttribute("maxlength", "32");
    nameInput.setAttribute("required", "");
    dialogContent.appendChild(nameInput);

    let errorLabel = document.createElement("div");
    errorLabel.classList.add("input-error");
    dialogContent.appendChild(errorLabel);

    let projectButtons = document.createElement("div");
    projectButtons.classList.add("project-buttons");

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.setAttribute("id", "project-cancel");
    cancelButton.textContent = "Cancelar";
    cancelButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(cancelButton);

    let sendButton = document.createElement("button");
    sendButton.classList.add("send-button");
    sendButton.setAttribute("id", "project-send");
    sendButton.textContent = "Añadir";
    sendButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(sendButton);

    dialogContent.appendChild(projectButtons);
}

const editProjectForm = (dialogContent, project) => {
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "projectName");
    nameLabel.textContent = "Nombre: ";
    dialogContent.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "projectName");
    nameInput.setAttribute("name", "project_name");
    nameInput.setAttribute("maxlength", "32");
    nameInput.setAttribute("required", "");
    nameInput.value = project.name;
    dialogContent.appendChild(nameInput);

    let errorLabel = document.createElement("div");
    errorLabel.classList.add("input-error");
    dialogContent.appendChild(errorLabel);

    let projectButtons = document.createElement("div");
    projectButtons.classList.add("project-buttons");

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.setAttribute("id", "project-cancel");
    cancelButton.textContent = "Cancelar";
    cancelButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(cancelButton);

    let sendButton = document.createElement("button");
    sendButton.classList.add("send-button");
    sendButton.setAttribute("id", "project-save-" + project.id);
    sendButton.textContent = "Guardar";
    sendButton.addEventListener("click", _clickHandler);
    projectButtons.appendChild(sendButton);

    dialogContent.appendChild(projectButtons);
}



export { printBasicLayout, appendContent }