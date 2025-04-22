package io.scrooge.data.flow;

import io.scrooge.data.category.IncomeCategory;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "incomes")
public class IncomeFlow extends BaseFlow {
    @OneToOne()
    @JoinColumn(insertable = false, updatable = false, name = "category_id", referencedColumnName = "id")
    private IncomeCategory category;
}
