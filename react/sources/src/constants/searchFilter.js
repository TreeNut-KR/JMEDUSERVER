//학생 검색 필터
export const SEARCH_STUDENT = {
  name: {
    name: "이름",
    value: "name",
  },
  phoneNumber: {
    name: "핸드폰 번호",
    value: "contact",
  },
};
//강사 검색 필터
export const SEARCH_TEACHER = {
  name: {
    name: "이름",
    value: "name",
  },
  phoneNumber: {
    name: "핸드폰 번호",
    value: "contact",
  },
  test: {
    name: "test",
    value: "contact",
  },
};

//강사 검색 필터
export const SEARCH_SUBJECT = {
  teacher_name: {
    name: "담당교수",
    value: "teacher_name",
  },
  grade: {
    name: "학년",
    value: "grade",
  },
  name: {
    name: "수업 명",
    value: "name",
  },
};
//학생 컬럼
export const EDIT_STUDENT = {
  name: {
    name: "이름",
    type: "text",
    value: "name",
  },
  sex_ism: {
    name: "성별",
    type: "radio",
    value: "sex_ism",
  },
  birthday: {
    name: "생일",
    type: "date",
    value: "birthday",
  },
  contact: {
    name: "연락처 (개인)",
    type: "phone",
    value: "contact",
  },
  contact_parent: {
    name: "연락처 (관계자)",
    type: "phone",
    value: "contact_parent",
  },
  school: {
    name: "학교",
    type: "text",
    value: "school",
  },
  payday: {
    name: "급여일",
    type: "text",
    value: "payday",
  },
  firstreg: {
    name: "??뭘 날",
    type: "date",
    value: "firstreg",
  },
  remove: {
    name: "삭제하기",
    type: "text",
    value: "remove",
  },
};

//강사 컬럼
export const EDIT_TEACHER = {
  name: {
    name: "이름",
    type: "text",
    value: "name",
  },
  sex_ism: {
    name: "성별",
    type: "radio",
    value: "sex_ism",
  },
  birthday: {
    name: "생일",
    type: "date",
    value: "birthday",
  },
  contact: {
    name: "연락처 (개인)",
    type: "phone",
    value: "contact",
  },
  remove: {
    name: "삭제하기",
    type: "text",
    value: "remove",
  },
};

//강사 컬럼
export const EDIT_SUBJECT = {
  remove: {
    name: "삭제하기",
    type: "text",
    value: "remove",
  },
};
