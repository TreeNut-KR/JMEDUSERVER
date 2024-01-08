import PropTypes from "prop-types";
import DatePickerV1 from "./datePicker/DatePicker";

export default function InputBox(props) {
  const { name, data, edit, disable, type, options } = props;

  return (
    <div className={`${name ? "py-10" : null} border-b-2 fontA flex gap-4`}>
      {name ? (
        <div className="w-36 flex justify-end">
          <span>{name} : </span>
        </div>
      ) : null}
      {type === "text" ? (
        <input
          className={`${
            name ? "w-3/4" : "w-full"
          } px-4 border border-[#5272F2] rounded-md`}
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
            <input
              type="radio"
              value={index}
              checked={data === index}
              onChange={() => edit(index)}
            />
            <label>{option}</label>
          </div>
        ))
      ) : type === "phone" ? (
        <input
          className={`${
            name ? "w-3/4" : "w-full"
          } px-4 border border-[#5272F2] rounded-md`}
          type="tel"
          disabled={disable}
          value={data}
          onChange={(e) => {
            const formattedNumber = e.target.value
              .replace(/[^\d]/g, "")
              .slice(0, 11);
            const formatted = formattedNumber.replace(
              /(\d{3})(\d{4})(\d{4})/,
              "$1-$2-$3"
            );
            edit(formatted);
          }}
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
        />
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
};

InputBox.defaultProps = {
  type: "text",
};
