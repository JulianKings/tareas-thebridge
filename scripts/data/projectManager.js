import { getNextProjectId } from './dataManager.js';
import { Project } from './project.js';

const _projects = [];

const getProjects = () => _projects;

const appendNewProject = (name) => {
    let proj = new Project(getNextProjectId(), name);
    _projects.push(proj);
    return proj;
}

const appendProjectFromData = (id, name) => {
    let proj = new Project(id, name);
    _projects.push(proj);
    return proj;
}

const deleteProject = (id) => {
    let projectIndex = _projects.findIndex((project) => {
        return (project.id === id);
    });

    if(projectIndex > -1)
    {
        _projects.splice(projectIndex, 1);
    }

}

const getProject = (id) => {
    let projIndex = _projects.findIndex((project) => {
        return (project.id === id);
    });

    if(projIndex > -1)
    {
        return _projects[projIndex];
    } else {
        return null; // none found
    }

}

export { getProjects, appendNewProject, getProject, deleteProject, appendProjectFromData }