import TransactionState from "Frontend/generated/io/scrooge/data/transaction/TransactionState";
import TransactionType from "Frontend/generated/io/scrooge/data/transaction/TransactionType";

export type SummaryByType = Record<TransactionType, number | undefined>;
export type SummaryByState = Record<TransactionState, number | undefined>;
export type SummaryByCategory = Record<string, Record<TransactionType, number | undefined> | undefined>;