import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const MyCoursesPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    const fetchMyEnrollments = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/enrollments/myenrollments', config);
            setEnrollments(data);
        } catch (error) {
            setError(error.response?.data?.message || 'No se pudieron cargar tus inscripciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyEnrollments();
        }
    }, [user]);

    const unenrollHandler = async (enrollmentId) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar tu inscripción en este curso?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/enrollments/${enrollmentId}`, config);
                fetchMyEnrollments(); // Recargar la lista
            } catch (error) {
                setError(error.response?.data?.message || 'No se pudo cancelar la inscripción');
            }
        }
    };

    if (loading) return <div>Cargando tus cursos...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-4">Mis Cursos</h1>
            {error && <p className="bg-red-500 text-white p-3 rounded mb-4">{error}</p>}
            {enrollments.length === 0 ? (
                <p>No estás inscrito en ningún curso.</p>
            ) : (
                <div className="bg-gray-800 p-4 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-600">
                            <tr>
                                <th className="p-3">Materia</th>
                                <th className="p-3">Profesor</th>
                                <th className="p-3">Período</th>
                                <th className="p-3">Horario</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment._id} className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="p-3">{enrollment.course.subject.name}</td>
                                    <td className="p-3">{`${enrollment.course.professor.firstName} ${enrollment.course.professor.lastName}`}</td>
                                    <td className="p-3">{enrollment.course.term}</td>
                                    <td className="p-3">{enrollment.course.schedule}</td>
                                    <td className="p-3">
                                        <button onClick={() => unenrollHandler(enrollment._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                                            Cancelar Inscripción
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyCoursesPage; 