import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserPool from './HalifaxFoodieUserPool';
import './styles/Login.css';
import VerifyQuestionAnswer from './VerifyQuestionAnswer';

export function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isUserVerified, setIsUserVerfied] = useState(false);
    const [userData, setUserData] = useState({});

    const loginUser = async (e) => {

        e.preventDefault();
        setErrorMessage("");

        const userDetails = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        })

        userDetails.authenticateUser(authenticationDetails, {
            onSuccess: async (data) => {
                await fetch(`https://s3g6f7xn4csj3fmqp2k5yrunti0keouo.lambda-url.us-east-1.on.aws/`, {
                    method: 'POST',
                    body: JSON.stringify({ email: email })
                }).then((res) => res.json()).then((res) => {
                    console.log(res);
                    if (res.result === true) {
                        setUserData({ email: res.email, name: res.name, userType: res.userType });
                        setIsUserVerfied(true);
                    }
                    else {
                        setErrorMessage("Some error occurred !! Please try again !!");
                    }
                });
            },
            onFailure: (err) => {
                setErrorMessage("Invalid Credentials !!");
                return;
            }
        });
    }

    return (
        <div className='loginForm'>
            {isUserVerified === false ?
                <div>
                    <h3>Login</h3>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <div className='errorMessage'>
                            {errorMessage}
                        </div>
                        <Button variant="primary" type="submit" onClick={(e) => loginUser(e)}>
                            Submit
                        </Button>
                        <br />
                        <a href='/signup'>Not a user? Register</a>
                    </Form>
                </div> : null}
            {isUserVerified ? <VerifyQuestionAnswer userData={userData} /> : null}
        </div>

    )
}

export default Login;

