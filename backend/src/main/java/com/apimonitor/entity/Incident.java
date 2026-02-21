package com.apimonitor.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Entity @Table(name="incidents")
public class Incident {
    @Id @GeneratedValue @UuidGenerator private UUID id;
    @Column(name="endpoint_id") private UUID endpointId;
    @Column(name="tenant_id") private UUID tenantId;
    @Column(name="started_at") private LocalDateTime startedAt;
    @Column(name="resolved_at") private LocalDateTime resolvedAt;
    @Column(name="alert_sent") private boolean alertSent = false;
}
