package io.scrooge.data.flow;

import io.scrooge.data.category.ExpenseCategory;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "expenses")
public class ExpenseFlow extends BaseFlow {
    @OneToOne()
    @JoinColumn(insertable = false, updatable = false, name = "category_id", referencedColumnName = "id")
    private ExpenseCategory category;
}
