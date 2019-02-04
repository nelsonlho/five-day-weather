import React from "react";

class Forecasts extends React.Component {
  state = {
    selectedForecastDate: null
  };

  /**
   * Filters all data except with the specified date
   * @function filterList
   * @param {Date}  date - specified date
   * @returns {Object[]} all objects associated with specified date
   */
  filterList = date => {
    const { dataList } = this.props;
    const formattedDate = date.setHours(0, 0, 0, 0);
    return dataList.filter(obj => {
      const objDate = new Date(obj.dt_txt);
      return objDate.setHours(0, 0, 0, 0) === formattedDate;
    });
  };

  /**
   * Add a number of dates to a date object
   * @function addDays
   * @param {Date}  date - date object to which addition occurs
   * @param {Number} days - number of days to be added
   * @returns {Date} new date with the added number of days
   */
  addDays = (date, days) => {
    let newDate = new Date();
    newDate.setDate(date.getDate() + days);
    return newDate;
  };

  /**
   * Add a number of dates to a date object
   * @function addDays
   * @param {Date}  date - date object to which addition occurs
   * @param {Number} days - number of days to be added
   * @returns {Date} new date with the added number of days
   */
  selectForecast = date => {
    const { toggleView } = this.props;
    this.setState({
      selectedForecastDate: date ? date : false
    });
    toggleView();
  };

  /**
   * Create five clickable components, one representing a date with weather forecast
   * @function createForecasts
   * @returns {ReactElement} and array of ForecastComponent's
   */
  createForecasts = () => {
    const today = new Date();
    let forecastComponents = [];
    for (let numberOfDays = 1; numberOfDays < 6; numberOfDays++) {
      const addedDate = this.addDays(today, numberOfDays);
      forecastComponents = [
        ...forecastComponents,
        <ForecastComponent
          key={addedDate}
          addedDate={addedDate}
          selectDate={this.selectForecast}
        />
      ];
    }

    return forecastComponents;
  };

  render() {
    const { selectedForecastDate } = this.state;
    const forecasts = this.createForecasts();
    return (
      <div>
        {!selectedForecastDate ? (
          forecasts
        ) : (
          <div>
            <button>
              <div
                className="button back"
                onClick={() => this.selectForecast()}
              >
                Back
              </div>
            </button>
            <DetailedForecast
              selectedForecastDate={selectedForecastDate}
              list={this.filterList(selectedForecastDate)}
            />
          </div>
        )}
      </div>
    );
  }
}

/**
 * A clickable forecast component, each associated with a day
 */
const ForecastComponent = ({ addedDate, selectDate }) => {
  return (
    <div className="forecast-date" onClick={() => selectDate(addedDate)}>
      {addedDate.toLocaleDateString()}
    </div>
  );
};

/**
 * A detailed forecast component for a particular day
 */
const DetailedForecast = ({ list, selectedForecastDate }) => {
  /**
   * Create a markup that has the average, highest and lowest temperatures of a day and forecasts of weather for every 3 hours
   * @function getAverage
   * @returns {ReactElement} html markup
   */
  const getAverage = () => {
    let tempAccum = 0;
    let lowestTemp = null;
    let highestTemp = null;
    let detailDescriptions = [];
    list.map(ele => {
      const main = ele.main;
      const date = new Date(ele.dt_txt);
      const time = date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true
      });
      const weather = ele.weather[0];
      const imgUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;
      const desc = weather.description;
      detailDescriptions = [
        ...detailDescriptions,
        <ImageDesc url={imgUrl} desc={desc} time={time} key={time} />
      ];
      tempAccum += main.temp;
      lowestTemp =
        lowestTemp === null
          ? main.temp_min
          : Math.min(lowestTemp, main.temp_min);
      highestTemp =
        highestTemp === null
          ? main.temp_max
          : Math.max(highestTemp, main.temp_max);
    });

    const averageTemp = (tempAccum / list.length).toFixed(2);
    return (
      <div>
        <div>Average Temp: {averageTemp}&#8451;</div>
        <div>Highest Temp: {highestTemp}&#8451;</div>
        <div>Lowest Temp: {lowestTemp}&#8451;</div>
        <div class="detail-desc">{detailDescriptions}</div>
      </div>
    );
  };

  const singleDayComponent = getAverage();

  return (
    <div>
      <h3>{selectedForecastDate.toLocaleDateString()}</h3>
      <div>{singleDayComponent}</div>
    </div>
  );
};

/**
 * Image and description of forecast at particular time of a day
 */
const ImageDesc = ({ url, time, desc }) => {
  return (
    <div className="image-desc">
      <img className="weather-icon" src={url} alt="" />
      <div>{time}</div>
      <div>{desc}</div>
    </div>
  );
};

export default Forecasts;
