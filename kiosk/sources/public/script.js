const iconclick = document.querySelector(".menu_icon");
const axios = require('axios');
let bar1 = document.querySelector(".bar_1_nonanima");
let bar2 = document.querySelector(".bar_2_nonanima");
let bar3 = document.querySelector(".bar_3_nonanima");
let inner_box = document.querySelector(".innerBox");
let spanBoxes = document.querySelectorAll(".spanBox");
let menu_icon = document.querySelector(".menu_icon");

let testbutton = document.querySelector(".QRtest");

let qrTemp = "";

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


  function QR_Read(qrcode){//QR 리딩되면 실행. 매개변수로 리딩된 값 넣기

    try {
      const response = axios.get("http://localhost/server/Kiosk_getStudent", {
        qrcode
      });
      console.log(response);

      if (response.data.success) {//성공 시 html에 값 변동 반영

        qrTemp = qrcode;
        document.getElementById('name').textContent = response.data.name;
        document.getElementById('birthday').textContent = response.data.birthday;
        document.getElementById('result').textContent = "등원/하원 여부를 선택하세요";
        animation_on();//UI의 애니메이션 구동 (갈아엎을거면 지우기)


      } else {
        console.log('서버와 통신하였으나 실패 반환');
      }
    } catch (error) {

      console.log(error.config);
    }
  }


// 등/하원 버튼을 눌렀을 경우 실행. is_atted는 등원의 경우 true, 하원의 경우 false
  function attend_submit(is_attend){
    try {
      const response = axios.post("http://localhost/server/submitAttend", {
        qrTemp,
        is_attend
      });
      if (response.data.success) {
        if(is_attend){
          document.getElementById('result').textContent = "등원 처리되었습니다.";
        }else{
          document.getElementById('result').textContent = "하원 처리되었습니다.";
        }


        console.log('성공');  
        
      } else {
        console.log('서버와 통신하였으나 실패 반환');
      }
    } catch (error) {

      console.log(error.config);
    }
    qrTemp = "";
  }


  // 타이머 설정: 1초 후에 애니메이션 종료
  timer = setTimeout(function () {
    bar1.className = "bar_1";
    bar2.className = "bar_2";
    bar3.className = "bar_3";
    inner_box.className = "innerBox";
    spanBoxes.forEach(function (spanBox) {
      spanBox.className = "spanBox";
      qrTemp = "";
    });
  }, 10000); // 10초 후에 애니메이션 종료
}
//버튼 테스트 (서비스 시 삭제)
testbutton.addEventListener("click", animation_on);
