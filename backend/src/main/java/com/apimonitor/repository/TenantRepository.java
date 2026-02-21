package com.apimonitor.repository;
import com.apimonitor.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
