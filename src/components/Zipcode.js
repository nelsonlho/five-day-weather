import React from "react";

class Zipcode extends React.Component {
  state = {
    zip: this.props.zip,
    isZipValid: true,
  };

  /**
   * Function that sets states of Zipcode component
   * @function getForecasts
   * @param {SyntheticEvent}  event - Click event of input
   * @returns
   */
  changeZip = event => {
    const zip = event.target.value;
    const postalRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
    this.setState({
      zip: event.target.value,
      isZipValid: postalRegex.test(zip)
    });
  };

  render() {
    const { zip, isZipValid } = this.state;
    return (
      <div>
        <form onSubmit={this.props.getForecasts}>
          <div className="form-content">
            <input
              className={
                isZipValid
                  ? "inputBox"
                  : ["inputBox", "input-red-border"].join(" ")
              }
              type="text"
              name="zip"
              placeholder="Zip Code"
              onChange={this.changeZip}
              value={zip}
              maxlength="5"
            />
            <button disabled={!isZipValid}>
              <div className={
                isZipValid && zip
                  ? ["button", "submit"].join(" ")
                  : ["button", "disabled"].join(" ")
              }>Get Forecasts</div>
            </button>
          </div>
        </form>
      </div>
    );
  }
}
export default Zipcode;
