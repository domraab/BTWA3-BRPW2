// src/main/java/cz/upce/fei/backend/entity/Roles.java
package cz.upce.fei.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Jedna role může být přiřazena mnoha uživatelům.
     */
    @OneToMany(mappedBy = "role")
    private List<User> users = new ArrayList<>();

    public Roles() {}

    public Roles(String name) {
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<User> getUsers() { return users; }
    public void setUsers(List<User> users) { this.users = users; }
}
