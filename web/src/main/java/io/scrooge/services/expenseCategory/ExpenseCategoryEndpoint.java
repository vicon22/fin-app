package io.scrooge.services.expenseCategory;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.category.ExpenseCategory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class ExpenseCategoryEndpoint {

    @Autowired
    private ExpenseCategoryService service;

    public List<ExpenseCategory> getAll() {
        return this.service.getAll();
    }

    public ExpenseCategory create(String title, String description) {
        ExpenseCategory category = new ExpenseCategory();

        category.setTitle(title);
        category.setDescription(description);

        return this.service.save(category);
    }
}
