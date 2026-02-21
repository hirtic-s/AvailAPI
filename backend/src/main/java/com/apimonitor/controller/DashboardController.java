package com.apimonitor.controller;
import com.apimonitor.repository.IncidentRepository;
import com.apimonitor.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final IncidentRepository incidentRepo;

    @GetMapping("/incidents")
    public ResponseEntity<?> incidents() {
        return ResponseEntity.ok(
            incidentRepo.findAllByTenantIdOrderByStartedAtDesc(
                UUID.fromString(TenantContext.getTenantId())));
    }
}
