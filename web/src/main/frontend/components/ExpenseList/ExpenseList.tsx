import {HorizontalLayout, TextField, VerticalLayout, Select} from '@vaadin/react-components';
import {AutoGrid} from '@vaadin/hilla-react-crud';
import ExpenseFlow from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlow';
import ExpenseFlowModel from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlowModel';
import IncomeFlow from 'Frontend/generated/io/scrooge/data/flow/IncomeFlow';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {formatAmount} from 'Frontend/util/currency';
import ExpenseCategory from 'Frontend/generated/io/scrooge/data/category/ExpenseCategory';
import {ExpenseService, TransactionService} from 'Frontend/generated/endpoints';
import {AddRecord} from './components/AddRecord/AddRecord';
import st from './expenseList.module.css';
import { useComputed, useSignal } from '@vaadin/hilla-react-signals';
import PropertyStringFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter';
import Matcher from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter/Matcher';
import AndFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import TransactionModel from 'Frontend/generated/io/scrooge/data/transaction/TransactionModel';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';

type ExpenseListProps = {
    project: Project | undefined;
    items: Transaction[];
    categories: TransactionCategory[];
    onCreate: (item: IncomeFlow) => void;
};

export function ExpenseList(props: ExpenseListProps) {
    const categoryFilterValue = useSignal('all');
    const nameFilterValue = useSignal('');

    const filter = useComputed(() => {
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
                    {renderAddControl('Добавить расход')}

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
                        service={TransactionService}
                        model={TransactionModel}
                        experimentalFilter={filter.value}
                        noHeaderFilters
                        visibleColumns={['title', 'description', 'category_id', 'amount', 'created']}
                        columnOptions={{
                            title : {
                                header: 'Название',
                            },
                            amount: {
                                header: 'Сумма транзакции',
                                renderer: ({ item }: { item: Transaction }) => {
                                    return formatAmount(item.amount, props.project?.currency)
                                }
                            },
                            category_id: {
                                header: 'Категория',
                                renderer: ({ item }: { item: Transaction }) => {
                                    return item.category?.title;
                                }
                            },
                            created: {
                                header: 'Дата создания',
                                renderer: ({ item }: { item: Transaction }) => {
                                    return (new Date(String(item.created))).toLocaleDateString('ru-RU');
                                }
                            },
                        }}
                    />
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>Расходов пока нет</h2>
                    <p>Создате первую запись о расходах</p>
                    {renderAddControl('Создать запись')}
                </div>
            )
    )
};
