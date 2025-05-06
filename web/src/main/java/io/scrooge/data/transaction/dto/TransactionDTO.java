package io.scrooge.data.transaction.dto;

import io.scrooge.data.transaction.TransactionLegal;
import io.scrooge.data.transaction.TransactionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Builder
@Getter
@Setter
public class TransactionDTO {
    private Long amount;
    private UUID category_id;
    private UUID project_id;
    private String title;
    private String details;
    private TransactionType type;
    private TransactionLegal legal;
    private String producer_account;
    private String consumer_account;
    private String consumer_tin;
    private String consumer_tel;
    private UUID consumer_bank_id;
    private UUID producer_bank_id;
    private Date created;
}