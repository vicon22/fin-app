import {HorizontalLayout, Select, TextField, VerticalLayout} from '@vaadin/react-components';
import {AutoGrid} from '@vaadin/hilla-react-crud';
import ExpenseFlow from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlow';
import IncomeFlow from 'Frontend/generated/io/scrooge/data/flow/IncomeFlow';
import IncomeFlowModel from 'Frontend/generated/io/scrooge/data/flow/IncomeFlowModel';
import {IncomeService} from 'Frontend/generated/endpoints';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {formatAmount} from 'Frontend/util/currency';
import {AddRecord} from './components/AddRecord/AddRecord';
import IncomeCategory from 'Frontend/generated/io/scrooge/data/category/IncomeCategory';
import st from './incomeList.module.css';
import AndFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter';
import Matcher from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter/Matcher';
import PropertyStringFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter';
import { useComputed, useSignal } from '@vaadin/hilla-react-signals';

type IncomeListProps = {
    project: Project | undefined;
    items: (ExpenseFlow | IncomeFlow)[];
    categories: IncomeCategory[];
    onCreate: (item: IncomeFlow) => void;
};

export function IncomeList(props: IncomeListProps) {
    const categoryFilterValue = useSignal('all');
    const nameFilterValue = useSignal('');

    const filter = useComputed(() => {
        const categoryFilter: PropertyStringFilter = {
          propertyId: 'category_id',
          filterValue: categoryFilterValue.value,
          matcher: Matcher.EQUALS,
          '@type': 'propertyString',
        };
      
        type NewType = PropertyStringFilter;

        const nameFilter: NewType = {
          propertyId: 'title',
          filterValue: nameFilterValue.value,
          matcher: Matcher.CONTAINS,
          '@type': 'propertyString',
        };

        const projectFilter: PropertyStringFilter = {
            propertyId: 'project_id',
            filterValue: String(props.project?.id),
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
    

    function renderAddControl(buttonText: string) {
        return (
            <AddRecord
                buttonText={buttonText}
                projectId={props.project?.id}
                onCreate={props.onCreate}
                categories={props.categories}
            />
        )
    };

    return (
        props.items.length
            ? (
                <VerticalLayout theme='spacing'>
                    {renderAddControl('Добавить доход')}

                    <HorizontalLayout theme='spacing'>
                        <TextField
                            label="Название"
                            value={nameFilterValue.value}
                            onValueChanged={(e) => {
                                nameFilterValue.value = e.detail.value;
                            }}
                        />
                        <Select
                            label="Категория"
                            items={[
                                {
                                    label: 'Все',
                                    value: 'all',
                                },
                                ...props.categories.map(item => ({
                                    label: item.title,
                                    value: item.id,
                                }))
                            ]}
                            value={categoryFilterValue.value}
                            onValueChanged={(e) => {
                                categoryFilterValue.value = e.detail.value;
                            }}
                        />
                    </HorizontalLayout>
                    <AutoGrid
                        service={IncomeService}
                        model={IncomeFlowModel}
                        experimentalFilter={filter.value}
                        noHeaderFilters
                        visibleColumns={['title', 'description', 'category_id', 'amount', 'created']}
                        columnOptions={{
                            title : {

                                header: 'Название',
                            },
                            amount: {
                                header: 'Сумма транзакции',
                                renderer: ({ item }: { item: ExpenseFlow }) => {
                                    return formatAmount(item.amount, props.project?.currency)
                                }
                            },
                            category_id: {
                                header: 'Категория',
                                width: '200px',
                                renderer: ({ item }: { item: ExpenseFlow }) => {
                                    const category = props.categories.find(category => category.id === item.category_id);

                                    return category?.title;
                                }
                            },
                            created: {
                                header: 'Дата создания',
                                renderer: ({ item }: { item: ExpenseFlow }) => {
                                    return (new Date(String(item.created))).toLocaleDateString('ru-RU');
                                }
                            },
                        }}
                    />
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>Доходов пока нет</h2>
                    <p>Создате первую запись о доходах</p>
                    {renderAddControl('Создать запись')}
                </div>
            )
    )
};
