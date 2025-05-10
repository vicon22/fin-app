import { STATE_PARAMS } from 'Frontend/domain/transactions/constants';
import {SummaryByBank, SummaryByCategory, SummaryByState, SummaryByType} from 'Frontend/domain/transactions/types';
import Bank from 'Frontend/generated/io/scrooge/data/bank/Bank';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import TransactionState from 'Frontend/generated/io/scrooge/data/transaction/TransactionState';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';

export function getSummaryByTypeChartData(input: SummaryByType) {
    return {
        labels: ['Доходы', 'Расходы'],
        datasets: [{
            data: [
                (input[TransactionType.INCOME] || 0) / 100,
                (input[TransactionType.EXPENSE] || 0) / 100
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

export function getSummaryByBankChartData(input: SummaryByBank, banks: Bank[]) {
    const producerEntries = Object.keys(input).map(id => ({
        id,
        name: banks.find(bank => bank.id === id)?.name || id,
        value: (input[id]?.['producer'] || 0) / 100
    }));
    
    const consumerEntries = Object.keys(input).map(id => ({
        id,
        name: banks.find(bank => bank.id === id)?.name || id,
        value: (input[id]?.['consumer'] || 0) / 100
    }));

    producerEntries.sort((a, b) => b.value - a.value);
    consumerEntries.sort((a, b) => a.value - b.value);
    const combinedEntries = [...producerEntries, ...consumerEntries];
    const uniqueIds = new Set<string>();
    const uniqueEntries = combinedEntries.filter(entry => {
        if (uniqueIds.has(entry.id)) {
            return false;
        }
        uniqueIds.add(entry.id);
        return true;
    });
    
    const producer = {
        label: 'Отправитель',
        data: [] as number[],
        backgroundColor: 'hsla(211, 90%, 50%, 0.5)',
    };

    const consumer = {
        label: 'Получатель',
        data: [] as number[],
        backgroundColor: 'hsla(271, 90%, 50%, 0.5)',
    };

    const result = {
        labels: uniqueEntries.map(entry => entry.name),
        datasets: [
            producer,
            consumer,
        ]
    };

    uniqueEntries.forEach(entry => {
        const unit = input[entry.id];
        if (unit) {
            producer.data.push((unit['producer'] || 0) / 100);
            consumer.data.push((unit['consumer'] || 0) / 100);
        }
    });

    return result;
}