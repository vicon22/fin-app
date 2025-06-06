import {Button, Icon, VerticalLayout, VirtualList} from '@vaadin/react-components';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import AddProject from '../AddProject/AddProject';
import {ProjectEndpoint} from 'Frontend/generated/endpoints';
import {useAuth } from 'Frontend/util/auth';
import st from './projectList.module.css'
import { NavLink } from 'react-router';

type ProjectListProps = {
    items: Project[];
    onCreate: (item: Project) => void;
    onRemove: (itemId: string) => void;
};

export function ProjectList(props: ProjectListProps) {
    const {state} = useAuth();

    function renderItem({ item } : {item: Project}) {
        return <div className={st.item}>
            <div className={st.title}>
                <NavLink to={`/projects/${item.id}/overview`}>{item.name}</NavLink>
            </div>
            <div className={st.actions}>
                <Button theme={'icon small'} onClick={() => {
                    ProjectEndpoint.deleteProject(state.user?.id, item.id).then(() => props.onRemove(String(item.id)))
                }}>
                    <Icon icon='vaadin:close-small' />
                </Button>
            </div>
        </div>
    };

    return (
        props.items.length
            ? (
                <VerticalLayout theme='spacing'>
                    <AddProject buttonText='Создать новый проект' onCreate={props.onCreate}/>
                    <VirtualList items={props.items}>{renderItem}</VirtualList>
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>Проектов пока нет</h2>
                    <p>Создайте первый проект для ведения учета расходов и доходов</p>

                    <AddProject buttonText='Создать проект' onCreate={props.onCreate}/>
                </div>
            )
    )
}
