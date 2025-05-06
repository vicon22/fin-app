import { NotEmpty, Positive, Size } from "@vaadin/hilla-lit-form";
import { useForm, useFormPart, UseFormResult } from "@vaadin/hilla-react-form";
import { useSignal } from "@vaadin/hilla-react-signals";
import { SelectItem } from "@vaadin/react-components";
import Bank from "Frontend/generated/io/scrooge/data/bank/Bank";
import TransactionDTO from "Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTO";
import TransactionDTOModel from "Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTOModel";
import Transaction from "Frontend/generated/io/scrooge/data/transaction/Transaction";
import TransactionLegal from "Frontend/generated/io/scrooge/data/transaction/TransactionLegal";
import TransactionType from "Frontend/generated/io/scrooge/data/transaction/TransactionType";
import { memo, ReactNode, useEffect, useMemo } from "react";

type TransactionFormControllerProps = {
    projectId: string | undefined;
    categories: SelectItem[];
    banks: Bank[];
    disabled?: boolean;
    initialValue?: Partial<TransactionDTO>;
    submit: (payload: TransactionDTO) => Promise<Transaction | undefined | void>;
    children: (payload: {
        form: UseFormResult<TransactionDTOModel>,
        banksOptions: SelectItem[]
    }) => ReactNode;
};


const telMaxDigits = 10;
const tinMaxDigits = 12;

export const TransactionFormController = memo<TransactionFormControllerProps>(function TransactionFormController(props: TransactionFormControllerProps) {
    const initialSet = useSignal<boolean>(false);
    const form = useForm(TransactionDTOModel, {
        onSubmit: async (e) => {
            await props.submit(e)
        }
    });

    const { model, setValue } = form;
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

    useEffect(() => {
        if (!initialSet.value && props.banks?.length) {
            setValue({
                amount: 0,
                project_id: props.projectId,
                category_id: props.categories[0]?.value,
                consumer_bank_id: props.banks[0].id,
                producer_bank_id: props.banks[10].id,
                type: TransactionType.INCOME,
                legal: TransactionLegal.PHYSICAL,
                ...props.initialValue
            });
            
            initialSet.value = true;
        }
    }, [props.banks, initialSet.value])

    const banksOptions = useMemo(() => (props.banks || []).map(item => ({
        label: item.name,
        value: item.id
    })), [props.banks]);

    return props.children({
        form,
        banksOptions
    })
});