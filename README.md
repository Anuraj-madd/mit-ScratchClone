# MIT-ScratchClone

A modern, interactive web-based clone of MIT Scratch, built with React, Vite, and Tailwind CSS. This project allows users to create, drag, and drop code blocks to control sprites on a stage, mimicking the block-based programming experience of Scratch.

## Features
- **Block-Based Programming:** Drag and drop motion, control, and looks blocks to build scripts visually.
- **Sprite Management:** Add, remove, and select sprites (Cat, Frog, Penguin, Crab) with live preview.
- **Stage Preview:** Real-time stage area to see sprite actions and movements.
- **Customizable Blocks:** Input fields for block parameters (e.g., move steps, say text, repeat count).
- **Run Scripts:** Execute scripts for individual sprites or all sprites at once.
- **Responsive UI:** Clean, modern interface styled with Tailwind CSS.
- **Error Handling:** Robust error boundaries for a smooth user experience.

## Tech Stack
- **React** (with Context API)
- **Vite** (development/build tool)
- **Tailwind CSS** (utility-first styling)
- **react-dnd** (drag-and-drop)
- **ESLint** (code linting)

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anuraj-madd/mit-ScratchClone.git
   cd mit-ScratchClone
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## Usage
- Use the sidebar to drag blocks into the scripting area.
- Select or add sprites in the stage area.
- Click "Run All" to execute scripts for all sprites, or run scripts for individual sprites.
- Customize block parameters directly in the UI.

## Project Structure
```
├── public/           # Static assets (logo, icons)
├── src/
│   ├── components/   # UI components (Sidebar, Midarea, PreviewArea, etc.)
│   ├── context/      # React context for state management
│   ├── App.jsx       # Main app component
│   └── main.jsx      # Entry point
├── index.html        # App entry HTML
├── package.json      # Project metadata and scripts
├── tailwind.config.js
├── vite.config.js
└── ...
```
