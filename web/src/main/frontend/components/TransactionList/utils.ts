import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';

export function categoriesToOptions(categories: TransactionCategory[]) {
    return (categories || []).map(item => ({
        label: item.title,
        value: item.id
    }));
}