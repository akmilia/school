import { useEffect, useState, useContext } from "react";
import { getSubjects, enrollToSubject } from "../../api/subjects";
import HeaderAdmin from "../../components/HeaderAdmin/Header";
import './SubjectPage.css';
import { Button, Table } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

interface Subject {
  id: number;
  name: string;
  description: string;
  type: string;
}

export const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects();
        setSubjects(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleEnroll = async (subjectId: number) => {
    try {
      if (!user?.id) {
        alert("Необходимо авторизоваться");
        return;
      }
      
      await enrollToSubject(user.id, subjectId);
      alert("Вы успешно записаны на предмет!");
      // Обновляем список предметов после записи
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (e) {
      alert("Ошибка при записи на предмет");
      console.error(e);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название предмета</th>
            <th>Описание</th>
            <th>Тип</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj) => (
            <tr key={subj.id}>
              <td>{subj.id}</td>
              <td>{subj.name}</td>
              <td>{subj.description}</td>
              <td>{subj.type}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEnroll(subj.id)}
                >
                  Записаться
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SubjectPage;