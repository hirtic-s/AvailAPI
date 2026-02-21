package com.apimonitor.service;
import com.apimonitor.entity.Endpoint;
import com.apimonitor.repository.EndpointRepository;
import com.apimonitor.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EndpointService {
    private final EndpointRepository endpointRepo;
    private final SchedulerService schedulerService;

    public List<Endpoint> getAll() {
        return endpointRepo.findAllByTenantId(UUID.fromString(TenantContext.getTenantId()));
    }

    public Endpoint create(Endpoint ep) {
        ep.setTenantId(UUID.fromString(TenantContext.getTenantId()));
        Endpoint saved = endpointRepo.save(ep);
        schedulerService.scheduleEndpoint(saved);
        return saved;
    }

    public void delete(UUID id) {
        Endpoint ep = endpointRepo.findById(id).orElseThrow();
        schedulerService.unscheduleEndpoint(ep);
        endpointRepo.delete(ep);
    }
}
