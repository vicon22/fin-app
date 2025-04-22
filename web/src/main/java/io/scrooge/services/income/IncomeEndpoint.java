package io.scrooge.services.income;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.flow.IncomeFlow;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

@Endpoint
@AnonymousAllowed
public class IncomeEndpoint {

    @Autowired
    private IncomeService service;

    public int getTotal(UUID projectId) {
        return this.service.totalByProject(projectId);
    }

    public List<IncomeFlow> getProjectIncomes(UUID projectId) {
        return this.service.listAllByProject(projectId);
    }

    public IncomeFlow create(UUID projectId, UUID categoryId, String title, int amount) {
        IncomeFlow e = new IncomeFlow();

        e.setProject_id(projectId);
        e.setAmount(amount);
        e.setTitle(title);
        e.setCategory_id(categoryId);

        return this.service.save(e);
    }
}
