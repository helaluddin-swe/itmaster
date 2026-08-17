const express = require('express');
const { getCourses, getCourseBySlug, seedCourses, handleSubtopicInteraction } = require('../controllers/CourseController.js');
const router = express.Router();

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.post('/', seedCourses);      
router.post('/seed', seedCourses);   

router.post("/:slug/subtopics/:subtopicId/interact", handleSubtopicInteraction);

module.exports = router;