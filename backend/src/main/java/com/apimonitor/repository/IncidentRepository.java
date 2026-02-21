package com.apimonitor.repository;
import com.apimonitor.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    Optional<Incident> findTopByEndpointIdAndResolvedAtIsNullOrderByStartedAtDesc(UUID endpointId);
    List<Incident> findAllByTenantIdOrderByStartedAtDesc(UUID tenantId);
}
