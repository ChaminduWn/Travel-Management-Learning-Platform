package com.skillshare.skill_platform.service;

import com.skillshare.skill_platform.entity.User;
import com.skillshare.skill_platform.entity.UserProfile;
import com.skillshare.skill_platform.repository.UserProfileRepository;
import com.skillshare.skill_platform.repository.UserRepository;
import com.skillshare.skill_platform.security.OAuth2UserInfo;
import com.skillshare.skill_platform.security.OAuth2UserInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());
        
        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        try {
            System.out.println("Registering new user with email: " + oAuth2UserInfo.getEmail());
            
            User user = new User();
            user.setEmail(oAuth2UserInfo.getEmail());
            user.setName(oAuth2UserInfo.getName());
            user.setOauthProvider(oAuth2UserRequest.getClientRegistration().getRegistrationId());
            user.setOauthId(oAuth2UserInfo.getId());
            user = userRepository.save(user);
            System.out.println("Created new user with ID: " + user.getId());
            
            UserProfile userProfile = new UserProfile();
            userProfile.setUserId(user.getId());
            userProfile.setFullName(oAuth2UserInfo.getName());
            if (oAuth2UserInfo.getImageUrl() != null) {
                userProfile.setProfilePictureUrl(oAuth2UserInfo.getImageUrl());
            }
            userProfile = userProfileRepository.save(userProfile);
            System.out.println("Created UserProfile with ID: " + userProfile.getId());
            
            user.setUserProfile(userProfile);
            user = userRepository.save(user);
            System.out.println("Updated user with UserProfile: " + user.getId());
            
            return user;
        } catch (Exception e) {
            System.err.println("Error registering new user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to register new user", e);
        }
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        try {
            System.out.println("Updating existing user: " + existingUser.getId());
            
            existingUser.setName(oAuth2UserInfo.getName());
            
            UserProfile userProfile = existingUser.getUserProfile();
            if (userProfile == null) {
                System.out.println("Creating new UserProfile for existing user");
                userProfile = new UserProfile();
                userProfile.setUserId(existingUser.getId());
                userProfile = userProfileRepository.save(userProfile);
            }
            
            userProfile.setFullName(oAuth2UserInfo.getName());
            if (oAuth2UserInfo.getImageUrl() != null) {
                userProfile.setProfilePictureUrl(oAuth2UserInfo.getImageUrl());
            }
            
            userProfile = userProfileRepository.save(userProfile);
            System.out.println("Updated UserProfile: " + userProfile.getId());
            
            existingUser.setUserProfile(userProfile);
            existingUser = userRepository.save(existingUser);
            System.out.println("Updated user: " + existingUser.getId());
            
            return existingUser;
        } catch (Exception e) {
            System.err.println("Error updating existing user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update existing user", e);
        }
    }

    public static class CustomOAuth2User implements OAuth2User {
        private final User user;
        private final Map<String, Object> attributes;

        public CustomOAuth2User(User user, Map<String, Object> attributes) {
            this.user = user;
            this.attributes = attributes;
        }

        @Override
        public Map<String, Object> getAttributes() {
            return attributes;
        }

        @Override
        public java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
            return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
        }

        @Override
        public String getName() {
            return user.getId();
        }

        public User getUser() {
            return user;
        }
    }
}