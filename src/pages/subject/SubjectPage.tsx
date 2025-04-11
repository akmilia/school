import { useEffect, useState, useContext } from "react";
import { getSubjects, getTypes, handleEnrollGroup, getGroups } from "../../api/subjects";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import './SubjectPage.css';
import { Button, Table, Form, Badge, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

interface SubjectType {
    id: number;
    type: string;
}

interface Subject {
    subject_id: number;
    subject_name: string;
    description: string;
    types: SubjectType[];
} 

interface Group { 
    idgroups: number;
    name: string
  } 

export const SubjectPage = () => { 

    const [groups, setGroups] = useState<Group[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [groupSortField, setGroupSortField] = useState<'idgroups' | 'name'>('name');
    const [groupSortDirection, setGroupSortDirection] = useState<'asc' | 'desc'>('asc');

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
    const [types, setTypes] = useState<SubjectType[]>([]);
    const [selectedType, setSelectedType] = useState<number | 'all'>('all');
    const [sortField, setSortField] = useState<'subject_id' | 'subject_name'>('subject_name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useContext(AuthContext);
    const isStudent = user?.role === 'Ученик';
    const isTeacher = user?.role === 'Преподаватель';

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [subjectsResponse, typesResponse, groupsResponse] = await Promise.all([
                    getSubjects(),
                    getTypes(), 
                    getGroups()
                ]);

                const subjectsData = Array.isArray(subjectsResponse.data) 
                    ? subjectsResponse.data 
                    : [];

                const typesData = Array.isArray(typesResponse) ? typesResponse : [];
                
                const groupsData = Array.isArray(groupsResponse.data) 
                ? groupsResponse.data 
                : []; 

                setSubjects(subjectsData.map(subject => ({
                    subject_id: subject.subject_id,
                    subject_name: subject.subject_name,
                    description: subject.description || '',
                    types: subject.types.map((type: { id: any; type: any; }) => ({
                        id: type.id,
                        type: type.type
                    }))
                })));
                
                setTypes(typesData.map(type => ({
                    id: type.id,
                    type: type.type
                }))); 
                
                const sortedGroups = [...groupsData].sort((a, b) => 
                    a.name.localeCompare(b.name)
                );
                
                setGroups(sortedGroups.map((group: { idgroups: number; name: string }) => ({
                    idgroups: group.idgroups,
                    name: group.name
                }))); 
                
                setFilteredGroups(sortedGroups.map((group: { idgroups: number; name: string }) => ({
                    idgroups: group.idgroups,
                    name: group.name
                })));


            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
                setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (isLoading || !Array.isArray(subjects)) return;

        let result = [...subjects];

        // Фильтрация по типу
        if (selectedType !== 'all') {
            result = result.filter(subject =>
                subject.types.some(type => type.id === selectedType)
            );
        }

        // Сортировка
        result.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' 
                    ? aValue.localeCompare(bValue) 
                    : bValue.localeCompare(aValue);
            }
            return sortDirection === 'asc' 
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
        });

        setFilteredSubjects(result);
    }, [subjects, selectedType, sortField, sortDirection, isLoading]);
    
    useEffect(() => {
        if (isLoading || !Array.isArray(groups)) return;

        const sorted = [...groups].sort((a, b) => {
            const aValue = a[groupSortField];
            const bValue = b[groupSortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return groupSortDirection === 'asc' 
                    ? aValue.localeCompare(bValue) 
                    : bValue.localeCompare(aValue);
            }
            return groupSortDirection === 'asc' 
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
        });

        setFilteredGroups(sorted);
    }, [groups, groupSortField, groupSortDirection, isLoading]);

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    }; 

    const toggleGroupSortDirection = () => {
        setGroupSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const changeGroupSortField = (field: 'idgroups' | 'name') => {
        setGroupSortField(field);
    };

    const handleGroupEnroll = async (groupId: number) => {
        if (!user || !isStudent) return;

        try {
            await handleEnrollGroup(groupId);
            alert('Вы успешно записаны в группу!');
            
            const response = await getGroups();
            if (response.data) {
                const updatedGroups = response.data.map((group: any) => ({
                    idgroups: group.idgroups,
                    name: group.name
                }));
                setGroups(updatedGroups);
            }
        } catch (error) {
            console.error("Ошибка при записи:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ошибка при записи в группу');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="m-3">
                {error}
            </Alert>
        );
    }

    return (
        <div>
            <HeaderAdmin />
            <div className="main">
                <h1>{isTeacher ? 'Список всех занятий' : 'Доступные занятия и группы'}</h1>
        
                <div className="filters-container">
                    <Form.Group className="filter-group">
                        <Form.Label>Фильтр по типу:</Form.Label>
                        <Form.Select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        >
                            <option value="all">Все типы</option>
                            {types.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.type}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
        
                    <div className="sorting-controls">
                        <Button
                            variant={sortField === 'subject_name' ? 'primary' : 'outline-secondary'}
                            onClick={() => setSortField('subject_name')}
                        >
                            По названию
                        </Button>
                        <Button
                            variant={sortField === 'subject_id' ? 'primary' : 'outline-secondary'}
                            onClick={() => setSortField('subject_id')}
                        >
                            По ID
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={toggleSortDirection}
                        >
                            {sortDirection === 'asc' ? '↑' : '↓'}
                        </Button>
                    </div>
                </div>
        
                <Table className="subjects-table" striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Типы</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subject) => (
                                <tr key={subject.subject_id}>
                                    <td>{subject.subject_id}</td>
                                    <td>{subject.subject_name}</td>
                                    <td>{subject.description || '—'}</td>
                                    <td>
                                        <div className="subject-types">
                                            {subject.types.map(type => (
                                                <Badge
                                                    key={type.id}
                                                    bg="info"
                                                    className="me-1"
                                                >
                                                    {type.type}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    {selectedType === 'all'
                                        ? 'Нет доступных предметов'
                                        : 'Нет предметов выбранного типа'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
        
                {isStudent && (
                    <div className="groups-table-container">
                        <h2>Доступные группы</h2>
                        <div className="groups-sorting-controls mb-3">
                            <Button
                                variant={groupSortField === 'name' ? 'primary' : 'outline-secondary'}
                                onClick={() => changeGroupSortField('name')}
                                className="me-2"
                            >
                                По названию
                            </Button>
                            <Button
                                variant={groupSortField === 'idgroups' ? 'primary' : 'outline-secondary'}
                                onClick={() => changeGroupSortField('idgroups')}
                                className="me-2"
                            >
                                По ID
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={toggleGroupSortDirection}
                            >
                                {groupSortDirection === 'asc' ? '↑' : '↓'}
                            </Button>
                        </div>
                        <Table className="groups-table" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGroups.length > 0 ? (
                                    filteredGroups.map((group) => (
                                        <tr key={group.idgroups}>
                                            <td>{group.idgroups}</td>
                                            <td>{group.name}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleGroupEnroll(group.idgroups)}
                                                >
                                                    Записаться
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center">
                                            Нет доступных групп
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectPage;

/*
export const SubjectPage = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
    const [types, setTypes] = useState<SubjectType[]>([]);
    const [selectedType, setSelectedType] = useState<number | 'all'>('all');
    const [sortField, setSortField] = useState<'subject_id' | 'subject_name'>('subject_name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useContext(AuthContext);
    const isStudent = user?.role === 'Ученик';
    const isTeacher = user?.role === 'Преподаватель';

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [subjectsResponse, typesResponse] = await Promise.all([
                    getSubjects(),
                    getTypes()
                ]);

                const subjectsData = Array.isArray(subjectsResponse.data) 
                    ? subjectsResponse.data 
                    : [];

                const typesData = Array.isArray(typesResponse) ? typesResponse : [];

                setSubjects(subjectsData.map(subject => ({
                    subject_id: subject.subject_id,
                    subject_name: subject.subject_name,
                    description: subject.description || '',
                    types: subject.types.map((type: { id: any; type: any; }) => ({
                        id: type.id,
                        type: type.type
                    }))
                })));

                setTypes(typesData.map(type => ({
                    id: type.id,
                    type: type.type
                })));

            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
                setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (isLoading || !Array.isArray(subjects)) return;

        let result = [...subjects];

        // Фильтрация по типу
        if (selectedType !== 'all') {
            result = result.filter(subject =>
                subject.types.some(type => type.id === selectedType)
            );
        }

        // Сортировка
        result.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' 
                    ? aValue.localeCompare(bValue) 
                    : bValue.localeCompare(aValue);
            }
            return sortDirection === 'asc' 
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
        });

        setFilteredSubjects(result);
    }, [subjects, selectedType, sortField, sortDirection, isLoading]);

    const handleEnroll = async (subjectId: number) => {
        if (!user || !isStudent) return;

        try {
            await enrollToSubject(user.id, subjectId);
            alert('Вы успешно записаны на предмет!');
            const response = await getSubjects();
            setSubjects(response.data.map((subject: { subject_id: any; subject_name: any; description: any; types: { id: any; type: any; }[]; }) => ({
                subject_id: subject.subject_id,
                subject_name: subject.subject_name,
                description: subject.description || '',
                types: subject.types.map((type: { id: any; type: any; }) => ({
                    id: type.id,
                    type: type.type
                }))
            })));
        } catch (error) {
            console.error("Ошибка при записи:", error);
            alert('Ошибка при записи на предмет');
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="m-3">
                {error}
            </Alert>
        );
    }

    return ( 
      <div> 
         <HeaderAdmin />
        <div className="main">
           
            <h1>{isTeacher ? 'Список всех занятий ' : 'Доступные занятия и группы'}</h1>

            <div className="filters-container">
                <Form.Group className="filter-group">
                    <Form.Label>Фильтр по типу:</Form.Label>
                    <Form.Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    >
                        <option value="all">Все типы</option>
                        {types.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.type}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="sorting-controls">
                    <Button
                        variant={sortField === 'subject_name' ? 'primary' : 'outline-secondary'}
                        onClick={() => setSortField('subject_name')}
                    >
                        По названию
                    </Button>
                    <Button
                        variant={sortField === 'subject_id' ? 'primary' : 'outline-secondary'}
                        onClick={() => setSortField('subject_id')}
                    >
                        По ID
                    </Button>
                    <Button
                        variant="outline-primary"
                        onClick={toggleSortDirection}
                    >
                        {sortDirection === 'asc' ? '↑' : '↓'}
                    </Button>
                </div>
            </div>

            <Table className="subjects-table" striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Типы</th>
                        {isStudent && <th>Действие</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject) => (
                            <tr key={subject.subject_id}>
                                <td>{subject.subject_id}</td>
                                <td>{subject.subject_name}</td>
                                <td>{subject.description || '—'}</td>
                                <td>
                                    <div className="subject-types">
                                        {subject.types.map(type => (
                                            <Badge
                                                key={type.id}
                                                bg="info"
                                                className="me-1"
                                            >
                                                {type.type}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>
                                {isStudent && (
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleEnroll(subject.subject_id)}
                                        >
                                            Записаться
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={isStudent ? 5 : 4} className="text-center">
                                {selectedType === 'all'
                                    ? 'Нет доступных предметов'
                                    : 'Нет предметов выбранного типа'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div> 
        </div>
    );
};

export default SubjectPage;
 */