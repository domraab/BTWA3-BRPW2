package cz.upce.fei.backend.mapper;

import cz.upce.fei.backend.dto.ProjectDTO;
import cz.upce.fei.backend.entity.Project;
import cz.upce.fei.backend.entity.Team;
import cz.upce.fei.backend.entity.User;

public class ProjectMapper {

    public static ProjectDTO toDTO(Project project) {
        if (project == null) {
            return null;
        }

        Long managerId = project.getManager() != null ? project.getManager().getId() : null;
        Long teamId = project.getTeam() != null ? project.getTeam().getId() : null;

        return new ProjectDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getStartDate(),
                project.getEndDate(),
                managerId,
                teamId
        );
    }

    public static Project toEntity(ProjectDTO dto, User manager, Team team) {
        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setManager(manager);
        project.setTeam(team);
        return project;
    }
}
