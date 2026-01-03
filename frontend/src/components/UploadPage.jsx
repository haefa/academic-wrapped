import { useState } from 'react';

export default function UploadPage({ onDataExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/process-bkd', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      // Parsing the data returned from Claude via your FastAPI backend
      const data = result.data;
      
      onDataExtracted(data);
    } catch (error) {
      console.error('Error processing BKD:', error);
      alert('Error processing your BKD. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-16">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Academic Wrapped
          </h1>
          <p className="text-xl text-gray-300">Transform your BKD into a beautiful year-in-review</p>
          <p className="text-sm text-gray-400 mt-2">Just like Spotify Wrapped, but for academics! 🎓</p>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur border border-purple-500/30 mb-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-float">📄</div>
              <h2 className="text-3xl font-bold mb-2">Upload Your BKD</h2>
              <p className="text-gray-300">PDF format from IPB BKD system</p>
            </div>

            {/* Drop Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging || file ? 'border-purple-400 bg-purple-500/10' : 'border-purple-400/50 hover:border-purple-400'
              }`}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input 
                type="file" 
                id="fileInput" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div className="text-4xl mb-4">⬆️</div>
              <p className="text-lg text-gray-300 mb-2">
                {file ? file.name : "Drop your BKD PDF here or click to browse"}
              </p>
              <p className="text-sm text-gray-400">Supported: PDF files (max 10MB)</p>
            </div>

            {/* File Info Alert */}
            {file && (
              <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-300"><span className="font-bold">File Ready:</span> {file.name}</p>
              </div>
            )}

            {/* Generate Button */}
            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing... ⏳' : 'Generate My Academic Wrapped ✨'}
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-500/30">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold mb-1">Teaching Stats</h3>
              <p className="text-sm text-gray-400">Classes, students, and impact</p>
            </div>
            <div className="bg-purple-500/20 rounded-2xl p-6 border border-purple-500/30">
              <div className="text-3xl mb-2">🔬</div>
              <h3 className="font-bold mb-1">Research Output</h3>
              <p className="text-sm text-gray-400">Publications and contributions</p>
            </div>
            <div className="bg-pink-500/20 rounded-2xl p-6 border border-pink-500/30">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold mb-1">Achievements</h3>
              <p className="text-sm text-gray-400">Your year's highlights</p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>🔒 Your data is processed securely and never stored on our servers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
