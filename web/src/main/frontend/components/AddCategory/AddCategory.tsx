import {useCallback} from 'react';
import {useSignal} from '@vaadin/hilla-react-signals';
import {Button, Dialog, Icon, TextField, VerticalLayout} from '@vaadin/react-components';
import st from './addCategory.module.css'
import TransactionCategory from 'Frontend/generated/io/scrooge/data/category/TransactionCategory';

type AddCategoryProps = {
    title: string;
    buttonText?: string;
    create: (title: string, description: string) => Promise<TransactionCategory | undefined>;
    onCreate: VoidFunction;
};

export default function AddCategory(props: AddCategoryProps) {
    const dialogOpened = useSignal<boolean>(false);
    const label = useSignal<string | undefined>();
    const desc = useSignal<string | undefined>();

    const close = useCallback(() => {
        desc.value = undefined;
        label.value = undefined;

        requestAnimationFrame(() => {
            dialogOpened.value = false;
        }) 
    }, []);

    const submit = useCallback(() => {
        const title = label.value;
        const description = desc.value;

        if (title && description) {
            props
                .create(title, description)
                .then(() => {
                    props.onCreate();
                    dialogOpened.value = false;
                });
        }
    }, [props.onCreate, props.create]);

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
                            Cancel
                        </Button>
                        <Button
                            theme='primary'
                            onClick={submit}
                        >
                            Add
                        </Button>
                    </>
                )}
                >
                <VerticalLayout className={st.layout}>
                    <TextField
                        required
                        label='Название'
                        value={label.value}
                        onChange={e => label.value = e.target.value.trim()}
                    />

                    <TextField
                        required
                        label='Описание'
                        value={desc.value}
                        onChange={e => desc.value = e.target.value.trim()}
                    />
                </VerticalLayout>
            </Dialog>

            <Button onClick={() => dialogOpened.value = true} theme={props.buttonText ? undefined : 'icon small'}>
                {props.buttonText || <Icon icon='lumo:plus' />}
            </Button>
        </>
    )
}
