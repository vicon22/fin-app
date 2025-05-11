import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';

type SummaryByType = Record<TransactionType, number | undefined>;
type SummaryByCategory = Record<string, Record<TransactionType, number | undefined> | undefined>;