import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useLocation, useNavigate } from 'react-router-dom';
import VerifyCipherKey from './VerifyCipherKey';


export function VerifyQuestionAnswer({userData}){

    const location = useLocation();

    const[question,setQuestion] = useState("");
    const[answer, setAnswer] = useState("");
    const[expectedAnswer,setExpectedAnswer] = useState("");
    const[isLoading, setLoading] = useState(true);
    const[errorMessage,setErrorMessage] = useState("");
    const[isCorrectAnswer,setCorrectAnswer] = useState(false);

    let navigate = useNavigate();

    let email = userData?.email;
    let name = userData?.name;
    let userType = userData?.userType;

    useEffect( () => { 
        loadQuestion();
    }, []);

    const loadQuestion  = async() =>{
        await fetch(` https://us-central1-a2-csci5410-sdp.cloudfunctions.net/getQuestionAnswer/`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "Application/JSON"
                      },
                    body: JSON.stringify({email: email})
            }).then((res) => res.json()).then((res)=>{
                console.log(res);
                if(res.result === true)
                {
                    setQuestion(res.question);
                    setExpectedAnswer(res.answer);
                    setLoading(false);
                }
        });
    }

    const verifyAnswer = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setCorrectAnswer(false);
        if(answer.toLowerCase() === expectedAnswer.toLowerCase())
        {
            setCorrectAnswer(true);
        }
        else
        {
            setErrorMessage("Invalid answer. Please try again");
        }
    }

    return(
        <div>
            {isLoading ?  <ProgressBar animated now={100} />: null}
            <h3>Hey {name}</h3>
            {isCorrectAnswer === false ? 
                <div> 
                    <Alert key="primary" variant="primary">
                    {question}
                    </Alert>
                    <Form>
                        <fieldset>                   
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="answer">Answer</Form.Label>
                                <Form.Control  required id="answer" placeholder="Answer to the  question" onChange={(e) => setAnswer(e.target.value)}/>
                            </Form.Group>
                            <div className='errorMessage'>{errorMessage}</div>
                            <Button type="submit" onClick = { (e)=> verifyAnswer(e)}>Submit</Button>
                        </fieldset>
                    </Form>
                </div> : null}
            {isCorrectAnswer ? <VerifyCipherKey userData={userData}/> : null}
        </div>
    )
}

export default VerifyQuestionAnswer;