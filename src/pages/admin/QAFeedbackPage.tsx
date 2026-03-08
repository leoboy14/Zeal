import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { 
  Paperclip, 
  Smile, 
  Send, 
  Globe, 
  Users, 
  Search, 
  MoreHorizontal,
  Filter, 
  Upload,
  Play,
  Link as LinkIcon,
  MessageSquare,
  Settings2,
  Trash2,
  Pencil,
  Save,
  PlusCircle,
  X,
  Check
} from 'lucide-react';
import { backend } from '../../lib/backend';

interface Comment {
  id: string;
  project_id: string;
  author_name: string;
  author_initials: string;
  author_avatar?: string;
  text: string;
  timestamp_seconds: number;
  thread_number: number;
  is_public: boolean;
  version_number: number;
  is_done: boolean;
  created_at?: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
  video_url: string;
  thumbnail_url: string;
  phase: string;
  editor: string;
  due: string;
  status: string;
  current_version: number;
  video_versions: { version: number; url: string; created_at: string; label?: string }[];
  video_type?: 'upload' | 'heygen';
  heygen_url?: string;
}

const USER_COLORS = [
  { bg: 'bg-emerald-100', text: 'text-emerald-700', primary: 'bg-emerald-600', ring: 'ring-emerald-50', marker: 'bg-emerald-500' },
  { bg: 'bg-blue-100', text: 'text-blue-700', primary: 'bg-blue-600', ring: 'ring-blue-50', marker: 'bg-blue-500' },
  { bg: 'bg-purple-100', text: 'text-purple-700', primary: 'bg-purple-600', ring: 'ring-purple-50', marker: 'bg-purple-500' },
  { bg: 'bg-amber-100', text: 'text-amber-700', primary: 'bg-amber-600', ring: 'ring-amber-50', marker: 'bg-amber-500' },
  { bg: 'bg-rose-100', text: 'text-rose-700', primary: 'bg-rose-600', ring: 'ring-rose-50', marker: 'bg-rose-500' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700', primary: 'bg-indigo-600', ring: 'ring-indigo-50', marker: 'bg-indigo-500' },
];

const getUserColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % USER_COLORS.length;
  return USER_COLORS[index];
};

