import React, { Component } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import { Redirect } from 'react-router-dom'

class OAuth2RedirectHandler extends Component {
    //url에서 token 추출
    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');//대괄호 이스케이프 처리
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'); //정규표현식

        var results = regex.exec(this.props.location.search); //정규표현식에 해당하는 패턴 찾기
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

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