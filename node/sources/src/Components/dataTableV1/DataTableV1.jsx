import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import moreIcon from "../../img/pending-icon.png";

export default function DataTableV1(props) {
  const { styleClass, datas, columns, title, type } = props;
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalNumber = datas.length;

  //자세히 보기 기능
  const [expandedRowIndex, setExpandedRowIndex] = useState(-1);

  //페이지당 보일 데이터 갯수 나중에 고를 수 있도록 수정할지도
  const itemsPerPage = 10;

  const totalPages = Math.ceil(totalNumber / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = datas.slice(startIndex, endIndex);

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
                <React.Fragment key={startIndex + index}>
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
                            onClick={() => buttonEffect(index + 1)}
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
            "데이터가 존재하지 않습니다."
          )}
        </table>
      </div>
      <div className="flex justify-end mt-2 relative items-center">
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
