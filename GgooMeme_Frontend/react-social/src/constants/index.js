//export const API_BASE_URL = 'https://port-0-ggoomeme-2aat2clunucjsg.sel5.cloudtype.app';
export const API_BASE_URL = 'https://backendu.com';
export const ACCESS_TOKEN = 'accessToken';

export const OAUTH2_REDIRECT_URI = 'http://localhost:3000/oauth2/redirect';
//export const OAUTH2_REDIRECT_URI = 'https://web-ggoomeme-1pgyr2mlvkuyw16.sel5.cloudtype.app/oauth2/redirect';

export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorization/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/oauth2/authorization/github?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const KAKAO_AUTH_URL = API_BASE_URL + '/oauth2/authorization/kakao?redirect_uri=' + OAUTH2_REDIRECT_URI;