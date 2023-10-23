console.log("Welcome");
// hide parameterBox
let parameterBox = document.getElementById("paraBox");
let jsonBox = document.getElementById("jsonBox");
let jsonRadio = document.getElementById("json");
let addBtn = document.getElementById("addParam");
parameterBox.classList.add("d-none");
let submit = document.getElementById("submit");
let params = document.getElementById("params");
let responseText = document.getElementById("responsePre");

// if clicks params box show parameters box
let coustomBox = document.getElementById("coustom");
coustomBox.addEventListener("click", () => {
    parameterBox.classList.remove("d-none");
    params.classList.remove("d-none");
    jsonBox.classList.add("d-none");

})
// if clicks json box hide parameters box

jsonRadio.addEventListener("click", () => {
    parameterBox.classList.add("d-none");
    jsonBox.classList.remove("d-none");
    params.classList.add("d-none");
})

// to add more coustom parameters  when the user clicks add button 
let length = 2;
paramCount = 0;
addBtn.addEventListener("click", (e) => {
    let string = `
    <div class="row my-2" id="parameterBox${length}">
        <label for="url" class="col-sm-2 col-form-label">Parameter ${length}</label>
        <div class="col">
            <input type="text" class="form-control" placeholder="Enter Parameter ${length} Key" id="parameterValue${paramCount + 2}">
        </div>
        <div class="col">
            <input type="text" class="form-control" placeholder="Enter Parameter ${length} value" id="parameterKey${paramCount + 2}">
        </div>
        <div class="col-auto">
            <button id="deleteParam${length}" class="btn btn-primary" onClick="deleteParam(this.id)"> - </button>
        </div >
    </div > `
    let paramElement = getElemenFromString(string);
    params.appendChild(paramElement)
    length++;
    paramCount++;
    e.preventDefault()
})
function getElemenFromString(string) {
    let form = document.createElement("form");
    form.innerHTML = string;
    return form.firstElementChild;
}
function deleteParam(id) {
    console.log(id);
    let paramDiv = document.getElementById("params");
    ele = document.getElementById(id);
    params.removeChild(ele.parentNode.parentNode);
    length = parseInt(paramDiv.lastElementChild.lastElementChild.lastElementChild.getAttribute("id").split("m").splice(-1)) + 1;
    paramCount--;
}

submit.addEventListener("click", (e) => {

    let url = document.getElementById("urlBox").value;
    document.getElementById("responsePrism").innerHTML = "Please Wait... Fetching Response...";
    let requestType = document.querySelector("input[name='gridRadios']:checked").value;
    let containType = document.querySelector("input[name='containtRadios']:checked").value;
    let data = {};
    if (checkUrl()) {
        var urlInput = document.getElementById("urlBox");
        urlInput.classList.remove("is-invalid");
        if (containType == "params") {
            for (let i = 0; i <= paramCount; i++) {
                if (document.getElementById("parameterValue" + (i + 1)) != undefined) {
                    let value = document.getElementById("parameterValue" + (i + 1)).value;
                    let Key = document.getElementById("parameterKey" + (i + 1)).value;
                    data[value] = Key;
                }
                data = JSON.stringify(data);
            }
        }
        else {
            data = document.getElementById("jsonBoxText").value;
        }

        if (requestType == "get") {
            apiFech(url, "GET").then(text => {
                document.getElementById("responsePrism").innerHTML = text;
                Prism.highlightAll();
            })
        }
        else {
            apiFech(url, "POST", data = data).then(text => {
                document.getElementById("responsePrism").innerHTML = text;
                Prism.highlightAll();
            })
        }
        Prism.highlightAll();
        showMassage("success", "Successfully", "Get Response.");
    }
    else {
        urlInput = document.getElementById("urlBox");
        urlInput.classList.add("is-invalid");
        showMassage("danger", "Please", "Enter Valid Url.");
        document.getElementById("responsePrism").innerHTML = "Some Error Occoured......"
    }


})
function checkUrl() {
    let reg = /^(https?:\/\/([a-zA-Z0-9]){1,20}(\.){1}([a-z]){1,5})/;
    let url = document.getElementById("urlBox").value;
    return reg.test(url);
}
function showMassage(alertType, strongMassage, massage) {
    let showAlert = document.getElementById("showAlert");
    let str = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
    <strong>${strongMassage}</strong> ${massage}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`

    showAlert.innerHTML = str;
    setTimeout(() => {
        showAlert.innerHTML = "";
    }, 3000);
}
async function apiFech(url, method, data = "") {
    if (method == "GET") {
        var responseText = await fetch(url, { method: "GET", });
    }
    else {
        var responseText = await fetch(url, {
            method: "POST",
            body: data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
    }
    const datas = await responseText.text();
    return datas

}
