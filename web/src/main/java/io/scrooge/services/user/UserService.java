package io.scrooge.services.user;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.user.User;
import io.scrooge.data.user.UserRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("ADMIN")
public class UserService extends CrudRepositoryService<User, UUID, UserRepository> {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
