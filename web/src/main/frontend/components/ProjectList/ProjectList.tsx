import { Button, Icon, VerticalLayout, VirtualList } from '@vaadin/react-components';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import AddProject from '../AddProject/AddProject';
import { NavLink } from 'react-router-dom';
import { ProjectEndpoint } from 'Frontend/generated/endpoints';
import { useAuth } from 'Frontend/util/auth';
import st from './projectList.module.css'

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
                <NavLink to={`/projects/${item.id}/`}>{item.name}</NavLink>
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
                    <AddProject buttonText='Add project' onCreate={props.onCreate}/>
                    <VirtualList items={props.items}>{renderItem}</VirtualList>
                </VerticalLayout>
            )
            : (
                <div className={st.placeholder}>
                    <h2>No projects yet</h2>
                    <p>Add projects to control flows</p>

                    <AddProject buttonText='Create first project' onCreate={props.onCreate}/>
                </div>
            )
    )
}
