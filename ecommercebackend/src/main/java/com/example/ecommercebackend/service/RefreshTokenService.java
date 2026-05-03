package com.example.ecommercebackend.service;
import com.example.ecommercebackend.model.RefreshToken;
import com.example.ecommercebackend.repository.RefreshTokenRepository;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
@Service
public class RefreshTokenService {
    @Value("${jwt.refreshExpirationMs:2592000000}")
    private Long refreshTokenDurationMs;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository; this.userRepository = userRepository;
    }
    public Optional<RefreshToken> findByToken(String token) { return refreshTokenRepository.findByToken(token); }
    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        // Delete any existing token for this user to avoid unique constraint violations
        refreshTokenRepository.deleteByUserId(userId);
        refreshTokenRepository.flush();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found")));
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(refreshToken);
    }
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }
    @Transactional
    public void deleteByUserId(Long userId) { refreshTokenRepository.deleteByUserId(userId); }
}
