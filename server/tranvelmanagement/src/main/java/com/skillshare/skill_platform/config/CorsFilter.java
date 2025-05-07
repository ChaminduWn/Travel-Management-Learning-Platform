package com.skillshare.skill_platform.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
        "http://localhost:5173", 
        "http://localhost:3000"
    );
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        System.out.println("CORS Filter: Processing request " + request.getMethod() + " " + request.getRequestURI());
        
        String origin = request.getHeader("Origin");
        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }
        
        // For WebSocket handshake requests
        if (isWebSocketRequest(request)) {
            System.out.println("CORS Filter: WebSocket request detected");
            response.setHeader("Access-Control-Allow-Headers", 
                "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-xsrf-token, Cache-Control, Pragma, Upgrade, Connection, Sec-WebSocket-Version, Sec-WebSocket-Key, Sec-WebSocket-Extensions");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, UPGRADE");
            response.setHeader("Access-Control-Expose-Headers", "Upgrade, Connection, Sec-WebSocket-Accept");
        } else {
            // Regular HTTP requests
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", 
                "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-xsrf-token, Cache-Control, Pragma");
        }
        
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Expose-Headers", 
                "Authorization, Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Credentials");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            System.out.println("CORS Filter: Handling OPTIONS request - returning 200 OK");
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }

    private boolean isWebSocketRequest(HttpServletRequest request) {
        String connection = request.getHeader("Connection");
        String upgrade = request.getHeader("Upgrade");
        return "websocket".equalsIgnoreCase(upgrade) && 
               connection != null && connection.toLowerCase().contains("upgrade");
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("CORS Filter initialized");
    }

    @Override
    public void destroy() {
    }
}