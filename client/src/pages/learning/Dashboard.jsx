import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainContentView from './MainContentView';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

export default function LearningDashboard() {
  const { slug, topicId, subtopicSlug } = useParams();
  const { darkMode } = useTheme();
  const { backendUrl } = useAppContext();
  const navigate = useNavigate();
  const activeSlug = slug || 'full-stack-engineering';

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);

  // 1. Map and flatten all subtopics, injecting parent IDs & slugified titles
  const allSubtopics = useMemo(() => {
    if (!courseData?.chapters) return [];
    return courseData.chapters.flatMap(chapter =>
      chapter.topics.flatMap(topic =>
        topic.subtopics.map(subtopic => ({
          ...subtopic,
          topicId: topic.id,
     subtopicSlug: subtopic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
           
        }))
      )
    );
  }, [courseData]);

  // 2. Find the current index based on subtopicSlug and topicId
  const currentIndex = useMemo(() => {
    if (!subtopicSlug || !topicId || allSubtopics.length === 0) return 0;
    const index = allSubtopics.findIndex(
      s => s.subtopicSlug === subtopicSlug.toLowerCase() && s.topicId === topicId
    );
    return index !== -1 ? index : 0;
  }, [subtopicSlug, topicId, allSubtopics]);

  const currentSubtopic = allSubtopics[currentIndex] || null;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allSubtopics.length - 1;

  // 3. Sync local UI states with the database model whenever the subtopic changes
  useEffect(() => {
    if (currentSubtopic) {
      const subId = currentSubtopic._id || currentSubtopic.id;
      // Check user interaction arrays populated from backend
      setIsLiked(currentSubtopic.likedBy?.includes(subId) || currentSubtopic.isLiked || false);
      setIsBookmarked(currentSubtopic.bookmarkedBy?.includes(subId) || currentSubtopic.isBookmarked || false);
      setIsCompleted(currentSubtopic.completedBy?.includes(subId) || currentSubtopic.completed || false);
    }
  }, [currentSubtopic]);

  // 4. Navigation helper
  const navigateToSubtopic = (subtopic) => {
    navigate(`/courses/${activeSlug}/${subtopic.topicId}/${subtopic.subtopicSlug}`);
  };

  const handlePrevious = () => {
    if (hasPrevious) navigateToSubtopic(allSubtopics[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) navigateToSubtopic(allSubtopics[currentIndex + 1]);
  };

  // 5. Database Interaction Handler (Like, Bookmark, Complete)
  const toggleDatabaseInteraction = async (actionType) => {
    if (!currentSubtopic) return;
    const targetId = currentSubtopic._id || currentSubtopic.id;
    try {
      await axios.post(
        `${backendUrl}/api/v1/courses/${activeSlug}/subtopics/${targetId}/interact`,
        { action: actionType }
      );
    } catch (err) {
      console.error(`Failed to sync ${actionType} state to database:`, err);
    }
  };

  const handleSetIsLiked = (newValue) => {
    setIsLiked(newValue);
    toggleDatabaseInteraction('like');
  };

  const handleSetIsBookmarked = (newValue) => {
    setIsBookmarked(newValue);
    toggleDatabaseInteraction('bookmark');
  };

  const handleSetIsCompleted = (newValue) => {
    setIsCompleted(newValue);
    toggleDatabaseInteraction('complete');
  };

  const handleSetCourseData = (newData) => {
    setCourseData(newData);
    toggleDatabaseInteraction('complete');
  };

  // 6. Fetch course curriculum from DB
  useEffect(() => {
    async function fetchCourseFromDB() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${backendUrl}/api/v1/courses/${activeSlug}`);
        const result = response.data;

        if (typeof result === 'string' && result.trim().startsWith('<')) {
          throw new Error('Received an HTML page instead of JSON. Check your backend URL.');
        }
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch course');
        }

        setCourseData(result.data);
      } catch (err) {
        console.error("Database fetch error:", err);
        setError(err.response?.data?.message || err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseFromDB();
  }, [activeSlug, backendUrl]);

  // 7. Redirect to the first subtopic if the route is invalid
  useEffect(() => {
    if (courseData && allSubtopics.length > 0) {
      const isValidSubtopic = allSubtopics.some(
        s => s.subtopicSlug === subtopicSlug && s.topicId === topicId
      );

      if (!subtopicSlug || !topicId || !isValidSubtopic) {
        const first = allSubtopics[0];
        navigate(`/courses/${activeSlug}/${first.topicId}/${first.subtopicSlug}`, { replace: true });
      }
    }
  }, [courseData, subtopicSlug, topicId, allSubtopics, navigate, activeSlug]);

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center text-xs ${darkMode ? 'bg-slate-950 text-indigo-400' : 'bg-slate-50 text-indigo-600'}`}>
        Loading {activeSlug} curriculum from database...
      </div>
    );
  }

  if (error || !courseData || !currentSubtopic) {
    return (
      <div className={`flex h-screen items-center justify-center text-sm ${darkMode ? 'bg-slate-950 text-red-400' : 'bg-slate-50 text-red-600'}`}>
        {error ? `Error: ${error}` : "Course content not found."}
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <LeftSidebar
        courseData={courseData}
        currentSubjectSlug={activeSlug}
        currentSubtopic={currentSubtopic}
        setCurrentSubtopic={(sidebarClickedSubtopic) => {
          const mappedSubtopic = allSubtopics.find(s => s.id === sidebarClickedSubtopic.id);
          if (mappedSubtopic) navigateToSubtopic(mappedSubtopic);
        }}
        mobileOpen={mobileLeftOpen}
        setMobileOpen={setMobileLeftOpen}
      />

      <MainContentView
        currentSubtopic={currentSubtopic}
        currentSubjectSlug={activeSlug}
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
        isPlayingAudio={isPlayingAudio}
        setIsPlayingAudio={setIsPlayingAudio}
        isLiked={isLiked}
        setIsLiked={handleSetIsLiked}
        isBookmarked={isBookmarked}
        setIsBookmarked={handleSetIsBookmarked}
        isCompleted={isCompleted}
        setIsCompleted={handleSetIsCompleted}
        setMobileLeftOpen={setMobileLeftOpen}
        setMobileRightOpen={setMobileRightOpen}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />

      <RightSidebar
        currentSubtopic={currentSubtopic}
        courseData={courseData}
        isFocusMode={isFocusMode}
        mobileRightOpen={mobileRightOpen}
        setMobileRightOpen={setMobileRightOpen}
        setCourseData={handleSetCourseData}
      />
    </div>
  );
}