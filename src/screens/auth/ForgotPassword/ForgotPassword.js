import React from 'react';
import {useParams} from 'react-router-dom';
import './ForgotPassword.scss'
import CommonAuthScreen from "../common/CommonAuthScreen/CommonAuthScreen";
import Button from "../../../common/Button/Button";
import BigInput from "../../../common/BigInput/BigInput";

function ForgotPassword() {
    const {screenType} = useParams()
    return (
        <CommonAuthScreen>
            {screenType === 'forgotPassword' ? <>
                <div className="login-field-name">Email or Number</div>
                <BigInput prefix="drafts" prefixClass="login-input-icon" type="email" placeholder="Enter email or number"/>
                <div className="login-action-row">
                    <div/>
                    <a href="/">Back To Login</a>
                </div>
                <Button title="SendOTP" buttonType={"primary"}/>
            </> : ''}

            {screenType === 'otp' ? <>
                <div className="login-field-name">Email or Number</div>
                <BigInput prefix="drafts" prefixClass="login-input-icon" type="email" placeholder="Enter email or number"/>
                <div className="login-field-name">Enter OTP</div>
                <div className="otp-row">
                    <div className="login-input"><input maxLength="1" placeholder="0"/></div>
                    <div className="login-input"><input maxLength="1" placeholder="0"/></div>
                    <div className="login-input"><input maxLength="1" placeholder="0"/></div>
                    <div className="login-input"><input maxLength="1" placeholder="0"/></div>
                    <div className="login-input"><input maxLength="1" placeholder="0"/></div>
                    <div className="login-input"><input maxLength="1" placeholder="0"/></div>
                </div>
                <div className="login-action-row">
                    <div/>
                    <a href="/">Back To Login</a>
                </div>
                <Button title="Resend OTP" buttonType={"outlined-secondary"}/>
                <Button title="Submit" buttonType={"secondary"} className="ml-15"/>
            </> : ''}

            {screenType === 'resetPassword' ? <>
                <div className="login-field-name">New Password</div>
                <BigInput prefix="lock_open" prefixClass="login-input-icon" type="password" placeholder="Enter New password"/>
                <div className="login-field-name">Re-enter Password</div>
                <BigInput prefix="lock_open" prefixClass="login-input-icon" type="password" placeholder="Re Enter password"/>
                <div className="login-action-row">
                    <div/>
                    <a href="/">Back To Login</a>
                </div>
                <Button title="Set New Password" buttonType={"secondary"} className="ml-15"/>
            </> : ''}
        </CommonAuthScreen>
    )
}

export default ForgotPassword;