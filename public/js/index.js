const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");
const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");
const loading = document.querySelector(".loading");
let uuid;

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const inputFildValue = e.dataTransfer.files[0];
  dropZone.classList.remove("dragged");
  fatchFileUrl(inputFildValue);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");
});

// file input change and uploader
fileInput.addEventListener("change", (e) => {
  fatchFileUrl(fileInput.files[0]);
});

const fatchFileUrl = async (file) => {
  loading.style.display = "block";
  const formData = new FormData();
  formData.append("myfile", file);
  const res = await fetch(`http://localhost:5000/api/files`, {
    method: "POST",
    body: formData,
  });
  loading.style.display = "block";
  const data = await res.json();
  loading.style.display = "none";
  fileURL.value = data.file;
  sharingContainer.style.display = "block";
  uuid = data.uuid;
};

// sharing container listenrs
copyURLBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
});

fileURL.addEventListener("click", () => {
  fileURL.select();
});

//2nd

// 1st

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop submission

  // disable the button
  emailForm[2].setAttribute("disabled", "true");
  emailForm[2].innerText = "Sending";

  const formData = {
    uuid: uuid,
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

  const response = await fetch(`http://localhost:5000/api/files/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();

  if (data) {
    emailForm.elements["to-email"].value = "";
    emailForm.elements["from-email"].value = "";
    emailForm[2].innerText = "Send";
  }
});
