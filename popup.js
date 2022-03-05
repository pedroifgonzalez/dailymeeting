// let yesterday_content = document.getElementById("fromyesterday")
let questionYesterday = document.getElementById("questionYesterday");
let questionToday = document.getElementById("questionToday");
let add_button = document.getElementById("addButton");
let task_input = document.getElementById("taskInput");

add_button.addEventListener("click", add_task_or_ignore);

function add_task_or_ignore() {
    if (task_input.value != '') {
        add_task();
    }
}

function setListeners() {
    a_tags = document.getElementsByTagName("a");
    for (let i = 0; i < a_tags.length; i++) {
        a_tags.item(i).addEventListener("click", function () {
            this.parentElement.remove();
            updateLocalTasksStorage();
        })
    }
    span_elements = document.getElementsByTagName("span");
    for (let index = 0; index < span_elements.length; index++) {
        let span_element = span_elements.item(index);
        span_element.addEventListener("click", function (event) {
            let task_content = this.innerText;
            let input_element = document.createElement("input");
            input_element.value = task_content;
            input_element.setAttribute("class", "task_content");
            child_element = this.parentElement.getElementsByClassName("task_content")[0];
            this.parentElement.appendChild(input_element);
            let checkbox = this.parentElement.getElementsByClassName("checkbox").item(0);
            checkbox.disabled = true;
            this.parentElement.removeChild(child_element);
            input_element.addEventListener("keyup", function (event) {
                if (event.key === 'Enter'){
                    let task_content = this.parentElement.getElementsByClassName("task_content")[0].value;
                    let span_element = document.createElement("span");
                    span_element.innerText = task_content;
                    span_element.setAttribute("class", "task_content");
                    let checkbox = this.parentElement.getElementsByClassName("checkbox").item(0);
                    this.parentElement.appendChild(span_element);
                    this.remove()
                    checkbox.disabled = false;
                    updateLocalTasksStorage();
                    setListeners();
                }
            });
        });
    }
    tasks = document.getElementsByClassName("task");
    for (let index = 0; index < tasks.length; index++) {
        let checkbox = tasks.item(index).getElementsByClassName("checkbox").item(0);
        checkbox.addEventListener('input', function (event) {
            if (this.checked) {
                let task_content = this.parentElement.getElementsByClassName("task_content")[0].innerText;
                let strike_element = document.createElement("strike");
                strike_element.innerText = task_content;
                strike_element.setAttribute("class", "task_content");
                span_element = this.parentElement.getElementsByClassName("task_content")[0];
                this.parentElement.removeChild(span_element);
                this.parentElement.appendChild(strike_element);
                this.parentElement.getElementsByClassName("status").item(0).setAttribute("value", 1);
                updateLocalTasksStorage();
            }
            else {
                let task_content = this.parentElement.getElementsByClassName("task_content")[0].innerText;
                let span_element = document.createElement("span");
                span_element.innerText = task_content;
                span_element.setAttribute("class", "task_content");
                strike_element = this.parentElement.getElementsByClassName("task_content")[0];
                this.parentElement.removeChild(strike_element);
                this.parentElement.appendChild(span_element);
                this.parentElement.getElementsByClassName("status").item(0).setAttribute("value", 0);
                updateLocalTasksStorage();
                setListeners();
            }
        })
    }
}

// set "From yesterday content" default
chrome.storage.local.get(["fromyesterday"], function (result) {
    let tasks = result["fromyesterday"];
    let default_p = document.getElementById("default")
    default_p.innerText = tasks;
});

// Set events for hiding and showing From Yesterday and For Today contents
questionYesterday.addEventListener("click", async () => {
    hideOrShow(document.getElementById("fromyesterday"));
});

questionToday.addEventListener("click", async () => {
    hideOrShow(document.getElementById("fortoday"));
});

function hideOrShow(element) {
    if (element.className == "hidden") {
        element.setAttribute("class", "show")
    }
    else {
        element.setAttribute("class", "hidden")
    }
}

function updateLocalTasksStorage() {
    let tasks = document.getElementsByClassName("task");
    let task_list = [];
    for (let i = 0; i < tasks.length; i++) {
        let task_status = [];
        let task_content = tasks.item(i).getElementsByClassName("task_content")[0].innerText;
        let status = tasks.item(i).getElementsByClassName("status")[0];
        task_status.push(status.value);
        task_status.push(task_content);
        task_list.push(task_status)
    }
    chrome.storage.local.set({ "fortoday": task_list }, function () { });
}

function add_div_task(load) {
    let div = document.createElement("div")
    div.className = "task"
    let input = document.createElement("input");
    input.type = "checkbox";
    input.className = "checkbox";
    let status = document.createElement("input");
    status.setAttribute("type", "hidden");
    status.setAttribute("class", "status");
    let child;
    if (load == "1") {
        let strike = document.createElement("strike");
        strike.setAttribute("class", "task_content");
        strike.innerHTML = task_input.value;
        child = strike;
        status.setAttribute("value", "1");
        input.setAttribute("checked", "true");
    }
    else {
        let span = document.createElement("span");
        span.setAttribute("class", "task_content");
        span.innerHTML = task_input.value;
        child = span;
        status.setAttribute("value", "0");
    }
    let a_delete = document.createElement("a");
    a_delete.innerText = "x";
    a_delete.className = "remove";
    a_delete.setAttribute("title", "Delete this task");
    task_input.value = ""
    div.appendChild(input);
    div.appendChild(child);
    div.appendChild(status);
    div.appendChild(a_delete);
    return div;
}

function add_task() {
    let div = add_div_task('0');
    task_input.parentElement.parentElement.appendChild(div);
    updateLocalTasksStorage();
    setListeners();
}

chrome.storage.local.get(["fortoday"], function (result) {
    let tasks = result["fortoday"];
    let fortoday = document.getElementById("fortoday")
    tasks.forEach(function (item, index, array) {
        let div = add_div_task(item[0])
        div.children.item(1).innerText = item[1];
        fortoday.appendChild(div);
    })
    setListeners();
});

