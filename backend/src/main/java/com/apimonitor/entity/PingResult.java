package com.apimonitor.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Entity @Table(name="ping_results")
@NoArgsConstructor @AllArgsConstructor
public class PingResult {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="endpoint_id") private UUID endpointId;
    @Column(name="tenant_id") private UUID tenantId;
    private String status;
    @Column(name="latency_ms") private Integer latencyMs;
    @Column(name="checked_at") private LocalDateTime checkedAt = LocalDateTime.now();

    public PingResult(UUID endpointId, UUID tenantId, String status, Integer latencyMs) {
        this.endpointId=endpointId; this.tenantId=tenantId;
        this.status=status; this.latencyMs=latencyMs;
        this.checkedAt=LocalDateTime.now();
    }
}
