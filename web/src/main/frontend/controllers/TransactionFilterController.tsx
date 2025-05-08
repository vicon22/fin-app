import { ReadonlySignal, Signal, useComputed, useSignal } from "@vaadin/hilla-react-signals";
import AndFilter from "Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter";
import PropertyStringFilter from "Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter";
import Matcher from "Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter/Matcher";
import { memo, ReactNode } from "react";
import { useParams } from "react-router";

type TransactionFilterController = {
    children: (payload: {
        filter: ReadonlySignal<AndFilter>,
        criterions: {
            name: Signal<string>;
            category: Signal<string>
        }
    }) => ReactNode;
}

export const TransactionFilterController = memo(function TransactionFilterController(props: TransactionFilterController) {
    const {projectId} = useParams();
    const categoryFilterValue = useSignal('all');
    const nameFilterValue = useSignal('');

    console.log('TransactionFilterController', categoryFilterValue.value);

    const state = useComputed(() => {
        const categoryFilter: PropertyStringFilter = {
          propertyId: 'category_id',
          filterValue: categoryFilterValue.value,
          matcher: Matcher.EQUALS,
          '@type': 'propertyString',
        };
      
        const nameFilter: PropertyStringFilter = {
          propertyId: 'title',
          filterValue: nameFilterValue.value,
          matcher: Matcher.CONTAINS,
          '@type': 'propertyString',
        };

        const projectFilter: PropertyStringFilter = {
            propertyId: 'project_id',
            filterValue: String(projectId),
            matcher: Matcher.EQUALS,
            '@type': 'propertyString',
        };
      
        const filter: AndFilter = {
            '@type': 'and',
            children: [
                nameFilter,
                projectFilter,
                
            ].filter(Boolean),
        };

        if (categoryFilterValue.value !== 'all') { 
            filter.children.push(categoryFilter);
        }
      
        return filter;
    });

    return props.children({
        filter: state,
        criterions: {
            name: nameFilterValue,
            category: categoryFilterValue
        }
    });
});