import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import moreIcon from "../../img/pending-icon.png";
import InputBox from "../InputBox";
import Button from "../ButtonTop";

export default function DataTableV2(props) {
  const { styleClass, datas, columns, title, type, editType, runSQL } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const totalNumber = datas ? datas.length : 0;

  //한번에 수정하기 ---------------------------------
  const [editAll, setEditAll] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [editTextDB, setEditTextDB] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [editText, setEditText] = useState({
    text: "",
    option: "",
    submit: false,
  });

  //다수 개체 한번에 수정 위한 버튼
  function editAllButton() {
    setEditText({
      text: editTextDB,
      option: selectedType.value,
      submit: true,
    });
    if (selectedType.value === "remove") setEditText({ text: "remove" });
    if (editText.text && dataArray.length >= 1 && editText.submit) {
      runSQL(editText, dataArray);
      setEditText({ text: "", option: "", submit: false });
    }
  }

  //data 안의 pk 값 이름 재설정
  console.log(datas);
  let modifiedData;
  if (datas) {
    modifiedData = datas.map((item) => {
      return {
        ...item,
        data_pk: item[type + "_pk"],
      };
    });
  } else {
    modifiedData = [];
  }
  //에드온 버튼
  const handleMasterCheckboxChange = (e) => {
    const checked = e.target.checked;
    let newDataToSelect = [];

    if (checked) {
      newDataToSelect = currentPageData.map((item) => item.data_pk);
    }

    setSelectedCheckboxes(newDataToSelect);
  };

  const handleCheckboxChange = (e, dataPk) => {
    const checked = e.target.checked;

    let newSelectedCheckboxes = [...selectedCheckboxes];

    if (checked) {
      newSelectedCheckboxes.push(dataPk);
    } else {
      newSelectedCheckboxes = newSelectedCheckboxes.filter((pk) => pk !== dataPk);
    }

    setSelectedCheckboxes(newSelectedCheckboxes);
  };

  useEffect(() => {
    setDataArray(selectedCheckboxes);
  }, [selectedCheckboxes]);

  //자세히 보기 기능 ---------------------------------
  const [expandedRowIndex, setExpandedRowIndex] = useState(-1);

  const [itemsPerPage, setItemPerPage] = useState(10);

  const totalPages = Math.ceil(parseInt(totalNumber, 10) / parseInt(itemsPerPage, 10));

  const startIndex = (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10);
  const endIndex = parseInt(startIndex, 10) + parseInt(itemsPerPage, 10);

  const currentPageData = modifiedData ? modifiedData.slice(parseInt(startIndex, 10), parseInt(endIndex, 10)) : [];

  // -------------------------------------------------------------------------
  return (
    <div className="w-full p-10 pt-0 relative">
      {editAll ? (
        <div className="w-56 h-40 absolute -top-4 -left-56 z-50 border-4 border-[#5272F2] rounded-lg p-5 bg-[#FAFBFE] fontA">
          <div
            onClick={() => setEditAll(!editAll)}
            className="absolute flex justify-center items-center top-0 right-0 w-10 h-6 border-l-4 border-b-4 rounded-bl-md border-[#5272F2] bg-red-500 text-white"
          >
            X
          </div>
          <select
            className="pb-3"
            onChange={(e) => {
              setEditTextDB("");
              const selectedTypeName = e.target.value;
              const selectedTypeObject = editType[selectedTypeName];
              setSelectedType(selectedTypeObject);
            }}
          >
            <option selected value="none">
              선택하기
            </option>
            {Object.keys(editType).map((key) => (
              <option key={key} value={key}>
                {editType[key].name}
              </option>
            ))}
          </select>
          <InputBox data={editTextDB} edit={setEditTextDB} type={selectedType.type} options={["남", "여"]} />
          <div className="flex justify-end py-3">
            <Button label={"수정"} onClick={editAllButton} />
          </div>
        </div>
      ) : null}
      <div className="border border-[#B3A492] rounded-md">
        <table className={`${styleClass} border-collapse rounded-md text-sm shadow-md w-full fontA `}>
          <caption className="text-left font-extrabold px-3 text-lg">
            {title} | <span className="text-sm pr-4"> 전체 : {totalNumber}</span>
            {type === "teacher" ? (
              <Button
                URL={`/${type}-add`}
                width={300}
                height={30}
                disabled={true}
                label={"강사는 회원가입을 통해 추가해주세요"}
              />
            ) : null}
          </caption>

          <thead className="text-base font-semibold">
            <tr className="border-b border-[#B3A492]">
              {editAll ? (
                <td className="pl-3" key={"index"}>
                  <input
                    type="checkbox"
                    checked={selectedCheckboxes.length === currentPageData.length && selectedCheckboxes.length > 0}
                    onChange={(e) => handleMasterCheckboxChange(e)}
                  />
                </td>
              ) : null}
              {columns.map((column, index) => (
                <td className="px-3" key={index}>
                  {column.columnName}
                </td>
              ))}
            </tr>
          </thead>
          {totalNumber > 0 ? (
            <tbody className="px-3">
              {currentPageData.map((item, index) => (
                <React.Fragment key={item.data_pk}>
                  <tr className="relative">
                    {editAll ? (
                      <td className="pl-3">
                        <input
                          type="checkbox"
                          className="relative"
                          checked={selectedCheckboxes.includes(item.data_pk)}
                          onChange={(e) => handleCheckboxChange(e, item.data_pk)}
                        />
                      </td>
                    ) : null}
                    {columns.map((column, columnIndex) => {
                      return (
                        <td className="py-2 px-3 border-b" key={columnIndex}>
                          {item[column.data]}
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          ) : (
            <div className="px-6">데이터가 존재하지 않습니다.</div>
          )}
        </table>
      </div>
      <div className="flex justify-between mt-2 relative items-center">
        <div className="flex fontA gap-5 items-center">
          <div className="px-2 border-2 rounded-md border-[#5272F2] fontA">
            <select onChange={(e) => setItemPerPage(e.target.value)}>
              <option selected value={10}>
                10개씩 보기
              </option>
              <option value={15}>15개씩 보기</option>
              <option value={20}>20개씩 보기</option>
              <option value={10000000}>전체 보기</option>
            </select>
          </div>
        </div>
        {currentPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-2 rounded-lg border bg-white absolute right-56 select-none`}
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-2 rounded-lg border bg-white absolute right-48 select-none`}
            >
              {"<"}
            </button>
          </>
        )}
        <div className="pr-[80px]">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            if (Math.abs(currentPage - pageNumber) <= 2) {
              return (
                <button
                  key={index}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-2 mx-1 rounded-lg border text-xs h-7 w-7 select-none ${
                    currentPage === pageNumber ? "bg-[#5272F2] text-white" : "bg-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else {
              return null;
            }
          })}
        </div>
        {currentPage < totalPages && (
          <>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-2 rounded-lg border bg-white absolute right-11 select-none`}
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-2 rounded-lg border bg-white absolute right-0 select-none`}
            >
              {">>"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

DataTableV2.propTypes = {
  title: PropTypes.string.isRequired,
  datas: PropTypes.array,
  styleClass: PropTypes.string,
  columns: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  setDataArray: PropTypes.func,
  editType: PropTypes.object,
  setEditText: PropTypes.func,
};
