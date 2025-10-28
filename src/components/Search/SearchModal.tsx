import { useState, useEffect } from 'react';
import { Search, X, BookOpen, Library } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { modules } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Search logic
  const searchResults = {
    lessons: [] as any[],
    vocabulary: [] as any[],
  };

  if (query.length >= 2) {
    const lowerQuery = query.toLowerCase();

    // Search lessons
    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (
          lesson.title.toLowerCase().includes(lowerQuery) ||
          module.title.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.lessons.push({
            ...lesson,
            moduleName: module.title,
          });
        }
      });
    });

    // Search vocabulary
    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        lesson.content.vocabulary?.forEach((vocab) => {
          if (
            vocab.term.toLowerCase().includes(lowerQuery) ||
            vocab.translation.toLowerCase().includes(lowerQuery) ||
            vocab.example.toLowerCase().includes(lowerQuery)
          ) {
            searchResults.vocabulary.push({
              ...vocab,
              lessonName: lesson.title,
            });
          }
        });
      });
    });
  }

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          {/* Search input */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lessons, vocabulary..."
                className="flex-1 outline-none text-lg"
                autoFocus
              />
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.length < 2 ? (
              <div className="p-8 text-center text-gray-500">
                Type at least 2 characters to search
              </div>
            ) : searchResults.lessons.length === 0 && searchResults.vocabulary.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No results found for "{query}"
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {/* Lessons */}
                {searchResults.lessons.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Lessons ({searchResults.lessons.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary-100 rounded-lg">
                              <BookOpen className="w-4 h-4 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">{lesson.title}</div>
                              <div className="text-sm text-gray-600">
                                {lesson.moduleName} • {lesson.duration} min
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocabulary */}
                {searchResults.vocabulary.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Vocabulary ({searchResults.vocabulary.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.vocabulary.slice(0, 10).map((vocab) => (
                        <div
                          key={vocab.id}
                          className="p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Library className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{vocab.term}</span>
                                <span className="text-gray-600">→</span>
                                <span className="text-gray-700">{vocab.translation}</span>
                              </div>
                              <div className="text-sm text-gray-600">{vocab.example}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                From: {vocab.lessonName}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





