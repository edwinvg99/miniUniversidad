import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const CourseListPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('/api/courses', config);
            setCourses(data);
        } catch (error) {
            setError(error.response?.data?.message || 'No se pudieron cargar los cursos');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCourses();
        }
    }, [user, fetchCourses]);

    const deleteHandler = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/courses/${id}`, config);
                fetchCourses();
            } catch (error) {
                setError(error.response?.data?.message || 'No se pudo eliminar el curso');
            }
        }
    };

    if (loading) return <div>Cargando cursos...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center my-4">
                <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
                <Link to="/admin/course/create" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Crear Curso
                </Link>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-600">
                        <tr>
                            <th className="p-3">Materia</th>
                            <th className="p-3">Profesor</th>
                            <th className="p-3">Período</th>
                            <th className="p-3">Horario</th>
                            <th className="p-3">Capacidad</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="p-3">{course.subject.name}</td>
                                <td className="p-3">{`${course.professor.firstName} ${course.professor.lastName}`}</td>
                                <td className="p-3">{course.term}</td>
                                <td className="p-3">{course.schedule}</td>
                                <td className="p-3">{course.capacity}</td>
                                <td className="p-3">
                                    <Link to={`/admin/course/${course._id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2">
                                        Editar
                                    </Link>
                                    <button onClick={() => deleteHandler(course._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseListPage; 