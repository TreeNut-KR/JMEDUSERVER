//사이드 메뉴 종류

/*
  수정페이지는 학생이면 student-edit 처럼 앞의 단어는 관련 단어로 하고 , 뒤에 -edit 이 따라오도록 이름을 제작한다.
*/
export const sideMenus = [
  {
    title: "학생 관리",
    menus: [
      {
        name: "학생 조회",
        href: "/student",
      },
      {
        name: "수업일정 조회",
        href: "/schedule_student",
      },
      {
        name: "등/하원 기록 조회",
        href: "/attendance-student",
      },
      {
        name: "학생 정보 수정",
        href: "/student-edit",
        display: "none",
      },
    ],
  },
  {
    title: "교직원 관리",
    menus: [
      {
        name: "교직원 조회",
        href: "/teacher",
      },
      {
        name: "등/하원 기록 조회",
        href: "/attendance-teacher",
      },
    ],
  },
  {
    title: "관리자용 페이지",
    menus: [
      {
        name: "수정 로그 보기",
        href: "/log",
      },
      {
        name: "교직원 관리",
        href: "/staff",
      },
    ],
  },
];
