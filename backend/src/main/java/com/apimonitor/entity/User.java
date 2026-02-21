package com.apimonitor.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Entity @Table(name="users")
public class User {
    @Id @GeneratedValue @UuidGenerator private UUID id;
    @Column(name="tenant_id") private UUID tenantId;
    @Column(unique=true, nullable=false) private String email;
    @Column(name="password_hash", nullable=false) private String passwordHash;
    private String role = "MEMBER";
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
}
