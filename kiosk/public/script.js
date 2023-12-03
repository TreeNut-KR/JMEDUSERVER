// function sendBarcode() {
//   const barcode = document.getElementById("barcode").value;

//   fetch("서버 URL", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       barcode: barcode,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById("studentName").innerText = data.name;
//       document.getElementById("studentBirth").innerText = data.birth;
//       document.getElementById("studentInfo").style.display = "block";
//     })
//     .catch((error) => {
//       console.error("서버와 통신할 수 없습니다.", error);
//       alert("서버와 통신할 수 없습니다.");
//     });
// }

// function checkIn(type) {
//   const barcode = document.getElementById("barcode").value;

//   fetch("서버 URL", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       barcode: barcode,
//       type: type,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       alert(data.message);
//     })
//     .catch((error) => {
//       console.error("서버와 통신할 수 없습니다.", error);
//       alert("서버와 통신할 수 없습니다.");
//     });
// }

const iconclick = document.querySelector(".menu_icon");
let bar1 = document.querySelector(".bar_1_nonanima");
let bar2 = document.querySelector(".bar_2_nonanima");
let bar3 = document.querySelector(".bar_3_nonanima");
let inner_box = document.querySelector(".innerBox");

var toggle = 0;

function animation_on() {
  if (toggle == 0) {
    bar1.className = "bar_1_animated";
    bar2.className = "bar_2_animated";
    bar3.className = "bar_3_animated";
    inner_box.className = "innerBox_animated";
    toggle = 1;
  } else if (toggle == 1) {
    bar1.className = "bar_1";
    bar2.className = "bar_2";
    bar3.className = "bar_3";
    inner_box.className = "innerBox";
    toggle = 0;
  }
}

iconclick.addEventListener("click", animation_on);
