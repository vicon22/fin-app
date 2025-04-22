package io.scrooge.data.flow.dto;

import java.util.UUID;

public record ExpenseFlowCategoryCurrencySum(UUID category_id, UUID currency_id, long total) {
}