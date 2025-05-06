package io.scrooge.services.transactionCategory;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.category.TransactionCategory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class TransactionCategoryEndpoint {

    @Autowired
    private TransactionCategoryService service;

    public List<TransactionCategory> getAll() {
        return this.service.getAll();
    }

    public TransactionCategory create(String title, String description) {
        TransactionCategory category = new TransactionCategory();

        category.setTitle(title);
        category.setDescription(description);

        return this.service.save(category);
    }
}
