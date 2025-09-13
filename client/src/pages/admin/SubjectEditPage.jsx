import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const SubjectEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState('');
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (isEditMode) {
            const fetchSubject = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`/api/subjects/${id}`, config);
                    setName(data.name);
                    setDescription(data.description);
                    setCredits(data.credits);
                    setLoading(false);
                } catch (error) {
                    setError(error.response?.data?.message || 'No se pudo cargar la materia');
                    setLoading(false);
                }
            };
            fetchSubject();
        }
    }, [id, isEditMode, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const subjectData = { name, description, credits: Number(credits) };
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
            if (isEditMode) {
                await axios.put(`/api/subjects/${id}`, subjectData, config);
            } else {
                await axios.post('/api/subjects', subjectData, config);
            }
            navigate('/admin/subjects');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la materia');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-4">{isEditMode ? 'Editar Materia' : 'Crear Materia'}</h1>
            {error && <p className="bg-red-500 text-white p-3 rounded mb-4">{error}</p>}
            <form onSubmit={submitHandler} className="bg-gray-800 p-8 rounded-lg">
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Nombre</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Descripción</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Créditos</label>
                    <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    {isEditMode ? 'Actualizar Materia' : 'Crear Materia'}
                </button>
            </form>
        </div>
    );
};

export default SubjectEditPage; 