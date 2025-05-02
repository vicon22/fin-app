package io.scrooge.data.transaction.dto;

import java.util.UUID;

public record FlowCategoryCurrencySum(UUID category_id, UUID currency_id, long total) {
}