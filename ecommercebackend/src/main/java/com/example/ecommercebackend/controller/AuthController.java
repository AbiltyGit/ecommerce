package com.example.ecommercebackend.controller;
import com.example.ecommercebackend.dto.request.LoginRequest;
import com.example.ecommercebackend.dto.request.RegisterRequest;
import com.example.ecommercebackend.dto.request.TokenRefreshRequest;
import com.example.ecommercebackend.dto.response.JwtResponse;
import com.example.ecommercebackend.dto.response.TokenRefreshResponse;
import com.example.ecommercebackend.model.RefreshToken;
import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.security.CustomUserDetails;
import com.example.ecommercebackend.security.JwtService;
import com.example.ecommercebackend.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder encoder, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager; this.userRepository = userRepository; this.encoder = encoder; this.jwtService = jwtService; this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String jwt = jwtService.generateJwtToken(authentication);
        List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUser().getId());
        return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(), userDetails.getUser().getId(), userDetails.getUsername(), userDetails.getUser().getEmail(), roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.findByUsername(signUpRequest.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        if (userRepository.findByEmail(signUpRequest.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        User user = new User();
        user.setUsername(signUpRequest.username());
        user.setEmail(signUpRequest.email());
        user.setPassword(encoder.encode(signUpRequest.password()));
        user.setRole(signUpRequest.role());
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.refreshToken();
        return refreshTokenService.findByToken(requestRefreshToken)
            .map(refreshTokenService::verifyExpiration)
            .map(RefreshToken::getUser)
            .map(user -> {
                String token = jwtService.generateJwtToken(new UsernamePasswordAuthenticationToken(new CustomUserDetails(user), null, new CustomUserDetails(user).getAuthorities()));
                return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
            })
            .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
