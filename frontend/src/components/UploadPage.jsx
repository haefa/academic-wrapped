import { useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';

export default function UploadPage({ onDataExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Use environment variable or fallback to /api
  const API_URL = typeof window !== 'undefined' && window.ENV?.VITE_API_URL 
    ? window.ENV.VITE_API_URL 
    : '/api';

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
      const response = await fetch(`${API_URL}/process-bkd`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* Mobile-optimized container */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-lg">
        {/* Header - Compact for mobile */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-5xl sm:text-6xl mb-3 animate-float">✨</div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Academic Wrapped
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 px-4">
            Transform your BKD into a beautiful review
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Like Spotify Wrapped, for academics! 🎓
          </p>
        </div>

        {/* Upload Card - Mobile optimized */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur border border-purple-500/30 mb-6 sm:mb-8 shadow-2xl">
          
          {/* Icon and Title - Smaller on mobile */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-float">📄</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Upload Your BKD</h2>
            <p className="text-sm sm:text-base text-gray-300">PDF from SISTER/BKD</p>
          </div>

          {/* Drop Zone - Touch-friendly */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer active:scale-95 ${
              isDragging || file 
                ? 'border-purple-400 bg-purple-500/10 animate-pulse-glow' 
                : 'border-purple-400/50 hover:border-purple-400 active:border-purple-400'
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
            
            {!file ? (
              <>
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-purple-400" />
                <p className="text-base sm:text-lg text-gray-300 mb-2 font-medium">
                  Tap to select your BKD PDF
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  PDF files only (max 10MB)
                </p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-green-400" />
                <p className="text-base sm:text-lg text-green-300 mb-1 font-semibold break-all px-2">
                  {file.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            )}
          </div>

          {/* Success Message - Mobile optimized */}
          {file && (
            <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-xl p-3 sm:p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <p className="text-green-300 text-sm sm:text-base font-semibold">File Ready!</p>
                <p className="text-green-400/80 text-xs sm:text-sm truncate">{file.name}</p>
              </div>
            </div>
          )}

          {/* Generate Button - Large touch target */}
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-5 sm:mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 text-white font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-base sm:text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Generate My Wrapped</span>
                <span className="text-xl">✨</span>
              </>
            )}
          </button>

          {/* Processing note for mobile */}
          {loading && (
            <p className="text-center text-xs sm:text-sm text-gray-400 mt-3">
              This may take 30-60 seconds...
            </p>
          )}
        </div>

        {/* Feature Grid - Stacked on small mobile, grid on larger */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-blue-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-500/30 flex items-center sm:flex-col sm:text-center gap-3 sm:gap-0">
            <div className="text-3xl sm:text-4xl sm:mb-2 flex-shrink-0">📊</div>
            <div className="flex-1">
              <h3 className="font-bold mb-0.5 sm:mb-1 text-sm sm:text-base">Teaching Stats</h3>
              <p className="text-xs sm:text-sm text-gray-400">Classes & impact</p>
            </div>
          </div>
          
          <div className="bg-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/30 flex items-center sm:flex-col sm:text-center gap-3 sm:gap-0">
            <div className="text-3xl sm:text-4xl sm:mb-2 flex-shrink-0">🔬</div>
            <div className="flex-1">
              <h3 className="font-bold mb-0.5 sm:mb-1 text-sm sm:text-base">Research Output</h3>
              <p className="text-xs sm:text-sm text-gray-400">Publications</p>
            </div>
          </div>
          
          <div className="bg-pink-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-500/30 flex items-center sm:flex-col sm:text-center gap-3 sm:gap-0">
            <div className="text-3xl sm:text-4xl sm:mb-2 flex-shrink-0">🏆</div>
            <div className="flex-1">
              <h3 className="font-bold mb-0.5 sm:mb-1 text-sm sm:text-base">Achievements</h3>
              <p className="text-xs sm:text-sm text-gray-400">Highlights</p>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-center text-xs sm:text-sm text-gray-400 px-4">
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Secure processing • No data stored</span>
          </p>
        </div>

        {/* Made by footer - Optional */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Made with ❤️ for All Lecturers</p>
        </div>
      </div>
    </div>
  );
}