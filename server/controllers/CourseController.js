const Course = require("../models/Course.js");
exports.seedCourses = async (req, res) => {
  try {
    const reqBody = req.body;

    // --------------------------------------------------
    // Case 1: Bulk Seeding format
    // { "slug-1": { title: {...}, chapters: [...] }, "slug-2": {...} }
    // --------------------------------------------------
    if (
      !Array.isArray(reqBody) &&
      !reqBody.slug &&
      Object.keys(reqBody).length > 0
    ) {
      const coursesToInsert = [];

      for (const [slug, courseData] of Object.entries(reqBody)) {
        if (courseData && courseData.chapters) {
          coursesToInsert.push({
            slug,
            title: courseData.title || {
              en: slug,
              bn: slug,
              fr: slug,
              es: slug,
            },
            chapters: courseData.chapters,
          });
        }
      }

      if (coursesToInsert.length > 0) {
        await Course.deleteMany({});
        const createdCourses = await Course.insertMany(coursesToInsert);

        return res.status(201).json({
          success: true,
          message: `${createdCourses.length} courses seeded successfully!`,
          data: createdCourses,
        });
      }
    }

    // --------------------------------------------------
    // Case 2: Individual Course / Admin Upsert
    // { slug, title, chapters: [...] }
    // --------------------------------------------------
    const { slug, title, chapters } = reqBody;

    if (!slug) {
      return res
        .status(400)
        .json({ success: false, message: "Course slug is required." });
    }

    let course = await Course.findOne({ slug });

    if (!course) {
      // Create new document
      course = new Course({
        slug,
        title: title || { en: slug, bn: "", fr: "", es: "" },
        chapters: chapters || [],
      });
      await course.save();
    } else {
      // Update existing document
      if (title) {
        course.title = title;
      }

      if (chapters && Array.isArray(chapters)) {
        chapters.forEach((incomingChapter) => {
          const chIdx = course.chapters.findIndex(
            (c) => c.id === incomingChapter.id
          );

          if (chIdx > -1) {
            // ----- Chapter exists -----
            if (incomingChapter.title) {
              course.chapters[chIdx].title = incomingChapter.title;
            }

            incomingChapter.topics?.forEach((incomingTopic) => {
              const topIdx = course.chapters[chIdx].topics.findIndex(
                (t) => t.id === incomingTopic.id
              );

              if (topIdx > -1) {
                // ----- Topic exists -----
                if (incomingTopic.title) {
                  course.chapters[chIdx].topics[topIdx].title =
                    incomingTopic.title;
                }

                incomingTopic.subtopics?.forEach((incomingSub) => {
                  const subIdx = course.chapters[chIdx].topics[
                    topIdx
                  ].subtopics.findIndex((s) => s.id === incomingSub.id);

                  if (subIdx > -1) {
                    // Replace whole subtopic (including questions & explanation)
                    course.chapters[chIdx].topics[topIdx].subtopics[subIdx] =
                      incomingSub;
                  } else {
                    // Add new subtopic
                    course.chapters[chIdx].topics[topIdx].subtopics.push(
                      incomingSub
                    );
                  }
                });
              } else {
                // Add new topic
                course.chapters[chIdx].topics.push(incomingTopic);
              }
            });
          } else {
            // Add new chapter
            course.chapters.push(incomingChapter);
          }
        });
      }

      // Mark nested arrays as modified so Mongoose actually saves them
      course.markModified("chapters");
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Course hierarchy with 4-language support successfully updated in MongoDB!",
      data: course,
    });
  } catch (error) {
    console.error("seedCourses Controller Error:", error);

    // Mongoose validation errors → 400 with readable messages
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ") || error.message,
        error: error.message,
      });
    }

    // Duplicate key (unique slug)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A course with this slug already exists.",
        error: error.message,
      });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};



// new version code



