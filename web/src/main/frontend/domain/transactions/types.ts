import { ReadonlySignal, Signal } from "@vaadin/hilla-react-signals";
import AndFilter from "Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter";
import TransactionState from "Frontend/generated/io/scrooge/data/transaction/TransactionState";
import TransactionType from "Frontend/generated/io/scrooge/data/transaction/TransactionType";

export type SummaryByType = Record<TransactionType, number | undefined>;
export type SummaryByState = Record<TransactionState, number | undefined>;
export type SummaryByCategory = Record<string, Record<TransactionType, number | undefined> | undefined>;
export type SummaryByBank = Record<string, Record<string, number | undefined> | undefined>;


export enum TransactionFilterCompareMode {
    EXACT = 'exact',
    RANGE = 'range',
};

export type TransactionFilterContext = {
    filter: ReadonlySignal<AndFilter>,
    criterions: {
        name: Signal<string>;
        tin: Signal<string>;
        category: Signal<string>;
        state: Signal<string>;
        type: Signal<string>;
        dateStart: Signal<string>;
        dateEnd: Signal<string>;
        amountStart: Signal<number>;
        amountEnd: Signal<number>;
        producedrBank: Signal<string>,
        consumerBank: Signal<string>
    },
    settings: {
        dateCompareMode: Signal<TransactionFilterCompareMode>;
        amountCompareMode: Signal<TransactionFilterCompareMode>;
    }
}