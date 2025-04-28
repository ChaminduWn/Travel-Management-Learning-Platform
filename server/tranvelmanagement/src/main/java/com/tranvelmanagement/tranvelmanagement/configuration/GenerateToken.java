package com.tranvelmanagement.tranvelmanagement.configuration;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class GenerateToken {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(String id) {
        long expirationMillis = 1000L * 60 * 60 * 24 * 30; // 30 days

        return Jwts.builder()
                .setSubject(id)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
}