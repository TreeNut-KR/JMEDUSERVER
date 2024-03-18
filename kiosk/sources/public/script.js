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


  function QR_Read(qrcode){//QR 리딩되면 실행되게 해주세요. 매개변수 : QR값


    try {
      const response = axios.post("http://localhost/server/Kiosk_getStudent", {// QR 값 주고 학생 정보 받아오기
        qrcode
      });
      console.log(response);

      if (response.data.success) {//response.data.name에 학생 이름 저장, response.data.birthday에 생년월일 저장, response.data.contact_parent에 부모연락처 저장


        //값 대입 후 애니메이션 시작 구현해주세요



      } else {
        console.log('서버와 통신하였으나 실패 반환');
      }
    } catch (error) {

      console.log(error.config);
    }

  }



  function attend_submit(name, contact_parent, attend_code){//등, 하원 선택하면 실행되게 해주세요. attend_code는 0은 등원, 1은 하원입니다.
    try {
      const response = axios.post("http://localhost/server/submitAttend", {
        name: response,
        contact_parent,
        attend_code
      },{headers: {'Content-Type': 'application/json; charset=utf-8'}}
      );
      console.log(response);

      if (response.data.success) {//response.data.name에 학생 이름 저장, response.data.birthday에 생년월일 저장
        //값 대입 후 애니메이션 시작 구현해주세요
        console.log('성공');  
        
      } else {
        console.log('서버와 통신하였으나 실패 반환');
      }
    } catch (error) {

      console.log(error.config);
    }
  }


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
