import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Brain, 
  Music, 
  Heart, 
  Play, 
  Pause, 
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  Repeat,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Eye,
  Filter,
  Search,
  Plus,
  Download,
  Share2
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  bpm: number;
  mood: string;
  energy: number;
  image: string;
  isPlaying: boolean;
  isLiked: boolean;
}

interface MentalState {
  type: string;
  confidence: number;
  description: string;
  color: string;
  icon: React.ReactNode;
}

export default function MusicRecommendation() {
  const [currentMentalState, setCurrentMentalState] = useState<MentalState | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [bpmRange, setBpmRange] = useState<[number, number]>([60, 180]);
  const [energyLevel, setEnergyLevel] = useState<number>(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  // Simulate mental state analysis
  useEffect(() => {
    const analyzeMentalState = () => {
      setIsAnalyzing(true);
      setTimeout(() => {
        const states = [
          {
            type: "Relaxed",
            confidence: 85,
            description: "Your brain shows calm alpha waves. Perfect for ambient and chill music.",
            color: "bg-green-500",
            icon: <Heart className="h-5 w-5" />
          },
          {
            type: "Focused",
            confidence: 78,
            description: "High beta activity detected. Ideal for instrumental and concentration music.",
            color: "bg-blue-500",
            icon: <Target className="h-5 w-5" />
          },
          {
            type: "Creative",
            confidence: 72,
            description: "Enhanced theta waves. Great for experimental and inspiring music.",
            color: "bg-purple-500",
            icon: <Eye className="h-5 w-5" />
          },
          {
            type: "Energetic",
            confidence: 68,
            description: "High gamma activity. Perfect for upbeat and energetic tracks.",
            color: "bg-orange-500",
            icon: <Zap className="h-5 w-5" />
          }
        ];
        const randomState = states[Math.floor(Math.random() * states.length)];
        setCurrentMentalState(randomState);
        setIsAnalyzing(false);
        generateRecommendations(randomState);
      }, 2000);
    };

    analyzeMentalState();
  }, []);

  const generateRecommendations = (mentalState: MentalState) => {
    const mockTracks: Track[] = [
      {
        id: "1",
        title: "Midnight City",
        artist: "M83",
        album: "Hurry Up, We're Dreaming",
        duration: "4:03",
        bpm: 128,
        mood: "energetic",
        energy: 85,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170",
        isPlaying: false,
        isLiked: false
      },
      {
        id: "2",
        title: "Weightless",
        artist: "Marconi Union",
        album: "Different Colours",
        duration: "8:10",
        bpm: 60,
        mood: "relaxed",
        energy: 25,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170",
        isPlaying: false,
        isLiked: false
      },
      {
        id: "3",
        title: "Claire de Lune",
        artist: "Debussy",
        album: "Suite Bergamasque",
        duration: "5:30",
        bpm: 72,
        mood: "focused",
        energy: 40,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170",
        isPlaying: false,
        isLiked: false
      },
      {
        id: "4",
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        duration: "5:55",
        bpm: 144,
        mood: "creative",
        energy: 90,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170",
        isPlaying: false,
        isLiked: false
      },
      {
        id: "5",
        title: "Strobe",
        artist: "deadmau5",
        album: "For Lack of a Better Name",
        duration: "10:37",
        bpm: 128,
        mood: "energetic",
        energy: 95,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170",
        isPlaying: false,
        isLiked: false
      },
      {
        id: "6",
        title: "Comfortably Numb",
        artist: "Pink Floyd",
        album: "The Wall",
        duration: "6:23",
        bpm: 68,
        mood: "relaxed",
        energy: 35,
        image: "https://api.builder.io/api/v1/image/assets/TEMP/960747fff14b1f54230227f838aa1b8e5d00df6b?width=170",
        isPlaying: false,
        isLiked: false
      }
    ];

    // Filter tracks based on mental state
    let filteredTracks = mockTracks;
    if (mentalState.type === "Relaxed") {
      filteredTracks = mockTracks.filter(track => track.mood === "relaxed" || track.bpm < 80);
    } else if (mentalState.type === "Focused") {
      filteredTracks = mockTracks.filter(track => track.mood === "focused" || (track.bpm >= 80 && track.bpm <= 120));
    } else if (mentalState.type === "Creative") {
      filteredTracks = mockTracks.filter(track => track.mood === "creative" || track.energy > 70);
    } else if (mentalState.type === "Energetic") {
      filteredTracks = mockTracks.filter(track => track.mood === "energetic" || track.bpm > 120);
    }

    setRecommendations(filteredTracks);
  };

  const togglePlay = (track: Track) => {
    setRecommendations(prev => 
      prev.map(t => ({ ...t, isPlaying: t.id === track.id ? !t.isPlaying : false }))
    );
    setCurrentTrack(track.isPlaying ? null : track);
  };

  const toggleLike = (trackId: string) => {
    setRecommendations(prev => 
      prev.map(t => t.id === trackId ? { ...t, isLiked: !t.isLiked } : t)
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/home" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-spotify-green rounded-full mb-6">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Music <span className="text-spotify-green">Recommendations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized music suggestions based on your brain activity and mental state
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Mental State Analysis */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-spotify-green" />
                    Mental State Analysis
                  </CardTitle>
                  <CardDescription>
                    Current brain activity and mood detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Analyzing your mental state...</p>
                    </div>
                  ) : currentMentalState ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentMentalState.color} text-white`}>
                            {currentMentalState.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{currentMentalState.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              Confidence: {currentMentalState.confidence}%
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {currentMentalState.confidence}% confident
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentMentalState.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Confidence Level</span>
                          <span>{currentMentalState.confidence}%</span>
                        </div>
                        <Progress value={currentMentalState.confidence} className="h-2" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No mental state data available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-spotify-green" />
                    Filters
                  </CardTitle>
                  <CardDescription>
                    Customize your recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mood Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mood</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["all", "relaxed", "focused", "creative", "energetic"].map((mood) => (
                        <Button
                          key={mood}
                          variant={selectedMood === mood ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedMood(mood)}
                          className="capitalize"
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* BPM Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      BPM Range: {bpmRange[0]} - {bpmRange[1]}
                    </label>
                    <Slider
                      value={bpmRange}
                      onValueChange={(value) => setBpmRange(value as [number, number])}
                      max={200}
                      min={60}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Energy Level */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Energy Level: {energyLevel}%
                    </label>
                    <Slider
                      value={[energyLevel]}
                      onValueChange={(value) => setEnergyLevel(value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-spotify-green" />
                        Recommended Tracks
                      </CardTitle>
                      <CardDescription>
                        Based on your mental state and preferences
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Shuffle className="h-4 w-4 mr-2" />
                        Shuffle
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="relative">
                          <img
                            src={track.image}
                            alt={track.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <button
                            onClick={() => togglePlay(track)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 hover:opacity-100 transition-opacity"
                          >
                            {track.isPlaying ? (
                              <Pause className="h-4 w-4 text-white" />
                            ) : (
                              <Play className="h-4 w-4 text-white" />
                            )}
                          </button>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium truncate">{track.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {track.artist} • {track.album}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Badge variant="outline" className="text-xs">
                                {track.bpm} BPM
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {track.mood}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {track.duration}
                              </span>
                              <span className="flex items-center">
                                <Activity className="h-3 w-3 mr-1" />
                                {track.energy}% energy
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleLike(track.id)}
                                className={`p-2 rounded-full transition-colors ${
                                  track.isLiked 
                                    ? "text-red-500 hover:text-red-600" 
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <Heart className={`h-4 w-4 ${track.isLiked ? "fill-current" : ""}`} />
                              </button>
                              <button className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                <Plus className="h-4 w-4" />
                              </button>
                              <button className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Track Player */}
              {currentTrack && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5 text-spotify-green" />
                      Now Playing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <img
                        src={currentTrack.image}
                        alt={currentTrack.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{currentTrack.title}</h3>
                        <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">0:00</span>
                          <div className="flex-1 bg-muted rounded-full h-1">
                            <div className="bg-spotify-green h-1 rounded-full w-1/3"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{currentTrack.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-full hover:bg-muted transition-colors">
                          <SkipBack className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full bg-spotify-green text-white hover:bg-spotify-green/90 transition-colors">
                          <Pause className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-muted transition-colors">
                          <SkipForward className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-muted transition-colors">
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
