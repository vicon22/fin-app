import { UnionCategory } from './types';

export function categoriesToOptions(categories: UnionCategory[]) {
    return (categories || []).map(item => ({
        label: item.title,
        value: item.id
    }));
}