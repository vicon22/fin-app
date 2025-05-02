package io.scrooge.data.transaction;

import io.scrooge.data.AbstractEntity;
import io.scrooge.data.bank.Bank;
import io.scrooge.data.category.ExpenseCategory;
import io.scrooge.data.category.IncomeCategory;
import io.scrooge.data.category.TransactionCategory;
import io.scrooge.data.flow.BaseFlow;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "transactions")
public class Transaction extends AbstractEntity {
    private int amount;
    private UUID category_id;
    private UUID project_id;
    private String title;
    private String details;
    private String state;
    private String flow_type;
    private String legal_type;

    private String producer_account;
    private String consumer_account;
    private String consumer_tin;
    private String consumer_tel;

    @OneToOne()
    @JoinColumn(insertable = false, updatable = false, name = "category_id", referencedColumnName = "id")
    private TransactionCategory category;

    @OneToOne()
    @JoinColumn(insertable = false, updatable = false, name = "consumer_bank_id", referencedColumnName = "id")
    private Bank consumer_bank;

    @OneToOne()
    @JoinColumn(insertable = false, updatable = false, name = "producer_bank_id", referencedColumnName = "id")
    private Bank producer_bank;

    @Column(insertable = false, updatable = false)
    private Date created;
}
