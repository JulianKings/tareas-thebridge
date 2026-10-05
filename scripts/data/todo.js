class ToDo {
    constructor(id, title, description, dueDate, priority, favorite, completed, projectId)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.favorite = favorite;
        this.completed = completed;
        this.projectId = projectId;
    }

    getDueDate() {
        let dateSplit = this.dueDate.split('/');
        let day = dateSplit[0];
        if(day.length == 1)
        {
            day = "0" + day;
        }
        return new Date(`${dateSplit[2]}-${dateSplit[1]}-${day}T12:00:00`);
    }
}

export { ToDo }