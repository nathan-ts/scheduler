// We are rendering `<Application />` down below, so we need React.createElement
import React from "react";

import PropTypes from 'prop-types';

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { render } from "@testing-library/react";

// We import the component that we are testing
import Appointment from "components/Appointment";


describe("Appointment", () => {
  // A test that renders a React Component
  it("renders without crashing", () => {
    render(<Appointment />);
  });

  it("does something it is supposed to do", () => {
    // ...
  });

  it("does something else it is supposed to do", () => {
    // ...
  });
});