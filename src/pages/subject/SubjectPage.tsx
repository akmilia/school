// import { useEffect, useState, useContext } from "react";
// import { getSubjects, getTypes, enrollToSubject } from "../../api/subjects";
// import HeaderAdmin from "../../components/HeaderAdmin/Header";
// import './SubjectPage.css';
// import { Button, Table, Form, Badge, Spinner, Alert } from "react-bootstrap";
// import { AuthContext } from "../../context/AuthContext";

// interface Subject {
//   subject_id: number;
//   subject_name: string;
//   description: string; 
//   types: SubjectType[] 
// }

// interface SubjectType {
//   id: number;
//   type: string;
// }
// export const SubjectPage = () => {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
//   const [types, setTypes] = useState<SubjectType[]>([]);
//   const [selectedType, setSelectedType] = useState<number | 'all'>('all');
//   const [sortField, setSortField] = useState<'subject_id' | 'subject_name'>('subject_name');
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const { user } = useContext(AuthContext);
//   const isStudent = user?.role === 'Ученик';
//   const isTeacher = user?.role === 'Преподаватель'; 
//   console.log('Current token:', localStorage.getItem('access_token'));

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setIsLoading(true);
//   //     setError(null);
      
//   //     try {
//   //       const [subjectsResponse, typesResponse] = await Promise.all([
//   //         getSubjects(),
//   //         getTypes()
//   //       ]);
        
//   //       // Проверка и преобразование данных
//   //       const subjectsData = Array.isArray(subjectsResponse?.data) 
//   //         ? subjectsResponse.data 
//   //         : [];
//   //       const typesData = Array.isArray(typesResponse?.data) 
//   //         ? typesResponse.data 
//   //         : [];

//   //         setSubjects(subjectsData.map(subject => ({
//   //           subject_id: subject.subject_id,
//   //           subject_name: subject.subject_name,
//   //           description: subject.description || '',
//   //           types: Array.isArray(subject.types) 
//   //             ? subject.types.map((type: { id: any; type: any; }) => ({
//   //                 id: type.id,       // Исправлено на id
//   //                 type: type.type    // Исправлено на 
//   //               }))
//   //             : []
//   //         })));
  
//   //         setTypes(typesData.map(type => ({
//   //           id: type.id,       // Исправлено на id
//   //           type: type.type    // Исправлено на name
//   //         }))); 

//   //       setFilteredSubjects(subjectsData);
//   //     } catch (err) {
//   //       console.error("Ошибка при загрузке данных:", err);
//   //       setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);
  
//   useEffect(() => {
//     if (isLoading || !Array.isArray(subjects)) return;
  
//     let result = [...subjects];
  
//     // Исправлена фильтрация по типам
//     if (selectedType !== 'all') {
//       result = result.filter(subject => 
//         subject.types.some(type => type.id === selectedType)
//       );
//     }
  
//     // Сортировка
//     result.sort((a, b) => {
//       const aValue = a[sortField];
//       const bValue = b[sortField];
  
//       if (typeof aValue === 'string' && typeof bValue === 'string') {
//         return sortDirection === 'asc' 
//           ? aValue.localeCompare(bValue) 
//           : bValue.localeCompare(aValue);
//       }
//       return sortDirection === 'asc' 
//         ? (aValue as number) - (bValue as number)
//         : (bValue as number) - (aValue as number);
//     });
  
//     setFilteredSubjects(result);
//   }, [subjects, selectedType, sortField, sortDirection, isLoading]);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     setIsLoading(true);
//   //     setError(null);
      
//   //     try {
//   //       const [subjectsResponse, typesResponse] = await Promise.all([
//   //         getSubjects(),
//   //         getTypes()
//   //       ]); 

//   //       console.log('Subjects response:', subjectsResponse);
//   //       console.log('Types response:', typesResponse);
  
        
//   //       // Проверка и преобразование данных
//   //       const subjectsData = Array.isArray(subjectsResponse?.data) 
//   //         ? subjectsResponse.data 
//   //         : [];
//   //       const typesData = Array.isArray(typesResponse?.data) 
//   //         ? typesResponse.data 
//   //         : [];
  
//   //       setSubjects(subjectsData.map(subject => ({
//   //         subject_id: subject.subject_id,
//   //         subject_name: subject.subject_name,
//   //         description: subject.description || '',
//   //         types: Array.isArray(subject.types) 
//   //           ? subject.types.map((type: any) => ({
//   //               id: type.id,  // учитываем оба варианта
//   //               type: type.type   // учитываем оба варианта
//   //             }))
//   //           : []
//   //       })));
  
