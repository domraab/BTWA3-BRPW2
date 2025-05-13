package cz.upce.fei.backend.mapper;

import cz.upce.fei.backend.dto.TaskDTO;
import cz.upce.fei.backend.entity.Project;
import cz.upce.fei.backend.entity.Task;
import cz.upce.fei.backend.entity.User;

public class TaskMapper {

    public static TaskDTO toDTO(Task task) {
        if (task == null) return null;

        Long projectId = task.getProjects() != null ? task.getProjects().getId() : null;
        Long assigneeId = task.getAssignee() != null ? task.getAssignee().getId() : null;
        Long teamId = task.getTeam() != null ? task.getTeam().getId() : null;

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate(),
                projectId,
                assigneeId,
                teamId
        );
    }

    public static Task toEntity(TaskDTO dto, Project project, User assignee) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setDueDate(dto.getDueDate());
        task.setProjects(project);
        task.setAssignee(assignee);
        //  Team assignment now handled in controller
        return task;
    }
}
