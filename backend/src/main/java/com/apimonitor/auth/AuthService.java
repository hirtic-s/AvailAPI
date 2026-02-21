package com.apimonitor.auth;
import com.apimonitor.entity.*;
import com.apimonitor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final TenantRepository tenantRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public Map<String,String> register(RegisterRequest req) {
        if (tenantRepo.existsBySlug(req.getSlug())) throw new RuntimeException("Slug already taken");
        if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email already registered");

        Tenant tenant = new Tenant();
        tenant.setName(req.getTeamName());
        tenant.setSlug(req.getSlug());
        tenantRepo.save(tenant);

        User user = new User();
        user.setTenantId(tenant.getId());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole("OWNER");
        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getId().toString(), tenant.getId().toString(), user.getEmail());
        return Map.of("token", token, "slug", tenant.getSlug(), "email", user.getEmail());
    }

    public Map<String,String> login(AuthRequest req) {
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) throw new RuntimeException("Invalid credentials");
        Tenant tenant = tenantRepo.findById(user.getTenantId()).orElseThrow();
        String token = jwtUtil.generateToken(user.getId().toString(), user.getTenantId().toString(), user.getEmail());
        return Map.of("token", token, "slug", tenant.getSlug(), "email", user.getEmail());
    }
}
