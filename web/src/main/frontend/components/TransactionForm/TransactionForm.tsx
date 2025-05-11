import {
    HorizontalLayout,
    NumberField,
    SelectItem,
    TextField,
    VerticalLayout,
    RadioButton,
    RadioGroup,
    DatePicker,
    Select,
    TextArea
} from '@vaadin/react-components';
import {format} from 'date-fns';
import st from './transactionForm.module.css';
import TransactionLegal from 'Frontend/generated/io/scrooge/data/transaction/TransactionLegal';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import TransactionDTOModel from 'Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTOModel';
import MoneyInput from '../MoneyInput/MoneyInput';
import {useFormPart, UseFormResult } from '@vaadin/hilla-react-form';
import { STATE_PARAMS } from 'Frontend/domain/transactions/constants';

type TransactionFormProps = {
    disabled?: boolean;
    mode: 'create' | 'edit';
    form: UseFormResult<TransactionDTOModel>;
    categories: SelectItem[];
    banks: SelectItem[];
};

const telMaxDigits = 10;
const tinMaxDigits = 11;

export default function TransactionForm(props: TransactionFormProps) {
    const { model, field} = props.form
    const amountField = useFormPart(model.amount);
    const createdField = useFormPart(model.created);
    const isCreate = props.mode === 'create';

    return (
        <VerticalLayout className={st.layout}>
            {isCreate && (
                <RadioGroup
                    disabled={props.disabled}
                    label='Тип транзакции'
                    {...field(model.type)}
                >
                    <RadioButton
                        value={TransactionType.INCOME}
                        label='Поступление'
                    />
                    <RadioButton
                        value={TransactionType.EXPENSE}
                        label='Расход'
                    />
                </RadioGroup>
            )}
            <HorizontalLayout theme='spacing' style={{ justifyContent: 'space-between' }}>
                {isCreate ? 
                    (
                        <TextField
                            disabled={props.disabled}
                            style={{ flexGrow: 1 }}
                            required
                            label='Название'
                            {...field(model.title)}
                        />
                    ) : (
                        <Select
                            disabled={props.disabled}
                            style={{ flexGrow: 1 }}
                            label='Статус'
                            items={Object.entries(STATE_PARAMS).map(([key, data]) => ({
                                value: key,
                                label: data.title
                            }))}
                            {...field(model.state)}
                        />
                    )
                }
                <DatePicker
                    disabled={props.disabled}
                    label='Дата операции'
                    max={(new Date()).toISOString()}
                    {...field(model.created)}
                    value={format(createdField.value ? new Date(createdField.value) : new Date(), 'yyyy-MM-dd')}
                />
            </HorizontalLayout>

            <HorizontalLayout theme='spacing' style={{ justifyContent: 'space-between' }}>
                <Select
                    required
                    disabled={props.disabled}
                    style={{ flexGrow: 1 }}
                    label='Категория'
                    items={props.categories}
                    {...field(model.category_id)}
                />
                
                <MoneyInput
                    disabled={props.disabled}
                    invalid={amountField.invalid}
                    errorMsg={amountField.errors[0]?.message}
                    value={amountField.value || 0}
                    onChange={amountField.setValue}
                />
            </HorizontalLayout>

            <hr/>
            <h5 className={st.subtitle}>Отправитель</h5>

            <HorizontalLayout theme='spacing' style={{ justifyContent: 'space-between' }}>
                <Select
                    disabled={props.disabled}
                    style={{ flexGrow: 1 }}
                    label='Банк'
                    items={props.banks}
                    {...field(model.producer_bank_id)}
                />
                {isCreate && (
                    <NumberField
                        disabled={props.disabled}
                        style={{ flexGrow: 1 }}
                        required
                        label='Счет'
                        {...field(model.producer_account)}
                    />
                )}
            </HorizontalLayout>

            <hr/>
            <h5 className={st.subtitle}>Получатель</h5>

            <RadioGroup
                disabled={props.disabled}
                label='Тип лица'
                {...field(model.legal)}
            >
                <RadioButton
                    value={TransactionLegal.LEGAL}
                    label='Юридическое'
                />
                <RadioButton
                    value={TransactionLegal.PHYSICAL}
                    label='Физическое'
                />
            </RadioGroup>

            <HorizontalLayout theme='spacing' style={{ justifyContent: 'space-between' }}>
                <Select
                    disabled={props.disabled}
                    style={{ flexGrow: 1 }}
                    label='Банк'
                    items={props.banks}
                    {...field(model.consumer_bank_id)}
                />
                {isCreate && (
                    <NumberField
                        disabled={props.disabled}
                        style={{ flexGrow: 1 }}
                        required
                        label='Счет'
                        {...field(model.consumer_account)}
                    />
                )}
            </HorizontalLayout>

            <HorizontalLayout theme='spacing' style={{ justifyContent: 'space-between' }}>
                <TextField
                    disabled={props.disabled}
                    maxlength={tinMaxDigits}
                    allowedCharPattern='[0-9]'
                    style={{ flexGrow: 1 }}
                    required
                    label='ИНН'
                    {...field(model.consumer_tin)}
                />

                <TextField
                    disabled={props.disabled}
                    maxlength={telMaxDigits}
                    allowedCharPattern='[0-9]'
                    style={{ flexGrow: 1 }}
                    required
                    label='Телефон'
                    {...field(model.consumer_tel)}
                >
                    <div slot='prefix'>+7</div>
                </TextField>
            </HorizontalLayout>

            <hr/>

            <TextArea
                disabled={props.disabled}
                label='Комментарии'
                minRows={3}
                maxRows={5}
                {...field(model.details)}
            />
        </VerticalLayout>
    )
}