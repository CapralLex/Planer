function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let csrftoken = getCookie('csrftoken');

(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
    function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement ('div');
    let button = document.createElement('button');
    
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
        form,
        input,
        button
    };
}

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoApp(container, title = 'Список дел'){

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let url = 'http://127.0.0.1:8000/api/task-list/'
        fetch(url)
            .then((resp) => resp.json())
            .then(function(data){

                console.log('Data: ', data)

                let list = data
                for (let i in list) {
                    makeNewTask(list[i]);
                }
            })

        function makeNewTask(item) {

            let todoItem = createTodoItem(item['text']);

            todoItem.doneButton.addEventListener('click', function(){
                completeTask(item)
                todoItem.item.classList.toggle('list-group-item-success');
            });
            todoItem.deleteButton.addEventListener('click', function(){
                if (confirm('Вы уверены?')){
                    todoItem.item.remove();
                    deleteItem(item)
                }
            });

            if (item['is_complete'] === true) {
                todoItem.item.classList.toggle('list-group-item-success');
            }

            todoList.append(todoItem.item);

        }

        function deleteItem(item) {
            console.log("Deleted: ", item)
            fetch(`http://127.0.0.1:8000/api/task-delete/${item.id}/`, {
				method:'DELETE',
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				}
			})
        }

        function completeTask(item) {
            console.log("Completed: ", item.id)
            item.is_complete = !item.is_complete
            fetch(`http://127.0.0.1:8000/api/task-update/${item.id}/`, {
				method:'POST',
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				},
				body:JSON.stringify({'text':item.text, 'is_complete':item.is_complete})
			})
        }

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            makeNewTask({'text': todoItemForm.input.value, 'is_complete': 0})

            let url = 'http://127.0.0.1:8000/api/task-create/'
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({'text': todoItemForm.input.value})
            }).then(function (response){
                location.reload(); // какая же классная команда
            })

            todoItemForm.input.value = '';

        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        createTodoApp(document.getElementById('my-todos'), 'Мои дела');
        //createTodoApp(document.getElementById('team-todos'), 'Дела команды');
    });

    function createTodoItem(name) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement ('button');
        let deleteButton = document.createElement('button');

        item.classList.add ('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-sucess');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton
        };

    }

})();