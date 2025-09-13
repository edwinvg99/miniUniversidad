const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  grade: {
    type: String, // o Number, dependiendo del sistema de calificación
    trim: true,
    default: null,
  },
}, {
  timestamps: true,
});

// Asegurar que un estudiante solo pueda inscribirse una vez en el mismo curso
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment; 