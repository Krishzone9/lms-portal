import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';

const VideoPlayerPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data);
        if (data.lectures.length > 0) {
          setSelectedLecture(data.lectures[0]);
        }
      } catch (error) {
        toast.error('Unable to load course videos');
      }
    };

    fetchCourse();
  }, [courseId]);

  const markProgress = async () => {
    try {
      await api.put('/enrollments/progress', { courseId, progress: 100 });
      toast.success('Progress marked as complete!');
    } catch (error) {
      toast.error('Could not update progress');
    }
  };

  if (!course) return <p>Loading course content...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-3">{course.title}</h2>
        {selectedLecture ? (
          <>
            <div className="aspect-video bg-black rounded overflow-hidden">
              <iframe
                title={selectedLecture.title}
                src={selectedLecture.videoUrl}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <h3 className="font-semibold mt-3">{selectedLecture.title}</h3>
            <button onClick={markProgress} className="mt-3 bg-green-600 text-white px-4 py-2 rounded text-sm">
              Mark as Completed
            </button>
          </>
        ) : (
          <p>No lectures available yet.</p>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Lecture List</h3>
        <ul className="space-y-2">
          {course.lectures.map((lecture) => (
            <li key={lecture._id}>
              <button
                onClick={() => setSelectedLecture(lecture)}
                className="text-left w-full border p-2 rounded hover:bg-gray-50"
              >
                <span className="block font-medium">{lecture.title}</span>
                <span className="text-xs text-gray-500">{lecture.duration}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
