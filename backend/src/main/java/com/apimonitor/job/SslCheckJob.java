package com.apimonitor.job;
import com.apimonitor.repository.EndpointRepository;
import com.apimonitor.service.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import javax.net.ssl.*;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.time.*;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class SslCheckJob {
    private final EndpointRepository endpointRepo;
    private final AlertService alertService;

    @Scheduled(cron = "0 0 8 * * *")
    public void checkAllSslCerts() {
        endpointRepo.findAllByIsActiveTrue().forEach(ep -> {
            try {
                if (!ep.getUrl().startsWith("https")) return;
                String host = new URL(ep.getUrl()).getHost();
                SSLSocket socket = (SSLSocket) SSLSocketFactory.getDefault().createSocket(host, 443);
                socket.startHandshake();
                X509Certificate cert = (X509Certificate) socket.getSession().getPeerCertificates()[0];
                socket.close();
                long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(),
                    cert.getNotAfter().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                if (daysLeft <= 30)
                    alertService.sendSslExpiryAlert(ep.getTenantId(), ep.getName(), ep.getUrl(), daysLeft);
            } catch (Exception e) {
                log.warn("SSL check failed {}: {}", ep.getUrl(), e.getMessage());
            }
        });
    }
}
