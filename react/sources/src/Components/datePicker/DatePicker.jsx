import { ko } from "date-fns/esm/locale";
import "../../Css/datepicker.css";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";

const extractDatePart = (isoString) => {
  if (typeof isoString === "string" && isoString.includes("T")) {
    return isoString.split("T")[0];
  }

  return isoString;
};

export default function DatePickerV1(props) {
  const { selected, onChange, className } = props;

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  };
  const selectedDate = isValidDate(extractDatePart(selected))
    ? new Date(extractDatePart(selected))
    : new Date();

  const handleChange = (date) => {
    const newDate = date.toISOString().slice(0, 10);
    onChange(newDate);
  };

  return (
    <DatePicker
      className={`w-32 text-lg text-center border rounded-md ml-4 custom-datepicker-input ${className}`}
      selected={selectedDate}
      onChange={handleChange}
      dateFormat="yyyy-MM-dd"
      locale={ko}
    />
  );
}

DatePickerV1.propTypes = {
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
