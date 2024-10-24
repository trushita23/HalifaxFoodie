import './styles/Signup.css'
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserPool from './HalifaxFoodieUserPool'

export function SignUp() {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("Customer");
    const [errorMessage, setErrorMessage] = useState("");

    let navigate = useNavigate();

    const register = async () => {

        verifyDetails();

        if (errorMessage.length > 0) {
            return;
        }

        UserPool.signUp(email, password, [], null, async (err, data) => {
            if (err) {
                console.log(err);
                setErrorMessage("Email already exists !!");
            }
            else
            {
                await fetch(`https://lkf5b5tkg7zkzb4au7eihop5sy0zpvse.lambda-url.us-east-1.on.aws/`, {
                    method: 'POST',
                    body: JSON.stringify({ email: email, userType: userType, phoneNumber: phoneNumber, name: name })
                }).then((res) => res.json()).then((res) => {
                    console.log(res);
                    if (res.result === true)
                        navigate('/setquestionanswer', { state: { email: email } });
                    else
                        setErrorMessage("Some error occurred !! Please try again !!");
                });
            }
        });
    }

    const verifyDetails = () => {

        setErrorMessage("");

        if (name.trim().length === 0) {
            setErrorMessage("Invalid name");
        }
        else if (email.trim().length === 0) {
            setErrorMessage("Invalid email");
        }
        else if (phoneNumber.trim().length !== 10) {
            setErrorMessage("Invalid phone number");
        }
        else if (password !== confirmPassword) {
            setErrorMessage("Password and Confirm password don't match");
        }
        else if (password.trim().length < 6) {
            setErrorMessage("Password should be of at least 6 length");
        }
    }

    return (
        <div className="form">
            <div className="form-body">
                <div><h3>Registration form</h3></div>
                <div>
                    <label>Register as : &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</label>
                    <input type="radio" id="userType" name="userType" value="Customer" checked={userType === "Customer"} onChange={() => setUserType("Customer")} />
                    <label htmlFor="userType"> Customer&emsp;</label>
                    <input type="radio" id="userType" name="userType" value="Restaurant" checked={userType === "Restaurant"} onChange={() => setUserType("Restaurant")} />
                    <label htmlFor="userType">Restaurant</label>
                </div>
                <div>
                    <label className="form__label" htmlFor="name">{userType} name </label>
                    <input className="form__input" type="text" id="firstName" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="email">
                    <label className="form__label" htmlFor="email">Email </label>
                    <input type="email" id="email" className="form__input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="phoneNumber">
                    <label className="form__label" htmlFor="phoneNumber">Phone number </label>
                    <input type="text" id="phoneNumber" className="form__input" placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="password">
                    <label className="form__label" htmlFor="password">Password </label>
                    <input className="form__input" type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="confirm-password">
                    <label className="form__label" htmlFor="confirmPassword">Confirm Password </label>
                    <input className="form__input" type="password" id="confirmPassword" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
            </div>
            <div className='errorMessage'>
                {errorMessage}
            </div>
            <div className="footer">
                <Button type="submit" onClick={() => register()}>Register</Button><br />
                <a href='/login'>Already a user? Login </a>
            </div>
        </div>
    )

}

export default SignUp;