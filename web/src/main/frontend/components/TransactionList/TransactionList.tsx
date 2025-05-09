import {HorizontalLayout, VerticalLayout, Button, Icon} from '@vaadin/react-components';
import {AutoGrid, AutoGridRef} from '@vaadin/hilla-react-crud';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {formatAmount} from 'Frontend/util/currency';
import {TransactionEndpoint, TransactionService} from 'Frontend/generated/endpoints';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import TransactionModel from 'Frontend/generated/io/scrooge/data/transaction/TransactionModel';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import {categoriesToOptions} from './utils';
import AddFlow from '../AddFlow/AddFlow';
import BanksController from 'Frontend/controllers/BanksController';
import st from './transactionList.module.css';
import TransactionLegal from 'Frontend/generated/io/scrooge/data/transaction/TransactionLegal';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import TransactionState from 'Frontend/generated/io/scrooge/data/transaction/TransactionState';
import {NavLink} from 'react-router';
import {STATE_PARAMS} from 'Frontend/domain/transactions/constants';
import { useRef } from 'react';
import { TransactionFilterContext } from 'Frontend/domain/transactions/types';
import { TransactionFilter } from '../TransactionFilter/TransactionFilter';

type TransactionListProps = TransactionFilterContext & {
    project: Project | undefined;
    items: Transaction[];
    categories: TransactionCategory[];
    onCreate: (item: Transaction) => void;
};

export function TransactionList(props: TransactionListProps) {
    const gridRef = useRef<AutoGridRef>(null);

    function renderToolbar(buttonText: string, needFilter?: boolean) {
        return (
            <BanksController>
                {(payload) => {
                    return (
                        <VerticalLayout theme='spacing'>
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

                            {needFilter && (
                                <TransactionFilter
                                    filter={props.filter}
                                    criterions={props.criterions}
                                    settings={props.settings}
                                    categories={props.categories}
                                    banks={payload.data.banks}
                                />
                            )}
                        </VerticalLayout>
                    )
                }}
            </BanksController>
        )
    };

    return (
        props.items.length
            ? (
                <VerticalLayout theme='spacing'>
                    {renderToolbar('Добавить транзакцию', true)}

                    <AutoGrid
                        ref={gridRef}
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
                                    const ediatable = STATE_PARAMS[item.state as TransactionState].editable;

                                    return (
                                        <HorizontalLayout className={st.name}>
                                            <Button
                                                theme="icon small secondary error"
                                                aria-label="Удалить"
                                                disabled={!ediatable}
                                                onClick={() => {
                                                    TransactionEndpoint.markDeleted(item.id).then(() => {
                                                        gridRef.current?.refresh()
                                                    })
                                                }}
                                            >
                                                <Icon icon="vaadin:close-small" />
                                            </Button>
                                            <NavLink
                                                to={`/projects/${props.project?.id}/transaction/${item.id}`}
                                            >
                                                {item.title}
                                            </NavLink>
                                        </HorizontalLayout>
                                        
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
                    <h2>Транзакций пока нет</h2>
                    <p>Создате первую запись</p>
                    {renderToolbar('Создать транзакцию')}
                </div>
            )
    )
};
