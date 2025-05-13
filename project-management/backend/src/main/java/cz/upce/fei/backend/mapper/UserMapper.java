package cz.upce.fei.backend.mapper;

import cz.upce.fei.backend.dto.UserDTO;
import cz.upce.fei.backend.entity.Roles;
import cz.upce.fei.backend.entity.User;
import cz.upce.fei.backend.repository.RoleRepository;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final RoleRepository roleRepository;

    public UserMapper(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /** Převod entity → DTO */
    public UserDTO toDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getJobTitle(),
                /* heslo v DTO pro výpis nevracíme */ null,
                user.getRole() != null ? user.getRole().getName() : null
        );
    }

    /** Převod DTO → entity (bez hesla, bez role) */
    public User toEntity(UserDTO dto) {
        if (dto == null) return null;
        User u = new User();
        u.setId(dto.getId());
        u.setUsername(dto.getUsername());
        u.setEmail(dto.getEmail());
        u.setFullName(dto.getFullName());
        u.setPhone(dto.getPhone());
        u.setJobTitle(dto.getJobTitle());
        return u;
    }

    /** Nově: podle jména role vrátí entitu Roles (nebo vyhodí) */
    public Roles resolveRole(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + name));
    }
}
