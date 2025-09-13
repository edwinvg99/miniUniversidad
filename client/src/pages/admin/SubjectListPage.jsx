import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const SubjectListPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/subjects', config);
            setSubjects(data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'No se pudieron cargar las materias');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSubjects();
        }
    }, [user]);

    const deleteHandler = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                await axios.delete(`/api/subjects/${id}`, config);
                fetchSubjects(); // Recargar la lista de materias
            } catch (error) {
                setError(error.response?.data?.message || 'No se pudo eliminar la materia');
            }
        }
    };

    if (loading) return <div>Cargando materias...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center my-4">
                <h1 className="text-3xl font-bold">Gestión de Materias</h1>
                <Link to="/admin/subject/create" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Crear Materia
                </Link>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-600">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Créditos</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                            <tr key={subject._id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="p-3">{subject.name}</td>
                                <td className="p-3">{subject.credits}</td>
                                <td className="p-3">
                                    <Link to={`/admin/subject/${subject._id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2">
                                        Editar
                                    </Link>
                                    <button onClick={() => deleteHandler(subject._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
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

export default SubjectListPage; 