package cz.upce.fei.backend.controller;

import cz.upce.fei.backend.dto.TaskDTO;
import cz.upce.fei.backend.entity.Project;
import cz.upce.fei.backend.entity.Task;
import cz.upce.fei.backend.entity.Team;
import cz.upce.fei.backend.entity.User;
import cz.upce.fei.backend.mapper.TaskMapper;
import cz.upce.fei.backend.repository.ProjectRepository;
import cz.upce.fei.backend.repository.TaskRepository;
import cz.upce.fei.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskController(TaskRepository taskRepository,
                          ProjectRepository projectRepository,
                          UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<TaskDTO> getAllTasks(Authentication auth) {
        User currentUser = userRepository.findByUsername(auth.getName());
        String role = currentUser.getRole().getName();

        if (role.equals("developer") || role.equals("tester")) {
            Set<Long> teamIds = currentUser.getTeams().stream()
                    .map(Team::getId)
                    .collect(Collectors.toSet());

            return taskRepository.findAll().stream()
                    .filter(task ->
                            task.getProjects() != null &&
                                    task.getProjects().getTeam() != null &&
                                    teamIds.contains(task.getProjects().getTeam().getId()))
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
        }

        return taskRepository.findAll().stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(task -> ResponseEntity.ok(TaskMapper.toDTO(task)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody @Valid TaskDTO dto) {
        Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
        if (project == null) return ResponseEntity.badRequest().build();

        User assignee = null;
        if (dto.getAssigneeId() != null) {
            assignee = userRepository.findById(dto.getAssigneeId()).orElse(null);
        }

        Task task = TaskMapper.toEntity(dto, project, assignee);
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(TaskMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody @Valid TaskDTO dto) {
        return taskRepository.findById(id).map(existing -> {
            Project project = projectRepository.findById(dto.getProjectId()).orElse(null);
            if (project == null) return ResponseEntity.badRequest().build();

            User assignee = null;
            if (dto.getAssigneeId() != null) {
                assignee = userRepository.findById(dto.getAssigneeId()).orElse(null);
            }

            existing.setTitle(dto.getTitle());
            existing.setDescription(dto.getDescription());
            existing.setStatus(dto.getStatus());
            existing.setDueDate(dto.getDueDate());
            existing.setProjects(project);
            existing.setAssignee(assignee);

            Task updated = taskRepository.save(existing);
            return ResponseEntity.ok(TaskMapper.toDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return taskRepository.findById(id).map(task -> {
                String newStatus = body.get("status");
                if (newStatus == null || newStatus.isBlank()) {
                    return ResponseEntity.badRequest().body("Missing status");
                }
                task.setStatus(newStatus);
                taskRepository.save(task);
                return ResponseEntity.noContent().<String>build();
            }).orElse(ResponseEntity.status(404).body("Task not found"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal error: " + e.getMessage());
        }
    }

    @GetMapping("/project/{projectId}")
    public List<TaskDTO> getTasksByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }
}
