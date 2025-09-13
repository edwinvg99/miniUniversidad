const Course = require('../models/Course');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc    Crear un nuevo curso
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    const { subjectId, professorId, term, schedule, capacity } = req.body;
    try {
        // Validar que la materia y el profesor existan
        const subject = await Subject.findById(subjectId);
        const professor = await User.findById(professorId);

        if (!subject || !professor) {
            return res.status(404).json({ message: 'Materia o profesor no encontrado' });
        }
        if (professor.role !== 'professor') {
            return res.status(400).json({ message: 'El usuario seleccionado no es un profesor' });
        }

        const course = new Course({
            subject: subjectId,
            professor: professorId,
            term,
            schedule,
            capacity: Number(capacity),
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obtener todos los cursos
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate('subject', 'name credits')
            .populate('professor', 'firstName lastName');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener un curso por ID
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('subject', 'name description credits')
            .populate('professor', 'firstName lastName email');
        
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Actualizar un curso
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            course.subject = req.body.subjectId || course.subject;
            course.professor = req.body.professorId || course.professor;
            course.term = req.body.term || course.term;
            course.schedule = req.body.schedule || course.schedule;
            course.capacity = req.body.capacity || course.capacity;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar un curso
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (course) {
            res.json({ message: 'Curso eliminado' });
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener los cursos que imparte el profesor actual
// @route   GET /api/courses/teaching
// @access  Private/Professor
const getTeachingCourses = async (req, res) => {
    try {
        // Primero, encontrar los cursos que imparte el profesor
        const courses = await Course.find({ professor: req.user._id })
            .populate('subject', 'name')
            .lean(); // .lean() para obtener objetos JS planos y poder modificarlos

        // Para cada curso, encontrar y adjuntar los estudiantes inscritos
        for (let course of courses) {
            const enrollments = await Enrollment.find({ course: course._id })
                .populate('student', 'firstName lastName email');
            course.enrolledStudents = enrollments.map(e => e.student);
        }
        
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, getTeachingCourses }; 