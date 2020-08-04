import React from "react";
import "./ErrorMessage.css";

function ErrorMessage(props) {
  const { message } = props;
  return (
    <div className="alert alert-danger small liveValidateMessage">
      {message}
    </div>
  );
}

export default ErrorMessage;
