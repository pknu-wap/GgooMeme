//API 서버의 기본 URL
export const API_BASE_URL = 'https://backendu.com';
export const ACCESS_TOKEN = 'accessToken';

//로컬
//export const OAUTH2_REDIRECT_URI = 'http://localhost:3000/oauth2/redirect';
//프로덕션
export const OAUTH2_REDIRECT_URI = 'https://web-ggoomeme-1pgyr2mlvkuyw16.sel5.cloudtype.app/oauth2/redirect';

//OAuth2 인증 URL
export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorization/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/oauth2/authorization/github?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const KAKAO_AUTH_URL = API_BASE_URL + '/oauth2/authorization/kakao?redirect_uri=' + OAUTH2_REDIRECT_URI;