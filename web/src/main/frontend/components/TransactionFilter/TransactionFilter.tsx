import {
    HorizontalLayout,
    TextField,
    VerticalLayout,
    Select,
    Button,
    Icon,
    DatePicker,
    Popover,
    NumberField
} from '@vaadin/react-components';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import st from './transactionFilter.module.css';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import {STATE_PARAMS} from 'Frontend/domain/transactions/constants';
import { useMemo} from 'react';
import {TransactionFilterContext } from 'Frontend/domain/transactions/types';
import Bank from 'Frontend/generated/io/scrooge/data/bank/Bank';

type TransactionFilterProps = TransactionFilterContext & {
    banks: Bank[];
    categories: TransactionCategory[];
};

export function TransactionFilter(props: TransactionFilterProps) {
    const banksOptions = useMemo(() => (props.banks || []).map(item => ({
        label: item.name,
        value: item.id
    })), [props.banks]);

    return (
        <>
            <Button id="show-notifications" aria-label="Notifications" theme="icon">
                <Icon icon="vaadin:filter"/>
            </Button>

            <Popover
                for="show-notifications"
                theme="arrow no-padding"
                modal
                position='end-top'
                contentWidth="500px"
                accessibleNameRef="notifications-heading"
            >
                <VerticalLayout theme='spacing padding' className={st.filter}>
                    {/* <h5 className={st.subtitle}>Дата</h5> */}
                    {/* <HorizontalLayout theme='spacing' className={st.unit}>
                        <RadioGroup
                            value={props.settings.dateCompareMode.value}
                            onValueChanged={e => { 
                                props.settings.dateCompareMode.value = e.detail.value as TransactionFilterCompareMode;
                            }}
                        >
                            <RadioButton value={TransactionFilterCompareMode.EXACT} label='Точное совпадение'/>
                            <RadioButton value={TransactionFilterCompareMode.RANGE} label='Диапазон'/>
                        </RadioGroup>
                    </HorizontalLayout> */}

                    <HorizontalLayout theme='spacing' className={st.unit}>
                        <DatePicker
                            className={st.field}
                            label="Дата (от)"
                            value={props.criterions.dateStart.value}
                            onChange={e => { 
                                props.criterions.dateStart.value = e.target.value
                            }}
                        />
                        <DatePicker
                            className={st.field}
                            label="Дата (до)"
                            value={props.criterions.dateEnd.value}
                            onChange={e => { 
                                props.criterions.dateEnd.value = e.target.value
                            }}
                        />
                    </HorizontalLayout>


                    <HorizontalLayout theme='spacing' className={st.unit}>
                        <NumberField
                            className={st.field}
                            label="Сумма (от)"
                            value={String(props.criterions.amountStart.value / 100)}
                            onChange={e => { 
                                props.criterions.amountStart.value= +e.target.value * 100
                            }}
                        />
                        <NumberField
                            className={st.field}
                            label="Сумма (до)"
                            value={String(props.criterions.amountEnd.value / 100)}
                            onChange={e => { 
                                props.criterions.amountEnd.value= +e.target.value * 100
                            }}
                        />
                    </HorizontalLayout>

                    <HorizontalLayout theme='spacing' className={st.unit}>
                        <Select
                            label="Тип"
                            className={st.field}
                            items={[
                                {
                                    label: 'Все',
                                    value: 'all',
                                },
                                {
                                    value: TransactionType.INCOME,
                                    label: 'Поступление'
                                },
                                {
                                    value: TransactionType.EXPENSE,
                                    label: 'Расход'
                                }
                            ]}
                            value={props.criterions.type.value}
                            onValueChanged={(e) => {
                                props.criterions.type.value = e.detail.value;
                            }}
                        />
                    </HorizontalLayout>


                    <HorizontalLayout theme='spacing' className={st.unit}>
                        <TextField
                            className={st.field}
                            label="Название"
                            value={props.criterions.name.value}
                            onValueChanged={(e) => {
                                props.criterions.name.value = e.detail.value;
                            }}
                        />

                        <TextField
                            label="ИНН"
                            className={st.field}
                            value={props.criterions.tin.value}
                            onValueChanged={(e) => {
                                props.criterions.tin.value = e.detail.value;
                            }}
                        />
                    </HorizontalLayout>
            
                    <HorizontalLayout theme='spacing' className={st.unit}>
                        <Select
                            label="Статус"
                            className={st.field}
                            items={[
                                {
                                    label: 'Все',
                                    value: 'all',
                                },
                                ...Object.entries(STATE_PARAMS).map(([key, item]) => ({
                                    label: item.title,
                                    value: key,
                                }))
                            ]}
                            value={props.criterions.state.value}
                            onValueChanged={(e) => {
                                props.criterions.state.value = e.detail.value;
                            }}
                        />

                        <Select
                            label="Категория"
                            className={st.field}
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

                    <HorizontalLayout theme='spacing' className={st.unit}>
                        <Select
                            label="Банк получатель"
                            className={st.field}
                            items={[
                                {
                                    label: 'Все',
                                    value: 'all',
                                },
                                ...banksOptions
                            ]}
                            value={props.criterions.consumerBank.value}
                            onValueChanged={(e) => {
                                props.criterions.consumerBank.value = e.detail.value;
                            }}
                        />

                        <Select
                            label="Банк отправитель"
                            className={st.field}
                            items={[
                                {
                                    label: 'Все',
                                    value: 'all',
                                },
                                ...banksOptions
                            ]}
                            value={props.criterions.producedrBank.value}
                            onValueChanged={(e) => {
                                props.criterions.producedrBank.value = e.detail.value;
                            }}
                        />
                    </HorizontalLayout>
                </VerticalLayout>
            </Popover>
        </>
    )
};
