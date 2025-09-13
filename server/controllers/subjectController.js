const Subject = require('../models/Subject');

// @desc    Crear una nueva materia
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = async (req, res) => {
  const { name, description, credits } = req.body;

  try {
    const subject = new Subject({
      name,
      description,
      credits,
    });

    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Obtener todas las materias
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener una materia por ID
// @route   GET /api/subjects/:id
// @access  Private
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (subject) {
            res.json(subject);
        } else {
            res.status(404).json({ message: 'Materia no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Actualizar una materia
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = async (req, res) => {
    const { name, description, credits } = req.body;
    try {
        const subject = await Subject.findById(req.params.id);

        if (subject) {
            subject.name = name || subject.name;
            subject.description = description || subject.description;
            subject.credits = credits || subject.credits;

            const updatedSubject = await subject.save();
            res.json(updatedSubject);
        } else {
            res.status(404).json({ message: 'Materia no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar una materia
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (subject) {
            res.json({ message: 'Materia eliminada' });
        } else {
            res.status(404).json({ message: 'Materia no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createSubject, getSubjects, getSubjectById, updateSubject, deleteSubject }; 