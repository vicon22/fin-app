package io.scrooge.services.incomeCategory;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.category.IncomeCategory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class IncomeCategoryEndpoint {

    @Autowired
    private IncomeCategoryService service;

    public List<IncomeCategory> getAll() {
        return this.service.getAll();
    }

    public IncomeCategory create(String title, String description) {
        IncomeCategory category = new IncomeCategory();

        category.setTitle(title);
        category.setDescription(description);

        return this.service.save(category);
    }
}
