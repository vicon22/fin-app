
import {SelectItem} from '@vaadin/react-components';
import TransactionDTO from 'Frontend/generated/io/scrooge/data/transaction/dto/TransactionDTO';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import Bank from 'Frontend/generated/io/scrooge/data/bank/Bank';
import { TransactionFormController } from '../TransactionForm/TransactionFormController';
import AddFlowModal from './components/Modal';

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

export default function AddFlow(props: AddFlowProps) {
    return (
        <TransactionFormController
            banks={props.banks}
            categories={props.categories}
            projectId={props.projectId}
            submit={form => props
            .create(form)
            .then(item => {
                if (item) {
                    props.onCreate(item);
                    
                }
            })}
        >
            {({ form, banksOptions}) => (
                <AddFlowModal
                    title={props.title}
                    buttonText={props.buttonText}
                    form={form}
                    categories={props.categories}
                    banks={banksOptions}
                />
            )}
        </TransactionFormController>
    )
}
