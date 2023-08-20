const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  let itemsFromStrorage = getItemsFromStorage();
  itemsFromStrorage.forEach((item) => addItemToDom(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  //validate input
  if (newItem === "") {
    alert("please add an item");
    return;
  }

  //check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    console.log(itemToEdit);
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExits(newItem)) {
      alert("That item already exists");
      return;
    }
  }

  //additem to dom
  addItemToDom(newItem);
  //add item to localstorage
  addItemToStorage(newItem);
  //checkui
  checkUI();
  itemInput.value = "";
}

function addItemToDom(newItem) {
  //create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));
  console.log(li);

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  //add item to list to dom
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createicon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createicon(classes) {
  const i = document.createElement("i");
  i.className = classes;
  return i;
}
//add item to localstorage
function addItemToStorage(item) {
  const itemsFromStrorage = getItemsFromStorage();

  itemsFromStrorage.push(item);

  //convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStrorage));
}

function getItemsFromStorage() {
  let itemsFromStrorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStrorage = [];
  } else {
    //Parse the data with JSON.parse(), and the data becomes a JavaScript object.

    itemsFromStrorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStrorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
    checkUI();
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExits(item) {
  const itemsFromStrorage = getItemsFromStorage();

  return itemsFromStrorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");

  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';

  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Are you Sure")) {
    //remove item from dom
    item.remove();
    //remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}
function removeItemFromStorage(item) {
  let itemsFromStrorage = getItemsFromStorage();

  //Filter out items to be removed
  itemsFromStrorage = itemsFromStrorage.filter((i) => i !== item);

  //reset to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStrorage));
}

function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //clear from local storage
  localStorage.removeItem("items");

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

//Event listeners
function init() {
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}
init();

// localStorage.clear();
// console.log("getitem", localStorage.getItem("items"));
//     console.log("jsonparse", JSON.parse(localStorage.getItem("items")));
//     console.log(
//       "stringify",
//       JSON.stringify(JSON.parse(localStorage.getItem("items")))
