package io.scrooge.services.project;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.project.Project;
import io.scrooge.data.project.ProjectRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class ProjectService extends CrudRepositoryService<Project, UUID, ProjectRepository> {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }
}
