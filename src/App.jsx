import React, { createContext, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from './components/Sidebar';
import Midarea from './components/Midarea';
import Allcontext from './context/Allcontext';
import PreviewArea from './components/PreviewArea';
import Getcontext from './context/Getcontext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

function App() {
  const { curSprite } = useContext(Getcontext);

  return (
    <ErrorBoundary>
      <Navbar />
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fa] p-0">
          <div className="flex w-full h-full rounded-2xl shadow-xl border border-yellow-200 bg-white overflow-hidden gap-6 px-4 py-6">
            <Sidebar id={curSprite} />
            <Midarea id={curSprite} />
            <PreviewArea />
          </div>
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
}

export default App;