// @desc    Get all courses
// @route   GET /api/v1/courses
exports.getCourses = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const courses = await Course.find({});

    const formattedCourses = courses.map((course) => ({
      _id: course._id,
      slug: course.slug,
      title: course.title?.[lang] || course.title?.en || course.slug,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));

    res.status(200).json({ success: true, data: formattedCourses });
  } catch (error) {
    console.error("getCourses Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get a single course with full curriculum
// @route   GET /api/v1/courses/:slug
exports.getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    const course = await Course.findOne({ slug });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (lang && ["en", "bn", "fr", "es"].includes(lang)) {
      const extractLang = (obj) => {
        if (!obj) return obj;
        if (typeof obj === "object" && !Array.isArray(obj) && (obj.en || obj.bn || obj.fr || obj.es !== undefined)) {
          return obj[lang] || obj.en || "";
        }
        return obj;
      };

      const localizedCourse = JSON.parse(JSON.stringify(course));
      localizedCourse.title = extractLang(localizedCourse.title);

      localizedCourse.chapters?.forEach((chapter) => {
        chapter.title = extractLang(chapter.title);

        chapter.topics?.forEach((topic) => {
          topic.title = extractLang(topic.title);

          topic.subtopics?.forEach((sub) => {
            sub.title = extractLang(sub.title);
            sub.content = extractLang(sub.content);

            sub.questions?.forEach((q) => {
              q.questionText = extractLang(q.questionText);
              q.options = extractLang(q.options); 
              q.explanation = extractLang(q.explanation);
            });
          });
        });
      });

      return res.status(200).json({ success: true, data: localizedCourse });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("getCourseBySlug Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Seed or Update Courses
// @route   POST /api/v1/courses/seed


// NEW: @desc Toggle Like, Bookmark, or Completion on a subtopic
// @route PUT /api/v1/courses/:slug/subtopics/:subtopicId/interact
exports.handleSubtopicInteraction = async (req, res) => {
  try {
    const { slug, subtopicId } = req.params;
    const { action } = req.body; // 'like', 'bookmark', or 'complete'
    const userId = req.user?._id; 

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user found' });
    }

    const course = await Course.findOne({ slug });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    let targetSubtopic = null;
    
    // Find the subtopic nested inside chapters -> topics -> subtopics using string comparison for safety
    for (let chapter of course.chapters) {
      for (let topic of chapter.topics) {
        const sub = topic.subtopics.find(s => s._id.toString() === subtopicId);
        if (sub) {
          targetSubtopic = sub;
          break;
        }
      }
      if (targetSubtopic) break;
    }

    if (!targetSubtopic) {
      return res.status(404).json({ success: false, message: 'Subtopic not found' });
    }

    // Initialize arrays if they don't exist
    if (!targetSubtopic.likedBy) targetSubtopic.likedBy = [];
    if (!targetSubtopic.bookmarkedBy) targetSubtopic.bookmarkedBy = [];
    if (!targetSubtopic.completedBy) targetSubtopic.completedBy = [];

    let updatedState = false;
    const userIdStr = userId.toString();

    if (action === 'like') {
      const index = targetSubtopic.likedBy.findIndex(id => id.toString() === userIdStr);
      if (index > -1) {
        targetSubtopic.likedBy.splice(index, 1);
        updatedState = false;
      } else {
        targetSubtopic.likedBy.push(userId);
        updatedState = true;
      }
    } else if (action === 'bookmark') {
      const index = targetSubtopic.bookmarkedBy.findIndex(id => id.toString() === userIdStr);
      if (index > -1) {
        targetSubtopic.bookmarkedBy.splice(index, 1);
        updatedState = false;
      } else {
        targetSubtopic.bookmarkedBy.push(userId);
        updatedState = true;
      }
    } else if (action === 'complete') {
      const index = targetSubtopic.completedBy.findIndex(id => id.toString() === userIdStr);
      if (index > -1) {
        targetSubtopic.completedBy.splice(index, 1);
        updatedState = false;
        targetSubtopic.completed = false;
      } else {
        targetSubtopic.completedBy.push(userId);
        updatedState = true;
        targetSubtopic.completed = true;
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action type' });
    }

    // Explicitly mark the parent document as modified to ensure Mongoose persists nested changes
    course.markModified('chapters');
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${action}`,
      state: updatedState,
      data: course
    });
  } catch (err) {
    console.error('Interaction error:', err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};