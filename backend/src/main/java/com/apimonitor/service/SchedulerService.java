package com.apimonitor.service;
import com.apimonitor.entity.Endpoint;
import com.apimonitor.job.EndpointPingJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulerService {
    private final Scheduler scheduler;

    public void scheduleEndpoint(Endpoint ep) {
        try {
            JobDetail job = JobBuilder.newJob(EndpointPingJob.class)
                .withIdentity(ep.getId().toString(), ep.getTenantId().toString())
                .usingJobData("endpointId", ep.getId().toString())
                .usingJobData("tenantId", ep.getTenantId().toString())
                .usingJobData("url", ep.getUrl())
                .usingJobData("name", ep.getName() != null ? ep.getName() : ep.getUrl())
                .storeDurably().build();

            Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger-" + ep.getId(), ep.getTenantId().toString())
                .withSchedule(SimpleScheduleBuilder
                    .repeatSecondlyForever(ep.getCheckIntervalSeconds()))
                .startNow().build();

            scheduler.scheduleJob(job, trigger);
            log.info("Scheduled endpoint: {}", ep.getUrl());
        } catch (SchedulerException e) {
            log.error("Failed to schedule endpoint {}: {}", ep.getUrl(), e.getMessage());
        }
    }

    public void unscheduleEndpoint(Endpoint ep) {
        try {
            scheduler.deleteJob(JobKey.jobKey(ep.getId().toString(), ep.getTenantId().toString()));
        } catch (SchedulerException e) {
            log.error("Failed to unschedule endpoint {}: {}", ep.getId(), e.getMessage());
        }
    }
}
