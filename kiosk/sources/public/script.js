const iconclick = document.querySelector(".menu_icon");
let bar1 = document.querySelector(".bar_1_nonanima");
let bar2 = document.querySelector(".bar_2_nonanima");
let bar3 = document.querySelector(".bar_3_nonanima");
let inner_box = document.querySelector(".innerBox");
let spanBoxes = document.querySelectorAll(".spanBox");
let menu_icon = document.querySelector(".menu_icon");

let testbutton = document.querySelector(".QRtest");

var toggle = 0;
let timer = null; // 타이머를 저장할 변수

resizeHandler();

// 박스 width, height 값 동일화
function resizeHandler() {
  const width = menu_icon.offsetWidth;

  menu_icon.style.height = width + "px";
}
//윈도우 크기 변화 감지
window.addEventListener("resize", resizeHandler);

//상자 애니메이션 함수
function animation_on() {
  // 기존 타이머가 있으면 취소
  if (timer) {
    clearTimeout(timer);
  }

  // 애니메이션 시작
  bar1.className = "bar_1_animated";
  bar2.className = "bar_2_animated";
  bar3.className = "bar_3_animated";
  inner_box.className = "innerBox_animated";
  spanBoxes.forEach(function (spanBox) {
    spanBox.className = "spanBox-animated";
  });

  // 타이머 설정: 1초 후에 애니메이션 종료
  timer = setTimeout(function () {
    bar1.className = "bar_1";
    bar2.className = "bar_2";
    bar3.className = "bar_3";
    inner_box.className = "innerBox";
    spanBoxes.forEach(function (spanBox) {
      spanBox.className = "spanBox";
    });
  }, 10000); // 10초 후에 애니메이션 종료
}
//버튼 테스트 (서비스 시 삭제)
testbutton.addEventListener("click", animation_on);
