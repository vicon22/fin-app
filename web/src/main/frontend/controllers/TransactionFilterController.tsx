import { useComputed, useSignal } from '@vaadin/hilla-react-signals';
import { format,  subDays, } from 'date-fns';
import { TransactionFilterCompareMode, TransactionFilterContext } from 'Frontend/domain/transactions/types';
import AndFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter';
import PropertyStringFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter';
import Matcher from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter/Matcher';
import { memo, ReactNode } from 'react';
import { useParams } from 'react-router';

type TransactionFilterController = {
    children: (payload: TransactionFilterContext) => ReactNode;
}

export const TransactionFilterController = memo(function TransactionFilterController(props: TransactionFilterController) {
    const {projectId} = useParams();
    const categoryFilterValue = useSignal('all');
    const typeFilterValue = useSignal('all');
    const stateFilterValue = useSignal('all');
    const consumerBankFilterValue = useSignal('all');
    const producerBankFilterValue = useSignal('all');
    const nameFilterValue = useSignal('');
    const tinFilterValue = useSignal('');

    const dateStart = useSignal('1900-01-01');
    const dateEnd = useSignal(format(new Date(), 'yyyy-MM-dd'));

    const amountStart = useSignal(0);
    const amountEnd = useSignal(99999999);

    const dateCompareMode = useSignal<TransactionFilterCompareMode>(TransactionFilterCompareMode.RANGE);
    const amountCompareMode = useSignal<TransactionFilterCompareMode>(TransactionFilterCompareMode.RANGE);

    const state = useComputed(() => {
        const categoryFilter: PropertyStringFilter = {
            propertyId: 'category_id',
            filterValue: categoryFilterValue.value,
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
        };

        const consumerBankFilter: PropertyStringFilter = {
            propertyId: 'consumer_bank_id',
            filterValue: consumerBankFilterValue.value,
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
        };

        const producerBankFilter: PropertyStringFilter = {
            propertyId: 'producer_bank_id',
            filterValue: producerBankFilterValue.value,
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
        };

        const typeFilter: PropertyStringFilter = {
            propertyId: 'type',
            filterValue: typeFilterValue.value,
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
          };

          const stateFilter: PropertyStringFilter = {
            propertyId: 'state',
            filterValue: stateFilterValue.value,
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
          };
      
        const nameFilter: PropertyStringFilter = {
            propertyId: 'title',
            filterValue: nameFilterValue.value,
            matcher: Matcher.CONTAINS,
            '@type': 'propertyString',
        };

        const tinFilter: PropertyStringFilter = {
            propertyId: 'consumer_tin',
            filterValue: tinFilterValue.value,
            matcher: Matcher.CONTAINS,
            '@type': 'propertyString',
        };

        const projectFilter: PropertyStringFilter = {
            propertyId: 'project_id',
            filterValue: String(projectId),
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
        };

        const dateExactFilter: PropertyStringFilter = {
            propertyId: 'created',
            filterValue: dateStart.value,
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
        };

        const dateLowerFilter: PropertyStringFilter = {
            propertyId: 'created',
            filterValue: dateStart.value,
            matcher: Matcher.GREATER_THAN,
            '@type': 'propertyString',
        };

        const dateGreaterFilter: PropertyStringFilter = {
            propertyId: 'created',
            filterValue: dateEnd.value,
            matcher: Matcher.LESS_THAN,
            '@type': 'propertyString',
        };

        const amountExactFilter: PropertyStringFilter = {
            propertyId: 'amount',
            filterValue: String(amountStart.value),
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
        };

        const amountLowerFilter: PropertyStringFilter = {
            propertyId: 'amount',
            filterValue: String(amountStart.value),
            matcher: Matcher.GREATER_THAN,
            '@type': 'propertyString',
        };

        const amountGreaterFilter: PropertyStringFilter = {
            propertyId: 'amount',
            filterValue: String(amountEnd.value),
            matcher: Matcher.LESS_THAN,
            '@type': 'propertyString',
        };

        const filter: AndFilter = {
            '@type': 'and',
            children: [
                nameFilter,
                tinFilter,
                projectFilter,
            ],
        };

        if (dateCompareMode.value === TransactionFilterCompareMode.EXACT) {
            filter.children.push(dateExactFilter);
        } else {
            filter.children.push(dateGreaterFilter);
            filter.children.push(dateLowerFilter);
        }

        if (amountCompareMode.value === TransactionFilterCompareMode.EXACT) {
            filter.children.push(amountExactFilter);
        } else {
            filter.children.push(amountGreaterFilter);
            filter.children.push(amountLowerFilter);
        }

        if (categoryFilterValue.value !== 'all') { 
            filter.children.push(categoryFilter);
        }

        if (typeFilterValue.value !== 'all') { 
            filter.children.push(typeFilter);
        }

        if (stateFilterValue.value !== 'all') { 
            filter.children.push(stateFilter);
        }

        if (consumerBankFilterValue.value !== 'all') { 
            filter.children.push(consumerBankFilter);
        }

        if (producerBankFilterValue.value !== 'all') { 
            filter.children.push(producerBankFilter);
        }
      
        return filter;
    });

    return props.children({
        filter: state,
        criterions: {
            name: nameFilterValue,
            tin: tinFilterValue,
            state: stateFilterValue,
            type: typeFilterValue,
            category: categoryFilterValue,
            dateStart,
            dateEnd,
            amountStart,
            amountEnd,
            producedrBank: producerBankFilterValue,
            consumerBank: consumerBankFilterValue
        },
        settings: {
            dateCompareMode,
            amountCompareMode
        }
    });
});