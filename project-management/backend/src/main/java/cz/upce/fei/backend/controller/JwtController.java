// src/main/java/cz/upce/fei/backend/controller/JwtController.java
package cz.upce.fei.backend.controller;

import cz.upce.fei.backend.entity.Roles;
import cz.upce.fei.backend.entity.User;
import cz.upce.fei.backend.jwt.JwtService;
import cz.upce.fei.backend.repository.RoleRepository;
import cz.upce.fei.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class JwtController {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public JwtController(JwtService jwtService,
                         UserRepository userRepository,
                         RoleRepository rolesRepository,
                         PasswordEncoder passwordEncoder) {
        this.jwtService      = jwtService;
        this.userRepository  = userRepository;
        this.rolesRepository = rolesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null ||
                !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationCredentialsNotFoundException("Invalid credentials.");
        }
        String role  = user.getRole().getName();
        String token = jwtService.generateToken(user.getUsername(), role);
        return ResponseEntity.ok(Map.of("token", token, "role", role));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error","Username already taken"));
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error","Email already registered"));
        }
        Roles defaultRole = rolesRepository.findByName("developer")
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        User user = new User(
                req.getUsername(),
                passwordEncoder.encode(req.getPassword()),
                req.getEmail(),
                req.getFullName(),
                req.getPhone(),
                req.getJobTitle(),
                defaultRole
        );
        userRepository.save(user);
        String token = jwtService.generateToken(user.getUsername(), defaultRole.getName());
        return ResponseEntity.ok(Map.of("token", token, "role", defaultRole.getName()));
    }

    // DTO for login (unchanged)
    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
