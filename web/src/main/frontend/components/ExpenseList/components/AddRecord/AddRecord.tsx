import AddFlow from 'Frontend/components/AddFlow/AddFlow';
import ExpenseCategory from 'Frontend/generated/io/scrooge/data/category/ExpenseCategory';
import ExpenseFlow from 'Frontend/generated/io/scrooge/data/flow/ExpenseFlow';
import { categoriesToOptions } from '../../utils';
import { ExpenseEndpoint } from 'Frontend/generated/endpoints';

type AddRecordProps = {
    projectId: string | undefined;
    categories: ExpenseCategory[];
    buttonText?: string;
    onCreate: (item: ExpenseFlow) => void;
};

export function AddRecord(props: AddRecordProps) {
    return (
        <AddFlow<ExpenseFlow, ExpenseCategory>
            title='New expense'
            projectId={props.projectId}
            categories={categoriesToOptions(props.categories)}
            create={ExpenseEndpoint.create}
            buttonText={props.buttonText}
            onCreate={props.onCreate}
        /> 
    )
};
