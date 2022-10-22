import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const qrcode = document.querySelector("#qrcode");
const socket = io();

socket.on("message", function (msg) {
  document.querySelector("#logs");
});

socket.on("qr", function (src) {
  qrcode.setAttribute("src", src);
});

socket.on("ready", function (data) {
  qrcode.classList.add("hidden");
  document.querySelector("#step2").classList.remove("hidden");
  document.querySelector("#stepIndicator").firstElementChild.classList.replace("active", "nonActive");
  document.querySelector("#stepIndicator > li:nth-child(2)").classList.replace("nonActive", "active");
});
// console.log(document.querySelector("#stepIndicator > li:nth-child(1)"));
socket.on("authenticated", function (data) {
  qrcode.setAttribute("src", "/img/check.gif");
});

// drag & drop
const form = document.querySelector("#usrform");
const head = document.querySelectorAll("h1");
const buttonUpload = document.querySelector("#buttonUpload");
const input = document.querySelector("input[type=file]");
let file;

// [2].innerHTML = "saya suka";

buttonUpload.onclick = () => {
  console.log(buttonUpload);
  input.click();
  buttonUpload.preventDefault();
};

// when the file inside the drag area
form.addEventListener("dragover", (e) => {
  e.preventDefault();
  head[0].innerHTML = "Lepaskan untuk mengunggah";
  form.classList.remove("border-dashed");
  console.log("inside boi");
});

// when file leave the drag area
form.addEventListener("dragleave", (e) => {
  e.preventDefault();
  head[0].innerHTML = "Drag & Drop";
  form.classList.add("border-dashed");
  console.log("meninggalkan");
});

// when the file is dropped in the drag area
form.addEventListener("drop", (e) => {
  e.preventDefault();
  file = e.dataTransfer.files[0];
  head[0].innerHTML = "Anda mengunggah";
  head[1].innerHTML = file.name;
  head[2].classList.add("hidden");
  // console.log(file.name);
  // console.log("di drop");
});
