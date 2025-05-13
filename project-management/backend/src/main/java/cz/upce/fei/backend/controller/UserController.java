package cz.upce.fei.backend.controller;

import cz.upce.fei.backend.dto.UserDTO;
import cz.upce.fei.backend.entity.User;
import cz.upce.fei.backend.mapper.UserMapper;
import cz.upce.fei.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository    userRepository;
    private final UserMapper        userMapper;
    private final PasswordEncoder   passwordEncoder;

    public UserController(UserRepository userRepository,
                          UserMapper     userMapper,
                          PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.userMapper      = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // ----------------------------------------------------
    // 1) Operace pro "manažery" – CRUD nad všemi uživateli
    // ----------------------------------------------------

    @GetMapping
    @PreAuthorize("hasRole('manager')")
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(userMapper.toDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Vytvoří nového uživatele (jen manager):
     * - zahashuje heslo
     * - nastaví roli z dto.getRole()
     */
    @PostMapping
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO dto) {
        // 1) Převod z DTO na entitu (včetně username, email aj. – bez hesla)
        User u = userMapper.toEntity(dto);

        // 2) Hash hesla
        u.setPassword(passwordEncoder.encode(dto.getPassword()));

        // 3) Uložení
        User saved = userRepository.save(u);

        // 4) Vrácení DTO (bez hesla)
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userMapper.toDTO(saved));
    }

    /**
     * Update existujícího uživatele (jen manager):
     * umožňuje i změnu hesla, pokud v DTO zadám password
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO dto
    ) {
        return userRepository.findById(id).map(existing -> {
            existing.setUsername(dto.getUsername());
            existing.setEmail(dto.getEmail());
            existing.setFullName(dto.getFullName());
            existing.setPhone(dto.getPhone());
            existing.setJobTitle(dto.getJobTitle());
            // Pokud chci také změnit roli:
            if (dto.getRole() != null) {
                existing.setRole(userMapper.resolveRole(dto.getRole()));
            }
            // Změna hesla (volitelně)
            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            User updated = userRepository.save(existing);
            return ResponseEntity.ok(userMapper.toDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('manager')")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // ----------------------------------------------------
    // 2) Operace pro aktuálně přihlášeného uživatele
    // ----------------------------------------------------

    /** Vrátí profil přihlášeného uživatele (včetně role). */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication auth) {
        User u = userRepository.findByUsername(auth.getName());
        if (u == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(userMapper.toDTO(u));  // DTO nyní obsahuje role
    }

    /** Upraví profil přihlášeného uživatele. */
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(
            Authentication auth,
            @RequestBody UserDTO dto
    ) {
        String username = auth.getName();
        User u = userRepository.findByUsername(username);
        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        u.setEmail(dto.getEmail());
        u.setFullName(dto.getFullName());
        u.setPhone(dto.getPhone());
        u.setJobTitle(dto.getJobTitle());
        // Změna hesla uživatelem
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        User saved = userRepository.save(u);
        return ResponseEntity.ok(userMapper.toDTO(saved));
    }
}
