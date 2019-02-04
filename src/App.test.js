import React from "react";
import Enzyme, { shallow } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import App from "./App";

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * Factory function to create a ShallowWrapper for the App component
 * @function setup
 * @param {object}  props - Component props specific to this setup;
 * @param {object} state - Initial state for setup;
 * @returns {ShallowWrapper}
 */
const setup = (props={}, state=null) => {
  const wrapper = shallow(<App {...props} />);
  if (state) {
    wrapper.setState(state);
  }
  return wrapper;
}

/**
 * Returns component with the correct test attribute
 * @function findTestAttr
 * @param {ShallowWrapper}  wrapper - The wrapper that contains the attribute
 * @param {String} attr - The attribute to be searched in the wrapper
 * @returns {ShallowWrapper}
 */
const findTestAttr = (wrapper, attr) => (
  wrapper.find(`[data-test='${attr}']`)
)

describe("initial states", () => {
  test("renders without crashing", () => {
    const wrapper = setup();
    const appComponent = findTestAttr(wrapper, 'component-app');
    expect(appComponent).toBeTruthy();
  });

  test("zipcod exists", () => {
    const wrapper = setup();
    const appComponent = findTestAttr(wrapper, 'test-app-zipcode');
    expect(appComponent.length).toBe(1)
  });
  
  test("input does not exist", () => {
    const wrapper = setup();
    const inputSection = findTestAttr(wrapper, 'test-app-forecast-input');
    expect(inputSection.length).toBe(0);
  });
  
  test("check initial states", () => {
    const wrapper = setup();
    expect(wrapper.state('city')).toBe(null);
    expect(wrapper.state('error')).toBe(null);
    expect(wrapper.state('zip')).toBe(null);
    expect(wrapper.state('hideInput')).toBe(false);
    expect(wrapper.state('dataList').length).toBe(0);
  });
});

describe("valid states", () => {
  test("input shows", () => {
    const wrapper = setup({}, {error: false, hideInput: false});
    const zipComponent = findTestAttr(wrapper, 'test-app-zipcode');
    expect(zipComponent.length).toBe(1);
  });

  test("input hidden", () => {
    const wrapper = setup({}, {error: false, hideInput: true});
    const zipComponent = findTestAttr(wrapper, 'test-app-zipcode');
    expect(zipComponent.length).toBe(0);
  });

  test("forecasts shown", () => {
    const wrapper = setup({}, {city: 'San Francisco', error: false});
    const component = findTestAttr(wrapper, 'test-app-forecast-input');
    expect(component.length).toBe(1);
  });
});

describe("error state", () => {
  test("error message appears", () => {
    const wrapper = setup({}, {error: true});
    const errComponent = findTestAttr(wrapper, 'test-app-error');
    expect(errComponent.length).toBe(1)
  });
  
  test("input does not show", () => {
    const wrapper = setup({}, {city: 'San Francisco', error: true});
    const inputSection = findTestAttr(wrapper, 'test-app-forecast-input');
    expect(inputSection.length).toBe(0);
  });
});

