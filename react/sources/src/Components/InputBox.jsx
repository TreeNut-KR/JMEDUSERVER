import PropTypes from "prop-types";
import DatePickerV1 from "./datePicker/DatePicker";
import { useState } from "react";

export default function InputBox(props) {
  const { name, data, table, edit, disable, type, options, subData_picker } = props;

  //picker 호버기능 on/off
  const [hoverBoxVisible, setHoverBoxVisible] = useState(false);
  //이 기능 선생, 학생 불러오는데만 쓰는데 쓸 값이 같아서 내비둠
  const setPK = `${table}_pk`;

  let columnsToShow = "";
  let columnTitles = "";

  if (table === "subject") {
    columnsToShow = ["name", "teacher_name"];
    columnTitles = {
      name: "강의 이름",
      teacher_name: "담당 강사",
    };
  } else if (table === "teacher") {
    columnsToShow = ["name", "birthday"];
    columnTitles = {
      name: "이름",
      birthday: "생년월일",
    };
  }
  //----------------------------------------

  //시간 타입을 위해서 추가한 코드
  const [value, setValue] = useState(data);

  const handleChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 4) input = input.slice(0, 4);

    let hours = input.slice(0, 2);
    let minutes = input.slice(2, 4);

    if (hours.length === 2 && parseInt(hours, 10) > 24) {
      hours = "24";
    }

    if (minutes.length === 2 && parseInt(minutes, 10) > 59) {
      minutes = "00";
    }

    input = hours + (minutes.length ? ":" + minutes : "");

    setValue(input);
    edit(input);
  };

  // -------------------------

  return (
    <div className={`${name ? "py-10" : null} border-b-2 fontA flex gap-4 relative`}>
      {name ? (
        <div className="w-36 flex justify-end">
          <span>{name} : </span>
        </div>
      ) : null}
      {type === "text" ? (
        <input
          className={`${name ? "w-3/4" : "w-full"} px-4 border border-[#5272F2] rounded-md`}
          type="text"
          disabled={disable}
          value={data}
          onChange={(e) => edit(e.target.value)}
        />
      ) : type === "date" ? (
        <DatePickerV1 selected={data} onChange={(date) => edit(date)} />
      ) : type === "radio" ? (
        options.map((option, index) => (
          <div key={index}>
            <input type="radio" value={index} checked={data === index} onChange={() => edit(index)} />
            <label>{option}</label>
          </div>
        ))
      ) : type === "phone" ? (
        <input
          className={`${name ? "w-3/4" : "w-full"} px-4 border border-[#5272F2] rounded-md`}
          type="tel"
          disabled={disable}
          value={data}
          onChange={(e) => {
            const formattedNumber = e.target.value.replace(/[^\d]/g, "").slice(0, 11);
            const formatted = formattedNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
            edit(formatted);
          }}
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
        />
      ) : type === "time" ? (
        <>
          <input
            className={`w-1/4 px-4 border border-[#5272F2] rounded-md`}
            type="tel"
            disabled={disable}
            value={data}
            onChange={handleChange}
            placeholder="HH:MM"
          />
        </>
      ) : type === "picker" ? (
        <>
          <input
            className={`${name ? "w-fit" : "w-full"} px-4 border border-[#5272F2] rounded-md`}
            type="text"
            disabled={true}
            value={data}
          />
          <button
            className="text-sm px-2 rounded-md border-2 w-[100px] h-[2rem] bg-[#FAFBFE] border-[#5272F2] fontA"
            onClick={() => setHoverBoxVisible(!hoverBoxVisible)}
          >
            수정하기
          </button>

          {hoverBoxVisible && (
            <div className="w-fit h-40 absolute -top-4 -left-56 z-50 border-4 border-[#5272F2] rounded-lg p-5 bg-[#FAFBFE] fontA">
              <div
                onClick={() => setHoverBoxVisible(!hoverBoxVisible)}
                className="absolute flex justify-center items-center top-0 right-0 w-10 h-6 border-l-4 border-b-4 rounded-bl-md border-[#5272F2] bg-red-500 text-white"
              >
                X
              </div>
              <table>
                <thead>
                  <tr className="border-b-2 border-[#5272F2] table w-full">
                    {columnsToShow.map((column) => (
                      <th className="pr-4" key={column}>
                        {columnTitles[column]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="block max-h-[100px] overflow-y-scroll">
                  {!subData_picker ? (
                    <tr>
                      <td colSpan={columnsToShow.length} className="text-center p-4">
                        <div>데이터가 존재하지 않습니다</div>
                      </td>
                    </tr>
                  ) : (
                    subData_picker.map((item, index) => (
                      <tr
                        className="border-b table w-full"
                        key={index}
                        onClick={() => {
                          setHoverBoxVisible(false);
                          edit({ name: item.name, pk: item[setPK] });
                        }}
                      >
                        {columnsToShow.map((column) => (
                          <td className="pr-4" key={column}>
                            {item[column]}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

InputBox.propTypes = {
  name: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  edit: PropTypes.func.isRequired,
  disable: PropTypes.bool,
  type: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  subData_picker: PropTypes.array,
  table: PropTypes.string,
};

InputBox.defaultProps = {
  type: "text",
};
