package cz.upce.fei.backend.repository;

import cz.upce.fei.backend.entity.Task;
import cz.upce.fei.backend.entity.Team;
import cz.upce.fei.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTeamIn(Set<Team> teams);
    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignee(User assignee);
}
