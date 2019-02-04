import React from "react";

import Zipcode from "./components/Zipcode";
import Forecasts from "./components/Forecasts";

import "./App.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

class App extends React.Component {
  state = {
    city: null,
    error: null,
    zip: null,
    hideInput: false,
    dataList: []
  };

  /**
   * Function to call weather api set states of App component
   * @function getForecasts
   * @param {SyntheticEvent}  event - Click event of input
   * @returns
   */
  getForecasts = async event => {
    if (event) {
      event.preventDefault();
    }
    const zip = event ? event.target.elements.zip.value : this.state.zip;
    try {
      if (zip) {
        const apiCall = await fetch(
          `http://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&units=metric&appid=${API_KEY}`
        );
        const data = await apiCall.json();
        this.setState({
          city: data.city.name,
          zip: zip,
          dataList: data.list,
          error: false
        });
      }
    } catch (e) {
      this.setState({
        city: null,
        zip: zip,
        dataList: [],
        error: true
      });
    }
  };

  toggleInputView = () => {
    this.setState({
      hideInput: !this.state.hideInput
    });
  };

  componentDidMount() {
    const fiveMinutes = 5 * 60 * 1000;
    setInterval(() => {
      this.getForecasts();
    }, fiveMinutes);
  }

  render() {
    const { dataList, city, hideInput, error, zip } = this.state;

    return (
      <div className="main" data-test="component-app">
        <div className="main-components">
          <h1>Five Day Weather Forecast</h1>
          {!hideInput && (
            <Zipcode
              data-test="test-app-zipcode"
              getForecasts={this.getForecasts}
              zip={zip}
            />
          )}
          <div className="forecast-components">
            {city && !error && (
              <div data-test="test-app-forecast-input">
                <h3>Forecasts for {city}</h3>
                <Forecasts
                  dataList={dataList}
                  toggleView={this.toggleInputView}
                />
              </div>
            )}
            {error && (
              <div className="error" data-test="test-app-error">
                Opps! An error occurs, please check your zipcode and try again.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
