package com.apimonitor.job;
import com.apimonitor.entity.*;
import com.apimonitor.repository.*;
import com.apimonitor.service.AlertService;
import com.apimonitor.tenant.TenantContext;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
public class EndpointPingJob implements Job {
    @Autowired private PingResultRepository pingRepo;
    @Autowired private IncidentRepository incidentRepo;
    @Autowired private AlertService alertService;

    @Override
    public void execute(JobExecutionContext ctx) {
        JobDataMap data = ctx.getMergedJobDataMap();
        UUID endpointId = UUID.fromString(data.getString("endpointId"));
        UUID tenantId   = UUID.fromString(data.getString("tenantId"));
        String url      = data.getString("url");
        String name     = data.getString("name");

        TenantContext.setTenantId(tenantId.toString());
        String status; int latency = -1;

        try {
            long start = System.currentTimeMillis();
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(5000); conn.setReadTimeout(5000);
            conn.connect();
            latency = (int)(System.currentTimeMillis() - start);
            status = conn.getResponseCode() < 400 ? "UP" : "DOWN";
            conn.disconnect();
        } catch (Exception e) {
            status = "TIMEOUT";
            log.warn("Ping failed {}: {}", url, e.getMessage());
        }

        pingRepo.save(new PingResult(endpointId, tenantId, status, latency));

        Optional<Incident> open = incidentRepo
            .findTopByEndpointIdAndResolvedAtIsNullOrderByStartedAtDesc(endpointId);

        if (!"UP".equals(status)) {
            if (open.isEmpty()) {
                Incident inc = new Incident();
                inc.setEndpointId(endpointId); inc.setTenantId(tenantId);
                inc.setStartedAt(LocalDateTime.now());
                incidentRepo.save(inc);
                alertService.sendDownAlert(tenantId, name, url);
            }
        } else {
            open.ifPresent(inc -> {
                inc.setResolvedAt(LocalDateTime.now());
                incidentRepo.save(inc);
                alertService.sendRecoveryAlert(tenantId, name, url);
            });
        }
        TenantContext.clear();
    }
}
