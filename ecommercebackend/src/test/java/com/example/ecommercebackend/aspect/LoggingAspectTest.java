package com.example.ecommercebackend.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoggingAspectTest {

    @InjectMocks
    private LoggingAspect loggingAspect;

    @Mock
    private ProceedingJoinPoint joinPoint;

    @Mock
    private Signature signature;

    @Test
    void logAround_ShouldProceedAndReturnResult() throws Throwable {
        // Arrange
        Object expectedResult = new Object();
        when(joinPoint.proceed()).thenReturn(expectedResult);
        lenient().when(joinPoint.getSignature()).thenReturn(signature);
        lenient().when(signature.getDeclaringTypeName()).thenReturn("TestClass");
        lenient().when(signature.getName()).thenReturn("testMethod");
        lenient().when(joinPoint.getArgs()).thenReturn(new Object[]{"arg1"});

        // Act
        Object actualResult = loggingAspect.logAround(joinPoint);

        // Assert
        assertEquals(expectedResult, actualResult);
        verify(joinPoint, times(1)).proceed();
    }
    
    @Test
    void logAround_ShouldThrowExceptionOnProceed_WhenExceptionIsThrown() throws Throwable {
        // Arrange
        IllegalArgumentException exception = new IllegalArgumentException("Test exception");
        when(joinPoint.proceed()).thenThrow(exception);
        lenient().when(joinPoint.getSignature()).thenReturn(signature);
        lenient().when(signature.getDeclaringTypeName()).thenReturn("TestClass");
        lenient().when(signature.getName()).thenReturn("testMethod");
        lenient().when(joinPoint.getArgs()).thenReturn(new Object[]{"arg1"});

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> loggingAspect.logAround(joinPoint));
        verify(joinPoint, times(1)).proceed();
    }
}
