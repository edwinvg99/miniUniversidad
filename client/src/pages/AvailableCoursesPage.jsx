import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AvailableCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
                // Pedir ambas listas de datos en paralelo
                const [coursesRes, enrollmentsRes] = await Promise.all([
                    axios.get('/api/courses', config),
                    axios.get('/api/enrollments/myenrollments', config)
                ]);
                
                setCourses(coursesRes.data);
                
                // Crear un Set con los IDs de los cursos en los que el usuario está inscrito
                const enrolledIds = new Set(enrollmentsRes.data.map(enrollment => enrollment.course._id));
                setEnrolledCourseIds(enrolledIds);

            } catch (error) {
                setError(error.response?.data?.message || 'No se pudieron cargar los cursos');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const enrollHandler = async (courseId) => {
        setError('');
        setSuccess('');
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/enrollments', { courseId }, config);
            setSuccess('¡Inscripción exitosa!');
            // Actualizar la lista de inscritos para reflejar el cambio inmediatamente
            setEnrolledCourseIds(prevIds => new Set(prevIds).add(courseId));
        } catch (error) {
            setError(error.response?.data?.message || 'Error en la inscripción');
        }
    };

    if (loading) return <div>Cargando cursos...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-4">Cursos Disponibles</h1>
            {error && <p className="bg-red-500 text-white p-3 rounded mb-4">{error}</p>}
            {success && <p className="bg-green-500 text-white p-3 rounded mb-4">{success}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course._id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-indigo-400">{course.subject.name}</h2>
                            <p className="text-gray-300 mt-2">Prof. {course.professor.firstName} {course.professor.lastName}</p>
                            <p className="text-gray-400 mt-2">{course.term} | {course.schedule}</p>
                            <p className="text-gray-400 mt-1">Créditos: {course.subject.credits}</p>
                        </div>
                        {enrolledCourseIds.has(course._id) ? (
                            <button 
                                className="mt-4 w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-md cursor-not-allowed"
                                disabled>
                                Inscrito
                            </button>
                        ) : (
                            <button 
                                onClick={() => enrollHandler(course._id)}
                                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                                Inscribirse
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableCoursesPage; 