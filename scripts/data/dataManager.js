import { Project } from "./project.js";
import { ToDo } from "./todo.js";
import { appendNewProject, appendProjectFromData } from "./projectManager.js";
import { appendNewToDo, appendToDoFromData } from "./todoManager.js";

let uniqueToDoID = 0;
let uniqueProjectId = 0;

const getNextTodoID = () => ++uniqueToDoID;

const getNextProjectId = () => ++uniqueProjectId;

const populateData = () => {
    if(!localStorage.getItem("todo-id-collection") && 
    !localStorage.getItem("project-id-collection"))
    {
        // create new storage
        localStorage.clear();
        localStorage.setItem("todo-id-collection", "");
        localStorage.setItem("project-id-collection", "");

        appendProject(appendNewProject("Ejemplo de Proyecto 1"));
        appendProject(appendNewProject("Ejemplo de Proyecto 2"));

        appendToDo(appendNewToDo("Ejemplo de Tarea 1", "Descripcion de la tarea 1", "13/10/2026", "low", -1));
        appendToDo(appendNewToDo("Ejemplo de Tarea 2", "Descripcion de la tarea 2", "15/10/2026", "high", -1));
        appendToDo(appendNewToDo("Ejemplo de Tarea 3", "Descripcion de la tarea 3", "22/10/2026", "low", -1));


    } else {
        let idSplit = localStorage.getItem("todo-id-collection").split(",");
        let projectSplit = localStorage.getItem("project-id-collection").split(",");

        for (const id of idSplit)
        {
            if(id !== '' && id.length > 0)
            {
                let todoId = +id;
                appendToDoFromData(todoId, localStorage.getItem(`todo-${todoId}-title`),
                    localStorage.getItem(`todo-${todoId}-description`), 
                    localStorage.getItem(`todo-${todoId}-dueDate`), 
                    localStorage.getItem(`todo-${todoId}-priority`), 
                    (localStorage.getItem(`todo-${todoId}-favorite`) == 'true'), 
                    (localStorage.getItem(`todo-${todoId}-completed`) == 'true'),
                    localStorage.getItem(`todo-${todoId}-project`));

                if(todoId > uniqueToDoID)
                {
                    uniqueToDoID = todoId;
                }
            }
        }

        for (const id of projectSplit)
        {
            if(id !== '' && id.length > 0)
            {
                let projectId = +id;
                appendProjectFromData(projectId, localStorage.getItem(`project-${projectId}-name`));

                if(projectId > uniqueProjectId)
                {
                    uniqueProjectId = projectId;
                }
            }
        }
    }
}

const appendProject = (project) =>
{
    if(!localStorage.getItem("project-id-collection").includes(project.id + ","))
    {
        localStorage.setItem("project-id-collection", (localStorage.getItem("project-id-collection") + project.id + ","));
        localStorage.setItem(`project-${project.id}-name`, project.name);
    }
}

const updateProject = (project) =>
{
    if(localStorage.getItem("project-id-collection").includes(project.id + ","))
    {
        localStorage.setItem(`project-${project.id}-name`, project.name);
    }
}

const removeProject = (project) =>
{
    if(localStorage.getItem("project-id-collection").includes(project.id + ","))
    {
        let newCollection = localStorage.getItem("project-id-collection").replace((project.id + ','), '');
        localStorage.setItem("project-id-collection", newCollection);
        localStorage.removeItem(`project-${project.id}-name`);
    }
}

const appendToDo = (todo) => {
    if(!localStorage.getItem("todo-id-collection").includes(todo.id + ","))
    {
        localStorage.setItem("todo-id-collection", (localStorage.getItem("todo-id-collection") + todo.id + ","));
        localStorage.setItem(`todo-${todo.id}-title`, todo.title);
        localStorage.setItem(`todo-${todo.id}-description`, todo.description);
        localStorage.setItem(`todo-${todo.id}-priority`, todo.priority);
        localStorage.setItem(`todo-${todo.id}-favorite`, todo.favorite);
        localStorage.setItem(`todo-${todo.id}-completed`, todo.completed);
        localStorage.setItem(`todo-${todo.id}-dueDate`, todo.dueDate);
        localStorage.setItem(`todo-${todo.id}-project`, todo.projectId);
    }
}

const updateToDo = (todo) => {
    if(localStorage.getItem("todo-id-collection").includes(todo.id + ","))
    {
        localStorage.setItem(`todo-${todo.id}-title`, todo.title);
        localStorage.setItem(`todo-${todo.id}-description`, todo.description);
        localStorage.setItem(`todo-${todo.id}-priority`, todo.priority);
        localStorage.setItem(`todo-${todo.id}-favorite`, todo.favorite);
        localStorage.setItem(`todo-${todo.id}-completed`, todo.completed);
        localStorage.setItem(`todo-${todo.id}-dueDate`, todo.dueDate);
        localStorage.setItem(`todo-${todo.id}-project`, todo.projectId);
    }
}

const removeToDo = (todo) => {
    if(localStorage.getItem("todo-id-collection").includes(todo.id + ","))
    {
        let newCollection = localStorage.getItem("todo-id-collection").replace((todo.id + ","), '');
        localStorage.setItem("todo-id-collection", newCollection);
        localStorage.removeItem(`todo-${todo.id}-title`);
        localStorage.removeItem(`todo-${todo.id}-description`);
        localStorage.removeItem(`todo-${todo.id}-priority`);
        localStorage.removeItem(`todo-${todo.id}-favorite`);
        localStorage.removeItem(`todo-${todo.id}-completed`);
        localStorage.removeItem(`todo-${todo.id}-dueDate`);
        localStorage.removeItem(`todo-${todo.id}-project`);
    }
}

export { getNextProjectId, getNextTodoID, populateData, appendProject, updateProject, removeProject, 
    appendToDo, updateToDo, removeToDo }