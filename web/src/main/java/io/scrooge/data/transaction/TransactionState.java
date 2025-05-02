package io.scrooge.data.transaction;

public enum TransactionState {
    INITIAL("initial"),
    PENDING("pending"),
    APPROVED("approved"),
    FULFILLED("fulfilled"),
    CANCELED("canceled"),
    DELETED("deleted"),
    RETURNED("returned");

    TransactionState(String s) {
    }
}


