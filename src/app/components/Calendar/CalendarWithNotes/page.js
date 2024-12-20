"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const CalendarWithNotes = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(parseInt(user.id)); // Make sure to parse the ID as an integer
    } else {
      router.push("/");
    }
  }, []);

  // Fetch notes
useEffect(() => {
  const fetchNotes = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await fetch(
        `/api/notes/get-notes?userId=${userId}&startDate=${firstDay.toISOString()}&endDate=${lastDay.toISOString()}`
      );

      if (!response.ok) throw new Error('Failed to fetch notes');

      const fetchedNotes = await response.json();
      const notesMap = {};
      fetchedNotes.forEach(note => {
        notesMap[format(new Date(note.date), 'yyyy-MM-dd')] = note.content;
      });
      setNotes(notesMap);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchNotes();
}, [currentDate, userId]);

// Add/Update note
const handleNoteSubmit = async (e) => {
  e.preventDefault();
  if (!userId || !selectedDate) return;

  try {
    setIsLoading(true);
    const formattedDate = formatDate(selectedDate);
    
    const response = await fetch('/api/notes/add-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        date: formattedDate,
        content: noteText
      }),
    });

    if (!response.ok) throw new Error('Failed to save note');

    setNotes(prev => ({
      ...prev,
      [formattedDate]: noteText
    }));
    setShowNoteInput(false);
  } catch (error) {
    console.error('Error saving note:', error);
  } finally {
    setIsLoading(false);
  }
};

// Delete note
const handleDeleteNote = async () => {
  if (!userId || !selectedDate) return;

  try {
    setIsLoading(true);
    const formattedDate = formatDate(selectedDate);
    
    const response = await fetch('/api/notes/delete-note', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        date: formattedDate
      }),
    });

    if (!response.ok) throw new Error('Failed to delete note');

    const updatedNotes = { ...notes };
    delete updatedNotes[formattedDate];
    setNotes(updatedNotes);
    setNoteText('');
    setShowNoteInput(false);
  } catch (error) {
    console.error('Error deleting note:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Date utility functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonthDays = (date) => {
    const firstDay = getFirstDayOfMonth(date);
    const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1);
    const daysInPreviousMonth = getDaysInMonth(previousMonth);
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() - 1, daysInPreviousMonth - i),
        isCurrentMonth: false
      });
    }
    return days;
  };

  const getCurrentMonthDays = (date) => {
    const daysInMonth = getDaysInMonth(date);
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        isCurrentMonth: true
      });
    }
    return days;
  };

  const getNextMonthDays = (date, currentDays) => {
    const totalDaysNeeded = 42; // 6 rows * 7 days
    const remainingDays = totalDaysNeeded - currentDays.length;
    const days = [];

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false
      });
    }
    return days;
  };

  const getAllDays = () => {
    const previousMonthDays = getPreviousMonthDays(currentDate);
    const currentMonthDays = getCurrentMonthDays(currentDate);
    const allCurrentDays = [...previousMonthDays, ...currentMonthDays];
    const nextMonthDays = getNextMonthDays(currentDate, allCurrentDays);
    return [...allCurrentDays, ...nextMonthDays];
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  // Event handlers
  const handleDateClick = (date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(date);
    setNoteText(notes[formattedDate] || '');
    setShowNoteInput(true);
  };

  
  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {getAllDays().map((day, index) => {
            const formattedDate = formatDate(day.date);
            const hasNote = notes[formattedDate];
            const isToday = formatDate(new Date()) === formattedDate;
            const isSelected = selectedDate && formatDate(selectedDate) === formattedDate;

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day.date)}
                className={`
                  p-2 h-24 border rounded-lg cursor-pointer transition-colors
                  ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                  ${isToday ? 'border-blue-500' : 'border-gray-200'}
                  ${isSelected ? 'bg-blue-50' : ''}
                  hover:bg-gray-50
                `}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm ${isToday ? 'text-blue-500 font-semibold' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  {hasNote && (
                    <div className="mt-1 text-xs bg-yellow-100 p-1 rounded truncate">
                      {notes[formattedDate]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Input Modal */}
        {showNoteInput && selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {notes[formatDate(selectedDate)] ? 'Edit' : 'Add'} Note for {selectedDate.toLocaleDateString()}
              </h3>
              <form onSubmit={handleNoteSubmit}>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2 border rounded mb-4 h-32"
                  placeholder="Enter your note here..."
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleDeleteNote}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowNoteInput(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarWithNotes;