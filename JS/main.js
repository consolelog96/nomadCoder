const greetUser = document.querySelector("h1");
const logInForm = document.querySelector(".login");
const timeSection = document.querySelector("h3");
const toDoListForm = document.querySelector(".list")
const toDoForm = document.querySelector(".todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todo-list");

const API_Keys = "879ebaf65d11765d866746e80700665e";

const myGreetingArray = ["Greetings","Welcome","Good Day"];
const imageGallery = [1,2,3];

const TODOS_KEY = "todos";
let userToDos = [];

let message = myGreetingArray[Math.floor(Math.random() * myGreetingArray.length)];
let randomImage = imageGallery[Math.floor(Math.random() * imageGallery.length)];

if (localStorage.hasOwnProperty("username")) {
  greetUser.innerText = `${message}, ${localStorage["username"]}`;
}else {
  logInForm.classList.remove("hidden");
  function displayName(e) {
    e.preventDefault();
    greetUser.innerText = `${message}, ${document.querySelector(".signin").value}`;
    localStorage.setItem("username", document.querySelector(".signin").value);
    logInForm.classList.add("hidden");
  }
}

function displayTime() {
  const today = new Date();
  const hours = String(today.getHours()).padStart(2,"0");
  const minutes = String(today.getMinutes()).padStart(2,"0");
  timeSection.innerText = `${hours}:${minutes}`;
}

function changeImage() {
  document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.75)), url("Image/${randomImage}.jpg")`;
}

function saveUserToDos(){
  localStorage.setItem(TODOS_KEY,JSON.stringify(userToDos));
}

function deleteTodo(event){
  const list = event.target.parentElement;
  userToDos = userToDos.filter(toDo => toDo.id !== parseInt(list.id));
  list.remove();
  saveUserToDos();
}

function paintToDo(newTodo){
  const list = document.createElement("li");
  list.id = newTodo.id;
  const span = document.createElement("span");
  const myButton = document.createElement("button");
  span.innerText = newTodo.text;
  myButton.innerText = "❌";
  myButton.addEventListener("click",deleteTodo);
  list.appendChild(span);
  list.appendChild(myButton);
  toDoList.appendChild(list);
}

function handleToDoSubmit(event){
  event.preventDefault();
  const newTodo = toDoInput.value;
  toDoInput.value = "";
  const newToDoObj = {
    text:newTodo,
    id:Date.now(),
  }
  userToDos.push(newToDoObj);
  paintToDo(newToDoObj);
  saveUserToDos();
}

function success(position){
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Keys}&units=metric`
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const weather = document.querySelector("#weather span:first-child")
    const city = document.querySelector("#weather span:last-child")
    city.innerText = data.name;
    weather.innerText = `${data.weather[0].main} / ${data.main.temp}`;
  });
}

function fail(){
  alert("Can't find your location");
}

logInForm.addEventListener("submit",displayName);
toDoForm.addEventListener("submit",handleToDoSubmit);
navigator.geolocation.getCurrentPosition(success,fail);

displayTime();
changeImage();
setInterval(displayTime,1000);

const savedToDos = localStorage.getItem(TODOS_KEY);
if(savedToDos !== null){
  const parsedToDos = JSON.parse(savedToDos);
  userToDos = parsedToDos;
  parsedToDos.forEach(paintToDo)
}