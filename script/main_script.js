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
    // Функция, которая берёт из памяти наши задачи и делает из них список
    function showTasks() {

         var keys = Object.keys(localStorage)
          .filter(key => key.startsWith(Mask))
          .sort((a, b) => {
            const aIndex = Number(a.slice(Mask.length));
            const bIndex = Number(b.slice(Mask.length));
            return bIndex - aIndex;
          });

        keys.forEach(key => {
              let taskObject = JSON.parse(localStorage.getItem(key));
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
                buttonContainer.append($('<input class=" form-check-input btn flex-shrink-0 checkbox input-check" type="checkbox" value="" style="font-size: 1.375em;" checked>'));
              } else {
                buttonContainer.append($('<input class="form-check-input btn flex-shrink-0 checkbox input-check" type="checkbox" value="" style="font-size: 1.375em;">').css({
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
            });
        }


    // Сразу вызываем эту функцию, вдруг в памяти уже остались задачи с прошлого раза
    showTasks();
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
          localStorage.setItem(Mask + number_Id, JSON.stringify(myTask));
          $('#task').val("");
          $('#info').val("");
          // и добавляем её в конец списка
          List.empty();
          showTasks();
        }
      }
    });

    $(document).on('click', '.delete-button', function (e) {
    // Находим задачу, по которой кликнули
    e.stopPropagation();
    // Убираем её из памяти
    var jet = $(e.target).closest('li');
    localStorage.removeItem(jet.attr('data-itemid'));
    // и убираем её из списка
    jet.remove();
    })


    $(document).on('click', '.change-button', function (e) {
    var jet = $(e.target).closest('li');
    let taskObjec = JSON.parse(localStorage.getItem(jet.attr('data-itemid')));
    let changeTask = new Task(String(taskObjec.id), String(taskObjec.task), String(taskObjec.info), String(taskObjec.status), Boolean(taskObjec.chek));
    // и убираем её из списка
       debugger;
         debugger;
     e.stopPropagation(); // Остановка всплытия события
    e.preventDefault();


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
        var jetn = $(t.target).closest('li');
        let taskObjec = JSON.parse(localStorage.getItem(jetn.attr('data-itemid')));
        let changeTask =  new Task(String(taskObjec.id), String($('#newTitleTask').val()), String( $('#newInfo').val()), String(taskObjec.status), Boolean(taskObjec.chek));
        localStorage.setItem(jetn.attr('data-itemid'), JSON.stringify(changeTask));
        debugger;
        List.empty();
        showTasks();
        })


  $(document).on('change', '.form-check-input', function() {
   var listItem = $(this).closest('li');
   var i = listItem.attr('data-itemid');
   var key = localStorage.key(i);
   let taskOb = JSON.parse(localStorage.getItem(key));
   let chekTask = new Task(Number(taskOb.id), String(taskOb.task), String(taskOb.info), String(taskOb.status), Boolean(taskOb.chek));
   localStorage.removeItem(i);

  if ($(this).prop('checked')) {
      chekTask.chek = true;
      listItem.addClass('dark-check-element');
      $(this).attr('checked', 'checked');
  } else {
      chekTask.chek = false;
    listItem.removeClass('dark-check-element');
    $(this).removeAttr('checked');
  }
  localStorage.setItem(i, JSON.stringify(chekTask));
});