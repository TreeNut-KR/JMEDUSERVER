//학생 검색 필터
export const SEARCH_STUDENT = {
  none: {
    name: "선택하기",
    value: "",
  },
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
  none: {
    name: "선택하기",
    value: "",
  },
  name: {
    name: "이름",
    value: "name",
  },
  phoneNumber: {
    name: "핸드폰 번호",
    value: "contact",
  },
};

//스케쥴 검색 필터
export const SEARCH_SCHEDULE = {
  none: {
    name: "선택하기",
    value: "",
  },
  name: {
    name: "담당강사",
    value: "t.name",
  },
  schedule: {
    name: "과목이름",
    value: "sub.name",
  },
};

//과목 검색 필터
export const SEARCH_SUBJECT = {
  none: {
    name: "선택하기",
    value: "",
  },
  teacher_name: {
    name: "과목이름",
    value: "subject.name",
  },
  grade: {
    name: "학년",
    value: "grade",
  },
  name: {
    name: "담당강사",
    value: "teacher.name",
  },
};
//학생 컬럼
export const EDIT_STUDENT = {
  none: {
    name: "선택하기",
    value: "",
  },
  name: {
    name: "이름",
    type: "text",
    value: "name",
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
  none: {
    name: "선택하기",
    value: "",
  },
  name: {
    name: "이름",
    type: "text",
    value: "name",
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
  none: {
    name: "선택하기",
    value: "",
  },
  remove: {
    name: "삭제하기",
    type: "text",
    value: "remove",
  },
};

//스케쥴 컬럼
export const EDIT_SCHEDULE = {
  none: {
    name: "선택하기",
    value: "",
  },
  remove: {
    name: "삭제하기",
    type: "text",
    value: "remove",
  },
};
