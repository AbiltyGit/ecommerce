package com.example.ecommercebackend.config;

import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.model.enums.UserRole;
import com.example.ecommercebackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setEmail("admin@example.com");
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);
            System.out.println("Mock Admin user created: admin / admin");
        }

        if (userRepository.findByUsername("corporate").isEmpty()) {
            User corporate = new User();
            corporate.setUsername("corporate");
            corporate.setPassword(passwordEncoder.encode("corporate"));
            corporate.setEmail("corporate@example.com");
            corporate.setRole(UserRole.CORPORATE);
            userRepository.save(corporate);
            System.out.println("Mock Corporate user created: corporate / corporate");
        }

        if (userRepository.findByUsername("individual").isEmpty()) {
            User individual = new User();
            individual.setUsername("individual");
            individual.setPassword(passwordEncoder.encode("individual"));
            individual.setEmail("individual@example.com");
            individual.setRole(UserRole.INDIVIDUAL);
            userRepository.save(individual);
            System.out.println("Mock Individual user created: individual / individual");
        }
    }
}
