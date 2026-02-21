package com.apimonitor.auth;
import com.apimonitor.tenant.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                TenantContext.setTenantId(jwtUtil.extractTenantId(token));
                var auth = new UsernamePasswordAuthenticationToken(
                    User.withUsername(jwtUtil.extractEmail(token)).password("").authorities(List.of()).build(),
                    null, List.of());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        try { chain.doFilter(req, res); }
        finally { TenantContext.clear(); }
    }
}
