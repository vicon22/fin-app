import {ReactNode, useCallback, useEffect, useState} from 'react';
import {CurrencyEndpoint} from 'Frontend/generated/endpoints';
import Project from 'Frontend/generated/io/scrooge/data/project/Project';
import {useAuth} from 'Frontend/util/auth';
import Currency from 'Frontend/generated/io/scrooge/data/currency/Currency';

type ProjectsControllerProps = {
    children: (payload: {
        error: boolean;
        pending: boolean;
        onCreate: (item: Project) => void;
        onRemove: (itemId: string) => void;
        data: {
            currencies: Currency[],
            projects: Project[];
        }
    }) => ReactNode;
};

export default function ProjectsController(props: ProjectsControllerProps) {
    const {state} = useAuth();
    const [error, setError] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(true);

    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [projects, setProjects] = useState<Project[]>(state?.user?.projects?.filter?.(item => !!item) || []);

    const fetchCurrencies = useCallback(async () => {
        const data = await CurrencyEndpoint.getCurrencies();

        setCurrencies((data || []).filter(p => !!p));
    }, []);

    useEffect(() => {
        fetchCurrencies()
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setPending(false)
            })
    }, []);

    return (
        props.children({
            error,
            pending,
            onRemove: id => {
                setProjects(projects.filter(item => item.id !== id));
            },
            onCreate: item => {
                setProjects([
                    ...projects,
                    item
                ]);
            },
            data: {
                currencies,
                projects
            }
        })
    );
}
