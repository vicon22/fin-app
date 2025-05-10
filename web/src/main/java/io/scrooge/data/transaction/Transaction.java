package io.scrooge.data.transaction;

import io.scrooge.data.AbstractEntity;
import io.scrooge.data.bank.Bank;
import io.scrooge.data.category.TransactionCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "transactions")
public class Transaction extends AbstractEntity {
    private Long amount;
    private UUID category_id;
    private UUID project_id;
    private UUID consumer_bank_id;
    private UUID producer_bank_id;
    private String title;
    private String details;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)

    private TransactionState state;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "flow_type")
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "legal_type")
    private TransactionLegal legal;

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
    private LocalDate created;
}
