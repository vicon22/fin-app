package io.scrooge.services.project;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.project.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Endpoint
@AnonymousAllowed
public class ProjectEndpoint {
    @Autowired
    private ProjectService service;

    private void checkProjectOwnership(Optional<Project> project, UUID userId) {
        if (project.isPresent()) {
            if (!userId.equals(project.get().getUser_id())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Permission denied");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
    }

    public Project createProject(UUID userId, String name, UUID currencyId) {
        Project w = new Project();

        w.setUser_id(userId);
        w.setName(name);
        w.setCurrency_id(currencyId);

        return this.service.save(w);
    }

    public Optional<Project> getProject(UUID userId, UUID projectId) {
        try {
            Optional<Project> w = this.service.get(projectId);

            this.checkProjectOwnership(w, userId);

            return w;
        } catch (NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
    }

    public void deleteProject(UUID userId, UUID projectId) {
        Optional<Project> w = this.service.get(projectId);

        this.checkProjectOwnership(w, userId);

        this.service.delete(projectId);
    }
}
