package com.construction.management;

import com.construction.management.entity.User;
import com.construction.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUser("admin", "admin123", User.Role.ADMIN);
        createUser("engineer", "engineer123", User.Role.ENGINEER);
        createUser("storemanager", "store123", User.Role.STORE_MANAGER);
    }

    private void createUser(String username, String password, User.Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
            System.out.println("Created user: " + username);
        }
    }
}
