package io.scrooge.services.income;

import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.crud.CrudRepositoryService;
import io.scrooge.data.flow.IncomeFlow;
import io.scrooge.data.flow.IncomeFlowRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@BrowserCallable
@Service
@RolesAllowed("USER")
public class IncomeService extends CrudRepositoryService<IncomeFlow, UUID, IncomeFlowRepository> {

    private final IncomeFlowRepository repository;

    public IncomeService(IncomeFlowRepository repository) {
        this.repository = repository;
    }

    public List<IncomeFlow> listAllByProject(UUID projectId) {
        return this.repository.findAllByProjectId(projectId);
    }

    public int totalByProject(UUID projectId) {
        return this.repository.totalByProjectId(projectId);
    }
}
