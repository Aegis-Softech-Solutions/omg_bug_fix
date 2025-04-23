import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const SuccessResetPassword = () => (
  <div className="gx-app-login-wrap">
    <div className="gx-page-success-container">
      <div className="gx-page-success-content">
        <div className="gx-page-success-logo">
          <img
            src={
              process.env.REACT_APP_IMAGE_URL +
              process.env.REACT_APP_LOGO_URL +
              "logo-horizontal.png"
            }
          />
        </div>
        <div className="gx-success-code gx-mb-4">
          Password Successfully Reset
        </div>
        <div style={{ textAlign: "center" }}>
          <Button type="primary">Click here to login</Button>
        </div>
      </div>
    </div>
  </div>
);

export default SuccessResetPassword;
