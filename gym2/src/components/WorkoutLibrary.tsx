import React, { useState, useMemo } from 'react';
import { EXERCISES, BODY_PARTS, Exercise } from '../data/workouts';
import { Search, Filter, Dumbbell, Sparkles, ChevronRight, Info, CheckCircle2, AlertTriangle, Flame, Shield, Activity, Target, Zap, Crown, UserCheck } from 'lucide-react';

interface WorkoutLibraryProps {
  onAskAICoach: (promptText: string) => void;
}

export const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({ onAskAICoach }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((ex) => {
      // Category match
      if (selectedCategory !== 'all' && ex.bodyPart !== selectedCategory) {
        return false;
      }
      // Difficulty match
      if (difficultyFilter !== 'all' && ex.difficulty !== difficultyFilter) {
        return false;
      }
      // Equipment match
      if (equipmentFilter !== 'all' && ex.equipment !== equipmentFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = ex.name.toLowerCase().includes(q);
        const muscleMatch = ex.targetMuscle.toLowerCase().includes(q);
        const equipmentMatch = ex.equipment.toLowerCase().includes(q);
        const bodyPartMatch = ex.bodyPartLabel.toLowerCase().includes(q);
        if (!nameMatch && !muscleMatch && !equipmentMatch && !bodyPartMatch) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery, difficultyFilter, equipmentFilter]);

  const getBodyPartBadge = (bodyPart: string) => {
    switch (bodyPart) {
      case 'biceps':
        return { label: 'Biceps 💪', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'triceps':
        return { label: 'Triceps ⚡', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'chest':
        return { label: 'Chest 🎽', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'back':
        return { label: 'Back 🦍', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'shoulder':
        return { label: 'Shoulders 🛡️', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'legs':
        return { label: 'Legs 🦵', bg: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
      case 'abs':
        return { label: 'Abs & Core 🔥', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
      default:
        return { label: bodyPart, bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Dumbbell className="w-4 h-4" />
            <span>FitFlow Master Workout Database</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Body Part Exercise Directory</h2>
          <p className="text-xs text-slate-300 mt-1">
            Targeted routines for <strong className="text-white">Biceps, Triceps, Back, Legs, Chest, Shoulders & Abs</strong> with form guides & AI Coach assistance.
          </p>
        </div>

        <button
          onClick={() => onAskAICoach("Give me a complete 5-day workout split for muscle mass covering biceps, triceps, chest, back, shoulders, and legs.")}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask AI Coach for Custom Split</span>
        </button>
      </div>

      {/* Body Part Category Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {BODY_PARTS.map((bp) => {
          const isActive = selectedCategory === bp.id;
          return (
            <button
              key={bp.id}
              onClick={() => setSelectedCategory(bp.id)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-blue-500/50'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                  {bp.label.split(' ')[0]}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {bp.count}
                </span>
              </div>
              <div className="text-sm font-bold truncate">{bp.label}</div>
            </button>
          );
        })}
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises (e.g., Bicep Curl, Squat, Bench Press)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold hidden sm:inline">Difficulty:</span>
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Equipment</option>
            <option value="Barbell">Barbell</option>
            <option value="Dumbbell">Dumbbell</option>
            <option value="Cable">Cable</option>
            <option value="Machine">Machine</option>
            <option value="Bodyweight">Bodyweight</option>
          </select>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      {filteredExercises.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
          <Dumbbell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No exercises found</h3>
          <p className="text-xs text-slate-500">Try adjusting your category search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex) => {
            const badge = getBodyPartBadge(ex.bodyPart);
            const diffClass = getDifficultyBadge(ex.difficulty);

            return (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${diffClass}`}>
                      {ex.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {ex.name}
                  </h3>

                  <div className="text-xs text-slate-600 mt-1 space-y-1">
                    <p><strong className="text-slate-800">Target:</strong> {ex.targetMuscle}</p>
                    <p><strong className="text-slate-800">Equipment:</strong> {ex.equipment}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Reps & Sets</span>
                      <span className="font-bold text-slate-900">{ex.recommendedSets} • {ex.recommendedReps}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Rest Time</span>
                      <span className="font-bold text-blue-600">{ex.restTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedExercise(ex)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Form Steps</span>
                  </button>

                  <button
                    onClick={() =>
                      onAskAICoach(
                        `How do I perform ${ex.name} with proper form? Explain target muscles (${ex.targetMuscle}), key steps, breathing tips, and common mistakes to avoid.`
                      )
                    }
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition flex items-center space-x-1 border border-blue-200"
                    title="Ask AI Fitness Assistant about this exercise"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  {selectedExercise.bodyPartLabel} Exercise Guide
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{selectedExercise.name}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Primary Target: <span className="font-bold text-blue-300">{selectedExercise.targetMuscle}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Exercise Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Difficulty</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{selectedExercise.difficulty}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Equipment</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{selectedExercise.equipment}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sets & Reps</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{selectedExercise.recommendedSets} • {selectedExercise.recommendedReps}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Rest Period</span>
                  <span className="text-xs font-bold text-blue-600 block mt-0.5">{selectedExercise.restTime}</span>
                </div>
              </div>

              {/* Instructions Steps */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Step-by-Step Execution Guide</span>
                </h4>

                <div className="space-y-2">
                  {selectedExercise.instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Pro Technique Tip</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed pl-6">
                  {selectedExercise.proTip}
                </p>
              </div>

              {/* Precautions */}
              <div className="bg-rose-50 border border-rose-200/80 p-4 rounded-2xl space-y-1">
                <div className="flex items-center space-x-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Safety Warning & Common Faults</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed pl-6">
                  {selectedExercise.precautions}
                </p>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition"
              >
                Close Guide
              </button>

              <button
                onClick={() => {
                  const ex = selectedExercise;
                  setSelectedExercise(null);
                  onAskAICoach(
                    `How can I maximize my muscle gains on ${ex.name}? Give me optimal warmup sets, breathing cadence, and progressions.`
                  );
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask AI Coach for Custom Warmup</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
