import {useCallback} from 'react';
import {useSignal} from '@vaadin/hilla-react-signals';
import {
    Button,
    Dialog,
    Icon,
    SelectItem,
} from '@vaadin/react-components';

import TransactionDTOModel from 'Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTOModel';
import {UseFormResult } from '@vaadin/hilla-react-form';
import TransactionForm from '../../TransactionForm/TransactionForm';

type AddFlowModalProps = {
    title: string;
    disabled?: boolean;
    buttonText?: string;
    form: UseFormResult<TransactionDTOModel>;
    categories: SelectItem[];
    banks: SelectItem[];
};

export default function AddFlowModal(props: AddFlowModalProps) {
    const dialogOpened = useSignal<boolean>(false);

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
                            onClick={props.form.submit}
                        >
                            Добавить
                        </Button>
                    </>
                )}
            >
                <TransactionForm
                    form={props.form}
                    banks={props.banks}
                    categories={props.categories}
                />
            </Dialog>

            <Button disabled={props.disabled} onClick={() => dialogOpened.value = true} theme={props.buttonText ? undefined : 'icon small'}>
                {props.buttonText || <Icon icon='lumo:plus' />}
            </Button>
        </>
    )
}