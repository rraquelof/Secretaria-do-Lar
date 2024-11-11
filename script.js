document.addEventListener("DOMContentLoaded", () => {
    const taskLists = JSON.parse(localStorage.getItem("taskLists")) || [];
    const taskListsContainer = document.getElementById("taskLists");
    const addListButton = document.getElementById("addListButton");
    const newListModal = document.getElementById("newListModal");
    const saveListButton = document.getElementById("saveListButton");
    const closeModalButton = document.getElementById("closeModalButton");
    const noListsMessage = document.getElementById("noListsMessage");
    const tasksContainer = document.getElementById("tasksContainer");
    const addTaskButton = document.getElementById("addTaskButton");
    const viewListModal = document.getElementById("viewListModal");
    const viewListTitle = document.getElementById("viewListTitle");
    const viewTasksContainer = document.getElementById("viewTasksContainer");
    const closeViewListModalButton = document.getElementById("closeViewListModalButton");
    const trashArea = document.getElementById("trashArea");
    let draggedListIndex = null;
    let tasks = [];
    let currentListIndex = null;

    function renderLists() {
        taskListsContainer.innerHTML = "";
        if (taskLists.length === 0) {
            noListsMessage.classList.remove("hidden");
        } else {
            noListsMessage.classList.add("hidden");
            taskLists.forEach((list, index) => {
                const listPreview = document.createElement("div");
                listPreview.classList.add("list-preview");
                
                const listTitle = document.createElement("input");
                listTitle.type = "text";
                listTitle.value = list.name;
                listTitle.classList.add("list-title-input");
                listTitle.addEventListener("change", (e) => {
                    list.name = e.target.value;
                    localStorage.setItem("taskLists", JSON.stringify(taskLists));
                });
                
                listPreview.appendChild(listTitle);
                listPreview.style.backgroundColor = list.color || "#f3e9e5";

                listPreview.addEventListener("click", (e) => {
                    if (e.target === listPreview) {
                        openViewListModal(index);
                    }
                });

                listPreview.setAttribute("draggable", true);
                listPreview.addEventListener("dragstart", () => startDrag(index));
                listPreview.addEventListener("dragend", endDrag);

                taskListsContainer.appendChild(listPreview);
            });
        }
    }

    function startDrag(index) {
        draggedListIndex = index;
        trashArea.classList.add("visible");
    }

    function endDrag() {
        trashArea.classList.remove("visible");
    }

    trashArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    trashArea.addEventListener("drop", () => {
        if (draggedListIndex !== null) {
            taskLists.splice(draggedListIndex, 1);
            localStorage.setItem("taskLists", JSON.stringify(taskLists));
            renderLists();
            draggedListIndex = null;
        }
    });

    function createTaskElement(task, isNewList = false) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Título da tarefa";
        titleInput.value = task.title || "";
        titleInput.required = true;
        
        if (isNewList) {
            titleInput.addEventListener("input", (e) => {
                task.title = e.target.value;
            });
        } else {
            titleInput.addEventListener("change", (e) => {
                task.title = e.target.value;
                localStorage.setItem("taskLists", JSON.stringify(taskLists));
            });
        }

        const descriptionToggle = document.createElement("button");
        descriptionToggle.textContent = "Descrição";
        descriptionToggle.classList.add("description-button");
        descriptionToggle.addEventListener("click", () => {
            descriptionInput.classList.toggle("hidden");
        });

        taskTitle.appendChild(titleInput);
        taskTitle.appendChild(descriptionToggle);

        const descriptionInput = document.createElement("textarea");
        descriptionInput.placeholder = "Adicione uma descrição (opcional)";
        descriptionInput.classList.add("description-dropdown", "hidden");
        descriptionInput.value = task.description || "";
        
        if (isNewList) {
            descriptionInput.addEventListener("input", (e) => {
                task.description = e.target.value;
            });
        } else {
            descriptionInput.addEventListener("change", (e) => {
                task.description = e.target.value;
                localStorage.setItem("taskLists", JSON.stringify(taskLists));
            });
        }

        taskItem.appendChild(taskTitle);
        taskItem.appendChild(descriptionInput);

        return taskItem;
    }

    function addTaskToContainer(container, isNewList = false) {
        const task = { title: "", description: "", completed: false };
        tasks.push(task);
        const taskItem = createTaskElement(task, isNewList);
        container.appendChild(taskItem);
        return task;
    }

    addTaskButton.addEventListener("click", () => {
        addTaskToContainer(tasksContainer, true);
    });

    saveListButton.addEventListener("click", () => {
        const listName = document.getElementById("listTitle").value.trim();
        const validTasks = tasks.filter(task => task.title.trim() !== "");
        
        if (listName && validTasks.length > 0) {
            taskLists.push({
                name: listName,
                color: "#fff",
                items: validTasks
            });
            
            localStorage.setItem("taskLists", JSON.stringify(taskLists));
            renderLists();
            newListModal.classList.add("hidden");
            clearNewListModal();
        } else {
            alert("Por favor, adicione um nome para a lista e pelo menos uma tarefa com título.");
        }
    });

    function clearNewListModal() {
        document.getElementById("listTitle").value = "";
        tasks = [];
        tasksContainer.innerHTML = "";
    }

    addListButton.addEventListener("click", () => {
        newListModal.classList.remove("hidden");
        clearNewListModal();
    });

    closeModalButton.addEventListener("click", () => {
        newListModal.classList.add("hidden");
        clearNewListModal();
    });

    function openViewListModal(index) {
        currentListIndex = index;
        const list = taskLists[index];
        
        viewListTitle.innerHTML = '';
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = list.name;
        titleInput.classList.add("modal-list-title");
        titleInput.addEventListener("change", (e) => {
            list.name = e.target.value;
            localStorage.setItem("taskLists", JSON.stringify(taskLists));
            renderLists();
        });
        viewListTitle.appendChild(titleInput);
        
        renderTasksInModal(list, index);
        viewListModal.classList.remove("hidden");
    }

    function renderTasksInModal(list, listIndex) {
        viewTasksContainer.innerHTML = "";
        
        list.items.forEach((task, taskIndex) => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");

            const taskTitle = document.createElement("div");
            taskTitle.classList.add("task-title");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                localStorage.setItem("taskLists", JSON.stringify(taskLists));
            });

            const taskTitleInput = document.createElement("input");
            taskTitleInput.type = "text";
            taskTitleInput.value = task.title;
            taskTitleInput.addEventListener("change", (e) => {
                task.title = e.target.value;
                localStorage.setItem("taskLists", JSON.stringify(taskLists));
            });

            const descriptionToggle = document.createElement("button");
            descriptionToggle.textContent = "Descrição";
            descriptionToggle.classList.add("description-button");

            taskTitle.appendChild(checkbox);
            taskTitle.appendChild(taskTitleInput);
            taskTitle.appendChild(descriptionToggle);

            const descriptionContent = document.createElement("textarea");
            descriptionContent.classList.add("description-dropdown", "hidden");
            descriptionContent.value = task.description || "";
            descriptionContent.placeholder = "Digite uma descrição...";
            descriptionContent.addEventListener("change", (e) => {
                task.description = e.target.value;
                localStorage.setItem("taskLists", JSON.stringify(taskLists));
            });

            descriptionToggle.addEventListener("click", () => {
                descriptionContent.classList.toggle("hidden");
            });

            const deleteTaskButton = document.createElement("button");
            deleteTaskButton.textContent = "Excluir";
            deleteTaskButton.classList.add("delete-task-button");
            deleteTaskButton.addEventListener("click", () => {
                list.items.splice(taskIndex, 1);
                localStorage.setItem("taskLists", JSON.stringify(taskLists));
                renderTasksInModal(list, listIndex);
            });

            taskItem.appendChild(taskTitle);
            taskItem.appendChild(descriptionContent);
            taskItem.appendChild(deleteTaskButton);

            viewTasksContainer.appendChild(taskItem);
        });

        // Adicionar botão para novas tarefas
        const addNewTaskButton = document.createElement("button");
        addNewTaskButton.textContent = "Nova Tarefa";
        addNewTaskButton.classList.add("add-task");
        addNewTaskButton.addEventListener("click", () => {
            const newTask = { title: "Nova Tarefa", description: "", completed: false };
            list.items.push(newTask);
            localStorage.setItem("taskLists", JSON.stringify(taskLists));
            renderTasksInModal(list, listIndex);
        });
        
        viewTasksContainer.appendChild(addNewTaskButton);
    }

    closeViewListModalButton.addEventListener("click", () => {
        viewListModal.classList.add("hidden");
        currentListIndex = null;
    });

    renderLists();
});