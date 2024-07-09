import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import BasicBox from "../manage-box/BasicBox";
import SearchBox from "../searchBox/SearchBox";

export default function DataTableHover(props) {
  const { styleClass, datas, setDatas, columns, title, type, setToggle, subData_picker } = props;
  const [currentPage, setCurrentPage] = useState(1);

  //한번에 수정하기 ---------------------------------
  const [editAll, setEditAll] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(subData_picker);
  const [innerData, setInnerData] = useState(datas);

  //data 안의 pk 값 이름 재설정
  const totalNumber = innerData ? innerData.length : 0;
  let modifiedData;
  if (innerData) {
    modifiedData = innerData.map((item) => {
      return {
        ...item,
        data_pk: item[type + "_pk"],
      };
    });
  } else {
    modifiedData = [];
  }

  //에드온 버튼
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

  //자세히 보기 기능 ---------------------------------
  const [itemsPerPage, setItemPerPage] = useState(10);
  const totalPages = Math.ceil(parseInt(totalNumber, 10) / parseInt(itemsPerPage, 10));

  const startIndex = (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10);
  const endIndex = parseInt(startIndex, 10) + parseInt(itemsPerPage, 10);
  const currentPageData = modifiedData ? modifiedData.slice(parseInt(startIndex, 10), parseInt(endIndex, 10)) : [];

  const tableRef = useRef(null);

  // -------------------------------------------------------------------------
  return (
    <>
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 " />
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 flex justify-center items-center">
        <BasicBox>
          <SearchBox setData={setInnerData} option={`${type}`}></SearchBox>
          <div ref={tableRef} className="w-full p-10 pt-0 relative">
            <div className="border border-[#B3A492] rounded-md">
              <table className={`${styleClass} border-collapse rounded-md text-sm shadow-md w-full fontA `}>
                <caption className="text-left font-extrabold px-3 text-lg">
                  {title} | <span className="text-sm pr-4"> 전체 : {totalNumber}</span>
                  <div className="h-4" />
                </caption>

                <thead className="text-base font-semibold">
                  <tr className="border-b border-[#B3A492]">
                    {editAll ? (
                      <td className="pl-3" key={"index"}>
                        <div />
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
                                checked={selectedCheckboxes?.includes(item.data_pk)}
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
                <div className="flex items-center border-2 rounded-md bg-[#5272F2] border-[#5272F2] px-2">
                  <button
                    className="text-white"
                    onClick={() => {
                      setDatas(selectedCheckboxes);
                      setToggle(false);
                    }}
                  >
                    확인
                  </button>
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
        </BasicBox>
      </div>
    </>
  );
}

DataTableHover.propTypes = {
  title: PropTypes.string.isRequired,
  datas: PropTypes.array,
  setDatas: PropTypes.func.isRequired,
  setToggle: PropTypes.func.isRequired,
  styleClass: PropTypes.string,
  columns: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  subData_picker: PropTypes.array,
};
