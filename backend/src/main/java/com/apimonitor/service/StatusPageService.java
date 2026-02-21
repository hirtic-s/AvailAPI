package com.apimonitor.service;
import com.apimonitor.entity.*;
import com.apimonitor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StatusPageService {
    private final TenantRepository tenantRepo;
    private final EndpointRepository endpointRepo;
    private final PingResultRepository pingRepo;
    private final IncidentRepository incidentRepo;

    public Map<String, Object> getStatusPage(String slug) {
        Tenant tenant = tenantRepo.findBySlug(slug).orElseThrow(() -> new RuntimeException("Team not found"));
        List<Endpoint> endpoints = endpointRepo.findAllByTenantId(tenant.getId());

        List<Map<String, Object>> endpointStatuses = endpoints.stream().map(ep -> {
            PingResult latest = pingRepo.findTopByEndpointIdOrderByCheckedAtDesc(ep.getId());
            List<PingResult> last24h = pingRepo.findByEndpointIdSince(ep.getId(), LocalDateTime.now().minusHours(24));

            long upCount = last24h.stream().filter(p -> "UP".equals(p.getStatus())).count();
            double uptime = last24h.isEmpty() ? 100.0 : (upCount * 100.0 / last24h.size());
            double avgLatency = last24h.stream()
                .filter(p -> p.getLatencyMs() != null && p.getLatencyMs() >= 0)
                .mapToInt(PingResult::getLatencyMs).average().orElse(0);

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", ep.getId());
            m.put("name", ep.getName());
            m.put("url", ep.getUrl());
            m.put("status", latest != null ? latest.getStatus() : "UNKNOWN");
            m.put("uptimePercent", Math.round(uptime * 100.0) / 100.0);
            m.put("avgLatencyMs", Math.round(avgLatency));
            return m;
        }).toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("teamName", tenant.getName());
        result.put("slug", tenant.getSlug());
        result.put("endpoints", endpointStatuses);
        result.put("incidents", incidentRepo.findAllByTenantIdOrderByStartedAtDesc(tenant.getId()));
        return result;
    }
}
