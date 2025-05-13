package cz.upce.fei.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Objekt pro přenos dat (DTO) pro Task.
 */
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title can't be longer than 100 characters")
    private String title;

    @Size(max = 500, message = "Description can't be longer than 500 characters")
    private String description;

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDate dueDate;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long assigneeId;
    private Long teamId;

    public TaskDTO() {}

    public TaskDTO(Long id, String title, String description, String status,
                   LocalDate dueDate, Long projectId, Long assigneeId, Long teamId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
        this.projectId = projectId;
        this.assigneeId = assigneeId;
        this.teamId = teamId;
    }

    // Gettery a settery

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }
    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public Long getTeamId() {
        return teamId;
    }
    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
}
