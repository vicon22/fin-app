import AddFlow from 'Frontend/components/AddFlow/AddFlow';
import {categoriesToOptions} from '../../utils';
import Transaction from 'Frontend/generated/io/scrooge/data/transaction/Transaction';
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';
import { TransactionEndpoint } from 'Frontend/generated/endpoints';

type AddRecordProps = {
    projectId: string | undefined;
    categories: TransactionCategory[];
    buttonText?: string;
    onCreate: (item: Transaction) => void;
};

export function AddRecord(props: AddRecordProps) {
    return (
        <AddFlow
            banks={[]}
            title='Новая транзакция'
            projectId={props.projectId}
            categories={categoriesToOptions(props.categories)}
            create={TransactionEndpoint.create}
            buttonText={props.buttonText}
            onCreate={props.onCreate}
        /> 
    )
};
