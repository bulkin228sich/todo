import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { doc, collection, addDoc , getDoc , setDoc, query , where, updateDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

  // Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDslTfzea0KFaVHszP6Q8BPst6prF1obmY",
authDomain: "todolist-e24ca.firebaseapp.com",
projectId: "todolist-e24ca",
storageBucket: "todolist-e24ca.appspot.com",
messagingSenderId: "173648301613",
appId: "1:173648301613:web:28337caf368ff49aee72a4"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
class Task {
  constructor(id, task, info, status, chek) {

    this.id = String(id);
    this.task = String(task);
    this.info = String(info);
    this.status = String(status);
    this.chek = Boolean(chek);
  }
}
    // Заводим переменные под наши задачи
var List = $('#tdlApp ul');
var Mask = 'tdl_';
var Filter = false;


if (localStorage.getItem("user") !== null) {
    const divElement = document.querySelector(".head-button-right");
    divElement.innerHTML = `<a href="https://bulkin228sich.github.io/todo/templates/login.html"><button type="button" class="btn btn-outline-primary me-2">Выйти</button></a>`;
    var storage = sessionStorage;
    loadingSession();
} else {
    var storage = localStorage;
    showTasks();
}
async function loadingSession() {
    var date = "";
    getDoc(doc(db, "users", localStorage.getItem('user')))
      .then((docSnapshot) => {
        const val = docSnapshot.data();
        const dataString = JSON.stringify(val);
        return JSON.parse(dataString).task; // Возвращаем данные для передачи в следующий обработчик
      })
      .then((taskData) => {
        date = JSON.parse(taskData);
        Object.entries(date).forEach(([key, value]) => {
          sessionStorage.setItem(key, value);
        });
      })
      .then(() => {
        showTasks();
      });
  }

// Функция, которая берёт из памяти наши задачи и делает из них список
function showTasks() {
     var keys = Object.keys(storage)
      .filter(key => key.startsWith(Mask))
      .sort((a, b) => {
        const aIndex = Number(a.slice(Mask.length));
        const bIndex = Number(b.slice(Mask.length));
        return bIndex - aIndex;
      });
    if (Filter){
        const trueObjects = [];
        const falseObjects = [];
    keys.forEach(function(key) {
      const object = JSON.parse(storage.getItem(key));
      if (object.chek === true) {
        trueObjects.push(key);
      } else {
        falseObjects.push(key);
      }
    });
    keys = falseObjects.concat(trueObjects);
    }
    List.empty();

    keys.forEach(key => {
         appendTask(key);
    });
}

    // Следим, когда пользователь напишет новую задачу в поле ввода и нажмёт добавить
$('#newTask').on('click keyup', function (e) {
  if (e.type === 'click' || e.keyCode === 13) {
    var str = $('#task').val();

    // Если в поле ввода было что-то написано — начинаем обрабатывать
    if (str.length > 0) {
      var number_Id = 0;
      List.children().each(function (index, el) {
        var element_Id = $(el).attr('data-itemid').slice(4);
        if (element_Id > number_Id)
          number_Id = element_Id;
      })
      number_Id++;
      let myTask = new Task(number_Id, $('#task').val(), $('#info').val(), "", false);
      // Отправляем новую задачу сразу в память
      storage.setItem(Mask + number_Id, JSON.stringify(myTask));
      $('#task').val("");
      $('#info').val("");
      // и добавляем её в конец списка
      if (localStorage.getItem("user") !== null) {
        saveUserList();
      }
      showTasks();
    }
  }
});

$(document).on('click', '.delete-button', function (e) {
    e.stopPropagation(); // Остановка всплытия события
    e.preventDefault();
    // Находим задачу, по которой кликнули
    e.stopPropagation();
    // Убираем её из памяти
    var jet = $(e.target).closest('li');
    storage.removeItem(jet.attr('data-itemid'));
    if (localStorage.getItem("user") !== null) {
      saveUserList();
    }
    // и убираем её из списка
    jet.remove();
})


$(document).on('click', '.change-button', function (e) {
    if ($('.changed').length) {

      var listItem = $('.changed');
      var key = listItem.attr('data-itemid');
      let taskObject = JSON.parse(storage.getItem(key));
      let oldTask = new Task(String(taskObject.id), String(taskObject.task), String(taskObject.info), String(taskObject.status), Boolean(taskObject.chek));
      if (oldTask.chek) {
                var tdItem = $('<div></div>');
              } else {
                var tdItem = $('<div></div>');
              }

              // и делаем это элементами списка

              tdItem.attr('data-itemid', key)
                      .append($('<span class="task-style"></span>').text(oldTask.task))
                      .append($('<br>'))
                      .append($('<span class="info-style"></span>').text(oldTask.info))
                      .append($('<br><br>'));

              var buttonContainer = $('<div></div>').addClass('button-container');
              if (oldTask.chek) {
                buttonContainer.append($('<input class=" form-check-input btn flex-shrink-0 checkbox input-check" type="checkbox" value="" style="font-size: 1.375em;" checked>').attr('id', key).css({
                  'border-color': '#5987fd'
                }));
              } else {
                buttonContainer.append($('<input class="form-check-input btn flex-shrink-0 checkbox input-check" type="checkbox" value="" style="font-size: 1.375em;">').attr('id', key).css({
                  'border-color': '#5987fd'
                }));
              }
              buttonContainer
                      .append($('<button></button>').addClass('btn btn-outline-primary me-2 delete-button').text('Удалить').css({
                        'float': 'center'
                      }))
                      .append($('<button></button>').addClass('btn btn-outline-primary me-2 change-button').text('Изменить').css({
                        'float': 'left'
                      }))
                      .appendTo(tdItem);
              $('<br>').appendTo(tdItem);

      listItem.html(tdItem);
      listItem.removeClass('changed');

    }

    var jet = $(e.target).closest('li');
    var keyc = jet.attr('data-itemid')
    let taskObjec = JSON.parse(storage.getItem(keyc));
    let changeTask = new Task(String(taskObjec.id), String(taskObjec.task), String(taskObjec.info), String(taskObjec.status), Boolean(taskObjec.chek));
    // и убираем её из списка
    jet.addClass('changed');

    debugger;

    jet.html('<div class="my-div">' +
            '      <input type="text" class="form-control inputtask-style" id="newTitleTask" placeholder="Тема" >\n' +
            '      <div class="div-height10 "></div>\n' +

            '      <input type="text" class="form-control inputinfo-style" id="newInfo" placeholder="Описание" >\n' +
            '      <div class="div-height10"></div>\n' +
                  '<div class="button-container">\n' +
            '      <button type="button" class="btn btn-outline-primary me-2 saveChange" id="saveChange" style="float: right;">Сохранить</button></div></div>'
    );
  $('#newTitleTask').val(changeTask.task);
  $('#newInfo').val(changeTask.info);
  jet.css('align-items', 'stretch');
})

$(document).on('click', '.saveChange', function (t) {
    t.preventDefault();
        var jetn = $(t.target).closest('li');
        let taskObjec = JSON.parse(storage.getItem(jetn.attr('data-itemid')));
        let changeTask =  new Task(String(taskObjec.id), String($('#newTitleTask').val()), String( $('#newInfo').val()), String(taskObjec.status), Boolean(taskObjec.chek));
        storage.setItem(jetn.attr('data-itemid'), JSON.stringify(changeTask));
         if (localStorage.getItem("user") !== null) {
          saveUserList();
        }
        showTasks();

  })

$(document).on('change', '.form-check-input', function() {
   var listItem = $(this).closest('li');
   var i = listItem.attr('data-itemid');
   let taskOb = JSON.parse(storage.getItem(i));
   let chekTask = new Task(Number(taskOb.id), String(taskOb.task), String(taskOb.info), String(taskOb.status), Boolean(taskOb.chek));
   storage.removeItem(i);
  if ($(this).prop('checked')) {
      chekTask.chek = true;
      listItem.addClass('dark-check-element');
      $(this).attr('checked', 'checked');
  } else {
      chekTask.chek = false;
    listItem.removeClass('dark-check-element');
    $(this).removeAttr('checked');
  }
  storage.setItem(i, JSON.stringify(chekTask));
   if (localStorage.getItem("user") !== null) {
      saveUserList();
    }
  showTasks();
});


    function appendTask(key) {
      let taskObject = JSON.parse(storage.getItem(key));
              let oldTask = new Task(String(taskObject.id), String(taskObject.task), String(taskObject.info), String(taskObject.status), Boolean(taskObject.chek));
              // и делаем это элементами списка
              if (oldTask.chek) {
                var tdItem = $('<li class="tdItem dark-check-element"></li>');
              } else {
                var tdItem = $('<li class="tdItem"></li>');
              }
              tdItem.attr('data-itemid', key)
                      .append($('<span class="task-style"></span>').text(oldTask.task))
                      .append($('<br>'))
                      .append($('<span class="info-style"></span>').text(oldTask.info))
                      .append($('<br><br>'))
                      .appendTo(List);

              var buttonContainer = $('<div></div>').addClass('button-container');
              if (oldTask.chek) {
                buttonContainer.append($('<input class=" form-check-input btn flex-shrink-0 checkbox input-check" type="checkbox" value="" style="font-size: 1.375em;" checked>').attr('id', key).css({
                  'border-color': '#5987fd'
                }));
              } else {
                buttonContainer.append($('<input class="form-check-input btn flex-shrink-0 checkbox input-check" type="checkbox" value="" style="font-size: 1.375em;">').attr('id', key).css({
                  'border-color': '#5987fd'
                }));
              }
              buttonContainer
                      .append($('<button></button>').addClass('btn btn-outline-primary me-2 delete-button').text('Удалить').css({
                        'float': 'center'
                      }))
                      .append($('<button></button>').addClass('btn btn-outline-primary me-2 change-button').text('Изменить').css({
                        'float': 'left'
                      }))
                      .appendTo(tdItem);
              $('<br>').appendTo(tdItem);
    }
  function saveUserList() {
      // Получаем все ключи из sessionStorage
      const keys = Object.keys(sessionStorage);

      // Создаем пустой объект для хранения данных
      const data = {};

      // Получаем данные для каждого ключа и сохраняем их в объекте
      keys.forEach(key => {
        data[key] = sessionStorage.getItem(key);
      });

      // Преобразуем объект в JSON-строку
      const dataStrings = JSON.stringify(data);
    updateDoc(doc(db, "users", localStorage.getItem('user')), {
      task: dataStrings
    });
  }

const loginLink = document.querySelector("a[href=\"https://bulkin228sich.github.io/todo/templates/login.html\"]");
loginLink.addEventListener("click", function(event) {
  // Здесь вы можете разместить код для обработки события нажатия на ссылку
  localStorage.removeItem("user");
  sessionStorage.clear();
});

document.getElementById("sortTask").addEventListener("click", function() {
    if (Filter) {
        Filter = false;
    } else{
        Filter = true;
    }
    showTasks();
});