//   //       setTypes(typesData.map(type => ({
//   //         id: type.id,
//   //         type: type.type 
//   //       })));
  
//   //       setFilteredSubjects(subjectsData);
//   //     } catch (err) {
//   //       console.error("Ошибка при загрузке данных:", err);
//   //       setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };
  
//   //   fetchData();
//   // }, []);

//   const handleEnroll = async (subjectId: number) => {
//     if (!user || !isStudent) return;
    
//     try {
//       await enrollToSubject(user.id, subjectId);
//       alert('Вы успешно записаны на предмет!');
//       // Обновляем данные
//       const response = await getSubjects();
//       if (Array.isArray(response?.data)) {
//         setSubjects(response.data.map(subject => ({
//           subject_id: subject.subject_id,
//           subject_name: subject.subject_name,
//           description: subject.description || '',
//           types: Array.isArray(subject.types) 
//             ? subject.types.map((type: { id: any; type: any; }) => ({
//                 id: type.id,
//                 type: type.type
//               }))
//             : []
//         })));
//       }
//     } catch (error) {
//       console.error("Ошибка при записи:", error);
//       alert('Ошибка при записи на предмет');
//     }
//   };

//   const toggleSortDirection = () => {
//     setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//   };

//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center mt-5">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Загрузка...</span>
//         </Spinner>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Alert variant="danger" className="m-3">
//         {error}
//       </Alert>
//     );
//   }

//   return (
//     <div className="main">
//       <HeaderAdmin />
//       <h1>{isTeacher ? 'Преподаваемые предметы' : 'Доступные занятия и курсы'}</h1>
      
//       <div className="filters-container">
//         <Form.Group className="filter-group">
//           <Form.Label>Фильтр по типу:</Form.Label>
//           <Form.Select 
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
//             disabled={isLoading}
//           >
//             <option value="all">Все типы</option>
//             {types.map(type => (
//               <option key={`type-${type.id}`} value={type.type}>
//                 {type.type}
//               </option>
//             ))}
//           </Form.Select>
//         </Form.Group>
        
//         <div className="sorting-controls">
//           <Button 
//             variant="outline-secondary"
//             onClick={() => setSortField('subject_name')}
//             active={sortField === 'subject_name'}
//             disabled={isLoading}
//           >
//             Сортировать по названию
//           </Button>
//           <Button 
//             variant="outline-secondary"
//             onClick={() => setSortField('subject_id')}
//             active={sortField === 'subject_id'}
//             disabled={isLoading}
//           >
//             Сортировать по ID
//           </Button>
//           <Button 
//             variant="outline-primary"
//             onClick={toggleSortDirection}
//             disabled={isLoading}
//           >
//             {sortDirection === 'asc' ? '↑' : '↓'}
//           </Button>
//         </div>
//       </div>
      
//       <Table className="subjects-table" striped bordered hover>
//   <thead>
//     <tr>
//       <th>ID</th>
//       <th>Название</th>
//       <th>Описание</th>
//       <th>Типы</th>
//       {isStudent && <th>Действие</th>} {/* Условие для колонки */}
//     </tr>
//   </thead>
//   <tbody>
//     {filteredSubjects.length > 0 ? (
//       filteredSubjects.map((subject) => (
//         <tr key={`subject-${subject.subject_id}`}>
//           <td>{subject.subject_id}</td>
//           <td>{subject.subject_name}</td>
//           <td>{subject.description || '—'}</td>
//           <td>
//             <div className="subject-types">
//               {subject.types.map(type => (
//                 <Badge
//                   key={`type-${subject.subject_id}-${type.id}`}
//                   bg="info"
//                   className="type-badge"
//                 >
//                   {type.type}
//                 </Badge>
//               ))}
//             </div>
//           </td>
//           {isStudent && ( // Условие для кнопки
//             <td>
//               <Button
//                 variant="primary"
//                 onClick={() => handleEnroll(subject.subject_id)}
//               >
//                 Записаться
//               </Button>
//             </td>
//           )}
//         </tr>
//       ))
//     ) : (
//       <tr>
//         <td colSpan={isStudent ? 5 : 4} className="text-center">
//           {selectedType === 'all' 
//             ? 'Нет доступных предметов' 
//             : 'Нет предметов выбранного типа'}
//         </td>
//       </tr>
//     )}
//   </tbody>
// </Table>
//     </div>
//   );
// };

// export default SubjectPage; 
import { useEffect, useState, useContext } from "react";
import { getSubjects, getTypes, enrollToSubject } from "../../api/subjects";
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
           
            <h1>{isTeacher ? 'Список всех занятий' : 'Доступные занятия и курсы'}</h1>

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
