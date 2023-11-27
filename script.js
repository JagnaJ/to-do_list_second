$(document).ready(function() {
  let todoList = [];
  let completedList = [];

  // Проверка наличия данных в localStorage и загрузка, если они есть
  if (localStorage.getItem('todoList')) {
    todoList = JSON.parse(localStorage.getItem('todoList'));
    displayTasks('todoList', todoList);
  }

  if (localStorage.getItem('completedList')) {
    completedList = JSON.parse(localStorage.getItem('completedList'));
    displayTasks('completedList', completedList);
  }

  // Функция отображения задач на экране
  function displayTasks(id, list) {
    $('#' + id).empty();
    list.forEach(function(task, index) {
      let listItem = '<li data-index="' + index + '" class="task-item">' +
                       '<span>' + task.title + '</span>' +
                       '<i class="edit fa fa-pencil" style="display: none;"></i>' +
                     '</li>';
      $('#' + id).append(listItem);
    });
    updateProgressCircle();
  }

// Обработчик событий для удаления задачи
$('body').on('click', 'i.delete', function () {
const listItem = $(this).closest('li');
const index = listItem.data('index');
const parentListId = listItem.parent().attr('id');

if (parentListId === 'todoList') {
  todoList.splice(index, 1);
  localStorage.setItem('todoList', JSON.stringify(todoList));
  displayTasks('todoList', todoList);
} else if (parentListId === 'completedList') {
  completedList.splice(index, 1);
  localStorage.setItem('completedList', JSON.stringify(completedList));
  displayTasks('completedList', completedList);
}
});
  // Добавление новой задачи
  $('#addTaskButton').on('click', function() {
    let newTaskTitle = $('#newTaskInput').val();
    let newTask = {
      title: newTaskTitle,
      completed: false
    };
    todoList.push(newTask);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    displayTasks('todoList', todoList);
    $('#newTaskInput').val('');
  });
// Добавление новой задачи при нажатии клавиши Enter
  $('#newTaskInput').on('keypress', function (e) {
    if (e.which === 13) {
      addNewTask();
    }
  });

  // Обработчик событий для удаления задачи
$('body').on('click', 'i.delete', function () {
  const listItem = $(this).closest('li');
  const index = listItem.data('index');
  const parentListId = listItem.parent().attr('id');

  if (parentListId === 'todoList') {
    todoList.splice(index, 1);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    displayTasks('todoList', todoList);
  } else if (parentListId === 'completedList') {
    completedList.splice(index, 1);
    localStorage.setItem('completedList', JSON.stringify(completedList));
    displayTasks('completedList', completedList);
  }
});

// Функция добавления новой задачи
function addNewTask() {
  let newTaskTitle = $('#newTaskInput').val();
  let newTask = {
    title: newTaskTitle,
    completed: false
  };
  todoList.push(newTask);
  localStorage.setItem('todoList', JSON.stringify(todoList));
  displayTasks('todoList', todoList);
  $('#newTaskInput').val('');
}



  // Отслеживание клика по задаче для переноса в выполненные или обратно в список дел
  $('body').on('click', 'li.task-item', function() {
    let index = $(this).data('index');
    if ($(this).parent().attr('id') === 'todoList') {
      completedList.push(todoList[index]);
      todoList.splice(index, 1);
      localStorage.setItem('completedList', JSON.stringify(completedList));
      localStorage.setItem('todoList', JSON.stringify(todoList));
      displayTasks('todoList', todoList);
      displayTasks('completedList', completedList);
    } else if ($(this).parent().attr('id') === 'completedList') {
      todoList.push(completedList[index]);
      completedList.splice(index, 1);
      localStorage.setItem('completedList', JSON.stringify(completedList));
      localStorage.setItem('todoList', JSON.stringify(todoList));
      displayTasks('todoList', todoList);
      displayTasks('completedList', completedList);
    }
  });

  // Очистка всех задач
  $('#clearAllButton').on('click', function() {
    todoList = [];
    completedList = [];
    localStorage.removeItem('todoList');
    localStorage.removeItem('completedList');
    displayTasks('todoList', todoList);
    displayTasks('completedList', completedList);
  });

  // Функция для обновления процентного круга
  function updateProgressCircle() {
    const todoTasks = document.querySelectorAll('#todoList li').length;
    const completedTasks = document.querySelectorAll('#completedList li').length;
    const totalTasks = todoTasks + completedTasks;
    
    if (totalTasks === 0) {
      $('.progress .percent').text(0);
    } else {
      const percentComplete = Math.round((completedTasks / totalTasks) * 100);
      $('.progress .percent').text(percentComplete);
    }
  }

  // Показать иконку редактирования при наведении
  $('body').on('mouseenter', 'li.task-item', function() {
    $(this).find('.edit').show();
  });

  // Скрыть иконку редактирования при уходе курсора
  $('body').on('mouseleave', 'li.task-item', function() {
    $(this).find('.edit').hide();
  });

  // Обработчик событий для редактирования задания
  $('body').on('click', 'i.edit', function(event) {
    const taskText = $(this).siblings('span').text();
    const newText = prompt('Edit task:', taskText);
    if (newText !== null) {
      $(this).siblings('span').text(newText);
      updateProgressCircle();
    }
    event.stopPropagation();
  });
});
