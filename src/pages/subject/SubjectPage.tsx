import { useEffect, useState, useContext } from "react";
import { getSubjects, getTypes, enrollToSubject } from "../../api/subjects";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import './SubjectPage.css';
import { Button, Table, Form, Badge } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

interface Type {
  type_id: number;
  type_name: string;
}

interface Subject {
  subject_id: number;
  subject_name: string;
  description: string;
  types: Type[];
}

export const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');
  const [sortField, setSortField] = useState<'subject_id' | 'subject_name'>('subject_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { user } = useContext(AuthContext);

  const isStudent = user?.role === 'Ученик';
  const isTeacher = user?.role === 'Преподаватель';

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsResponse, typesResponse] = await Promise.all([
          getSubjects(),
          getTypes()
        ]);
        
        setSubjects(subjectsResponse.data as Subject[]);
        setTypes(typesResponse.data as unknown as Type[]);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };


    fetchData();
  }, []);

  // Фильтрация и сортировка
  useEffect(() => {
    let result = [...subjects];
    
    if (selectedType !== 'all') {
      result = result.filter(subject => 
        subject.types.some(type => type.type_id === selectedType)
      );
    }
    
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
  }, [subjects, selectedType, sortField, sortDirection]);

  const handleEnroll = async (subjectId: number) => {
    if (!user || !isStudent) return;
    
    try {
      await enrollToSubject(user.id, subjectId);
      alert('Вы успешно записаны на предмет!');
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error("Ошибка при записи:", error);
      alert('Ошибка при записи на предмет');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="main">
      <HeaderAdmin />
      <h1>{isTeacher ? 'Преподаваемые предметы' : 'Доступные занятия и курсы'}</h1>
      
      <div className="filters-container">
        <Form.Group className="filter-group">
          <Form.Label>Фильтр по типу:</Form.Label>
          <Form.Select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Все типы</option>
            {types.map(type => (
              <option key={type.type_id} value={type.type_id}>
                {type.type_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        
        <div className="sorting-controls">
          <Button 
            variant="outline-secondary"
            onClick={() => setSortField('subject_name')}
            active={sortField === 'subject_name'}
          >
            Сортировать по названию
          </Button>
          <Button 
            variant="outline-secondary"
            onClick={() => setSortField('subject_id')}
            active={sortField === 'subject_id'}
          >
            Сортировать по ID
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
          {filteredSubjects.map((subject) => (
            <tr key={subject.subject_id}>
              <td>{subject.subject_id}</td>
              <td>{subject.subject_name}</td>
              <td>{subject.description || '—'}</td>
              <td>
                <div className="subject-types">
                  {subject.types.map(type => (
                    <Badge key={type.type_id} bg="info" className="type-badge">
                      {type.type_name}
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
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SubjectPage;