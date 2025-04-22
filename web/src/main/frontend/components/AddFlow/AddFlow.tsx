import { useCallback, useEffect } from 'react';
import { useSignal } from '@vaadin/hilla-react-signals';
import { Button, ComboBox, Dialog, HorizontalLayout, Icon, NumberField, SelectItem, TextField, VerticalLayout } from '@vaadin/react-components';
import st from './addFlow.module.css'

type AddFlowProps<T, C> = {
    title: string;
    projectId: string | undefined;
    categories: SelectItem[];
    buttonText?: string;
    create: (projectId: string, categoryId: string, title: string, amount: number) => Promise<T | undefined>;
    onCreate: (item: T) => void;
};

export default function AddFlow<T, C>(props: AddFlowProps<T, C>) {
    const dialogOpened = useSignal<boolean>(false);
    const label = useSignal<string | undefined>();
    const integer = useSignal<number | undefined>();
    const fraction = useSignal<number | undefined>();
    const categoryId = useSignal<string | undefined>();

    const close = useCallback(() => {
        label.value = undefined;
        integer.value = undefined;
        fraction.value = undefined;
        categoryId.value = undefined;

        requestAnimationFrame(() => {
            dialogOpened.value = false;
        }) 
    }, []);

    const submit = useCallback(() => {
        const amount = (integer?.value || 0) * 100 + (fraction.value || 0);
        const category = categoryId.value;
        const title = label.value;
        const projectId = props.projectId;
    
        if (projectId && category && title) {
            props
                .create(projectId, category, title, amount)
                .then(item => {
                    if (item) {
                        props.onCreate(item);
                        close();
                    }
                });
        }
    }, [props.projectId, props.create, props.onCreate]);

    useEffect(() => {
        if (!categoryId.value) {
            categoryId.value = props.categories[0]?.value;
        }
    }, [props.categories]);

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
                        label='Title'
                        errorMessage='Title required'
                        value={label.value}
                        onChange={e => label.value = e.target.value.trim()}
                    />

                    <ComboBox
                        required
                        label='Category'
                        errorMessage='Category required'
                        items={props.categories}
                        value={categoryId.value}
                        onChange={e => categoryId.value = e.target.value}
                    />

                    <HorizontalLayout className={st.amount}>
                        <NumberField
                            required
                            label='Amount'
                            theme='align-right'
                            className={st.integer}
                            placeholder='0'
                            min={0}
                            value={String(integer.value)}
                            onChange={e => {
                                const value = parseInt(e.target.value);

                                if (value < 0) {
                                    integer.value = 0;
                                } else {
                                    integer.value = value;
                                }
                            }}
                        />
                        <div className={st.separator}>.</div>
                        <NumberField
                            theme='align-right'
                            className={st.fraction}
                            placeholder='00'
                            value={String(fraction.value)}
                            onChange={e => {
                                const value = parseInt(e.target.value);

                                if (value < 0) {
                                    fraction.value = 0;
                                } else if (value > 99) {
                                    fraction.value = 99;
                                } else {
                                    fraction.value = value;
                                }
                            }}
                        />
                    </HorizontalLayout>
                </VerticalLayout>
            </Dialog>

            <Button onClick={() => dialogOpened.value = true} theme={props.buttonText ? undefined : 'icon small'}>
                {props.buttonText || <Icon icon='lumo:plus' />}
            </Button>
        </>
    )
}