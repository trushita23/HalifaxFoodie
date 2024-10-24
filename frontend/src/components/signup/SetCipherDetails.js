import './styles/SetCipherDetails.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export function SetCipherDetails(){

    const[key,setKey] = useState("");
    const[plainText,setPlainText] = useState("");
    const[cipherKey, setCipherKey] = useState("Not yet generated");
    const[isResultGenerated, setResultGenerated] = useState(false);
    const location = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        if(!location.state)
        {
            navigate('/signup');
        }
    });

    const navigateLogin = () => {
        navigate('/login');
    };

    const register = async(e) => {
        e.preventDefault();
        let email = location.state.email;
        setResultGenerated(false);
        await fetch(`https://dj53hc3uwerd734spsaphsioka0dtotk.lambda-url.us-east-1.on.aws/`, {
                    method: 'POST',
                    body: JSON.stringify({email: email, key:  key, plainText: plainText})
            }).then((res) => res.json()).then((res)=>{
                console.log(res);
                if(res.result === true){
                    setCipherKey(res.cipherText);
                    setResultGenerated(true);
                }
            });
    }

    const CipherTextResult = () => (
        <div>
            <Card>
                <Card.Header>Key</Card.Header>
                <Card.Body>
                   <Card.Title>{cipherKey}</Card.Title>
                   <Card.Text>
                     Please copy the above key, you will need to login later !!
                    </Card.Text>
                <Button variant="primary" onClick={navigateLogin}>Login</Button>
                </Card.Body>
            </Card>
        </div>
      )
      

    return(
        <div className='setCipherDetailsDiv'>
            {!isResultGenerated ? 
            <div>
                <Alert key="primary" variant="primary">
                    Set Key and Plain text to get cipher key. Please keep the copy of text once generated !!
                </Alert>
                <Form>
                    <fieldset>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="answer">Key (Length:4)</Form.Label>
                            <Form.Control required id="answer" placeholder="Key (Length:4)" onChange={(e) => setKey(e.target.value)} minLength={4} maxLength={4}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="answer">Plain text</Form.Label>
                            <Form.Control required id="answer" placeholder="Plain text" onChange={(e) => setPlainText(e.target.value)}/>
                        </Form.Group>
                        <Button type="submit" onClick = { (e)=> register(e)}>Submit</Button>
                    </fieldset>
                </Form>
            </div> : null}
            { isResultGenerated ? <CipherTextResult/> : null }
        </div>
    )
}

export default SetCipherDetails;