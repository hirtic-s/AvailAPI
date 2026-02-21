package com.apimonitor.repository;
import com.apimonitor.entity.Endpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface EndpointRepository extends JpaRepository<Endpoint, UUID> {
    List<Endpoint> findAllByTenantId(UUID tenantId);
    List<Endpoint> findAllByIsActiveTrue();
}
