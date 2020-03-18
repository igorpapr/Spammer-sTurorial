function loadData() {
    getData();
    configureAddForm();
    configureModal();

    document.getElementById("save").addEventListener("click", function(e){
        e.preventDefault();
        let registerForm = document.forms["editForm"];
        let email = registerForm.elements["emailedit"].value;
        let fname = registerForm.elements["fnameedit"].value;
        let sname = registerForm.elements["snameedit"].value;
        let patr = registerForm.elements["patredit"].value;

        let data = JSON.stringify({_id: email, name: fname, surname: sname, patronymic: patr});

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/upd", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.onreadystatechange =  function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                clearForm('editForm');
                $('#modal').modal('hide');
                getData();
            }
            else if(xhr.status !== 200){
                alert("Something went wrong while editing.");
            }
        };
        xhr.send(data);
    });
}


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function configureAddForm(){
    document.getElementById("add-button").addEventListener("click", function(e){
        e.preventDefault();
        // получаем данные формы
        let registerForm = document.forms["addForm"];
        let email = registerForm.elements["email"].value;
            if (validateEmail(email)){
                let fname = registerForm.elements["fname"].value;
                let sname = registerForm.elements["sname"].value;
                let patr = registerForm.elements["patr"].value;

                let data = JSON.stringify({_id: email, name: fname, surname: sname, patronymic: patr});

                let xhr = new XMLHttpRequest();
                xhr.open("POST", "/add", true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.onreadystatechange =  function () {
                    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        clearForm('addForm');
                        getData();
                    }
                    else if(xhr.status !== 200){
                        alert("Something went wrong while adding.");
                    }
                };
                xhr.send(data);
            }
            else{
                alert("Bad email, try again.");
                let elem = document.getElementById('email');
                elem.value = '';
            }

    });
}

function configureModal() {
    $('#modal').on('show.bs.modal', function (event) {
        let $tr = $(event.relatedTarget).parent().parent(); //current table row
        let $email = $tr.find("td:nth-child(1)").text();
        let $sname = $tr.find("td:nth-child(2)").text();
        let $fname = $tr.find("td:nth-child(3)").text();
        let $patr = $tr.find("td:nth-child(4)").text();

        let modal = $(this);
        modal.find('#emailedit').val($email);
        modal.find('#fnameedit').val($fname);
        modal.find('#snameedit').val($sname);
        modal.find('#patredit').val($patr);
    });

}

function getData() {
    let url="/getUsers";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (this.status === 200) {
            treatTable(this.response);
        }
        else {
            let error = new Error(this.statusText);
            error.code = this.status;
            alert(error);
        }
    };
    xhr.onerror = function() {
        alert("Network Error");
    };
    xhr.send();
}

function treatTable(data) {
    dataObj = JSON.parse(data);
    let elem = document.getElementById("mails");
    let inner = '<tr class="thead-dark">' +
        '<th>Address</th>' +
        '<th>Surname</th>' +
        '<th>First name</th>' +
        '<th>Last name</th>' +
        '<th></th>' +
        '<th></th>' +
        '</tr>';
    for (let user of dataObj){
        inner += '<tr class="table-row"><td>'
            + user._id
            + '</td><td>'
            + user.surname
            + '</td><td>'
            + user.name
            + '</td><td>'
            + user.patronymic
            + '</td><td>'
            + '<button class="btn btn-info" data-toggle="modal" ' +
            'data-target="#modal">Edit</button>'
            + '</td><td>'
            + '<button class="btn btn-danger" onclick="sendDelete(this.id)" id='+user._id+'>Delete</button>'
            + '</td></tr>';
    }
    elem.innerHTML = inner;
}

function sendDelete(currentId) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/del", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            getData();
        }
        else if(xhr.status !== 200){
            alert("Something went wrong while deleting "+currentId+".");
        }
    };
    xhr.send(JSON.stringify({email: currentId}));
}

function clearForm(name) {
    let form = document.forms[name];
    form.reset();
}

function addTemplate(event) {
    let targ = event.target || event.srcElement;
    document.getElementById('message').value += targ.textContent || targ.innerText;
}