document.addEventListener("DOMContentLoaded", () => { getAllUser() });

function getAllUser() {
     fetch("/User/GetAll/")
        .then(resp => resp.json())
        .then(users => {
            let tBody = document.querySelector(".table-body");
            tBody.innerHTML = "";

            for (let i = 0; i < users.length; i++) {
                printUserInTable(users[i], tBody);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function showUpsertDialog(title, func, id = 0) {
    let btnUpsert = document.querySelector("#btn-upsert");
    btnUpsert.innerHTML = title;
    btnUpsert.onclick = () => func(id);

    document.querySelector("#upsertModalLabel").innerHTML = title + " user";

    getUser(id);
}

function getUser(id) {
    fetch("/User/Get/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(resp => resp.json())
        .then(user => {
            document.querySelector("#name-input").value = user.name;
            document.querySelector("#age-input").value = user.age;

            return user;
        })
        .catch(err => console.log(err));
}

function getUserForm(id) {
    let user = {
        id: 0,
        name: "",
        age: 0
    }

    user.id = id;
    user.name = document.querySelector("#name-input").value;
    user.age = document.querySelector("#age-input").value;

    return user;
}

function addUser() {
    let user = {
        name: document.querySelector("#name-input").value,
        age: document.querySelector("#age-input").value
    }

    fetch("/User/Upsert/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                console.log(data.message)

                document.querySelector("#btn-close-modal").click();

                getAllUser();

                return;
            }

            showValidationText(data.message); 

            console.log(data.message);
        })
        .catch(err => console.log(err));
}

function editUser(id) {

    let user = getUserForm(id);

    fetch("/User/Upsert/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(resp => resp.json())
        .then(data => {

            if (data.success) {
                console.log(data.message)

                document.querySelector("#btn-close-modal").click();

                getAllUser();

                return;
            }

            showValidationText(data.message);

            console.log(data.message);
        })
        .catch(err => console.log(err));
}

function deleteUser(id) {

    var isDelete = confirm(`Do you want to delete this user (his id - ${id})?`);

    if (!isDelete) return;

    fetch("/User/Delete/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(id)
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);

                getAllUser();

                return;
            }

            console.log(data.message);
        })
        .catch(err => console.log(err));
}

function printUserInTable(user, tBody) {
    let tr = document.createElement("tr");
    tr.classList.add('newRow');

    let thName = document.createElement("th");
    thName.innerHTML = user.name;

    let thAge = document.createElement("th");
    thAge.innerHTML = user.age;

    let btnDel = document.createElement("button");
    btnDel.addEventListener("click", () => { deleteUser(user.id); });
    btnDel.classList.add("btn");
    btnDel.classList.add("btn-danger");
    btnDel.innerHTML = "Delete";

    let btnEdit = document.createElement("button");
    btnEdit.addEventListener("click", () => { showUpsertDialog("Edit", editUser, user.id); });
    btnEdit.classList.add("btn");
    btnEdit.classList.add("btn-warning");
    btnEdit.classList.add("m-2");
    btnEdit.innerHTML = "Edit";
    btnEdit.setAttribute("data-bs-toggle", "modal");
    btnEdit.setAttribute("data-bs-target", "#upsertModal");

    let thBtnGroup = document.createElement("th");

    thBtnGroup.appendChild(btnEdit);
    thBtnGroup.appendChild(btnDel);

    tr.appendChild(thName);
    tr.appendChild(thAge);
    tr.appendChild(thBtnGroup);

    tBody.appendChild(tr);
}

function showValidationText(title) {
    let validText = document.querySelector("#validationText");

    validText.innerHTML = title;
    validText.style.visibility = "visible";
}

function hideValidationText() { document.querySelector("#validationText").style.visibility = "hidden" }