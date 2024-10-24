import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RestaurantNavBar from "../navbars/RestaurantNavBar";
import axios from "axios";
import { EXTRACTING_URL } from "../../config/config";
import FileUpload from "../UploadFile";
import ExtractInformation from "../ExtractInformation";
import foodImage from "../../images/food.jpg";
import LexChatBot from "../LexChatBot";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from "@fortawesome/free-solid-svg-icons";

const myStyle = {
  height: "100%",
  width: "100%",
};
const uploadButtonDiv = {
  justifyContent: "center",
  display: "flex",
  marginTop: "10%",
  //   marginLeft: "40%",
};
export function RestaurantHomePage() {
  
  let navigate = useNavigate();
  // Lex chat
  const [show, setShow] = useState(false);
  const displayChatBox = () => {
    setShow((show) => !show);
  };
  const [activeTab, setActiveTab] = useState("reports");
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [uploadSuccess, setUploadSuccess] = React.useState(undefined);
  console.log("selected file ...", selectedFile);
  const uploadFile = (file) => {
    axios(
      `${EXTRACTING_URL}?fileName=` +
      file.name
    ).then((response) => {
      console.log("response:", response);
      const url = response.data.fileUploadURL;

      axios({
        method: "PUT",
        url: url,
        data: file,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          console.log("response:", res);
          setSelectedFile(file)
          setUploadSuccess("File upload successfully");
        })
        .catch((err) => {
          setUploadSuccess(undefined);
        });
    });
  };


  useEffect(() => {
    if (localStorage.getItem("isUserLoggedIn") !== "true") {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <div>
        <RestaurantNavBar activeTab={activeTab} />
      </div>
      <div style={{ justifyContent: "center", display: "flex" }}>
        <h2> Welcome Restaurant Owner</h2>
      </div>
      <div>
        <Container fluid>
          <Row>
            <Col xs={8}>
              <img src={foodImage} style={myStyle} />
            </Col>
            <Col xs={4}>
              {show && <LexChatBot displayChatBox={displayChatBox} />}

            </Col>
          </Row>
          <Row>
            <Col>
              <div style={uploadButtonDiv}>
                <FileUpload uploadFile={uploadFile} uploadSuccess={uploadSuccess} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div
                style={{
                  justifyContent: "center",
                  marginLeft: "40%",
                  marginTop: "3%",
                }}
              >
                <h2> Extract Information</h2>
                <ExtractInformation selectedFile={selectedFile} />
              </div>
            </Col>
          </Row>
        </Container>
        <FontAwesomeIcon icon={faMessage} size="3x" className='chatIcon' onClick={displayChatBox} />
      </div>
    </div>
  );
}

export default RestaurantHomePage;
