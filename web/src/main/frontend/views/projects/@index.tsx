import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { ProjectList } from 'Frontend/components/ProjectList/ProjectList';
import ProjectsController from 'Frontend/controllers/ProjectsController';
import st from './project.module.css';

export const config: ViewConfig = {
  menu: { order: 2, icon: 'line-awesome/svg/book-solid.svg' },
  title: 'Проекты',
  loginRequired: true,
};

export default function ProjectsView() {
    return (
        <div className={st.layout}>
            <ProjectsController>
                {({data, onCreate, onRemove}) => (
                    <ProjectList onCreate={onCreate} onRemove={onRemove} items={data.projects}/>
                )}
            </ProjectsController>
        </div>
    );
}
