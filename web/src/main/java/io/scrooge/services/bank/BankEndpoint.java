package io.scrooge.services.bank;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import io.scrooge.data.bank.Bank;
import io.scrooge.data.category.ExpenseCategory;
import io.scrooge.services.expenseCategory.ExpenseCategoryService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class BankEndpoint {

    @Autowired
    private BankService service;

    public List<Bank> getAll() {
        return this.service.getAll();
    }
}
