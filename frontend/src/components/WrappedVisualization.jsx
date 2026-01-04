import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, FlaskConical, Award, TrendingUp, Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas'; 

export default function WrappedVisualization({ data = {} }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);

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

  // Share functionality with screenshot
  const handleShare = async (platform) => {
    try {
      // Create a canvas from the current slide
      const slideElement = slideRef.current;
      if (!slideElement) return;

      // Use html2canvas if available, otherwise fallback to text share
      if (typeof window !== 'undefined' && window.html2canvas) {
        const canvas = await html2canvas(slideElement, {
          backgroundColor: '#1a0b2e',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true
        });

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          const file = new File([blob], 'academic-wrapped.png', { type: 'image/png' });

          if (platform === 'whatsapp') {
            // For WhatsApp, try to share the image
            if (navigator.share && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: 'My Academic Wrapped',
                  text: `🎓 My Academic Wrapped ${semesterYear}\n📊 ${totalCourses} Classes | 📚 ${totalPublications} Publications | ⭐ ${totalWorkload.toFixed(2)} SKS`
                });
              } catch (err) {
                // Fallback to WhatsApp text if image share fails
                const shareText = `🎓 My Academic Wrapped ${semesterYear}\n\n📊 ${totalCourses} Classes Taught\n📚 ${totalPublications} Publications\n👨‍🎓 ${totalAdvisees} Students Advised\n⭐ ${totalWorkload.toFixed(2)} SKS Total\n\nCheck out Academic Wrapped! ✨`;
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
              }
            } else {
              // Fallback to text share
              const shareText = `🎓 My Academic Wrapped ${semesterYear}\n\n📊 ${totalCourses} Classes Taught\n📚 ${totalPublications} Publications\n👨‍🎓 ${totalAdvisees} Students Advised\n⭐ ${totalWorkload.toFixed(2)} SKS Total\n\nCheck out Academic Wrapped! ✨`;
              window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
            }
          } else if (platform === 'download') {
            // Download the image
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `academic-wrapped-${semesterYear}.png`;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (platform === 'share') {
            // Try native share with image
            if (navigator.share && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'My Academic Wrapped',
                text: `🎓 My Academic Wrapped ${semesterYear}`
              });
            } else {
              // Fallback to download
              const url = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `academic-wrapped-${semesterYear}.png`;
              link.href = url;

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
        });
      } else {
        // Fallback to text share if html2canvas not available
        const shareText = `🎓 My Academic Wrapped ${semesterYear}\n\n📊 ${totalCourses} Classes Taught\n📚 ${totalPublications} Publications\n👨‍🎓 ${totalAdvisees} Students Advised\n⭐ ${totalWorkload.toFixed(2)} SKS Total\n\nCheck out Academic Wrapped! ✨`;
        
        if (platform === 'whatsapp') {
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        } else {
          await navigator.clipboard.writeText(shareText);
          alert('✓ Copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Please try again.');
    }
  };

  const slides = [
    // Intro Slide
    {
      type: 'intro',
      content: (
        <div className="text-center space-y-4 sm:space-y-8 relative overflow-hidden px-2 sm:px-4">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-5 left-5 w-20 h-20 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-5 right-5 w-24 h-24 sm:w-40 sm:h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            {/* Sparkle emoji with animation */}
            <div className="text-5xl sm:text-8xl mb-4 sm:mb-6 animate-bounce">✨</div>
            
            {/* Main title with gradient animation */}
            <h1 className="text-4xl sm:text-7xl md:text-8xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse inline-block">
                Academic
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse inline-block" style={{animationDelay: '0.5s'}}>
                Wrapped
              </span>
            </h1>
            
            {/* Year badge */}
            <div className="inline-block bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-400/50 rounded-full px-4 sm:px-8 py-2 sm:py-3 mb-4 sm:mb-8">
              <p className="text-xl sm:text-3xl font-bold text-white">{semesterYear}</p>
            </div>
            
            {/* Tagline */}
            <p className="text-base sm:text-2xl text-gray-300 font-light mb-6 sm:mb-12 max-w-2xl mx-auto px-4">
              Your Semester in Teaching & Research
            </p>
            
            {/* Divider line */}
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-4 sm:mb-8"></div>
            
            {/* User info card */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl">
              <p className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">{nama}</p>
              <div className="space-y-1 sm:space-y-2 text-gray-300">
                {jurusan && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-purple-400">📚</span>
                    <p className="text-xs sm:text-base">{jurusan}</p>
                  </div>
                )}
                {fakultas && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-blue-400">🏛️</span>
                    <p className="text-xs sm:text-base">{fakultas}</p>
                  </div>
                )}
                {perguruan_tinggi && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-pink-400">🎓</span>
                    <p className="text-xs sm:text-base font-semibold">{perguruan_tinggi}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Call to action */}
            <div className="mt-6 sm:mt-12 animate-pulse">
              <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest">Swipe to see your impact →</p>
            </div>
          </div>
        </div>
      )
    },
    
    // Teaching Stats Slide
    {
      type: 'teaching',
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
            <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Your Teaching Journey</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-blue-500/30">
              <div className="text-3xl sm:text-6xl font-bold text-blue-400 mb-1 sm:mb-2">{totalWorkload.toFixed(2)}</div>
              <div className="text-sm sm:text-xl text-gray-300">Total Workload (SKS)</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Teaching + Research + Service</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-purple-500/30">
              <div className="text-3xl sm:text-6xl font-bold text-purple-400 mb-1 sm:mb-2">{totalCourses}</div>
              <div className="text-sm sm:text-xl text-gray-300">Total Classes</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">{uniqueCourseTypes} different courses</div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-pink-500/30">
              <div className="text-3xl sm:text-6xl font-bold text-pink-400 mb-1 sm:mb-2">{totalTeachingSks.toFixed(2)}</div>
              <div className="text-sm sm:text-xl text-gray-300">Teaching Credits</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">SKS in education</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-green-500/30">
              <div className="text-3xl sm:text-6xl font-bold text-green-400 mb-1 sm:mb-2">{totalAdvisees}</div>
              <div className="text-sm sm:text-xl text-gray-300">Academic Advisees</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Students guided</div>
            </div>
          </div>
        </div>
      )
    },
    
    // Top Courses Slide
    {
      type: 'courses',
      content: (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">Your Most Taught Courses</h2>
          
          <div className="space-y-3 sm:space-y-4">
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
                  className={`bg-gradient-to-r ${gradients[index]} rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur border transform active:scale-95 transition-transform`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 break-words">
                        {medals[index]} {courseName}
                      </div>
                      <div className="text-sm sm:text-base text-gray-300">{count} classes taught</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {uniqueCourseTypes > 3 && (
            <div className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-gray-400">
              + {uniqueCourseTypes - 3} more courses taught
            </div>
          )}
        </div>
      )
    },
    
    // Research Stats Slide
    {
      type: 'research',
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
            <FlaskConical className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400" />
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Research Highlights</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-purple-500/30 col-span-2">
              <div className="text-4xl sm:text-6xl font-bold text-purple-400 mb-1 sm:mb-2">{totalResearchSks.toFixed(2)}</div>
              <div className="text-base sm:text-xl text-gray-300">Total Research Credits (SKS)</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Research contributions</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-blue-500/30">
              <div className="text-3xl sm:text-5xl font-bold text-blue-400 mb-1 sm:mb-2">{totalPublications}</div>
              <div className="text-sm sm:text-lg text-gray-300">Publications</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Published</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-green-500/30">
              <div className="text-3xl sm:text-5xl font-bold text-green-400 mb-1 sm:mb-2">{totalServiceSks.toFixed(2)}</div>
              <div className="text-sm sm:text-lg text-gray-300">Service Credits</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Community</div>
            </div>
          </div>
          
          {/* Show publication details if available */}
          {journalPubs.length > 0 && (
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 max-h-48 overflow-y-auto">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">Recent Publications</h3>
              {journalPubs.map((pub, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur border border-indigo-500/30"
                >
                  <div className="text-sm sm:text-lg font-semibold text-blue-300 mb-1 break-words">
                    {pub.title}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
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
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
            <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" />
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Workload Breakdown</h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-500/20 to-gray-700/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-gray-500/30 mb-4 sm:mb-6">
            <div className="text-4xl sm:text-6xl font-bold text-white mb-2 sm:mb-4 text-center">{totalWorkload.toFixed(2)} SKS</div>
            <div className="text-base sm:text-xl text-gray-300 text-center">Total Academic Contribution</div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur border border-blue-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">{totalTeachingSks.toFixed(2)} SKS</div>
                  <div className="text-sm sm:text-lg text-gray-300 mt-1">Teaching</div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-400/50">
                  {((totalTeachingSks / totalWorkload) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur border border-purple-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">{totalResearchSks.toFixed(2)} SKS</div>
                  <div className="text-sm sm:text-lg text-gray-300 mt-1">Research</div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-purple-400/50">
                  {((totalResearchSks / totalWorkload) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur border border-green-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-400">{totalServiceSks.toFixed(2)} SKS</div>
                  <div className="text-sm sm:text-lg text-gray-300 mt-1">Service</div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-green-400/50">
                  {((totalServiceSks / totalWorkload) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    // Outro Slide with Share
    {
      type: 'outro',
      content: (
        <div className="text-center space-y-4 sm:space-y-8" ref={slideRef}>
          <Award className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-yellow-400 animate-bounce" />
          <h1 className="text-3xl sm:text-5xl font-bold text-white">That's a Wrap!</h1>
          <p className="text-base sm:text-2xl text-gray-300 px-4">You achieved so much this semester.</p>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur border border-purple-500/30 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-purple-400">{totalCourses}</div>
                <div className="text-gray-300 mt-1 text-xs sm:text-sm">Classes</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-pink-400">{totalPublications}</div>
                <div className="text-gray-300 mt-1 text-xs sm:text-sm">Publications</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-blue-400">{totalAdvisees}</div>
                <div className="text-gray-300 mt-1 text-xs sm:text-sm">Advisees</div>
              </div>
            </div>
          </div>
          
          <p className="text-base sm:text-xl text-gray-400 mt-4 sm:mt-8">
            Total Workload: <span className="font-bold text-white">{totalWorkload.toFixed(2)} SKS</span>
          </p>
          
          {/* Share Buttons */}
          <div className="mt-6 sm:mt-8 space-y-3">
            <p className="text-sm sm:text-base text-gray-400 mb-4">Share your achievement!</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              {/* <button
                onClick={() => handleShare('download')}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Download Image</span>
              </button> */}
              
              <button
                onClick={() => handleShare('share')}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Result</span>
              </button>
              
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>
            {/* <p className="text-xs text-gray-500 mt-2">Download the image first, then share to Instagram Story!</p> */}
          </div>
          
          <p className="text-sm sm:text-lg text-gray-500 mt-4 sm:mt-6">Keep up the amazing work! 🎉</p>
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

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-2 sm:px-4 sm:py-8 flex items-center justify-center">
      <div className="relative w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-8 flex justify-center gap-1 sm:gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 sm:w-12 bg-white'
                  : index < currentSlide
                  ? 'w-4 sm:w-8 bg-gray-500'
                  : 'w-4 sm:w-8 bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div 
          className="bg-gray-800/70 p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-lg border border-gray-700 min-h-[500px] sm:min-h-[600px] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides[currentSlide].content}
        </div>

        {/* Navigation Controls */}
        <div className="mt-4 sm:mt-8 flex justify-between items-center px-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all ${
              currentSlide === 0
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                : 'bg-white/10 active:bg-white/20 text-white backdrop-blur active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="text-gray-400 text-sm sm:text-base">
            {currentSlide + 1} / {slides.length}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`p-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              currentSlide === slides.length - 1
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 active:from-purple-600 active:to-pink-600 text-white active:scale-95'
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}