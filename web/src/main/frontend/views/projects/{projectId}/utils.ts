import { STATE_PARAMS } from 'Frontend/domain/transactions/constants';
import {SummaryByCategory, SummaryByState, SummaryByType} from 'Frontend/domain/transactions/types';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import TransactionState from 'Frontend/generated/io/scrooge/data/transaction/TransactionState';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';

export function getSummaryByTypeChartData(input: SummaryByType) {
    return {
        labels: ['Доходы', 'Расходы'],
        datasets: [{
            data: [
                input[TransactionType.INCOME],
                input[TransactionType.EXPENSE]
            ],
            backgroundColor: [
                'hsla(145, 72%, 31%, 0.5)',
                'hsla(3, 85%, 49%, 0.5)',
            ],
        }],
    }
}


export function getSummaryByStateChartData(input: SummaryByState) {
    return {
        labels: Object.values(STATE_PARAMS).map(item => item.title),
        datasets: [{
            data: Object.keys(STATE_PARAMS).map(key => input[key as TransactionState]),
            backgroundColor: Object.values(STATE_PARAMS).map(item => item.color),
        }],
    }
}

export function getSummaryByCategoryChartData(input: SummaryByCategory, categories: TransactionCategory[]) {
    const income = {
        label: 'Доходы',
        data: [] as number[],
        backgroundColor: 'hsla(145, 72%, 31%, 0.5)',
    };

    const expense = {
        label: 'Расходы',
        data: []  as number[],
        backgroundColor: 'hsla(3, 85%, 49%, 0.5)',
    };

    const result = {
        labels: Object.keys(input).map(id => { 
            const category = categories.find(cat => cat.id == id);
            return category?.title || id;
        }),
        datasets: [
            expense,
            income,
        ]
    };

    for (const unit of Object.values(input)) {
        for(const [type, value] of Object.entries(unit || {})) {
            const target = type === TransactionType.INCOME ? income : expense;

            target.data.push((value || 0) / 100);
        }
    }

    return result;
}