// src/main/java/cz/upce/fei/backend/controller/TeamController.java
package cz.upce.fei.backend.controller;

import cz.upce.fei.backend.dto.TeamDTO;
import cz.upce.fei.backend.dto.UserDTO;
import cz.upce.fei.backend.entity.Project;
import cz.upce.fei.backend.entity.Team;
import cz.upce.fei.backend.entity.User;
import cz.upce.fei.backend.mapper.UserMapper;
import cz.upce.fei.backend.repository.ProjectRepository;
import cz.upce.fei.backend.repository.TeamRepository;
import cz.upce.fei.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams") // Základní cesta pro práci s týmy
public class TeamController {

    @Autowired private TeamRepository teamRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserMapper userMapper;

    // Získání všech týmů jako seznam DTO objektů
    @GetMapping
    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream().map(team -> new TeamDTO(
                team.getId(),
                team.getName(),
                team.getMembers().stream().map(User::getId).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }

    // Získání členů konkrétního týmu podle ID
    @GetMapping("/{id}/members")
    public List<UserDTO> getTeamMembers(@PathVariable Long id) {
        return teamRepository.findById(id)
                .map(team -> team.getMembers().stream()
                        .map(userMapper::toDTO)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    // Přidání člena do týmu – pouze pro manažera
    @PreAuthorize("hasRole('manager')")
    @PatchMapping("/{teamId}/add-member/{userId}")
    public ResponseEntity<?> addMemberToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (teamOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); // Tým nebo uživatel neexistuje
        }

        Team team = teamOpt.get();
        User user = userOpt.get();

        // Pokud uživatel není v týmu, přidáme ho
        if (!team.getMembers().contains(user)) {
            team.getMembers().add(user);
            teamRepository.save(team);
        }

        return ResponseEntity.ok().build();
    }

    // Odebrání člena z týmu – pouze pro manažera
    @PreAuthorize("hasRole('manager')")
    @PatchMapping("/{teamId}/remove-member/{userId}")
    public ResponseEntity<?> removeMemberFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (teamOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); // Tým nebo uživatel neexistuje
        }

        Team team = teamOpt.get();
        User user = userOpt.get();

        // Pokud je uživatel v týmu, odebereme ho
        if (team.getMembers().contains(user)) {
            team.getMembers().remove(user);
            teamRepository.save(team);
        }

        return ResponseEntity.ok().build();
    }

    // Vytvoření nového týmu a přiřazení členů – pouze pro manažera
    @PreAuthorize("hasRole('manager')")
    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO dto) {
        // Načteme uživatele podle jejich ID
        List<User> users = userRepository.findAllById(dto.getMemberIds());

        // Vytvoření a uložení týmu
        Team team = new Team(dto.getName());
        team.setMembers(users);
        Team saved = teamRepository.save(team);

        // Vrácení DTO odpovědi
        List<Long> memberIds = saved.getMembers().stream()
                .map(User::getId)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new TeamDTO(saved.getId(), saved.getName(), memberIds));
    }

    // Přiřazení týmu ke konkrétnímu projektu – pouze pro manažera
    @PreAuthorize("hasRole('manager')")
    @PostMapping("/assign-to-project/{projectId}/{teamId}")
    public ResponseEntity<?> assignTeamToProject(@PathVariable Long projectId, @PathVariable Long teamId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        Optional<Team> teamOpt = teamRepository.findById(teamId);

        if (projectOpt.isEmpty() || teamOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); // Projekt nebo tým nenalezen
        }

        // Přiřazení týmu projektu a uložení změny
        Project project = projectOpt.get();
        Team team = teamOpt.get();

        project.setTeam(team);
        projectRepository.save(project);

        return ResponseEntity.ok().build();
    }
    @PreAuthorize("hasRole('manager')")
    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            return ResponseEntity.notFound().build();
        }
        teamRepository.deleteById(teamId);
        return ResponseEntity.noContent().build();
    }
}
