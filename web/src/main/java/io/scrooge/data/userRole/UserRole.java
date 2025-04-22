package io.scrooge.data.userRole;

import io.scrooge.data.AbstractEntity;
import io.scrooge.data.user.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Entity
@Getter
@Table(name = "users_roles")
public class UserRole extends AbstractEntity {
    private Role role;
    private UUID user_id;
}
