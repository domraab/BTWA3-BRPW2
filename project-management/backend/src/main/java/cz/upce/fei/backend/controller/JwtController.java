// src/main/java/cz/upce/fei/backend/controller/JwtController.java
// Hlavní controller pro autentizaci pomocí JWT (login, registrace)
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
@RequestMapping("/api/auth") // URL prefix pro všechny endpointy v tomto controlleru
public class JwtController {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;

    // Konstruktor – dependency injection všech potřebných služeb a repozitářů
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

    // Endpoint pro přihlášení uživatele
    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody LoginRequest request) {
        // Najdeme uživatele podle uživatelského jména
        User user = userRepository.findByUsername(request.getUsername());

        // Pokud uživatel neexistuje nebo nesouhlasí heslo, vyhodíme výjimku
        if (user == null ||
                !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationCredentialsNotFoundException("Invalid credentials.");
        }

        // Vygenerujeme JWT token s rolí uživatele
        String role  = user.getRole().getName();
        String token = jwtService.generateToken(user.getUsername(), role);

        // Vracíme token a roli ve formátu JSON
        return ResponseEntity.ok(Map.of("token", token, "role", role));
    }

    // Endpoint pro registraci nového uživatele
    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> register(@RequestBody RegisterRequest req) {
        // Kontrola, zda uživatelské jméno již existuje
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error","Username already taken"));
        }

        // Kontrola, zda e-mail již existuje
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error","Email already registered"));
        }

        // Získáme výchozí roli "developer"
        Roles defaultRole = rolesRepository.findByName("developer")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        // Vytvoříme nového uživatele a zakódujeme heslo
        User user = new User(
                req.getUsername(),
                passwordEncoder.encode(req.getPassword()),
                req.getEmail(),
                req.getFullName(),
                req.getPhone(),
                req.getJobTitle(),
                defaultRole
        );

        // Uložíme uživatele do databáze
        userRepository.save(user);

        // Vygenerujeme JWT token pro nově zaregistrovaného uživatele
        String token = jwtService.generateToken(user.getUsername(), defaultRole.getName());

        // Vrátíme token a roli
        return ResponseEntity.ok(Map.of("token", token, "role", defaultRole.getName()));
    }

    // Vnitřní třída pro přihlašovací požadavek – DTO (Data Transfer Object)
    public static class LoginRequest {
        private String username;
        private String password;

        // Getter a setter pro uživatelské jméno
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        // Getter a setter pro heslo
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
