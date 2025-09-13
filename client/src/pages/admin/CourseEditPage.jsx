import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const CourseEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [subjects, setSubjects] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [formData, setFormData] = useState({
        subjectId: '',
        professorId: '',
        term: '',
        schedule: '',
        capacity: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Cargar materias y profesores
                const [subjectsRes, professorsRes] = await Promise.all([
                    axios.get('/api/subjects', config),
                    axios.get('/api/users/professors', config),
                ]);
                setSubjects(subjectsRes.data);
                setProfessors(professorsRes.data);

                // Si es modo edición, cargar datos del curso
                if (isEditMode) {
                    const { data } = await axios.get(`/api/courses/${id}`, config);
                    setFormData({
                        subjectId: data.subject._id,
                        professorId: data.professor._id,
                        term: data.term,
                        schedule: data.schedule,
                        capacity: data.capacity,
                    });
                }
            } catch (error) {
                console.error("Error al cargar datos para la página de edición de cursos:", error);
                setError('Error al cargar los datos necesarios. Revisa la consola para más detalles.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [id, isEditMode, user]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
            if (isEditMode) {
                await axios.put(`/api/courses/${id}`, formData, config);
            } else {
                await axios.post('/api/courses', formData, config);
            }
            navigate('/admin/courses');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el curso');
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-4">{isEditMode ? 'Editar Curso' : 'Crear Curso'}</h1>
            <form onSubmit={submitHandler} className="bg-gray-800 p-8 rounded-lg">
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Materia</label>
                    <select name="subjectId" value={formData.subjectId} onChange={onChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" required>
                        <option value="">Selecciona una materia</option>
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Profesor</label>
                    <select name="professorId" value={formData.professorId} onChange={onChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" required>
                        <option value="">Selecciona un profesor</option>
                        {professors.map(p => <option key={p._id} value={p._id}>{`${p.firstName} ${p.lastName}`}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Período</label>
                    <input type="text" name="term" value={formData.term} onChange={onChange} placeholder="Ej: 2024-1" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Horario</label>
                    <input type="text" name="schedule" value={formData.schedule} onChange={onChange} placeholder="Ej: Lunes 10-12" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Capacidad</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={onChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" required />
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
                    {isEditMode ? 'Actualizar Curso' : 'Crear Curso'}
                </button>
            </form>
        </div>
    );
};

export default CourseEditPage; 