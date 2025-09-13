const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Inscribir al usuario actual en un curso
// @route   POST /api/enrollments
// @access  Private
const createEnrollment = async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user._id;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        const alreadyEnrolled = await Enrollment.findOne({ course: courseId, student: studentId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Ya estás inscrito en este curso' });
        }

        const enrollmentsCount = await Enrollment.countDocuments({ course: courseId });
        if (enrollmentsCount >= course.capacity) {
            return res.status(400).json({ message: 'El curso ha alcanzado su capacidad máxima' });
        }

        const enrollment = new Enrollment({
            student: studentId,
            course: courseId,
        });

        const createdEnrollment = await enrollment.save();
        res.status(201).json(createdEnrollment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener los cursos del usuario actual
// @route   GET /api/enrollments/myenrollments
// @access  Private
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate({
                path: 'course',
                populate: {
                    path: 'subject professor',
                    select: 'name firstName lastName'
                }
            });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancelar una inscripción
// @route   DELETE /api/enrollments/:id
// @access  Private
const deleteEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Inscripción no encontrada' });
        }

        // Asegurarse de que el usuario que borra es el dueño de la inscripción
        if (enrollment.student.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        await Enrollment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inscripción cancelada' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEnrollment, getMyEnrollments, deleteEnrollment }; 