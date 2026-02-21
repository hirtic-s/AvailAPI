package com.apimonitor.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Entity @Table(name="endpoints")
public class Endpoint {
    @Id @GeneratedValue @UuidGenerator private UUID id;
    @Column(name="tenant_id", nullable=false) private UUID tenantId;
    private String name;
    @Column(nullable=false) private String url;
    @Column(name="check_interval_seconds") private int checkIntervalSeconds = 60;
    @Column(name="is_active") private boolean isActive = true;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
}
