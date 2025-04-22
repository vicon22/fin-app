package io.scrooge.data.category;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "income_categories")
public class IncomeCategory extends BaseCategory {
}
