import PropTypes from "prop-types";

export default function InputBox(props) {
  const { name, data, edit, disable } = props;

  return (
    <div className="py-10 border-b-2 fontA flex gap-4">
      <div className="w-28 flex justify-end">
        <span>{name} : </span>
      </div>
      <input
        className="w-3/4 px-4 border border-[#5272F2] rounded-md"
        type="text"
        disabled={disable}
        value={data}
        onChange={(e) => edit(e.target.value)}
      />
    </div>
  );
}

InputBox.propTypes = {
  name: PropTypes.string,
  data: PropTypes.string,
  edit: PropTypes.func.isRequired,
  disable: PropTypes.bool,
};
