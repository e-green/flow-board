// app/page.js
import CalendarWithNotes from '../Calendar/CalendarWithNotes/page';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <CalendarWithNotes />
    </main>
  );
}