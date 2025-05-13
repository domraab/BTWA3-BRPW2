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
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository, TeamRepository teamRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    // GET all projects with role-based filtering (M:N teams)
    @GetMapping
    public List<ProjectDTO> getAllProjects(Authentication auth) {
        User currentUser = userRepository.findByUsername(auth.getName());
        String role = currentUser.getRole().getName();

        if (role.equals("developer") || role.equals("tester")) {
            Set<Team> teams = currentUser.getTeams();
            if (teams == null || teams.isEmpty()) return List.of();
            return projectRepository.findByTeamIn(teams).stream()
                    .map(ProjectMapper::toDTO)
                    .collect(Collectors.toList());
        }

        return projectRepository.findAll().stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET project by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(proj -> ResponseEntity.ok(ProjectMapper.toDTO(proj)))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - create new project
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        User manager = null;
        if (projectDTO.getManagerId() != null) {
            manager = userRepository.findById(projectDTO.getManagerId()).orElse(null);
        }

        Team team = null;
        if (projectDTO.getTeamId() != null) {
            team = teamRepository.findById(projectDTO.getTeamId()).orElse(null);
        }

        Project project = ProjectMapper.toEntity(projectDTO, manager, team);
        Project saved = projectRepository.save(project);
        return ResponseEntity.ok(ProjectMapper.toDTO(saved));
    }

    // PUT - update project
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO dto) {
        return projectRepository.findById(id).map(existing -> {
            User manager = null;
            if (dto.getManagerId() != null) {
                manager = userRepository.findById(dto.getManagerId()).orElse(null);
            }

            Team team = null;
            if (dto.getTeamId() != null) {
                team = teamRepository.findById(dto.getTeamId()).orElse(null);
            }

            existing.setName(dto.getName());
            existing.setDescription(dto.getDescription());
            existing.setStatus(dto.getStatus());
            existing.setStartDate(dto.getStartDate());
            existing.setEndDate(dto.getEndDate());
            existing.setManager(manager);
            existing.setTeam(team);

            Project updated = projectRepository.save(existing);
            return ResponseEntity.ok(ProjectMapper.toDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH - update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return projectRepository.findById(id)
                    .map(proj -> {
                        proj.setStatus(body.get("status"));
                        projectRepository.save(proj);
                        return ResponseEntity.noContent().<String>build();
                    })
                    .orElse(ResponseEntity.notFound().<String>build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception při aktualizaci: " + e.getMessage());
        }
    }

    // DELETE project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
