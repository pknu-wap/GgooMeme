import React, { Component } from 'react';
import './Login.css';
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN, KAKAO_AUTH_URL } from '../../constants';
import { login } from '../../util/APIUtils';
import { Link, Redirect } from 'react-router-dom'
import googleLogo from '../../img/google-logo.png';
import githubLogo from '../../img/github-logo.png';
import kakaoLogo from '../../img/kakao.png';
import Alert from 'react-s-alert';

class Login extends Component {
    componentDidMount() {
        // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
        // Here we display the error and then remove the error query parameter from the location.
        if(this.props.location.state && this.props.location.state.error) {
            setTimeout(() => {
                Alert.error(this.props.location.state.error, {
                    timeout: 5000
                });
                this.props.history.replace({
                    pathname: this.props.location.pathname,
                    state: {}
                });
            }, 100);
        }
    }
    
    render() {
        // if(this.props.authenticated) {
        //     return <Redirect
        //         to={{
        //         pathname: "/",
        //         state: { from: this.props.location }
        //     }}/>;            
        // }

        return (
            <div className="login-container">
                <div className="login-content">
                    <h1 className="login-title">Login with Social</h1>
                    <SocialLogin />
                    {/* <div className="or-separator">
                        <span className="or-text">OR</span>
                    </div>
                    <LoginForm {...this.props} /> */}
                    {/* <span className="signup-link">아직 회원이 아니신가요? <Link to="/signup">Sign up!</Link></span> */}
                </div>
            </div>
        );
    }
}

class SocialLogin extends Component {
    render() {
        return (
            <div className="social-login">
                <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src={googleLogo} alt="Google" /> Google 계정으로 로그인</a>
                <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
                    <img src={githubLogo} alt="Github" /> Github 계정으로 로그인</a>
                <a className="btn btn-block social-btn kakao" href={KAKAO_AUTH_URL}>
                    <img src={kakaoLogo} alt="Kakao" /> Kakao 계정으로 로그인</a>
            </div>
        );
    }
}


// class LoginForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             email: '',
//             password: ''
//         };
//         this.handleInputChange = this.handleInputChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handleInputChange(event) {
//         const target = event.target;
//         const inputName = target.name;        
//         const inputValue = target.value;

//         this.setState({
//             [inputName] : inputValue
//         });        
//     }

//     handleSubmit(event) {
//         event.preventDefault();   

//         const loginRequest = Object.assign({}, this.state);

//         login(loginRequest) //요청
//         .then(response => {
//             localStorage.setItem(ACCESS_TOKEN, response.accessToken);
//             Alert.success("로그인에 성공하셨습니다!");
//             this.props.history.push("/");
//         }).catch(error => {
//             Alert.error((error && error.message) || 'Oops! Something went wrong. 다시 로그인해주세요!');
//         });
//     }
    
//     render() {
//         return (
//             <form onSubmit={this.handleSubmit}>
//                 <div className="form-item">
//                     <input type="email" name="email" 
//                         className="form-control" placeholder="Email"
//                         value={this.state.email} onChange={this.handleInputChange} required/>
//                 </div>
//                 <div className="form-item">
//                     <input type="password" name="password" 
//                         className="form-control" placeholder="Password"
//                         value={this.state.password} onChange={this.handleInputChange} required/>
//                 </div>
//                 <div className="form-item">
//                     <button type="submit" className="btn btn-block btn-primary">로그인</button>
//                 </div>
//             </form>                    
//         );
//     }
// }

export default Login
