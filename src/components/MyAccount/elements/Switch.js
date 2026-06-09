import { Component } from 'react';
import ReactSwitch from 'react-switch';

class MaterialDesignSwitch extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.setDisplay((prev) => !prev);
  }

  render() {
    const { display, height, width, disabled, bgcolor, handleColor } = this.props;
    const onColor = bgcolor ? "#dddce1" : "#7ba986";
    const offColor = bgcolor ? "#dddce1" : "#dddce1";
    const handleColors = handleColor ? handleColor : "#fff"

    return (
      <div
        className={
          display
            ? 'sustainability--switch-checked'
            : 'sustainability--switch-unchecked'
        }
      >
        <ReactSwitch
          checked={display}
          onChange={this.handleChange}
          onColor={onColor}
          onHandleColor={handleColors}
          offHandleColor={handleColors} 
          offColor={offColor}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          height={height}
          width={width}
          className="react-switch"
          id="material-switch"
          disabled={disabled}
        />
      </div>
    );
  }
}

export default MaterialDesignSwitch;
