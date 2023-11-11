import { ko } from "date-fns/esm/locale";
import "../../Css/datepicker.css";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";

export default function DatePickerV1(props) {
  const { selected, onChange, className } = props;

  return (
    <DatePicker
      className={`w-32 text-lg text-center border rounded-md ml-4 custom-datepicker ${className}`}
      selected={selected}
      onChange={onChange} // Use onChange instead of onchange
      locale={ko}
    />
  );
}

DatePickerV1.propTypes = {
  selected: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired, // Use onChange instead of onchange
  className: PropTypes.string,
};
