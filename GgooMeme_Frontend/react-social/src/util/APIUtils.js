import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

export const request = async (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    const response = await fetch(options.url, options);
    const text = await response.text();

    let json;
    try {
        json = JSON.parse(text);
    } catch (error) {
        json = text; // JSON 파싱에 실패하면 평문 그대로 반환
    }

    if (!response.ok) {
        return Promise.reject(json);
    }
    return json;
};

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
        //현재 사용자가 로그인되어 있지 않다면 액세스 토큰이 설정되어 있지 않다는 메시지를 반환
    }

    return request({
        url: API_BASE_URL + "/mypage/info",
        method: 'GET'
    });
    //이 함수는 현재 로그인한 사용자의 정보를 가져오는 API를 호출
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

// export const fetchPostData = (page, order) => {
//     return request({
//         url: API_BASE_URL + `/post/main/${page}/${order}`,
//         method: "GET",
//     });
// };

export const fetchImagesByHashtags = (hashtag, page) => {
    return request({
      url: API_BASE_URL + `/post/search/${hashtag}/${page + 1}`,
      method: "GET",
    });
  };

  export function relatedImages(Id, page) {
    return request({
        url: API_BASE_URL + `/post/related/${Id}/${page}`,
        method: "GET",
    });
  };

