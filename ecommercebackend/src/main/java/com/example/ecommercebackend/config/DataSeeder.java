package com.example.ecommercebackend.config;

import com.example.ecommercebackend.model.Store;
import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.model.CustomerProfile;
import com.example.ecommercebackend.model.enums.UserRole;
import com.example.ecommercebackend.repository.StoreRepository;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.repository.CustomerProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, 
                      StoreRepository storeRepository, 
                      CustomerProfileRepository customerProfileRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.customerProfileRepository = customerProfileRepository;
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
            User savedCorporate = userRepository.save(corporate);

            // Create a store for the corporate user
            Store store = new Store();
            store.setName("Corporate Official Store");
            store.setDescription("Main store managed by corporate user");
            store.setOpen(true);
            store.setCorporateUser(savedCorporate);
            storeRepository.save(store);

            // Enrich with profile
            CustomerProfile profile = new CustomerProfile();
            profile.setUser(savedCorporate);
            profile.setCity("Istanbul");
            profile.setGender("Male");
            profile.setAge(35);
            profile.setMembershipType("Premium");
            profile.setTotalSpend(new BigDecimal("15000.00"));
            profile.setItemsPurchased(45);
            profile.setAvgRating(4.8);
            profile.setSatisfactionLevel(5);
            customerProfileRepository.save(profile);

            System.out.println("Mock Corporate user AND Store created: corporate / corporate");
        }

        if (userRepository.findByUsername("individual").isEmpty()) {
            User individual = new User();
            individual.setUsername("individual");
            individual.setPassword(passwordEncoder.encode("individual"));
            individual.setEmail("individual@example.com");
            individual.setRole(UserRole.INDIVIDUAL);
            User savedIndividual = userRepository.save(individual);

            // Enrich with profile
            CustomerProfile profile = new CustomerProfile();
            profile.setUser(savedIndividual);
            profile.setCity("Ankara");
            profile.setGender("Female");
            profile.setAge(28);
            profile.setMembershipType("Silver");
            profile.setTotalSpend(new BigDecimal("2500.50"));
            profile.setItemsPurchased(12);
            profile.setAvgRating(4.2);
            profile.setSatisfactionLevel(4);
            customerProfileRepository.save(profile);

            System.out.println("Mock Individual user created: individual / individual");
        }
    }
}
