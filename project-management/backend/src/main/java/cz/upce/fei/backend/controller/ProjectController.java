// src/main/java/cz/upce/fei/backend/controller/ProjectController.java
package cz.upce.fei.backend.controller;

import cz.upce.fei.backend.dto.ProjectDTO;
import cz.upce.fei.backend.entity.Project;
import cz.upce.fei.backend.entity.Team;
import cz.upce.fei.backend.entity.User;
import cz.upce.fei.backend.mapper.ProjectMapper;
import cz.upce.fei.backend.repository.ProjectRepository;
import cz.upce.fei.backend.repository.TeamRepository;
import cz.upce.fei.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects") // Všechny endpointy budou začínat /api/projects
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    // Konstruktor – dependency injection repozitářů
    @Autowired
    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository, TeamRepository teamRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    // Získání všech projektů s ohledem na roli uživatele
    @GetMapping
    public List<ProjectDTO> getAllProjects(Authentication auth) {
        User currentUser = userRepository.findByUsername(auth.getName());
        String role = currentUser.getRole().getName();

        // Pokud je uživatel developer nebo tester, vidí jen projekty týmů, ve kterých je
        if (role.equals("developer") || role.equals("tester")) {
            Set<Team> teams = currentUser.getTeams();
            if (teams == null || teams.isEmpty()) return List.of();
            return projectRepository.findByTeamIn(teams).stream()
                    .map(ProjectMapper::toDTO)
                    .collect(Collectors.toList());
        }

        // Jinak (např. manager nebo admin) vidí všechny projekty
        return projectRepository.findAll().stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Získání jednoho projektu podle ID
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(proj -> ResponseEntity.ok(ProjectMapper.toDTO(proj)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Vytvoření nového projektu
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        // Načtení manažera projektu (pokud je zadaný)
        User manager = null;
        if (projectDTO.getManagerId() != null) {
            manager = userRepository.findById(projectDTO.getManagerId()).orElse(null);
        }

        // Načtení týmu (pokud je zadaný)
        Team team = null;
        if (projectDTO.getTeamId() != null) {
            team = teamRepository.findById(projectDTO.getTeamId()).orElse(null);
        }

        // Vytvoření a uložení entity projektu
        Project project = ProjectMapper.toEntity(projectDTO, manager, team);
        Project saved = projectRepository.save(project);

        // Vrácení uloženého projektu ve formě DTO
        return ResponseEntity.ok(ProjectMapper.toDTO(saved));
    }

    // Úprava existujícího projektu
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO dto) {
        return projectRepository.findById(id).map(existing -> {
            // Načtení manažera a týmu (pokud jsou zadáni)
            User manager = null;
            if (dto.getManagerId() != null) {
                manager = userRepository.findById(dto.getManagerId()).orElse(null);
            }

            Team team = null;
            if (dto.getTeamId() != null) {
                team = teamRepository.findById(dto.getTeamId()).orElse(null);
            }

            // Aktualizace údajů projektu
            existing.setName(dto.getName());
            existing.setDescription(dto.getDescription());
            existing.setStatus(dto.getStatus());
            existing.setStartDate(dto.getStartDate());
            existing.setEndDate(dto.getEndDate());
            existing.setManager(manager);
            existing.setTeam(team);

            // Uložení aktualizovaného projektu
            Project updated = projectRepository.save(existing);
            return ResponseEntity.ok(ProjectMapper.toDTO(updated));
        }).orElse(ResponseEntity.notFound().build()); // Projekt nenalezen
    }

    // Změna pouze stavu projektu (PATCH)
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return projectRepository.findById(id)
                    .map(proj -> {
                        // Nastavení nového stavu
                        proj.setStatus(body.get("status"));
                        projectRepository.save(proj);
                        return ResponseEntity.noContent().<String>build();
                    })
                    .orElse(ResponseEntity.notFound().<String>build()); // Projekt nenalezen
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception při aktualizaci: " + e.getMessage());
        }
    }

    // Smazání projektu podle ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        // Pokud projekt neexistuje, vrátí 404
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Jinak projekt smaže a vrátí 204
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
