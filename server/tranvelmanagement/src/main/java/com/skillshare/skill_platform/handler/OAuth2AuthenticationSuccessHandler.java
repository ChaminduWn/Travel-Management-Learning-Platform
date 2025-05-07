package com.skillshare.skill_platform.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.oauth2.authorizedRedirectUris}")
    private String[] authorizedRedirectUris;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                        Authentication authentication) throws IOException, ServletException {
        try {
            System.out.println("=== OAuth2 Authentication Success Handler ===");
            
            String token = UUID.randomUUID().toString();
            System.out.println("OAuth2 Authentication Success for user: " + authentication.getName());
            
            Object principal = authentication.getPrincipal();
            String userId = null;
            
            if (principal instanceof OAuth2User) {
                OAuth2User oauth2User = (OAuth2User) principal;
                System.out.println("OAuth2User attributes: " + oauth2User.getAttributes());
                userId = oauth2User.getName();
            }
            
            String redirectUrl = UriComponentsBuilder.fromUriString(authorizedRedirectUris[0])
                    .queryParam("token", token)
                    .queryParam("userId", userId)
                    .build().toUriString();
            
            System.out.println("Redirecting to: " + redirectUrl);
            
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception e) {
            System.err.println("Error in OAuth2 authentication success handler: " + e.getMessage());
            e.printStackTrace();
            
            String redirectUrl = UriComponentsBuilder.fromUriString(authorizedRedirectUris[0])
                    .queryParam("error", "Authentication failed: " + e.getMessage())
                    .build().toUriString();
            
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        }
    }
}