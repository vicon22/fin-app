import {useCallback, useEffect, useMemo} from 'react';
import {useSignal} from '@vaadin/hilla-react-signals';
import {
    Button,
    Dialog,
    HorizontalLayout,
    Icon,
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
import st from './addFlow.module.css';
import TransactionLegal from 'Frontend/generated/io/scrooge/data/transaction/TransactionLegal';
import TransactionType from 'Frontend/generated/io/scrooge/data/transaction/TransactionType';
import TransactionDTO from 'Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTO';
import TransactionDTOModel from 'Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTOModel';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import Bank from 'Frontend/generated/io/scrooge/data/bank/Bank';
import MoneyInput from '../MoneyInput/MoneyInput';
import { useForm, useFormPart } from '@vaadin/hilla-react-form';
import { NotEmpty, Positive, Size } from '@vaadin/hilla-lit-form';

type AddFlowProps = {
    title: string;
    projectId: string | undefined;
    categories: SelectItem[];
    banks: Bank[];
    disabled?: boolean;
    buttonText?: string;
    create: (payload: TransactionDTO) => Promise<Transaction | undefined>;
    onCreate: (item: Transaction) => void;
};

const telMaxDigits = 10;
const tinMaxDigits = 12;

export default function AddFlow(props: AddFlowProps) {
    const dialogOpened = useSignal<boolean>(false);
    const initialSet = useSignal<boolean>(false);
    const { model, submit, field, setValue, addValidator } = useForm(TransactionDTOModel, {
        onSubmit: async (e) => {
          await props
            .create(e)
            .then(item => {
                if (item) {
                    props.onCreate(item);
                    close();
                }
            });
        }
    });

    const amountField = useFormPart(model.amount);
    const titleField = useFormPart(model.title);
    const tinField = useFormPart(model.consumer_tin);
    const telField = useFormPart(model.consumer_tel);

    const consumerAccountField = useFormPart(model.consumer_account);
    const producerAccountField = useFormPart(model.producer_account);

    useEffect(() => {
        amountField.addValidator(new Positive({
            message: 'Укажите сумму платежа'
        }));

        titleField.addValidator(new NotEmpty({
            message: 'Укажите название транзакции'
        }));

        tinField.addValidator(new NotEmpty({
            message: 'Укажите ИНН'
        }));

        tinField.addValidator(new Size({
            min: tinMaxDigits,
            max: tinMaxDigits,
            message: `ИНН должен состоять из ${tinMaxDigits} цифр`
        }));

        telField.addValidator(new NotEmpty({
            message: 'Укажите телефон'
        }));

        telField.addValidator(new Size({
            min: telMaxDigits,
            max: telMaxDigits,
            message: `телефон должен состоять из ${telMaxDigits} цифр`
        }));

        consumerAccountField.addValidator(new NotEmpty({
            message: 'Укажите счет'
        }));

        producerAccountField.addValidator(new NotEmpty({
            message: 'Укажите счет'
        }));
    }, []);

    const banksOptions = useMemo(() => (props.banks || []).map(item => ({
        label: item.name,
        value: item.id
    })), [props.banks]);

    useEffect(() => {
        if (!initialSet.value && props.banks?.length) {
            setValue({
                amount: 0,
                project_id: props.projectId,
                category_id: props.categories[0]?.value,
                consumer_bank_id: props.banks[0].id,
                producer_bank_id: props.banks[10].id,
                type: TransactionType.INCOME,
                legal: TransactionLegal.PHYSICAL
            });
            
            initialSet.value = true;
        }
    }, [props.banks, initialSet.value])

    const close = useCallback(() => {
        requestAnimationFrame(() => {
            dialogOpened.value = false;
        }) 
    }, []);
   
    return (
        <>
            <Dialog
                headerTitle={props.title}
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }) => {
                    dialogOpened.value = detail.value;
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>
                            Отмена
                        </Button>
                        <Button
                            theme='primary'
                            onClick={submit}
                        >
                            Добавить
                        </Button>
                    </>
                )}
            >
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
                            items={banksOptions}
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
                            items={banksOptions}
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
            </Dialog>

            <Button disabled={props.disabled} onClick={() => dialogOpened.value = true} theme={props.buttonText ? undefined : 'icon small'}>
                {props.buttonText || <Icon icon='lumo:plus' />}
            </Button>
        </>
    )
}