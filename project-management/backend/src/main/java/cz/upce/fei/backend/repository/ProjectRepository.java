package cz.upce.fei.backend.repository;

import cz.upce.fei.backend.entity.Project;
import cz.upce.fei.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTeamIn(Set<Team> teams);
}
