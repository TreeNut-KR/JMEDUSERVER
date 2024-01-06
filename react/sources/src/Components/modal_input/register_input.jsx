import PropTypes from "prop-types";

export default function ModalInputBox(props) {
  const { label, data, edit, disable, type } = props;

  const renderInput = () => {
    switch (type) {
      case "checkBox":
        return (
          <div className="flex items-center gap-3 mt-5 fontA">
            {label}
            <input
              className=" h-5 w-8 rounded-md border border-[#000000]"
              type="checkbox"
              disabled={disable}
              checked={data}
              onChange={(e) => edit(e.target.checked)}
            />
          </div>
        );

      case "radioButton":
        return (
          <div className="flex items-center gap-5 mt-5 fontA">
            {label}
            <div className="flex items-center gap-2">
              남
              <input
                className="px-2 h-5 w-8 rounded-md border border-[#000000]"
                type="radio"
                name={label}
                disabled={disable}
                checked={data === "male"}
                onChange={() => edit("male")}
              />
            </div>
            <div className="flex items-center gap-2">
              여
              <input
                className="px-2 h-5 w-8 rounded-md border border-[#000000]"
                type="radio"
                name={label}
                disabled={disable}
                checked={data === "female"}
                onChange={() => edit("female")}
              />
            </div>
          </div>
        );

      default:
        return (
          <input
            className="px-2 w-80 h-11 rounded-md border border-[#000000] mt-5 fontA"
            placeholder={label}
            disabled={disable}
            value={data}
            onChange={(e) => edit(e.target.value)}
          />
        );
    }
  };

  return <>{renderInput()}</>;
}

ModalInputBox.propTypes = {
  label: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  edit: PropTypes.func.isRequired,
  disable: PropTypes.bool,
  type: PropTypes.oneOf(["checkBox", "radioButton", null]),
};

ModalInputBox.defaultProps = {
  type: null,
};
