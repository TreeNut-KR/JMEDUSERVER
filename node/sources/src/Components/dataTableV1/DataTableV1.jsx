import React from "react";
import PropTypes from "prop-types";

export default function DataTableV1(props) {
  const { styleClass, datas, columns, title } = props;
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalNumber = datas.length;
  //페이지당 보일 데이터 갯수 나중에 고를 수 있도록 수정할지도
  const itemsPerPage = 10;

  const totalPages = Math.ceil(totalNumber / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = datas.slice(startIndex, endIndex);

  return (
    <div className="w-full p-10 pt-0">
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
                <tr key={startIndex + index}>
                  {columns.map((column, columnIndex) => {
                    if (column.data === "no") {
                      return (
                        <td className="py-2 px-2" key={columnIndex}>
                          {startIndex + index + 1}
                        </td>
                      );
                    } else {
                      return (
                        <td className="py-2 px-2" key={columnIndex}>
                          {item[column.data]}
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          ) : (
            "데이터가 존재하지 않습니다."
          )}
        </table>
      </div>
      <div className="flex justify-end mt-2">
        {currentPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-2 rounded-lg border bg-white`}
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-2 rounded-lg border bg-white`}
            >
              {"<"}
            </button>
          </>
        )}
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          if (Math.abs(currentPage - pageNumber) <= 2) {
            return (
              <button
                key={index}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-2 mx-1 rounded-lg border text-xs ${
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
        {currentPage < totalPages && (
          <>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-2 rounded-lg border bg-white`}
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-2 rounded-lg border bg-white`}
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
};
