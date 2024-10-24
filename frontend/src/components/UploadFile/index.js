// Reference https://medium.com/@shashithd/upload-a-file-to-s3-using-lambda-from-reactjs-application-cba327c9b923

import React, { Component, useRef } from "react";
import { Button} from "react-bootstrap";

const UploadFile = (props) => {
  const inputRef = useRef(null);
  const [file, setFile] = React.useState(undefined);

  const uploadFile = () => {
    inputRef.current?.click();
    props.uploadFile(file);
  };
  return (
    <div>
      <div>
        <form>
          <div className="form-group">
            <h3>Upload your recipe </h3>
            <input
              type="file"
              className="form-control-file"
              id="fileName"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && (
              <Button
                variant="warning"
                onClick={(e) => {
                  uploadFile();
                }}
              >
                Upload your file{" "}
              </Button>
            )}
            <div>
              <span>{props.uploadSuccess ? "File Uploaded Successfully" : ""}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
