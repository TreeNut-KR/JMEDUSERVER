import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import moreIcon from "../../img/pending-icon.png";

export default function DataTableV1(props) {
  const { styleClass, datas, columns, title, type } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const totalNumber = datas ? datas.length : 0;

  //자세히 보기 기능
  const [expandedRowIndex, setExpandedRowIndex] = useState(-1);

  const [itemsPerPage, setItemPerPage] = useState(10);

  const totalPages = Math.ceil(
    parseInt(totalNumber, 10) / parseInt(itemsPerPage, 10)
  );

  const startIndex =
    (parseInt(currentPage, 10) - 1) * parseInt(itemsPerPage, 10);
  const endIndex = parseInt(startIndex, 10) + parseInt(itemsPerPage, 10);
  const currentPageData = datas
    ? datas.slice(parseInt(startIndex, 10), parseInt(endIndex, 10))
    : [];

  //테이블 내의 '자세히 보기' 버튼 뜨도록 하는 기능 -------
  const toggleRowExpansion = (index) => {
    if (expandedRowIndex === index) {
      setExpandedRowIndex(-1);
    } else {
      setExpandedRowIndex(index);
    }
  };

  const closeExpandedRow = () => {
    setExpandedRowIndex(-1);
  };

  const tableRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        closeExpandedRow();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function buttonEffect(ID) {
    const editUrl = `/${type}-edit/${ID}`;
    window.location.href = editUrl;
  }
  // -------------------------------------------------------------------------
  return (
    <div ref={tableRef} className="w-full p-10 pt-0">
      <div className="border border-[#B3A492] rounded-md">
        <table
          className={`${styleClass} border-collapse rounded-md text-sm shadow-md w-full fontA `}
        >
          <caption className="text-left font-extrabold px-3 text-lg">
            {title} | <span className="text-sm"> 전체 : {totalNumber}</span>
          </caption>
          <thead className="text-base font-semibold">
            <tr className="border-b border-[#B3A492]">
              {columns.map((column, index) => (
                <td className="px-2" key={index}>
                  {column.columnName}
                </td>
              ))}
            </tr>
          </thead>
          {totalNumber > 0 ? (
            <tbody className="px-3">
              {currentPageData.map((item, index) => (
                <React.Fragment key={item.student_pk}>
                  <tr className="relative">
                    {columns.map((column, columnIndex) => {
                      if (column.data === "no") {
                        return (
                          <td className="py-2 px-2 border-b" key={columnIndex}>
                            {startIndex + index + 1}
                          </td>
                        );
                      } else {
                        return (
                          <td className="py-2 px-2 border-b" key={columnIndex}>
                            {item[column.data]}
                          </td>
                        );
                      }
                    })}
                    <td className="absolute right-1 top-[6px]">
                      <button
                        className="relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(index);
                        }}
                      >
                        <img src={moreIcon} alt="" />
                        {expandedRowIndex === index && (
                          <span
                            className="absolute top-[-4px] left-[7rem] transform translate-x-[-50%] bg-[#5272F2] px-3 py-1 border rounded w-[10rem] text-white"
                            onClick={() => buttonEffect(item.student_pk)}
                          >
                            자세히 보기 / 수정
                          </span>
                        )}
                      </button>
                    </td>
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
        <div className="px-2 border-2 rounded-md border-[#5272F2] fontA ">
          <select onChange={(e) => setItemPerPage(e.target.value)}>
            <option selected value={10}>
              10개씩 보기
            </option>
            <option value={15}>15개씩 보기</option>
            <option value={20}>20개씩 보기</option>
            <option value={10000000}>전체 보기</option>
          </select>
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
                    currentPage === pageNumber
                      ? "bg-[#5272F2] text-white"
                      : "bg-white"
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

DataTableV1.propTypes = {
  title: PropTypes.string.isRequired,
  datas: PropTypes.array,
  styleClass: PropTypes.string,
  columns: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};
