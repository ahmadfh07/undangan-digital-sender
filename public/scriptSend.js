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
socket.on("authenticated", function (data) {
  qrcode.setAttribute("src", "/img/check.gif");
});

// => INPUT AND UPLOAD FILE
const inputKontak = document.querySelector("#inputKontak");
const deleteKontak = document.querySelector("#buttonDelete");
const form = document.querySelector("form");
const h1 = document.querySelectorAll("h1");
const buttonUpload = document.querySelector("#buttonUpload");
const buttonDelete = document.querySelector("#buttonDelete");
const input = document.querySelector("input[type=file]");
const submit = document.querySelector("button[type=submit]");
const validExtension = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

buttonUpload.onclick = () => {
  input.click();
};

// when the file inside the drag area
form.addEventListener("dragover", (e) => {
  e.preventDefault();
  h1[0].innerHTML = "Lepaskan untuk mengunggah";
  form.classList.remove("border-dashed");
});

// when file leave the drag area
form.addEventListener("dragleave", () => {
  h1[0].innerHTML = "Drag & Drop";
  form.classList.add("border-dashed");
});

// when the file is dropped in the drag area
form.addEventListener("drop", (e) => {
  e.preventDefault();
  let fileDrop = e.dataTransfer.files;
  let fileType = fileDrop[0].type;
  if (validExtension.includes(fileType)) {
    inputKontak.files = fileDrop;
    h1[0].innerHTML = "Anda mengunggah";
    h1[1].innerHTML = fileDrop[0].name;
    h1[2].classList.add("hidden");
  } else {
    fileDrop = null;
    alert("harap memasukkan tipe file yang dengan format .xlsx");
    return;
  }
  if (fileDrop == null) {
  } else {
    buttonDelete.classList.toggle("hidden");
    buttonUpload.classList.toggle("hidden");
  }
});

inputKontak.addEventListener("change", (e) => {
  let fileBrowse = e.target.files[0];
  let fileType = fileBrowse.type;
  if (validExtension.includes(fileType)) {
    h1[0].innerHTML = "Anda mengunggah";
    h1[1].innerHTML = fileBrowse.name;
    h1[2].classList.add("hidden");
  } else {
    console.log(fileBrowse);
    fileBrowse = null;
    alert("harap memasukkan tipe file yang dengan format .xlsx");
    return;
  }
  if (fileBrowse == null) {
  } else {
    buttonDelete.classList.toggle("hidden");
    buttonUpload.classList.toggle("hidden");
  }
});

deleteKontak.addEventListener("click", () => {
  if (confirm("Yakin ingin menghapus file ?") !== true) {
    return;
  }
  inputKontak.value = null;
  buttonDelete.classList.toggle("hidden");
  buttonUpload.classList.toggle("hidden");
  h1[0].innerHTML = "Drag & Drop";
  h1[1].innerHTML = "or";
  h1[2].classList.remove("hidden");
  h1[2].innerHTML = "Support: .xlsx";
});

submit.addEventListener("click", function (e) {
  if (fileBrowse == null) {
    console.log(this);
    alert("mohon masukkan file dan isikan data terlebih dahulu");
  }
});
