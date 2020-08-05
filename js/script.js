"use strict";

const accounts = [];
const LAST_ACTIVE = 'last-active';
const navGroups = {nav: {}};
const screen1 = document.querySelector('.screen-one');
const screen2 = document.querySelector('.screen-two');
const btnCreate = document.querySelector('.create');
const btnCancel = document.querySelector('.cancel');
const input = document.querySelector('.addInput');
const btnAdd = document.querySelector('.addModals');
let focused;
const generator = getId(0);

window.onload = () => {
    data.accounts.forEach(item => {
        addItem(item);
    });
    setDefaultFocus();
    addEventsListeners();
    document.addEventListener('keydown', logKey);

    const focusableEls = document.querySelectorAll('button, input[type="text"], li');

    focused = focusableEls[0];
    focusableEls.forEach(i => {
        if (!navGroups[i.tabIndex]) {
            navGroups[i.tabIndex] = [];
        }
        navGroups[i.tabIndex].push(i);
        keepPrevFocused(i);
    })
    setNavigation();
};

function setNavigation() {
    navGroups.nav["10"] = {
        ArrowUp: setPrevActive,
        ArrowDown: setNextActive,
        ArrowLeft: removeItem,
        ArrowRight: toAddBtn
    };
    navGroups.nav["30"] = {ArrowLeft: toList};
    navGroups.nav["40"] = {ArrowDown: toControls};
    navGroups.nav["50"] = {
        ArrowUp: () => input.focus(),
        ArrowLeft: () => btnCreate.focus(),
        ArrowRight: () => btnCancel.focus()
    };
}

function keepPrevFocused(i) {
    i.onblur = () => {
        setTimeout(function () {
            if (document.activeElement.tabIndex !== -1) {
                document.activeElement.focus();
            }
        }, 0)
    };
    i.onfocus = function () {
        focused = i
    }
}

function addItem(item) {
    let id = generator.next().value;
    let ul = document.getElementById("dynamic-list");
    let li = document.createElement("li");
    let img = document.createElement("img");
    li.setAttribute('id', '' + id);
    li.setAttribute('class', 'list-item');
    img.setAttribute('src', 'https://c7.hotpng.com/preview/348/800/890/computer-icons-avatar-user-login-avatar-thumbnail.jpg')
    img.style.width = '50px';
    li.innerHTML = item.title;
    li.setAttribute("tabindex", "10");
    li.appendChild(img);
    ul.appendChild(li);
    item.id = id;
    accounts.push(item);
}

function addEventsListeners() {
    onBtnAdd();
    onModalButtons();
    onInputMaxLength();
}

function onModalButtons() {
    btnCancel.addEventListener('click', switchToScreen1);
    btnCreate.addEventListener('click', () => {
        if (!input.value) {
            alert('The input field is empty');
        } else {
            let newEl = {
                "title": input.value,
                "img": "https://c7.hotpng.com/preview/348/800/890/computer-icons-avatar-user-login-avatar-thumbnail.jpg"
            };
            addItem(newEl);
            input.value = '';
            switchToScreen1();
        }
    });
}

function switchToScreen1() {
    screen1.style.display = 'inline-flex';
    screen2.style.display = 'none';
    btnAdd.focus();
    input.value='';
}

function switchToScreen2() {
    screen1.style.display = 'none';
    screen2.style.display = 'block';
    input.focus();
}

function onInputMaxLength() {
    input.addEventListener("input", (e) => {
        if (e.target.value.length >= 20) {
            alert('The number of characters should not exceed 20');
        }
    });
}

function onBtnAdd() {
    btnAdd.addEventListener('click', () => {
        switchToScreen2();
    });
}

// focus

function logKey(e) {
    let nav = navGroups.nav[document.activeElement.tabIndex];
    if (nav && nav[e.code]) {
        nav[e.code]();
    }
}

function setNextActive() {
    let next = document.activeElement.nextElementSibling;
    if (next) {
        next.focus();
        return true;
    }
    return false;
}

function setPrevActive() {
    let current = document.activeElement;
    let prev = current.previousElementSibling;
    if (prev) {
        prev.focus();
        return true;
    }
    return false;
}

function removeItem() {
    let current = document.activeElement;
    let ul = document.getElementById("dynamic-list");
    if (!setNextActive()) {
        setPrevActive();
    }
    ul.removeChild(current);
    if (!ul.hasChildNodes()) {
        btnAdd.focus();
    }
    accounts.splice(accounts.indexOf(current), 1);
}

function toList() {
    let li = document.getElementsByClassName(LAST_ACTIVE)[0];
    if (li) {
        li.classList.remove(LAST_ACTIVE);
        li.focus();
    } else {
       li = document.getElementsByTagName("li")[0];
       li ?  li.focus() : null;
    }
}

function toControls() {
    if (focused === btnCancel) {
        btnCancel.focus();
        return;
    }
    btnCreate.focus();
}

function toAddBtn() {
    document.activeElement.classList.add(LAST_ACTIVE);
    let btn = document.getElementById("go-to-screen2");
    btn.focus()
}

function setDefaultFocus() {
    let firstItem = document.getElementsByTagName("li")[0];
    firstItem.focus();
}

function* getId(index) {
    while (true) {
        yield index;
        index++;
    }
}