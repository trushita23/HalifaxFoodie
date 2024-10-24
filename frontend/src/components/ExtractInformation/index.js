import axios from "axios";
import React from "react";
import { Button } from "react-bootstrap";
import { LAMBDA_COMPREHEND_URL } from "../../config/config";

const ExtractInformation = (props) => {
  const fileName = props.selectedFile?.name;
  const handleExtractText = () => {
    axios(`${LAMBDA_COMPREHEND_URL}?fileName=${fileName}`)
      .then((res) => {
        console.log("response:", res);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };
  return (
    <>
      <Button
        variant="warning"
        onClick={(e) => {
          handleExtractText();
        }}
      >
        Extract Information
      </Button>
    </>
  );
};

export default ExtractInformation;
