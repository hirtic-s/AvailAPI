package com.apimonitor.service;
import com.apimonitor.entity.Tenant;
import com.apimonitor.entity.User;
import com.apimonitor.repository.TenantRepository;
import com.apimonitor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepo;
    private final TenantRepository tenantRepo;

    private List<String> getTenantEmails(UUID tenantId) {
        return userRepo.findAll().stream()
            .filter(u -> tenantId.equals(u.getTenantId()))
            .map(User::getEmail).toList();
    }

    public void sendDownAlert(UUID tenantId, String name, String url) {
        sendEmail(tenantId, "🔴 DOWN: " + name, "Your endpoint is DOWN.\nURL: " + url);
    }

    public void sendRecoveryAlert(UUID tenantId, String name, String url) {
        sendEmail(tenantId, "🟢 RECOVERED: " + name, "Your endpoint is back UP.\nURL: " + url);
    }

    public void sendSslExpiryAlert(UUID tenantId, String name, String url, long daysLeft) {
        sendEmail(tenantId, "⚠️ SSL Expiring: " + name,
            "SSL cert expires in " + daysLeft + " days.\nURL: " + url);
    }

    private void sendEmail(UUID tenantId, String subject, String body) {
        getTenantEmails(tenantId).forEach(email -> {
            try {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(email);
                msg.setSubject(subject);
                msg.setText(body);
                mailSender.send(msg);
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", email, e.getMessage());
            }
        });
    }
}
