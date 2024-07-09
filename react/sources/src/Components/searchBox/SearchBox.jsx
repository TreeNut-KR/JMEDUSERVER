import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { SEARCH_STUDENT, SEARCH_TEACHER, SEARCH_SUBJECT, SEARCH_SCHEDULE, SEARCH_SCHOOL } from "../../constants/searchFilter";
import Button from "../ButtonTop";
import DatePickerV1 from "../datePicker/DatePicker";
import axios from "axios";

export default function SearchBox(props) {
  const today = new Date();
  const { setData, option, useDatePicker } = props;

  const [startDate, setStartDate] = useState(useDatePicker ? today : null);
  const [endDate, setEndDate] = useState(useDatePicker ? today : null);

  // 검색 옵션으로 들어올 것 지정
  const filterOption = (option) => {
    if (option === "student") return SEARCH_STUDENT;
    else if (option === "teacher") return SEARCH_TEACHER;
    else if (option === "subject") return SEARCH_SUBJECT;
    else if (option === "schedule") return SEARCH_SCHEDULE;
    else if (option === "school") return SEARCH_SCHOOL;
    else return [];
  };

  // 초기 옵션 배열을 가져옴
  const options = filterOption(option);

  // 초기 상태 설정
  const [search, setSearch] = useState({
    text: "",
    option: options.length > 0 ? options[0].value : "",
  });
  // api 지정
  const endPoint = (option) => {
    if (option === "student") return "students_search";
    else if (option === "teacher") return "teachers_search";
    else if (option === "subject") return "subjects_search";
    else if (option === "schedule") return "schedules_search";
    else if (option === "school") return "schools_search";
    else return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  async function searchData() {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/${endPoint(option)}`, {
        search: search,
      });
      setData(response.data.datas);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full p-10 fontA">
      <div className="w-full h-40 border border-[#B3A492] shadow-md rounded-md p-5">
        <form className="flex gap-4 w-full flex-col" onSubmit={(e) => handleSubmit(e)}>
          <div className="w-full flex">
            <select
              className="w-24 mr-5 rounded-md border border-[#B3A492]"
              onChange={(e) => setSearch({ text: search.text, option: e.target.value })}
              value={search.option}
              id=""
            >
              {Object.values(options).map((filter) => (
                <option key={filter.value} value={filter.value} className="fontA">
                  {filter.name}
                </option>
              ))}
            </select>
            <input
              className="px-2 w-full h-11 rounded-md border border-[#B3A492]"
              name="nameText"
              id="text-field"
              placeholder={`검색기능을 이용하실 수 있습니다.`}
              onChange={(e) => setSearch({ text: e.target.value, option: search.option })}
              value={search.text}
            />
          </div>
          <div className="mt-3 flex justify-end items-center gap-3 w-full">
            <div className="flex justify-center w-full h-full items-center">
              {useDatePicker ? (
                <>
                  <span className="fontA text-lg">날짜 : </span>
                  <DatePickerV1 selected={startDate} onChange={(e) => setStartDate(e)} />
                  <span className="px-10">~</span>
                  <DatePickerV1 selected={endDate} onChange={(e) => setEndDate(e)} />
                </>
              ) : null}
            </div>
            <button className="text-xs w-16 h-10 px-2 rounded-md border bg-[#5272F2] text-white">검색</button>
            <Button onClick={() => setSearch({ option: search.option, text: "" })} label={"초기화"}>
              초기화
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

SearchBox.propTypes = {
  setData: PropTypes.func.isRequired,
  option: PropTypes.string,
  useDatePicker: PropTypes.bool,
};

SearchBox.defaultProps = {
  useDatePicker: false,
};
