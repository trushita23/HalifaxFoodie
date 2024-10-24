import './styles/SetQuestionAnswer.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export function SetQuestionAnswer(){

    const location = useLocation();

    const questionOptions = [
        {value: 'What is your nick name?', textToDisplay: 'What is your nick name?'},
        {value: 'What is your place of birth?', textToDisplay: 'What is your place of birth?'},
        {value: 'What is name of your best friend?', textToDisplay: 'What is name of your best friend?'}
      ];

    const[question,setQuestion] = useState(questionOptions[0].value);
    const[answer, setAnswer] = useState("");

    let navigate = useNavigate();

    useEffect(() => {
        console.log(location.state);
        if(!location.state)
        {
            navigate('/signup');
        }
    });

    const register = async(e) => {
        e.preventDefault();
        let email = location.state.email;
        await fetch(`https://us-central1-a2-csci5410-sdp.cloudfunctions.net/setQuestionAnswer/`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "Application/JSON"
                      },
                    body: JSON.stringify({email: email, question:  question, answer: answer})
            }).then((res) => res.json()).then((res)=>{
                if(res.result === true)
                        navigate('/setcipherdetails',{ state: { email: email} });
        });
    }

    return(
        <div className='setQuestionAnswerDiv'>
            <Alert key="primary" variant="primary">
            Select question and answer !!
            </Alert>
            <Form>
                <fieldset>
                    <Form.Group className="mb-3">
                    <Form.Label htmlFor="question">Select Question</Form.Label>
                        <Form.Select required id="question" onChange={(e) => setQuestion(e.target.value)}>
                            {questionOptions.map( question => (
                                <option key={question.value} value={question.value}>
                                    {question.textToDisplay}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="answer">Answer</Form.Label>
                        <Form.Control  required id="answer" placeholder="Answer to the selected question" onChange={(e) => setAnswer(e.target.value)}/>
                        </Form.Group>
                    <Button type="submit" onClick = { (e)=> register(e)}>Submit</Button>
                </fieldset>
            </Form>
        </div>
    )
}

export default SetQuestionAnswer;