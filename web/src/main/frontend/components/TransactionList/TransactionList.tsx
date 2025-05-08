import {HorizontalLayout, TextField, VerticalLayout, Select} from '@vaadin/react-components';
import {AutoGrid} from '@vaadin/hilla-react-crud';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {formatAmount} from 'Frontend/util/currency';
import {TransactionEndpoint, TransactionService} from 'Frontend/generated/endpoints';
import { ReadonlySignal, Signal, useComputed, useSignal } from '@vaadin/hilla-react-signals';
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
import { useEffect } from 'react';
import { STATE_PARAMS } from 'Frontend/domain/transactions/constants';

type TransactionListProps = {
    filter: ReadonlySignal<AndFilter>,
    criterions: {
        name: Signal<string>;
        category: Signal<string>
    }
    project: Project | undefined;
    items: Transaction[];
    categories: TransactionCategory[];
    onCreate: (item: Transaction) => void;
};

export function TransactionList(props: TransactionListProps) {
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
                            value={props.criterions.name.value}
                            onValueChanged={(e) => {
                                props.criterions.name.value = e.detail.value;
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
                            value={props.criterions.category.value}
                            onValueChanged={(e) => {
                                props.criterions.category.value = e.detail.value;
                            }}
                        />
                    </HorizontalLayout>

                    <AutoGrid
                        service={TransactionService}
                        model={TransactionModel}
                        experimentalFilter={props.filter.value}
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
                                renderer: ({ item }: { item: Transaction }) => {
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
                                    const unit = STATE_PARAMS[item.state as TransactionState];

                                    return (
                                        <span style={{ color: unit.color }}>
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
                                    return formatAmount(item.amount || 0, props.project?.currency)
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
