package io.scrooge.data.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.scrooge.data.AbstractEntity;
import io.scrooge.data.project.Project;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Table(name = "users")
public class User extends AbstractEntity {
    private String username;
    private String name;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Role> roles;

    @OneToMany
    @JoinColumn(name = "user_id")
    @OrderBy("created ASC")
    private List<Project> projects;
}
