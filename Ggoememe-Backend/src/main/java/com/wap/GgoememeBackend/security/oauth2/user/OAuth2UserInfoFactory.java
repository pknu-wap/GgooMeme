package com.wap.GgoememeBackend.security.oauth2.user;

import com.wap.GgoememeBackend.domain.AuthProvider;
import com.wap.GgoememeBackend.exception.OAuth2AuthenticationProcessingException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(OAuth2UserRequest oAuth2UserRequest, Map<String, Object> attributes) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();

        if(registrationId.equalsIgnoreCase(AuthProvider.google.toString())) {
            return new GoogleOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase(AuthProvider.facebook.toString())) {
            return new FacebookOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase(AuthProvider.github.toString())) {
            if(attributes.get("email")==null){
                 return new GithubOAuth2UserInfo(setAttributesGithubEmail(attributes,oAuth2UserRequest.getAccessToken().getTokenValue()));
            }
            return new GithubOAuth2UserInfo(attributes);
        } else {
            throw new OAuth2AuthenticationProcessingException("Sorry! Login with " + registrationId + " is not supported yet.");
        }
    }

    public static Map<String, Object> setAttributesGithubEmail(Map<String, Object> attributes, String accessToken){
        String email = getGithubEmail(accessToken);
        Map<String, Object> modifiedAttributes = new HashMap<>(attributes);
        modifiedAttributes.replace("email", email);
        return Collections.unmodifiableMap(new LinkedHashMap<>(modifiedAttributes));
    }

    public static String getGithubEmail(String accessToken){
        RestTemplate restTemplate = new RestTemplate();
        String api_url = "https://api.github.com/user/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer "+accessToken);
        HttpEntity request = new HttpEntity(headers);

        ResponseEntity<GithubEmailInfo[]> response = restTemplate.exchange(
                api_url,
                HttpMethod.GET,
                request,
                GithubEmailInfo[].class);

        return response.getBody()[0].getEmail();
    }
}
