import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useLocation, useNavigate } from 'react-router-dom';


export function VerifyCipherKey({userData}){

    const location = useLocation();

    const[cipherKey, setCipherKey] = useState("");
    const[isLoading, setLoading] = useState(false);
    const[errorMessage,setErrorMessage] = useState("");

    let navigate = useNavigate();

    let email = userData?.email;
    let name = userData?.name;
    let userType = userData?.userType;

    useEffect( () => { 
        if(userData.email)
        {
         navigate('/login');   
        }
    }, []);

    const verifyCipherKey = async(e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        await fetch(`https://t7fblqkfc6p32723lhnfh27pva0yyjjf.lambda-url.us-east-1.on.aws/`, {
                    method: 'POST',
                    body: JSON.stringify({email: email, cipherKey:cipherKey})
                }).then((res) => res.json()).then((res)=>{
                    if(res.result === true)
                    {
                        setLoading(false);
                        localStorage.setItem("isUserLoggedIn","true");
                        localStorage.setItem("userType",userType);
                        localStorage.setItem("email",email);
                        localStorage.setItem("name",name);
                        navigate('/homepage');
                    }
                    else
                    {
                        setErrorMessage("Invalid cipher key!!");
                    }   
                });
    }

    return(
        <div>
            {isLoading ?  <ProgressBar animated now={100} />: null}
                <div> 
                <Alert key="primary" variant="primary">
                Please provide the cipher key
                </Alert>
                <Form>
                    <fieldset>                   
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="cipherKey">Answer</Form.Label>
                            <Form.Control  required id="cipherKey" placeholder="Enter cipher key" onChange={(e) => setCipherKey(e.target.value)}/>
                        </Form.Group>
                        <div className='errorMessage'>{errorMessage}</div>
                        <Button type="submit" onClick = { (e)=> verifyCipherKey(e)}>Submit</Button>
                    </fieldset>
                </Form>
            </div>
        </div>
    )
}

export default VerifyCipherKey;