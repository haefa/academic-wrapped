import { useState } from 'react';
// Import the visualization component we just created
import WrappedVisualization from './components/WrappedVisualization';
// Import the upload component
import UploadPage from './components/UploadPage';

function App() {
  // This state will hold the data received from the backend (or null initially)
  const [academicData, setAcademicData] = useState(null);

  // You can remove these if you don't use them anymore
  // const [count, setCount] = useState(0) 
  // import reactLogo from './assets/react.svg'
  // import viteLogo from '/vite.svg'
  // import './App.css'


  return (
    <>
      {!academicData ? (
        // Show the UploadPage component
        // Pass setAcademicData to the UploadPage via the onDataExtracted prop
        <UploadPage onDataExtracted={(data) => setAcademicData(data)} />
      ) : (
        // If data exists, show the WrappedVisualization component
        // Pass the received data via the data prop
        <WrappedVisualization data={academicData} />
      )}
    </>
  );
}

export default App;
