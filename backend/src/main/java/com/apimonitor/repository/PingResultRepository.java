package com.apimonitor.repository;
import com.apimonitor.entity.PingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.*;

public interface PingResultRepository extends JpaRepository<PingResult, Long> {
    List<PingResult> findTop100ByEndpointIdOrderByCheckedAtDesc(UUID endpointId);

    @Query("SELECT p FROM PingResult p WHERE p.endpointId = :endpointId AND p.checkedAt >= :since ORDER BY p.checkedAt ASC")
    List<PingResult> findByEndpointIdSince(UUID endpointId, LocalDateTime since);

    PingResult findTopByEndpointIdOrderByCheckedAtDesc(UUID endpointId);
}
