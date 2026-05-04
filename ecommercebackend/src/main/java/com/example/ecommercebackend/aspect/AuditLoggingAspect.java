package com.example.ecommercebackend.aspect;

import com.example.ecommercebackend.model.AuditLog;
import com.example.ecommercebackend.repository.AuditLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLoggingAspect {

    private final AuditLogRepository auditLogRepository;

    public AuditLoggingAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Pointcut("@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
              "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
              "@annotation(org.springframework.web.bind.annotation.DeleteMapping) || " +
              "@annotation(org.springframework.web.bind.annotation.PatchMapping)")
    public void writeOperations() {}

    @AfterReturning("writeOperations()")
    public void logAfter(JoinPoint joinPoint) {
        String username = "System/Anonymous";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            username = auth.getName(); // email
        }

        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String details = "Executed " + className + "." + methodName;

        AuditLog log = new AuditLog("WRITE_OPERATION", username, details);
        auditLogRepository.save(log);
    }
}
