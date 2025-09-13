import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TeachingPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchTeachingCourses = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/courses/teaching', config);
                setCourses(data);
            } catch (error) {
                setError(error.response?.data?.message || 'No se pudieron cargar tus clases');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTeachingCourses();
        }
    }, [user]);

    if (loading) return <div>Cargando tus clases...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-4">Mis Clases</h1>
            {courses.length === 0 ? (
                <p>No tienes ninguna clase asignada.</p>
            ) : (
                <div className="space-y-6">
                    {courses.map(course => (
                        <div key={course._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-indigo-400">{course.subject.name}</h2>
                            <p className="text-gray-400 mt-1">{course.term} | {course.schedule}</p>
                            <h3 className="text-lg font-semibold mt-4 mb-2">Estudiantes Inscritos ({course.enrolledStudents.length}/{course.capacity})</h3>
                            {course.enrolledStudents.length > 0 ? (
                                <ul className="list-disc list-inside bg-gray-700 p-4 rounded-md">
                                    {course.enrolledStudents.map(student => (
                                        <li key={student._id} className="text-gray-300">{student.firstName} {student.lastName} ({student.email})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Aún no hay estudiantes inscritos.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeachingPage; 