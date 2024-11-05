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

    function renderLists() {
        taskListsContainer.innerHTML = "";
        if (taskLists.length === 0) {
            noListsMessage.classList.remove("hidden");
        } else {
            noListsMessage.classList.add("hidden");
            taskLists.forEach((list, index) => {
                const listPreview = document.createElement("div");
                listPreview.classList.add("list-preview");
                listPreview.textContent = list.name;
                listPreview.style.backgroundColor = list.color || "#f3e9e5";

                // Abre modal para visualizar lista completa ao clicar
                listPreview.addEventListener("click", () => openViewListModal(index));

                // Funções de arrastar
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

    trashArea.addEventListener("dragover", (event) => {
        event.preventDefault(); // Permite soltar o item
    });

    trashArea.addEventListener("drop", () => {
        if (draggedListIndex !== null) {
            taskLists.splice(draggedListIndex, 1);
            localStorage.setItem("taskLists", JSON.stringify(taskLists));
            renderLists();
            draggedListIndex = null;
        }
    });

    function openViewListModal(index) {
        const list = taskLists[index];
        viewListTitle.textContent = list.name;
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

            const taskTitleText = document.createElement("span");
            taskTitleText.textContent = task.title;

            const descriptionToggle = document.createElement("button");
            descriptionToggle.textContent = "Descrição";
            descriptionToggle.addEventListener("click", () => {
                descriptionContent.classList.toggle("hidden");
            });

            taskTitle.appendChild(checkbox);
            taskTitle.appendChild(taskTitleText);
            taskTitle.appendChild(descriptionToggle);

            const descriptionContent = document.createElement("p");
            descriptionContent.classList.add("description-dropdown");
            descriptionContent.textContent = task.description || "nenhuma descrição adicionada";
            descriptionContent.classList.add("hidden");

            // Botão para excluir a tarefa
            const deleteTaskButton = document.createElement("button");
            deleteTaskButton.textContent = "Excluir";
            deleteTaskButton.classList.add("delete-task-button");
            deleteTaskButton.addEventListener("click", () => {
                list.items.splice(taskIndex, 1);
                localStorage.setItem("taskLists", JSON.stringify(taskLists));
                openViewListModal(index); // Recarrega a lista atualizada
            });

            taskItem.appendChild(taskTitle);
            taskItem.appendChild(descriptionContent);
            taskItem.appendChild(deleteTaskButton);

            viewTasksContainer.appendChild(taskItem);
        });

        viewListModal.classList.remove("hidden");
    }

    closeViewListModalButton.addEventListener("click", () => {
        viewListModal.classList.add("hidden");
    });

    addListButton.addEventListener("click", () => {
        newListModal.classList.remove("hidden");
    });

    closeModalButton.addEventListener("click", () => {
        newListModal.classList.add("hidden");
        clearNewListModal();
    });

    function clearNewListModal() {
        document.getElementById("listTitle").value = "";
        tasks = [];
        tasksContainer.innerHTML = "";
    }

    addTaskButton.addEventListener("click", () => {
        const task = { title: "", description: "", completed: false };
        tasks.push(task);

        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Título da tarefa";
        titleInput.required = true;
        titleInput.addEventListener("input", (e) => {
            task.title = e.target.value;
        });

        const descriptionToggle = document.createElement("button");
        descriptionToggle.textContent = "Descrição";
        descriptionToggle.addEventListener("click", () => {
            descriptionInput.classList.toggle("hidden");
        });

        taskTitle.appendChild(titleInput);
        taskTitle.appendChild(descriptionToggle);

        const descriptionInput = document.createElement("textarea");
        descriptionInput.placeholder = "Adicione uma descrição (opcional)";
        descriptionInput.classList.add("description-dropdown", "hidden");
        descriptionInput.addEventListener("input", (e) => {
            task.description = e.target.value;
        });

        taskItem.appendChild(taskTitle);
        taskItem.appendChild(descriptionInput);
        tasksContainer.appendChild(taskItem);
    });

    saveListButton.addEventListener("click", () => {
        const listName = document.getElementById("listTitle").value.trim();
        if (listName && tasks.length > 0) {
            taskLists.push({ name: listName, color: "#fff", items: tasks });
            localStorage.setItem("taskLists", JSON.stringify(taskLists));
            renderLists();
            newListModal.classList.add("hidden");
            clearNewListModal();
        } else {
            alert("Por favor, adicione um nome para a lista e pelo menos uma tarefa.");
        }
    });

    renderLists();
});