export default function QAFeedbackPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [manualTimestamp, setManualTimestamp] = useState('00:00');
  const [activeTab, setActiveTab] = useState<'comments' | 'fields'>('comments');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('Admin');
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  const [isManageVersionsOpen, setIsManageVersionsOpen] = useState(false);
  const [editingVersionIdx, setEditingVersionIdx] = useState<number | null>(null);
  const [tempLabel, setTempLabel] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [showDone, setShowDone] = useState(true);
  const [isUploadingVersion, setIsUploadingVersion] = useState(false);
  const [uploadType, setUploadType] = useState<'upload' | 'heygen'>('upload');
  const [heygenUrlInput, setHeygenUrlInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reselectInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedProjectId) {
      setVideoFile(file);
      const url = await backend.uploadVideo(file);
      
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const nextVersion = (project.video_versions && project.video_versions.length > 0) ? Math.max(...project.video_versions.map(v => v.version)) + 1 : 1;
        const newVersionObj = { version: nextVersion, url: url, created_at: new Date().toISOString() };
        const updatedVersions = [...(project.video_versions || []), newVersionObj];
        
        await backend.updateProject(selectedProjectId, {
          video_url: url,
          video_type: 'upload',
          current_version: nextVersion,
          video_versions: updatedVersions
        });
        
        const updatedProjects = await backend.getProjects();
        setProjects(updatedProjects);
        setSelectedVersion(nextVersion);
        setVideoUrl(url);
        setIsUploadingVersion(false);
      }
    }
  };

  const handleHeygenSubmit = async () => {
    if (!heygenUrlInput.trim() || !selectedProjectId) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      let extractUrl = heygenUrlInput;
      if (extractUrl.includes('<iframe') && extractUrl.includes('src="')) {
        const match = extractUrl.match(/src="([^"]+)"/);
        if (match) extractUrl = match[1];
      }
      
      const nextVersion = (project.video_versions && project.video_versions.length > 0) ? Math.max(...project.video_versions.map(v => v.version)) + 1 : 1;
      const newVersionObj = { version: nextVersion, url: extractUrl, created_at: new Date().toISOString() };
      const updatedVersions = [...(project.video_versions || []), newVersionObj];
      
      await backend.updateProject(selectedProjectId, {
        heygen_url: extractUrl,
        video_type: 'heygen',
        current_version: nextVersion,
        video_versions: updatedVersions
      });
      
      const updatedProjects = await backend.getProjects();
      setProjects(updatedProjects);
      setSelectedVersion(nextVersion);
      setVideoUrl(extractUrl);
      setIsUploadingVersion(false);
      setHeygenUrlInput('');
    }
  };

  const handleReselectVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedProjectId) {
      setVideoFile(file);
      // Just create a new object URL for the duration of this session
      const newUrl = URL.createObjectURL(file);
      setVideoUrl(newUrl);
      setVideoError(false);
      
      // We also update the backend so next time they click this version it uses this new blob URL
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const updatedVersions = [...(project.video_versions || [])];
        const vIndex = updatedVersions.findIndex(v => v.version === selectedVersion);
        if (vIndex >= 0) {
          updatedVersions[vIndex].url = newUrl;
        } else if (selectedVersion === 1) {
          updatedVersions.push({ version: 1, url: newUrl, created_at: new Date().toISOString() });
        }
        await backend.updateProject(selectedProjectId, {
          video_url: selectedVersion === project.current_version ? newUrl : project.video_url,
          video_versions: updatedVersions
        });
        const updatedProjects = await backend.getProjects();
        setProjects(updatedProjects);
      }
    }
  };

  React.useEffect(() => {
    setVideoError(false);
    const loadProjects = async () => {
      try {
        const data = await backend.getProjects();
        setProjects(data);
        if (data.length > 0) {
          const firstProject = data[0];
          setSelectedProjectId(firstProject.id);
          setSelectedVersion(firstProject.current_version || 1);
          if (firstProject.video_type === 'heygen') {
            setVideoUrl(firstProject.heygen_url || null);
          } else {
            setVideoUrl(firstProject.video_url);
          }
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  React.useEffect(() => {
    if (selectedProjectId) {
      const loadComments = async () => {
        try {
          const data = await backend.getComments(selectedProjectId, selectedVersion);
          setComments(data);
        } catch (e) {
          console.error("Failed to load comments", e);
        }
      };
      loadComments();
      
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const versionData = project.video_versions?.find(v => v.version === selectedVersion);
        if (project.video_type === 'heygen') {
          setVideoUrl(project.heygen_url || null);
        } else if (versionData) {
          setVideoUrl(versionData.url);
        } else if (selectedVersion === 1) {
          setVideoUrl(project.video_url);
        }
      }
    }
  }, [selectedProjectId, selectedVersion, projects]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setVideoError(false);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const version = project.current_version || 1;
      setSelectedVersion(version);
      const versionData = project.video_versions?.find(v => v.version === version);
      if (project.video_type === 'heygen') {
        setVideoUrl(project.heygen_url || null);
      } else {
        setVideoUrl(versionData ? versionData.url : project.video_url);
      }
    }
    setVideoFile(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleSeek = (seconds: number) => {
     const currentProject = projects.find(p => p.id === selectedProjectId);
     
     if (currentProject?.video_type === 'heygen') {
       // Approach for iframe embeds: force a reload with a time parameter if possible
       const iframe = document.querySelector('iframe[title="HeyGen Avatar"]') as HTMLIFrameElement;
       if (iframe && videoUrl) {
           const baseUrl = videoUrl.split('?')[0];
           const currentParams = new URLSearchParams(videoUrl.split('?')[1] || '');
           currentParams.set('t', Math.floor(seconds).toString());
           const newUrl = `${baseUrl}?${currentParams.toString()}`;
           
           // We'll update the component's videoUrl state so the iframe re-renders with the new URL
           setVideoUrl(newUrl);
       }
     } else if (videoRef.current) {
       videoRef.current.currentTime = seconds;
       if (!isPlaying) {
         videoRef.current.play();
         setIsPlaying(true);
       }
     }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * videoRef.current.duration;
    
    if (!isNaN(newTime) && isFinite(newTime)) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const parseTimeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10);
      const secs = parseInt(parts[1], 10);
      if (!isNaN(mins) && !isNaN(secs)) {
        return mins * 60 + secs;
      }
    }
    return 0;
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !selectedProjectId) return;

    const currentProject = projects.find(p => p.id === selectedProjectId);
    const isHeyGen = currentProject?.video_type === 'heygen';
    const secondsToUse = (videoUrl && !isHeyGen) ? currentTime : parseTimeToSeconds(manualTimestamp);

    const editorName = selectedAuthor;
    const initials = editorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const newCommentData = {
      project_id: selectedProjectId,
      author_name: editorName,
      author_initials: initials,
      author_avatar: undefined,
      text: newCommentText,
      thread_number: comments.length + 1,
      is_public: true,
      timestamp_seconds: secondsToUse,
      version_number: selectedVersion,
      is_done: false
    };

    try {
      const savedComment = await backend.addComment(newCommentData);
      setComments([...comments, savedComment].sort((a,b) => a.timestamp_seconds - b.timestamp_seconds));
      setNewCommentText('');
    } catch (e) {
      console.error("Failed to add comment", e);
    }
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const handleUpdateVersionLabel = async (vIdx: number) => {
    if (!currentProject) return;
    
    const updatedVersions = [...(currentProject.video_versions || [])];
    updatedVersions[vIdx] = { ...updatedVersions[vIdx], label: tempLabel, url: tempUrl };
    
    try {
      await backend.updateProject(selectedProjectId, { video_versions: updatedVersions });
      setProjects(prev => prev.map(p => p.id === selectedProjectId ? { ...p, video_versions: updatedVersions } : p));
      
      if (updatedVersions[vIdx].version === selectedVersion) {
        setVideoUrl(tempUrl);
      }
      
      setEditingVersionIdx(null);
    } catch (e) {
      console.error("Failed to update version", e);
    }
  };

  const handleDeleteVersion = async (vIdx: number) => {
    if (!currentProject || !confirm("Are you sure you want to delete this version? This will NOT delete associated comments.")) return;
    
    const updatedVersions = currentProject.video_versions.filter((_, i) => i !== vIdx);
    
    if (currentProject.video_versions[vIdx].version === selectedVersion) {
      if (updatedVersions.length > 0) {
        setSelectedVersion(updatedVersions[0].version);
      } else {
        setSelectedVersion(1);
      }
    }
    try {
      await backend.updateProject(selectedProjectId, { 
        video_versions: updatedVersions,
        current_version: Math.max(0, ...updatedVersions.map(v => v.version)) || 1
      });
      setProjects(prev => prev.map(p => p.id === selectedProjectId ? { 
        ...p, 
        video_versions: updatedVersions,
        current_version: Math.max(0, ...updatedVersions.map(v => v.version)) || 1
      } : p));
    } catch (e) {
      console.error("Failed to delete version", e);
    }
  };

  const handleToggleDone = async (commentId: string, currentStatus: boolean) => {
    try {
      await backend.updateComment(commentId, { is_done: !currentStatus });
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, is_done: !currentStatus } : c));
    } catch (e) {
      console.error("Failed to update comment status", e);
    }
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editingCommentText.trim()) return;
    try {
      await backend.updateComment(commentId, { text: editingCommentText });
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: editingCommentText } : c));
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (e) {
      console.error("Failed to update comment", e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await backend.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (e) {
      console.error("Failed to delete comment", e);
    }
  };

  const filteredComments = comments.filter(c => showDone || !c.is_done);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-muted/60 text-foreground -mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
      {/* Left side - Video Player */}
      <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden border-r border-slate-200 justify-center items-center p-4">
        {!videoUrl || isUploadingVersion ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8 bg-slate-50 w-full relative">
            {videoUrl && (
              <button 
                onClick={() => setIsUploadingVersion(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="flex p-1 bg-white rounded-lg border border-slate-200 mb-4 shadow-sm">
              <button 
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${uploadType === 'upload' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setUploadType('upload')}
              >
                Upload Video
              </button>
              <button 
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${uploadType === 'heygen' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setUploadType('heygen')}
              >
                HeyGen Embed
              </button>
            </div>
            
            {uploadType === 'upload' ? (
              <>
                <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center mb-3 transition-transform hover:scale-105">
                  <Upload className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-slate-900">Upload Video for QA</h3>
                <p className="text-xs text-slate-500 max-w-sm text-center">
                  Select a video file to review. You can leave timestamped comments and collaborate with your team.
                </p>
                <Button onClick={() => fileInputRef.current?.click()} className="h-8 px-4 text-xs mt-4 shadow-sm hover:shadow-md transition-all">
                  Browse Files
                </Button>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleVideoUpload}
                />
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center mb-3 transition-transform hover:scale-105">
                  <Globe className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-slate-900">Paste HeyGen Embed</h3>
                <p className="text-xs text-slate-500 max-w-sm text-center">
                  Paste the HeyGen URL or iframe code to embed the video directly.
                </p>
                <div className="flex items-center mt-4 w-full max-w-md gap-2">
                  <input
                    type="text"
                    value={heygenUrlInput}
                    onChange={(e) => setHeygenUrlInput(e.target.value)}
                    placeholder="https://app.heygen.com/embeds/..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <Button onClick={handleHeygenSubmit} disabled={!heygenUrlInput.trim()} className="h-8 px-4 text-xs shadow-sm">
                    Embed
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
           <div 
            className="relative w-full max-w-5xl aspect-video bg-white rounded-xl shadow-2xl overflow-hidden group flex items-center justify-center border border-slate-200"
          >
            <video 
              ref={videoRef}
              src={projects.find(p => p.id === selectedProjectId)?.video_type === 'heygen' ? '' : (videoUrl || '')} 
              className={`w-full h-full object-contain ${projects.find(p => p.id === selectedProjectId)?.video_type === 'heygen' || videoError ? 'hidden' : ''}`}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={(e) => {
                if (videoUrl && videoUrl.startsWith('blob:')) {
                  setVideoError(true);
                }
              }}
            />

            {videoError && projects.find(p => p.id === selectedProjectId)?.video_type !== 'heygen' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 p-8 text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="h-5 w-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1.5">Local File Disconnected</h3>
                <p className="text-xs text-slate-500 max-w-sm mb-5">
                  Because this video was uploaded locally, the browser forgot where it was after you reloaded the page. Please re-select the file from your computer to continue reviewing.
                </p>
                <Button onClick={() => reselectInputRef.current?.click()} className="h-8 px-4 text-xs shadow-sm">
                  Re-select Video File
                </Button>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={reselectInputRef} 
                  onChange={handleReselectVideo}
                />
              </div>
            )}

            {projects.find(p => p.id === selectedProjectId)?.video_type === 'heygen' && (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={videoUrl || ''} 
                  title="HeyGen Avatar" 
                  frameBorder="0" 
                  allow="encrypted-media; fullscreen;" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {/* Custom Progress Bar overlay - Only for uploaded videos */}
            {projects.find(p => p.id === selectedProjectId)?.video_type !== 'heygen' && (
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity flex flex-col justify-end pb-6 px-6">
                 <div className="flex items-center justify-between mb-2 text-white/90 font-mono text-xs font-medium">
                   <span>{formatTime(currentTime)}</span>
                   <span>{formatTime(videoRef.current?.duration || 0)}</span>
                 </div>
                 <div 
                   className="w-full h-1.5 bg-white/30 cursor-pointer relative group/scrubber rounded-full"
                   onClick={handleScrub}
                   onMouseMove={(e) => e.buttons === 1 && handleScrub(e)}
                 >
                   <div 
                     className="absolute top-0 left-0 bottom-0 bg-primary transition-all duration-75 relative rounded-full"
                     style={{ width: `${videoRef.current?.duration ? (currentTime / videoRef.current.duration) * 100 : 0}%` }}
                   >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover/scrubber:opacity-100 transition-opacity shadow-lg ring-2 ring-white/80" />
                   </div>
                   
                    {/* Commment Markers */}
                   {comments.map(comment => {
                      const percent = videoRef.current?.duration 
                         ? (comment.timestamp_seconds / videoRef.current.duration) * 100 
                         : 0;
                      const userColor = getUserColor(comment.author_name);
                      return (
                         <div 
                           key={`marker-${comment.id}`}
                           className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 ${userColor.marker} rounded-full shadow-sm shadow-black/50 hover:scale-[1.8] transition-all z-10 cursor-pointer ring-1 ring-white ${comment.is_done ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
                           style={{ left: `${percent}%` }}
                           title={`${comment.author_name}: ${comment.text}`}
                           onClick={(e) => {
                             e.stopPropagation();
                             handleSeek(comment.timestamp_seconds);
                           }}
                         />
                      );
                   })}
                 </div>
              </div>
            )}

            {projects.find(p => p.id === selectedProjectId)?.video_type !== 'heygen' && !isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                <div className="w-16 h-16 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-sm transition-transform hover:scale-110">
                   <Play className="h-8 w-8 ml-1" />
                </div>
              </div>
            )}
            
          </div>
        ) }
      </div>

      {/* Right side - Sidebar */}
      <div className="w-full md:w-[320px] flex flex-col bg-white text-slate-600 shadow-xl z-10 shrink-0 border-l border-slate-200">
        
        {/* Project Selector */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Project</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                {projects.length === 0 && <option disabled>No projects found</option>}
              </select>
            </div>
            
            {selectedProjectId && (
              <div className="ml-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  Version
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setIsUploadingVersion(true)}
                      className="p-1 hover:bg-slate-200 rounded-md transition-colors"
                      title="Add New Version"
                    >
                      <PlusCircle className="h-3 w-3 text-slate-500" />
                    </button>
                    <button 
                      onClick={() => setIsManageVersionsOpen(true)}
                      className="p-1 hover:bg-slate-200 rounded-md transition-colors"
                      title="Manage Versions"
                    >
                      <Settings2 className="h-3 w-3 text-slate-500" />
                    </button>
                  </div>
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 min-w-16 justify-end overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {(currentProject?.video_versions || []).map(v => (
                    <button
                      key={v.version}
                      onClick={() => setSelectedVersion(v.version)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md whitespace-nowrap transition-all ${selectedVersion === v.version ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      title={v.label || `Version ${v.version}`}
                    >
                      {v.label || `V${v.version}`}
                    </button>
                  ))}
                  {(!currentProject?.video_versions || currentProject.video_versions.length === 0) && (
                    <button className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-white text-primary shadow-sm">V1</button>
                  )}
                </div>
              </div>
            )}
        </div>

         {/* Version Management Modal */}
         {isManageVersionsOpen && (
           <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />
                    Manage Versions
                  </h3>
                  <button 
                    onClick={() => {
                      setIsManageVersionsOpen(false);
                      setEditingVersionIdx(null);
                    }}
                    className="p-1 px-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-2 max-h-[300px] overflow-y-auto">
                   {(currentProject?.video_versions || []).map((v, idx) => (
                     <div key={`manage-${v.version}`} className="group p-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors">
                        {editingVersionIdx === idx ? (
                           <div className="flex-1 flex flex-col gap-2">
                              <div className="flex gap-2">
                                 <span className="text-[10px] font-bold text-slate-400 w-8 pt-2">Label</span>
                                 <input 
                                   autoFocus
                                   type="text"
                                   placeholder="Version Label"
                                   value={tempLabel}
                                   onChange={(e) => setTempLabel(e.target.value)}
                                   className="flex-1 bg-white border border-primary/30 rounded-lg px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                 />
                              </div>
                              <div className="flex gap-2">
                                 <span className="text-[10px] font-bold text-slate-400 w-8 pt-2">URL</span>
                                 <input 
                                   type="text"
                                   placeholder="Video URL"
                                   value={tempUrl}
                                   onChange={(e) => setTempUrl(e.target.value)}
                                   className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-mono focus:ring-2 focus:ring-primary/20 outline-none"
                                 />
                              </div>
                              <div className="flex justify-end gap-2 mt-1">
                                 <button onClick={() => setEditingVersionIdx(null)} className="px-3 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                                   Cancel
                                 </button>
                                 <button onClick={() => handleUpdateVersionLabel(idx)} className="px-3 py-1 text-[10px] font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
                                   <Save className="h-3 w-3" /> Save Changes
                                 </button>
                              </div>
                           </div>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedVersion === v.version ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                                  V{v.version}
                                </span>
                                <span className="text-xs font-semibold text-slate-700 truncate">{v.label || 'No label'}</span>
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5 truncate font-mono opacity-60 max-w-[200px]">
                                {v.url?.startsWith('blob:') ? 'Local file (requires re-selecting if reloading page)' : v.url}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingVersionIdx(idx);
                                  setTempLabel(v.label || `V${v.version}`);
                                  setTempUrl(v.url);
                                }}
                                className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteVersion(idx)}
                                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                     </div>
                   ))}
                </div>
                
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
                  Versions track video iterations. Deleting a version removes its link but preserves comments.
                </div>
              </div>
           </div>
         )}

        {/* Filters/Actions Bar */}
        <div className="px-5 py-2.5 flex items-center justify-between shrink-0 border-b border-slate-100">
          <div className="flex items-center text-[15px] font-bold text-slate-900 hover:text-primary cursor-pointer transition-colors">
            All comments
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5 opacity-60"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="flex gap-4 text-slate-400 items-center">
             <button
               onClick={() => setShowDone(!showDone)}
               className={`p-1.5 rounded-lg transition-colors ${!showDone ? 'text-[#ff6a00] bg-[#ffeedd]' : 'hover:text-slate-900 hover:bg-slate-100'}`}
               title={showDone ? "Hide Done Comments" : "Show Done Comments"}
             >
               <Filter className="h-[18px] w-[18px]" strokeWidth={2} />
             </button>
             <Search className="h-[18px] w-[18px] hover:text-slate-900 cursor-pointer transition-colors text-slate-400 opacity-80" strokeWidth={1.5} />
             <MoreHorizontal className="h-[18px] w-[18px] hover:text-slate-900 cursor-pointer transition-colors text-slate-400 opacity-80" strokeWidth={1.5} />
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 font-sans bg-slate-50/50" style={{ scrollbarWidth: 'none' }}>
          {filteredComments.map((comment) => {
             const userColor = getUserColor(comment.author_name);

             return (
               <div 
                 key={comment.id} 
                 className={`bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer border ${comment.is_done ? 'border-slate-100 opacity-60' : 'border-slate-200'}`} 
                 onClick={() => handleSeek(comment.timestamp_seconds)}
               >
                   <div className="flex items-start gap-4">
                     <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                        {/* Header: Name, Time, Checkbox */}
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2.5">
                              <span className={`font-bold text-[14px] text-[#222b3b] tracking-tight ${comment.is_done ? 'line-through text-slate-400' : ''}`}>{comment.author_name}</span>
                              <span className={`shrink-0 inline-flex items-center justify-center ${comment.is_done ? 'bg-slate-100 text-slate-400' : 'bg-[#faebd7] text-[#a54a00]'} font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md`}>
                                {formatTime(comment.timestamp_seconds)}
                              </span>
                           </div>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               handleToggleDone(comment.id, comment.is_done);
                             }}
                             className={`shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center border-[2px] transition-all ${comment.is_done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#e2e8f0] bg-transparent hover:border-slate-300'}`}
                             title={comment.is_done ? "Mark as Pending" : "Mark as Done"}
                           >
                             {comment.is_done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                           </button>
                        </div>
                        
                        {/* Body: Text */}
                        <div className="flex items-start gap-2.5">
                           <div className={`text-xs leading-snug font-semibold ${comment.is_done ? 'text-slate-400' : 'text-[#384252]'} w-full pt-0.5`}>
                             {editingCommentId === comment.id ? (
                               <div className="flex-1 w-full">
                                 <input 
                                   type="text" 
                                   autoFocus
                                   value={editingCommentText}
                                   onChange={(e) => setEditingCommentText(e.target.value)}
                                   onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(comment.id)}
                                   className="w-full bg-white border border-primary/30 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                   onClick={(e) => e.stopPropagation()}
                                 />
                                 <div className="flex justify-end gap-2 mt-2">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setEditingCommentId(null); }} 
                                     className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200"
                                   >Cancel</button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleEditSubmit(comment.id); }} 
                                     className="text-[11px] font-bold bg-[#e87c04] text-white px-2 py-1 rounded hover:opacity-90"
                                   >Save</button>
                                 </div>
                               </div>
                             ) : (
                               <span className={`break-words ${comment.is_done ? 'line-through' : ''}`}>
                                 {comment.text}
                               </span>
                             )}
                           </div>
                        </div>

                      {/* Footer: Actions */}
                      <div className="mt-2 flex items-center justify-start text-slate-500 font-bold">
                         <div className="flex items-center gap-4 text-[13px]">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setNewCommentText(`@${comment.author_name} `);
                               setTimeout(() => commentInputRef.current?.focus(), 10);
                             }}
                             className="hover:text-slate-800 transition-colors flex items-center"
                           >
                               Reply
                           </button>
                           {(selectedAuthor === 'Admin' || selectedAuthor === comment.author_name) && !editingCommentId && (
                             <>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setEditingCommentId(comment.id);
                                   setEditingCommentText(comment.text);
                                 }}
                                 className="hover:text-slate-800 transition-colors flex items-center gap-1.5"
                                 title="Edit Comment"
                               >
                                 <Pencil className="h-[14px] w-[14px] opacity-70" strokeWidth={2} /> Edit
                               </button>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleDeleteComment(comment.id);
                                 }}
                                 className="hover:text-slate-800 transition-colors flex items-center gap-1.5"
                                 title="Delete Comment"
                               >
                                 <Trash2 className="h-[15px] w-[15px] opacity-70" strokeWidth={2} /> Delete
                               </button>
                             </>
                           )}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             );
           })}
          {comments.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-3 mt-20">
              <MessageSquare className="h-10 w-10 text-slate-300" />
              <p className="font-medium text-sm text-slate-400">No comments yet</p>
            </div>
          )}
        </div>

         {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 z-20">
           <div className="bg-white rounded-lg border border-[#e87c04] p-2.5 shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
              <div className="flex gap-3 mb-3 items-start">
                 <textarea 
                   ref={commentInputRef}
                   value={newCommentText}
                   onChange={(e) => setNewCommentText(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleAddComment();
                     }
                   }}
                   rows={3}
                   placeholder="Leave your comment..."
                   className="bg-transparent border-0 focus:ring-0 text-xs w-full placeholder:text-[#94a3b8] text-slate-900 outline-none font-medium resize-none leading-relaxed"
                 />
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-1">
                    <div className="inline-flex items-center justify-center bg-[#faebd7] text-[#a54a00] font-mono text-[11px] font-bold px-1.5 py-1 rounded-md shrink-0">
                        <input
                          type="text"
                          value={projects.find(p => p.id === selectedProjectId)?.video_type !== 'heygen' && videoUrl ? formatTime(currentTime) : manualTimestamp}
                          onChange={(e) => {
                            if (projects.find(p => p.id === selectedProjectId)?.video_type === 'heygen' || !videoUrl) setManualTimestamp(e.target.value);
                          }}
                          className="w-10 bg-transparent border-0 text-center font-mono text-[11px] font-bold text-[#a54a00] outline-none p-0"
                          disabled={projects.find(p => p.id === selectedProjectId)?.video_type !== 'heygen' && !!videoUrl}
                        />
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      onClick={() => setIsAuthorDropdownOpen(!isAuthorDropdownOpen)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#384252] bg-white px-2 py-1 rounded-md border border-[#e2e8f0] cursor-pointer hover:bg-slate-50 transition-colors shadow-sm select-none"
                    >
                       <Users className="h-3.5 w-3.5 text-[#94a3b8]" />
                       <span>{selectedAuthor}</span>
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`ml-0.5 opacity-70 transition-transform duration-200 ${isAuthorDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>

                    {isAuthorDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsAuthorDropdownOpen(false)} 
                        />
                        <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="px-3 py-1.5 mb-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">Post Comment as:</div>
                          
                          <button
                            onClick={() => {
                              setSelectedAuthor('Admin');
                              setIsAuthorDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedAuthor === 'Admin' ? 'text-primary font-semibold' : 'text-slate-600'}`}
                          >
                            <span>Admin</span>
                            {selectedAuthor === 'Admin' && <Check className="h-3 w-3" />}
                          </button>

                          {(projects.find(p => p.id === selectedProjectId)?.editor || '')
                            .split('/')
                            .map(e => e.trim())
                            .filter(Boolean)
                            .map(editor => (
                              <button
                                key={editor}
                                onClick={() => {
                                  setSelectedAuthor(editor);
                                  setIsAuthorDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedAuthor === editor ? 'text-primary font-semibold' : 'text-slate-600'}`}
                              >
                                <span>{editor}</span>
                                {selectedAuthor === editor && <Check className="h-3 w-3" />}
                              </button>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={handleAddComment}
                    disabled={!newCommentText.trim() || (!videoUrl && projects.find(p => p.id === selectedProjectId)?.video_type !== 'heygen')}
                    className="h-7 w-7 bg-[#fcd4b4] hover:bg-[#fabc8f] text-white flex items-center justify-center rounded-md shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send Comment"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
