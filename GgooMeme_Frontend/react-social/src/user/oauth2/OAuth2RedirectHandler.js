import React, { Component } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import { Redirect } from 'react-router-dom'

class OAuth2RedirectHandler extends Component {
    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    // requestKakaoAccessToken(code) {
    //     const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
    //     const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
    //     const KAKAO_APP_KEY = process.env.REACT_APP_KAKAO_API_KEY;

    //     fetch(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=http://localhost:3000/oauth2/callback/kakao&code=${code}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         localStorage.setItem(ACCESS_TOKEN, data.access_token);
    //         this.props.onLogin();
    //     })
    //     .catch(error => {
    //         console.error('Error fetching Kakao access token:', error);
    //     });
    // }

    render() {        
        const token = this.getUrlParameter('token');
        const error = this.getUrlParameter('error');

        if(token) {
            localStorage.setItem(ACCESS_TOKEN, token);
            this.props.onLogin();
            return <Redirect to={{
                pathname: "/", //유요한 토큰일 경우 메인페이지
                state: { from: this.props.location }
            }}/>; 
        } else {
            return <Redirect to={{
                pathname: "/login", //유효하지 않은 토큰이거나 오류 -> 로그인페이지
                state: { 
                    from: this.props.location,
                    error: error 
                }
            }}/>; 
        }
    }
}

export default OAuth2RedirectHandler;