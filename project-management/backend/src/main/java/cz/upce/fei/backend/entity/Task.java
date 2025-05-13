package cz.upce.fei.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private String status;

    @Column(name = "due_date")
    private LocalDate dueDate;

    /**
     * Více úkolů patří jednomu projektu (Many-to-One).
     * project_id nesmí být null (každý task musí mít projekt).
     */
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    /**
     * Kdo je přiřazen (assignee) – je to Many-to-One vůči User.
     * Může být i null, pokud úkol zatím nikdo nemá přiřazen.
     */
    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;


    // Konstruktory
    public Task() {
    }

    public Task(String title, String description, String status, LocalDate dueDate, Project project, User assignee) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
        this.project = project;
        this.assignee = assignee;
    }

    // gettery a settery

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

    public Project getProjects() {
        return project;
    }
    public void setProjects(Project project) {
        this.project = project;
    }

    public User getAssignee() {
        return assignee;
    }
    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}
