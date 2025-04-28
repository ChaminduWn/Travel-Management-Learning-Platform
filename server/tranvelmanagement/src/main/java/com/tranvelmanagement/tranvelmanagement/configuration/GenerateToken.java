package com.tranvelmanagement.tranvelmanagement.configuration;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class GenerateToken {

    private static final String SECRET_KEY = System.getenv("JWT_SECRET");

    public static String generateToken(String id) {
        long expirationMillis = 1000L * 60 * 60 * 24 * 30; // 30 days

        return Jwts.builder()
                .setSubject(id)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}
