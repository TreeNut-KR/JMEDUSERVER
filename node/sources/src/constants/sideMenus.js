//사이드 메뉴 종류

/*
  수정페이지는 학생이면 student-edit 처럼 앞의 단어는 관련 단어로 하고 , 뒤에 -edit 이 따라오도록 이름을 제작한다.
*/
export const sideMenus = [
  {
    title: "학생관리",
    menus: [
      {
        name: "회원관리",
        href: "/student",
      },
      {
        name: "응애관리",
        href: "/product",
      },
      {
        name: "학생 수정페이지",
        href: "/student-edit",
        display: "none",
      },
    ],
  },
  {
    title: "돈관리",
    menus: [
      {
        name: "회원관리2",
        href: "/aa",
      },
      {
        name: "응애관리2",
        href: "/bb",
      },
    ],
  },
];
