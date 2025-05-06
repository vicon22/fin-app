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
import st from './transactionForm.module.css';
import TransactionLegal from 'Frontend/generated/io/scrooge/data/transaction/TransactionLegal';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import TransactionDTOModel from 'Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTOModel';
import MoneyInput from '../MoneyInput/MoneyInput';
import {useFormPart, UseFormResult } from '@vaadin/hilla-react-form';

type TransactionFormProps = {
    form: UseFormResult<TransactionDTOModel>;
    categories: SelectItem[];
    banks: SelectItem[];
};

const telMaxDigits = 10;
const tinMaxDigits = 12;

export default function TransactionForm(props: TransactionFormProps) {
    const { model, field} = props.form
    const amountField = useFormPart(model.amount);

    return (
        <VerticalLayout className={st.layout}>
            <RadioGroup
                label="Тип транзакции"
                {...field(model.type)}
            >
                <RadioButton
                    value={TransactionType.INCOME}
                    label="Поступление"
                />
                <RadioButton
                    value={TransactionType.EXPENSE}
                    label="Расход"
                />
            </RadioGroup>
            <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                <TextField
                    style={{ flexGrow: 1 }}
                    required
                    label='Название'
                    {...field(model.title)}
                />
                <DatePicker
                    label="Дата операции"
                    max={(new Date()).toISOString()}
                    {...field(model.created)}
                />
            </HorizontalLayout>

            <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                <Select
                    required
                    style={{ flexGrow: 1 }}
                    label='Категория'
                    items={props.categories}
                    {...field(model.category_id)}
                />
                
                <MoneyInput
                    invalid={amountField.invalid}
                    errorMsg={amountField.errors[0]?.message}
                    value={amountField.value || 0}
                    onChange={amountField.setValue}
                />
            </HorizontalLayout>

            <hr/>
            <h5 className={st.subtitle}>Отправитель</h5>

            <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                <Select
                    style={{ flexGrow: 1 }}
                    label="Банк"
                    items={props.banks}
                    {...field(model.producer_bank_id)}
                />
                <NumberField
                    style={{ flexGrow: 1 }}
                    required
                    label='Счет'
                    {...field(model.producer_account)}
                />
            </HorizontalLayout>

            <hr/>
            <h5 className={st.subtitle}>Получатель</h5>

            <RadioGroup
                label="Тип лица"
                {...field(model.legal)}
            >
                <RadioButton
                    value={TransactionLegal.LEGAL}
                    label="Юридическое"
                />
                <RadioButton
                    value={TransactionLegal.PHYSICAL}
                    label="Физическое"
                />
            </RadioGroup>

            <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                <Select
                    style={{ flexGrow: 1 }}
                    label="Банк"
                    items={props.banks}
                    {...field(model.consumer_bank_id)}
                />
                <NumberField
                    style={{ flexGrow: 1 }}
                    required
                    label='Счет'
                    {...field(model.consumer_account)}
                />
            </HorizontalLayout>

            <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
                <TextField
                    maxlength={tinMaxDigits}
                    allowedCharPattern='[0-9]'
                    style={{ flexGrow: 1 }}
                    required
                    label='ИНН'
                    {...field(model.consumer_tin)}
                />

                <TextField
                    maxlength={telMaxDigits}
                    allowedCharPattern='[0-9]'
                    style={{ flexGrow: 1 }}
                    required
                    label='Телефон'
                    {...field(model.consumer_tel)}
                >
                    <div slot="prefix">+7</div>
                </TextField>
            </HorizontalLayout>

            <hr/>

            <TextArea
                label='Комментарии'
                minRows={3}
                maxRows={5}
                {...field(model.details)}
            />
        </VerticalLayout>
    )
}