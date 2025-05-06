import {HorizontalLayout, TextField, VerticalLayout, Select} from '@vaadin/react-components';
import {AutoGrid} from '@vaadin/hilla-react-crud';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {formatAmount} from 'Frontend/util/currency';
import {TransactionEndpoint, TransactionService} from 'Frontend/generated/endpoints';
import { useComputed, useSignal } from '@vaadin/hilla-react-signals';
import PropertyStringFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter';
import Matcher from 'Frontend/generated/com/vaadin/hilla/crud/filter/PropertyStringFilter/Matcher';
import AndFilter from 'Frontend/generated/com/vaadin/hilla/crud/filter/AndFilter';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import TransactionModel from 'Frontend/generated/io/scrooge/data/transaction/TransactionModel';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import { categoriesToOptions } from './utils';
import AddFlow from '../AddFlow/AddFlow';
import BanksController from 'Frontend/controllers/BanksController';
import st from './transactionList.module.css';
import TransactionLegal from 'Frontend/generated/io/scrooge/data/transaction/TransactionLegal';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import TransactionState from 'Frontend/generated/io/scrooge/data/transaction/TransactionState';
import { NavLink } from 'react-router';

type TransactionListProps = {
    project: Project | undefined;
    items: Transaction[];
    categories: TransactionCategory[];
    onCreate: (item: Transaction) => void;
};

export function TransactionList(props: TransactionListProps) {
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

            <BanksController>
                {(payload) => (
                    <AddFlow
                        disabled={payload.pending || payload.error}
                        banks={payload.data.banks || []}
                        title='Новая транзакция'
                        projectId={props.project?.id}
                        categories={categoriesToOptions(props.categories)}
                        create={TransactionEndpoint.create}
                        buttonText={buttonText}
                        onCreate={props.onCreate}
                    /> 
                )}
            </BanksController>
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
                        visibleColumns={[
                            'title',
                            'state',
                            'type',
                            'legal',
                            'description',
                            'category_id',
                            'amount', 
                            'created'
                        ]}
                        columnOptions={{
                            title : {
                                header: 'Название',
                                //
                                renderer: ({ item }: { item: Transaction }) => {
                                    const isExpense = item.type === TransactionType.EXPENSE;

                                    return (
                                        <NavLink
                                            to={`/projects/${props.project?.id}/transaction/${item.id}`}
                                        >
                                            {item.title}
                                        </NavLink>
                                    )
                                }
                            },
                            state : {
                                header: 'Состояние',
                                renderer: ({ item }: { item: Transaction }) => {
                                    const params = {
                                        [TransactionState.INITIAL]: { 
                                            title: 'Новая',
                                            className: st.initial
                                        },
                                        [TransactionState.PENDING]: {
                                            title: 'В процессе',
                                            className: st.pending
                                        },
                                        [TransactionState.FULFILLED]: {
                                            title: 'Выполнено',
                                            className: st.fulfilled
                                        },
                                        [TransactionState.DELETED]: {
                                            title: 'Удалено',
                                            className: st.deleted
                                        },
                                        [TransactionState.CANCELED]: {
                                            title: 'Отменена',
                                            className: st.canceled
                                        },
                                        [TransactionState.APPROVED]: {
                                            title: 'Утверждена',
                                            className: st.approved
                                        },
                                        [TransactionState.RETURNED]: {
                                            title: 'Возврат',
                                            className: st.returned
                                        },
                                    }

                                    const unit = params[item.state as TransactionState];

                                    return (
                                        <span className={unit.className}>
                                            {unit.title}
                                        </span>
                                    )
                                }
                            },

                            type : {
                                width: '150px',
                                header: 'Вид',
                                renderer: ({ item }: { item: Transaction }) => {
                                    const isExpense = item.type === TransactionType.EXPENSE;

                                    return (
                                        <span {...{ theme: isExpense ? 'badge error' : 'badge success' }}>
                                            {isExpense ? 'Расход' : 'Поступление'}
                                        </span>
                                    )
                                }
                            },
                            legal : {
                                header: 'Тип лица',
                                renderer: ({ item }: { item: Transaction }) => {
                                    return item.legal === TransactionLegal.LEGAL ? "Юр." : "Физ."
                                }
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
