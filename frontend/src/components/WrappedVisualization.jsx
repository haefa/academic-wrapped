import React, { useState } from 'react';
import { ChevronRight, BookOpen, FlaskConical, Award, TrendingUp, Calendar } from 'lucide-react';

export default function WrappedVisualization({ data = {} }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper function to safely extract data
  const getSks = (key) => {
    if (!data) return 0;
    return parseFloat(data[key] || 0) || 0;
  };
  
  // Extract data from new JSON structure with safe defaults
  const nama = data?.nama || 'Academic Professional';
  const fakultas = data?.fakultas_departemen || '';
  const jurusan = data?.jurusan_program_studi || '';
  const perguruan_tinggi = data?.perguruan_tinggi || '';
  
  const totalWorkload = getSks('total_sks_bkd');
  const totalTeachingSks = getSks('total_teaching_sks');
  const totalResearchSks = getSks('total_research_sks');
  const totalServiceSks = getSks('total_service_sks');
  
  const totalAdvisees = data?.total_advisees || 0;
  const semesterYear = data?.semester_year || '2024/2025';
  
  // Count total courses from number_of_courses object
  const coursesObj = data?.number_of_courses || {};
  const totalCourses = Object.values(coursesObj).reduce((sum, count) => sum + count, 0);
  const uniqueCourseTypes = Object.keys(coursesObj).length;
  
  // Get top 3 courses by count
  const topCourses = Object.entries(coursesObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Journal publications
  const journalPubs = Array.isArray(data?.journal_publications) ? data.journal_publications : [];
  const totalPublications = journalPubs.length;

  const slides = [
    // Intro Slide
    {
      type: 'intro',
      content: (
        <div className="text-center space-y-8 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            {/* Sparkle emoji with animation */}
            <div className="text-8xl mb-6 animate-bounce">✨</div>
            
            {/* Main title with gradient animation */}
            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse inline-block">
                Academic
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse inline-block" style={{animationDelay: '0.5s'}}>
                Wrapped
              </span>
            </h1>
            
            {/* Year badge */}
            <div className="inline-block bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-400/50 rounded-full px-8 py-3 mb-8">
              <p className="text-3xl font-bold text-white">{semesterYear}</p>
            </div>
            
            {/* Tagline */}
            <p className="text-2xl text-gray-300 font-light mb-12 max-w-2xl mx-auto">
              Your Year in Teaching & Research
            </p>
            
            {/* Divider line */}
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-8"></div>
            
            {/* User info card */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl">
              <p className="text-2xl font-bold text-white mb-3">{nama}</p>
              <div className="space-y-2 text-gray-300">
                {jurusan && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-purple-400">📚</span>
                    <p className="text-base">{jurusan}</p>
                  </div>
                )}
                {fakultas && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-blue-400">🏛️</span>
                    <p className="text-base">{fakultas}</p>
                  </div>
                )}
                {perguruan_tinggi && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-pink-400">🎓</span>
                    <p className="text-base font-semibold">{perguruan_tinggi}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Call to action */}
            <div className="mt-12 animate-pulse">
              <p className="text-gray-400 text-sm uppercase tracking-widest">Swipe to see your impact →</p>
            </div>
          </div>
        </div>
      )
    },
    
    // Teaching Stats Slide
    {
      type: 'teaching',
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-12 h-12 text-blue-400" />
            <h2 className="text-4xl font-bold text-white">Your Teaching Journey</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur border border-blue-500/30">
              <div className="text-6xl font-bold text-blue-400 mb-2">{totalWorkload.toFixed(2)}</div>
              <div className="text-xl text-gray-300">Total Workload (SKS)</div>
              <div className="text-sm text-gray-400 mt-2">Teaching + Research + Service</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur border border-purple-500/30">
              <div className="text-6xl font-bold text-purple-400 mb-2">{totalCourses}</div>
              <div className="text-xl text-gray-300">Total Classes</div>
              <div className="text-sm text-gray-400 mt-2">{uniqueCourseTypes} different courses</div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-3xl p-8 backdrop-blur border border-pink-500/30">
              <div className="text-6xl font-bold text-pink-400 mb-2">{totalTeachingSks.toFixed(2)}</div>
              <div className="text-xl text-gray-300">Teaching Credits</div>
              <div className="text-sm text-gray-400 mt-2">SKS in education</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-3xl p-8 backdrop-blur border border-green-500/30">
              <div className="text-6xl font-bold text-green-400 mb-2">{totalAdvisees}</div>
              <div className="text-xl text-gray-300">Academic Advisees</div>
              <div className="text-sm text-gray-400 mt-2">Students guided</div>
            </div>
          </div>
        </div>
      )
    },
    
    // Top Courses Slide
    {
      type: 'courses',
      content: (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white mb-8">Your Most Taught Courses</h2>
          
          <div className="space-y-4">
            {topCourses.map(([courseName, count], index) => {
              const gradients = [
                'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
                'from-gray-500/20 to-gray-600/20 border-gray-500/30',
                'from-orange-500/20 to-red-500/20 border-orange-500/30'
              ];
              const medals = ['🥇', '🥈', '🥉'];
              
              return (
                <div 
                  key={courseName}
                  className={`bg-gradient-to-r ${gradients[index]} rounded-2xl p-6 backdrop-blur border transform hover:scale-105 transition-transform`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {medals[index]} {courseName}
                      </div>
                      <div className="text-gray-300">{count} classes taught</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {uniqueCourseTypes > 3 && (
            <div className="text-center mt-6 text-gray-400">
              + {uniqueCourseTypes - 3} more course types
            </div>
          )}
        </div>
      )
    },
    
    // Research Stats Slide
    {
      type: 'research',
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical className="w-12 h-12 text-purple-400" />
            <h2 className="text-4xl font-bold text-white">Research Highlights</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl p-8 backdrop-blur border border-purple-500/30 col-span-2">
              <div className="text-6xl font-bold text-purple-400 mb-2">{totalResearchSks.toFixed(2)}</div>
              <div className="text-xl text-gray-300">Total Research Credits (SKS)</div>
              <div className="text-sm text-gray-400 mt-2">Research contributions this semester</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl p-8 backdrop-blur border border-blue-500/30">
              <div className="text-5xl font-bold text-blue-400 mb-2">{totalPublications}</div>
              <div className="text-lg text-gray-300">Journal Publications</div>
              <div className="text-sm text-gray-400 mt-2">Published this semester</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-3xl p-8 backdrop-blur border border-green-500/30">
              <div className="text-5xl font-bold text-green-400 mb-2">{totalServiceSks.toFixed(2)}</div>
              <div className="text-lg text-gray-300">Service Credits</div>
              <div className="text-sm text-gray-400 mt-2">Community contributions</div>
            </div>
          </div>
          
          {/* Show publication details if available */}
          {journalPubs.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-2xl font-bold text-white mb-4">Recent Publications</h3>
              {journalPubs.map((pub, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 backdrop-blur border border-indigo-500/30"
                >
                  <div className="text-lg font-semibold text-blue-300 mb-1">
                    {pub.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    {pub.journal_name} • {pub.publication_date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    
    // Workload Breakdown Slide
    {
      type: 'breakdown',
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-12 h-12 text-green-400" />
            <h2 className="text-4xl font-bold text-white">Workload Breakdown</h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-500/20 to-gray-700/20 rounded-3xl p-8 backdrop-blur border border-gray-500/30 mb-6">
            <div className="text-6xl font-bold text-white mb-4 text-center">{totalWorkload.toFixed(2)} SKS</div>
            <div className="text-xl text-gray-300 text-center">Total Academic Contribution</div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl p-6 backdrop-blur border border-blue-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400">{totalTeachingSks.toFixed(2)} SKS</div>
                  <div className="text-lg text-gray-300 mt-1">Teaching</div>
                </div>
                <div className="text-4xl font-bold text-blue-400/50">
                  {((totalTeachingSks / totalWorkload) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl p-6 backdrop-blur border border-purple-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold text-purple-400">{totalResearchSks.toFixed(2)} SKS</div>
                  <div className="text-lg text-gray-300 mt-1">Research</div>
                </div>
                <div className="text-4xl font-bold text-purple-400/50">
                  {((totalResearchSks / totalWorkload) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl p-6 backdrop-blur border border-green-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold text-green-400">{totalServiceSks.toFixed(2)} SKS</div>
                  <div className="text-lg text-gray-300 mt-1">Service</div>
                </div>
                <div className="text-4xl font-bold text-green-400/50">
                  {((totalServiceSks / totalWorkload) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    // Outro Slide
    {
      type: 'outro',
      content: (
        <div className="text-center space-y-8">
          <Award className="w-24 h-24 mx-auto text-yellow-400 animate-bounce" />
          <h1 className="text-5xl font-bold text-white">That's a Wrap!</h1>
          <p className="text-2xl text-gray-300">You achieved so much this academic semester.</p>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur border border-purple-500/30 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold text-purple-400">{totalCourses}</div>
                <div className="text-gray-300 mt-1 text-sm">Classes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-400">{totalPublications}</div>
                <div className="text-gray-300 mt-1 text-sm">Publications</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400">{totalAdvisees}</div>
                <div className="text-gray-300 mt-1 text-sm">Advisees</div>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-400 mt-8">Total Workload: <span className="font-bold text-white">{totalWorkload.toFixed(2)} SKS</span></p>
          <p className="text-lg text-gray-500">Keep up the amazing work! 🎉</p>
        </div>
      )
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-16 flex items-center justify-center">
      <div className="relative w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-12 bg-white'
                  : index < currentSlide
                  ? 'w-8 bg-gray-500'
                  : 'w-8 bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="bg-gray-800/70 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-lg border border-gray-700 min-h-[600px] flex items-center justify-center">
          {slides[currentSlide].content}
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              currentSlide === 0
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur'
            }`}
          >
            Previous
          </button>

          <div className="text-gray-400">
            {currentSlide + 1} / {slides.length}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              currentSlide === slides.length - 1
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            }`}
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}