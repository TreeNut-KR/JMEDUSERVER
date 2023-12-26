const iconclick = document.querySelector(".menu_icon");
let bar1 = document.querySelector(".bar_1_nonanima");
let bar2 = document.querySelector(".bar_2_nonanima");
let bar3 = document.querySelector(".bar_3_nonanima");
let inner_box = document.querySelector(".innerBox");
let spanBoxes = document.querySelectorAll(".spanBox");

var toggle = 0;

function animation_on() {
  if (toggle == 0) {
    bar1.className = "bar_1_animated";
    bar2.className = "bar_2_animated";
    bar3.className = "bar_3_animated";
    inner_box.className = "innerBox_animated";
    spanBoxes.forEach(function (spanBox) {
      spanBox.className = "spanBox-animated";
    });
    toggle = 1;
  } else if (toggle == 1) {
    bar1.className = "bar_1";
    bar2.className = "bar_2";
    bar3.className = "bar_3";
    inner_box.className = "innerBox";
    spanBoxes.forEach(function (spanBox) {
      spanBox.className = "spanBox";
    });
    toggle = 0;
  }
}

iconclick.addEventListener("click", animation_on);
