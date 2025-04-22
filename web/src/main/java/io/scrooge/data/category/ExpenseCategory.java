package io.scrooge.data.category;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "expense_categories")
public class ExpenseCategory extends BaseCategory {
}
