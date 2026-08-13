export interface Exercise {
  id: string;
  name: string;
  bodyPart: 'biceps' | 'triceps' | 'chest' | 'back' | 'shoulder' | 'legs' | 'abs';
  bodyPartLabel: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight';
  recommendedSets: string;
  recommendedReps: string;
  restTime: string;
  instructions: string[];
  proTip: string;
  precautions: string;
}

export const BODY_PARTS = [
  { id: 'all', label: 'All Exercises', icon: 'Dumbbell', count: 35 },
  { id: 'biceps', label: 'Biceps', icon: 'Biceps', count: 5, color: 'from-amber-500 to-orange-600' },
  { id: 'triceps', label: 'Triceps', icon: 'Zap', count: 5, color: 'from-blue-500 to-indigo-600' },
  { id: 'chest', label: 'Chest', icon: 'Shield', count: 5, color: 'from-red-500 to-rose-600' },
  { id: 'back', label: 'Back', icon: 'Crown', count: 5, color: 'from-emerald-500 to-teal-600' },
  { id: 'shoulder', label: 'Shoulders', icon: 'Target', count: 5, color: 'from-purple-500 to-violet-600' },
  { id: 'legs', label: 'Legs', icon: 'Activity', count: 5, color: 'from-cyan-500 to-blue-600' },
  { id: 'abs', label: 'Abs & Core', icon: 'Flame', count: 5, color: 'from-amber-600 to-red-500' },
] as const;

export const EXERCISES: Exercise[] = [
  // BICEPS
  {
    id: 'ex-bicep-1',
    name: 'Barbell Bicep Curl',
    bodyPart: 'biceps',
    bodyPartLabel: 'Biceps',
    targetMuscle: 'Biceps Brachii (Short & Long Head)',
    secondaryMuscles: ['Brachialis', 'Forearm Flexors'],
    difficulty: 'Beginner',
    equipment: 'Barbell',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '8 - 12 Reps',
    restTime: '60 - 90 seconds',
    instructions: [
      'Stand upright holding an EZ or straight barbell with an underhand grip (palms facing up), shoulder-width apart.',
      'Keep your elbows pinned close to your torso and shoulders retracted.',
      'Curl the weight up toward chest level while contracting your biceps. Pause and squeeze firmly at the top for 1 second.',
      'Slowly lower the barbell back to full arm extension under complete control (2-3 seconds eccentric).'
    ],
    proTip: 'Avoid swinging your lower back or using momentum. Keep core tight and elbows steady.',
    precautions: 'If you feel wrist strain with a straight bar, switch to an EZ curl bar.'
  },
  {
    id: 'ex-bicep-2',
    name: 'Dumbbell Hammer Curls',
    bodyPart: 'biceps',
    bodyPartLabel: 'Biceps',
    targetMuscle: 'Brachialis & Brachioradialis (Arm Thickness)',
    secondaryMuscles: ['Biceps Brachii', 'Forearms'],
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    recommendedSets: '3 Sets',
    recommendedReps: '10 - 12 Reps',
    restTime: '60 seconds',
    instructions: [
      'Stand tall holding dumbbells at your sides with palms facing inward towards each other (neutral grip).',
      'Without swinging your upper arm, curl the right dumbbell up toward your right shoulder.',
      'Squeeze the contraction at top position, then control the descent down.',
      'Repeat with the left arm or curl both arms simultaneously.'
    ],
    proTip: 'Hammer curls target arm thickness and forearm strength, enhancing overall upper arm mass.',
    precautions: 'Do not lean backward as the weight gets heavier.'
  },
  {
    id: 'ex-bicep-3',
    name: 'Incline Dumbbell Bicep Curl',
    bodyPart: 'biceps',
    bodyPartLabel: 'Biceps',
    targetMuscle: 'Biceps Long Head (Bicep Peak)',
    secondaryMuscles: ['Brachialis'],
    difficulty: 'Intermediate',
    equipment: 'Dumbbell',
    recommendedSets: '3 Sets',
    recommendedReps: '10 - 12 Reps',
    restTime: '60 seconds',
    instructions: [
      'Sit back on an incline bench set at 45 to 60 degrees with dumbbells hanging straight down behind your body.',
      'Keep shoulders against the bench and curl both dumbbells upward while supinating your wrists (turning palms up).',
      'Pause at the peak contraction, feeling an intense deep stretch at the bottom position.',
      'Lower under steady control.'
    ],
    proTip: 'The incline position creates maximal stretch on the long head of the bicep for peak growth.',
    precautions: 'Start lighter than usual to prevent shoulder joint strain.'
  },
  {
    id: 'ex-bicep-4',
    name: 'Preacher Curl',
    bodyPart: 'biceps',
    bodyPartLabel: 'Biceps',
    targetMuscle: 'Biceps Short Head (Inner Bicep)',
    secondaryMuscles: ['Forearms'],
    difficulty: 'Intermediate',
    equipment: 'Machine',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '10 - 12 Reps',
    restTime: '60 - 90 seconds',
    instructions: [
      'Position your upper arms firmly flat against the preacher bench pad with chest pressed gently against the top.',
      'Grip the EZ-bar with palms facing upward.',
      'Lower the weight until your arms are almost fully extended, feeling a deep stretch.',
      'Curl the bar up toward your shoulders, squeezing hard at top contraction.'
    ],
    proTip: 'Eliminates all cheating and body momentum for pure bicep isolation.',
    precautions: 'Do not hyper-extend or lock out knees/elbows violently at the bottom.'
  },
  {
    id: 'ex-bicep-5',
    name: 'High Cable Bicep Curl',
    bodyPart: 'biceps',
    bodyPartLabel: 'Biceps',
    targetMuscle: 'Biceps Brachii (Peak Isolation)',
    secondaryMuscles: ['Brachialis'],
    difficulty: 'Intermediate',
    equipment: 'Cable',
    recommendedSets: '3 Sets',
    recommendedReps: '12 - 15 Reps',
    restTime: '45 - 60 seconds',
    instructions: [
      'Stand between two high cable pulleys, holding single D-handles with arms outstretched horizontally in a "T" pose.',
      'Curl handles inward towards your ears while keeping upper arms parallel to the floor.',
      'Squeeze biceps forcefully for 1-2 seconds.',
      'Return slowly to starting extended T position.'
    ],
    proTip: 'Simulates a double bicep pose under continuous cable tension.',
    precautions: 'Keep shoulders relaxed down and away from ears.'
  },

  // TRICEPS
  {
    id: 'ex-tricep-1',
    name: 'Cable Tricep Rope Pushdown',
    bodyPart: 'triceps',
    bodyPartLabel: 'Triceps',
    targetMuscle: 'Triceps Lateral & Medial Head',
    secondaryMuscles: ['Triceps Long Head', 'Anconeus'],
    difficulty: 'Beginner',
    equipment: 'Cable',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '12 - 15 Reps',
    restTime: '60 seconds',
    instructions: [
      'Attach a rope attachment to a high pulley. Stand with knees slightly bent and torso leaning forward slightly.',
      'Keep upper arms pinned tightly against your ribcage throughout the movement.',
      'Push the rope down until arms are fully locked out, flaring the rope ends outward at the bottom.',
      'Return under control until forearms reach parallel to floor.'
    ],
    proTip: 'Spreading the rope apart at the bottom maximizes peak contraction on the outer lateral head.',
    precautions: 'Do not let your shoulders flare or upper arms move forward.'
  },
  {
    id: 'ex-tricep-2',
    name: 'Skull Crushers (Lying Triceps Extension)',
    bodyPart: 'triceps',
    bodyPartLabel: 'Triceps',
    targetMuscle: 'Triceps Long Head & Lateral Head',
    secondaryMuscles: ['Forearms'],
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    recommendedSets: '3 Sets',
    recommendedReps: '8 - 12 Reps',
    restTime: '90 seconds',
    instructions: [
      'Lie back on a flat bench holding an EZ-bar directly above your chest with narrow overhand grip.',
      'Keep upper arms vertical and bend elbows to lower the bar toward your forehead or behind your head.',
      'Pause slightly when forearms break 90 degrees, then extend elbows forcefully to push bar back up.',
      'Keep elbows pointing straight up toward ceiling, avoid flaring out.'
    ],
    proTip: 'Lowering the bar slightly behind the top of your head keeps continuous tension on the long head.',
    precautions: 'Use a spotter or start light to protect your elbows and face.'
  },
  {
    id: 'ex-tricep-3',
    name: 'Overhead Dumbbell Tricep Extension',
    bodyPart: 'triceps',
    bodyPartLabel: 'Triceps',
    targetMuscle: 'Triceps Long Head (Tricep Sweep)',
    secondaryMuscles: ['Shoulders', 'Core'],
    difficulty: 'Intermediate',
    equipment: 'Dumbbell',
    recommendedSets: '3 Sets',
    recommendedReps: '10 - 12 Reps',
    restTime: '60 seconds',
    instructions: [
      'Sit on a bench with back support or stand upright, holding one heavy dumbbell overhead with both hands forming a heart shape around inner plate.',
      'Lower the dumbbell behind your head by bending elbows while keeping upper arms close to ears.',
      'Stretch triceps deeply at bottom, then press dumbbell back up until arms are extended.'
    ],
    proTip: 'Great for building long head mass which makes up 2/3 of total arm size.',
    precautions: 'Keep core tight to prevent arched lumbar spine.'
  },
  {
    id: 'ex-tricep-4',
    name: 'Close-Grip Bench Press',
    bodyPart: 'triceps',
    bodyPartLabel: 'Triceps',
    targetMuscle: 'Triceps All 3 Heads & Inner Chest',
    secondaryMuscles: ['Anterior Deltoids'],
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '6 - 10 Reps',
    restTime: '90 seconds',
    instructions: [
      'Lie on flat bench. Grip barbell with hands shoulder-width apart (approx 8-12 inches).',
      'Unrack bar and lower under control to lower chest level with elbows tucked close to sides.',
      'Press bar straight back up to full extension while concentrating on driving through triceps.'
    ],
    proTip: 'Hand spacing should not be closer than shoulder width to protect wrist joint health.',
    precautions: 'Use a safety rack or spotter for heavy loads.'
  },
  {
    id: 'ex-tricep-5',
    name: 'Parallel Bar Bodyweight Dips',
    bodyPart: 'triceps',
    bodyPartLabel: 'Triceps',
    targetMuscle: 'Triceps Brachii & Lower Chest',
    secondaryMuscles: ['Front Deltoid', 'Core'],
    difficulty: 'Advanced',
    equipment: 'Bodyweight',
    recommendedSets: '3 Sets',
    recommendedReps: '8 - 15 Reps',
    restTime: '90 seconds',
    instructions: [
      'Grip dip bars and lock out arms, supporting bodyweight vertically.',
      'Keep body upright (minimize forward chest lean) to place maximum emphasis on triceps.',
      'Lower body until elbows are at a 90-degree angle.',
      'Press upward forcefully through palms until arms are straight.'
    ],
    proTip: 'If bodyweight is easy, add a dip belt with weight plates.',
    precautions: 'Avoid dropping below 90 degrees if you have shoulder impingement history.'
  },

  // CHEST
  {
    id: 'ex-chest-1',
    name: 'Barbell Bench Press',
    bodyPart: 'chest',
    bodyPartLabel: 'Chest',
    targetMuscle: 'Pectoralis Major (Overall Chest Mass)',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    difficulty: 'Beginner',
    equipment: 'Barbell',
    recommendedSets: '4 Sets',
    recommendedReps: '6 - 10 Reps',
    restTime: '120 seconds',
    instructions: [
      'Lie flat on bench, feet firmly planted on floor. Grip bar slightly wider than shoulder-width.',
      'Retract shoulder blades back and down into bench, creating a subtle arch in upper back.',
      'Unrack bar, lower under control to mid-chest/sternum level, touching gently.',
      'Press bar explosively up and back slightly over shoulders to starting position.'
    ],
    proTip: 'Drive through heels and squeeze shoulder blades together throughout entire set.',
    precautions: 'Never bounce the bar off your chest.'
  },
  {
    id: 'ex-chest-2',
    name: 'Incline Dumbbell Bench Press',
    bodyPart: 'chest',
    bodyPartLabel: 'Chest',
    targetMuscle: 'Pectoralis Major (Upper Clavicular Head)',
    secondaryMuscles: ['Front Deltoids', 'Triceps'],
    difficulty: 'Intermediate',
    equipment: 'Dumbbell',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '8 - 12 Reps',
    restTime: '90 seconds',
    instructions: [
      'Set incline bench at 30 to 45 degrees. Kick dumbbells up to shoulder level as you lie back.',
      'Press dumbbells up above chest level until arms are straight.',
      'Lower dumbbells slowly toward outer chest level, feeling deep stretch in upper pecs.',
      'Press back up, bringing dumbbells close at top without clacking.'
    ],
    proTip: 'Incline bench angle above 45 degrees shifts work away from chest onto front shoulders. Keep angle at 30° for best upper chest activation.',
    precautions: 'Maintain wrist alignment over elbows.'
  },
  {
    id: 'ex-chest-3',
    name: 'Standing Cable Chest Flyes',
    bodyPart: 'chest',
    bodyPartLabel: 'Chest',
    targetMuscle: 'Pectoralis Major (Inner Chest Separation)',
    secondaryMuscles: ['Anterior Deltoid'],
    difficulty: 'Beginner',
    equipment: 'Cable',
    recommendedSets: '3 Sets',
    recommendedReps: '12 - 15 Reps',
    restTime: '60 seconds',
    instructions: [
      'Set cable pulleys at shoulder height. Step forward into staggered stance holding handles.',
      'Keep slight bend in elbows, bring handles together in front of chest in a hugging arc motion.',
      'Squeeze chest muscles together forcefully at center for 1 second.',
      'Control handles back into wide chest stretch.'
    ],
    proTip: 'Cables provide constant tension throughout full range of motion unlike dumbbells.',
    precautions: 'Do not let arms over-extend backward past shoulder line.'
  },
  {
    id: 'ex-chest-4',
    name: 'Dumbbell Chest Pullover',
    bodyPart: 'chest',
    bodyPartLabel: 'Chest',
    targetMuscle: 'Serratus Anterior & Lower Chest',
    secondaryMuscles: ['Lats', 'Triceps Long Head'],
    difficulty: 'Intermediate',
    equipment: 'Dumbbell',
    recommendedSets: '3 Sets',
    recommendedReps: '10 - 12 Reps',
    restTime: '60 - 90 seconds',
    instructions: [
      'Lie perpendicular across flat bench with upper back supported on pad and feet on ground.',
      'Hold one dumbbell vertically with palms against inner plate directly over chest.',
      'Keep elbows slightly bent, lower dumbbell back behind your head in deep arc until upper arms are parallel to floor.',
      'Pull dumbbell back over chest using chest and serratus contraction.'
    ],
    proTip: 'Great exercise for expanding ribcage and building serratus muscle outline.',
    precautions: 'Keep hips low below bench level.'
  },
  {
    id: 'ex-chest-5',
    name: 'Bodyweight Push-Ups',
    bodyPart: 'chest',
    bodyPartLabel: 'Chest',
    targetMuscle: 'Chest, Core & Shoulder Complex',
    secondaryMuscles: ['Triceps', 'Serratus', 'Abs'],
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '15 - 20 Reps',
    restTime: '60 seconds',
    instructions: [
      'Get into plank position with hands slightly wider than shoulder width and body in straight line.',
      'Lower chest toward floor by bending elbows at 45-degree angle to body.',
      'Touch chest near ground, then push body back up to starting plank.'
    ],
    proTip: 'Elevate feet on bench for incline push-ups (targets upper chest).',
    precautions: 'Avoid letting hips sag or lower back arch.'
  },

  // BACK
  {
    id: 'ex-back-1',
    name: 'Barbell Bent-Over Row',
    bodyPart: 'back',
    bodyPartLabel: 'Back',
    targetMuscle: 'Latissimus Dorsi & Rhomboids (Back Thickness)',
    secondaryMuscles: ['Trapezius', 'Rear Deltoids', 'Biceps'],
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    recommendedSets: '4 Sets',
    recommendedReps: '8 - 10 Reps',
    restTime: '90 - 120 seconds',
    instructions: [
      'Hinge at hips at 45-degree torso angle, knees slightly bent, back flat and core engaged.',
      'Grip barbell overhand slightly wider than shoulder-width hanging at arm length.',
      'Pull bar up toward lower ribcage / navel area, driving elbows behind body.',
      'Squeeze shoulder blades together at top, lower bar under control.'
    ],
    proTip: 'Pulling to navel targets lower lats; pulling to sternum targets upper back/rhomboids.',
    precautions: 'Keep spine neutral; do not round lumbar back.'
  },
  {
    id: 'ex-back-2',
    name: 'Lat Pulldown',
    bodyPart: 'back',
    bodyPartLabel: 'Back',
    targetMuscle: 'Latissimus Dorsi (V-Taper Back Width)',
    secondaryMuscles: ['Rhomboids', 'Biceps', 'Brachialis'],
    difficulty: 'Beginner',
    equipment: 'Cable',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '10 - 12 Reps',
    restTime: '60 - 90 seconds',
    instructions: [
      'Sit at pulldown machine, securing thighs under pad. Grip wide bar with overhand grip.',
      'Lean back slightly (10-15 degrees) and pull bar down towards upper chest.',
      'Drive elbows down and back, feeling lats contract.',
      'Slowly return bar overhead to full extension.'
    ],
    proTip: 'Think of pulling with your elbows rather than gripping hard with hands.',
    precautions: 'Do not pull bar behind neck (prevents shoulder injury).'
  },
  {
    id: 'ex-back-3',
    name: 'Conventional Barbell Deadlift',
    bodyPart: 'back',
    bodyPartLabel: 'Back',
    targetMuscle: 'Erector Spinae, Glutes & Hamstrings',
    secondaryMuscles: ['Lats', 'Traps', 'Forearms', 'Core'],
    difficulty: 'Advanced',
    equipment: 'Barbell',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '5 - 8 Reps',
    restTime: '120 - 180 seconds',
    instructions: [
      'Stand with feet hip-width under bar, shins close to metal.',
      'Hinge hips, grip bar shoulder-width, flatten back, pack lats, and pull slack out of bar.',
      'Drive feet through floor, extending knees and hips together until standing tall at lockout.',
      'Hinge at hips to lower bar back to floor along shins.'
    ],
    proTip: 'King of compound movements for building whole-body power and back thickness.',
    precautions: 'Maintain braced spine from start to finish. Never round lower spine.'
  },
  {
    id: 'ex-back-4',
    name: 'Seated Cable Row',
    bodyPart: 'back',
    bodyPartLabel: 'Back',
    targetMuscle: 'Mid-Back, Rhomboids & Traps',
    secondaryMuscles: ['Latissimus Dorsi', 'Biceps'],
    difficulty: 'Beginner',
    equipment: 'Cable',
    recommendedSets: '3 Sets',
    recommendedReps: '10 - 12 Reps',
    restTime: '60 seconds',
    instructions: [
      'Sit at cable machine with feet on footrests and knees slightly bent. Grip V-bar handle.',
      'Sit tall with shoulders pulled down. Pull handle toward abdomen.',
      'Squeeze shoulder blades firmly together at peak contraction.',
      'Extend arms fully forward while resisting weight pull.'
    ],
    proTip: 'Avoid excessive rocking backward and forward.',
    precautions: 'Keep chest lifted throughout movement.'
  },
  {
    id: 'ex-back-5',
    name: 'Single-Arm Dumbbell Row',
    bodyPart: 'back',
    bodyPartLabel: 'Back',
    targetMuscle: 'Latissimus Dorsi Isolation',
    secondaryMuscles: ['Rhomboids', 'Rear Delts', 'Biceps'],
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    recommendedSets: '3 Sets',
    recommendedReps: '10 - 12 Reps each side',
    restTime: '60 seconds',
    instructions: [
      'Place left knee and left hand on bench, torso parallel to floor. Hold dumbbell in right hand.',
      'Pull dumbbell up toward hip, keeping elbow tucked close to body.',
      'Squeeze lat at top of movement, lower dumbbell down for full stretch.'
    ],
    proTip: 'Rowing to hip instead of chest engages lower lat fiber orientation better.',
    precautions: 'Keep spine level without rotating hips dramatically.'
  },

  // SHOULDERS
  {
    id: 'ex-shoulder-1',
    name: 'Seated Dumbbell Shoulder Press',
    bodyPart: 'shoulder',
    bodyPartLabel: 'Shoulders',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '8 - 12 Reps',
    restTime: '90 seconds',
    instructions: [
      'Sit on bench with vertical back support holding dumbbells at ear level with palms facing forward.',
      'Press dumbbells upward overhead until arms extend without locking elbows.',
      'Lower dumbbells back down with control to ear/jaw level.'
    ],
    proTip: 'Slightly angling palms inward at 30 degrees (scaption plane) is safer for rotator cuff.',
    precautions: 'Do not arch lower back excessively.'
  },
  {
    id: 'ex-shoulder-2',
    name: 'Dumbbell Lateral Raises',
    bodyPart: 'shoulder',
    bodyPartLabel: 'Shoulders',
    targetMuscle: 'Lateral Deltoids (3D Capped Shoulder Width)',
    secondaryMuscles: ['Trapezius', 'Supraspinatus'],
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    recommendedSets: '4 Sets',
    recommendedReps: '12 - 15 Reps',
    restTime: '60 seconds',
    instructions: [
      'Stand holding dumbbells at your sides with palms facing each other and slight bend in elbows.',
      'Raise dumbbells out to sides until arms are parallel with floor (shoulder height).',
      'Pause for split second at top, lower slowly back down.'
    ],
    proTip: 'Think of pushing dumbbells outward toward side walls rather than lifting up.',
    precautions: 'Do not shrug shoulders up toward ears.'
  },
  {
    id: 'ex-shoulder-3',
    name: 'Face Pulls with Cable Rope',
    bodyPart: 'shoulder',
    bodyPartLabel: 'Shoulders',
    targetMuscle: 'Posterior Deltoids & Rotator Cuff',
    secondaryMuscles: ['Rhomboids', 'Mid Traps'],
    difficulty: 'Beginner',
    equipment: 'Cable',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '15 - 20 Reps',
    restTime: '60 seconds',
    instructions: [
      'Set cable pulley at upper chest height with rope attachment. Overhand thumbs-back grip.',
      'Step back, pull rope toward nose/forehead while separating hands outward.',
      'Focus on external shoulder rotation (hands ending up behind elbows).',
      'Hold 1 second squeeze, return forward.'
    ],
    proTip: 'Essential exercise for posture improvement and rotator cuff health.',
    precautions: 'Use light-to-moderate weight with high reps.'
  },
  {
    id: 'ex-shoulder-4',
    name: 'Barbell Military Overhead Press',
    bodyPart: 'shoulder',
    bodyPartLabel: 'Shoulders',
    targetMuscle: 'Anterior Deltoids & Upper Body Strength',
    secondaryMuscles: ['Triceps', 'Core', 'Upper Chest'],
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    recommendedSets: '4 Sets',
    recommendedReps: '6 - 8 Reps',
    restTime: '120 seconds',
    instructions: [
      'Stand tall, feet shoulder-width. Hold bar at collarbone height with grip slightly outside shoulders.',
      'Brace core and glutes. Press bar overhead in straight path, tucking chin back slightly as bar passes face.',
      'Lock out overhead with bar centered over mid-foot.'
    ],
    proTip: 'Squeezing glutes tightly protects lower back from arching.',
    precautions: 'Do not use leg bounce (that becomes a push press).'
  },
  {
    id: 'ex-shoulder-5',
    name: 'Reverse Pec Deck Flyes',
    bodyPart: 'shoulder',
    bodyPartLabel: 'Shoulders',
    targetMuscle: 'Posterior Deltoids (Rear Shoulder Isolation)',
    secondaryMuscles: ['Rhomboids', 'Traps'],
    difficulty: 'Beginner',
    equipment: 'Machine',
    recommendedSets: '3 Sets',
    recommendedReps: '12 - 15 Reps',
    restTime: '60 seconds',
    instructions: [
      'Sit facing machine chest against pad. Adjust handles to chest height.',
      'Grip handles with arms outstretched. Drive arms outward and backward in wide arc.',
      'Contract rear delts at back position, return slowly to starting position.'
    ],
    proTip: 'Keep elbows high in line with shoulders.',
    precautions: 'Do not use momentum to swing weight.'
  },

  // LEGS
  {
    id: 'ex-leg-1',
    name: 'Barbell Back Squat',
    bodyPart: 'legs',
    bodyPartLabel: 'Legs',
    targetMuscle: 'Quadriceps, Glutes & Hamstrings',
    secondaryMuscles: ['Adductors', 'Calves', 'Core', 'Lower Back'],
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    recommendedSets: '4 Sets',
    recommendedReps: '6 - 10 Reps',
    restTime: '120 - 180 seconds',
    instructions: [
      'Rest bar across upper traps (high bar) or mid-traps (low bar). Step out of rack, feet shoulder-width apart.',
      'Inhale deep into abdomen, brace core. Initiate squat by bending hips and knees simultaneously.',
      'Lower until thighs break parallel to floor.',
      'Drive through heels and mid-foot explosively back up to top position.'
    ],
    proTip: 'Keep knees tracking in line with toes throughout the lift.',
    precautions: 'Do not let knees collapse inward (valgus collapse).'
  },
  {
    id: 'ex-leg-2',
    name: 'Romanian Deadlift (RDL)',
    bodyPart: 'legs',
    bodyPartLabel: 'Legs',
    targetMuscle: 'Hamstrings & Gluteus Maximus',
    secondaryMuscles: ['Erector Spinae', 'Forearms', 'Core'],
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '8 - 12 Reps',
    restTime: '90 seconds',
    instructions: [
      'Stand holding barbell at hip height with soft bend in knees.',
      'Push hips backward like reaching for a wall behind you, lowering bar along thighs and shins.',
      'Lower until deep stretch is felt in hamstrings (around mid-shin).',
      'Drive hips forward to stand tall, squeezing glutes at top.'
    ],
    proTip: 'Movement is a hip hinge, not a knee squat. Keep bar close to legs.',
    precautions: 'Stop lowering if spine begins to curve.'
  },
  {
    id: 'ex-leg-3',
    name: 'Bulgarian Split Squat',
    bodyPart: 'legs',
    bodyPartLabel: 'Legs',
    targetMuscle: 'Quadriceps & Glute Isolation (Unilateral)',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    difficulty: 'Intermediate',
    equipment: 'Dumbbell',
    recommendedSets: '3 Sets',
    recommendedReps: '10 - 12 Reps per leg',
    restTime: '60 - 90 seconds',
    instructions: [
      'Stand a step away from bench, placing top of rear foot flat on bench pad behind you.',
      'Hold dumbbells at sides. Lower rear knee toward floor while front leg bends to 90 degrees.',
      'Push through front heel to return to top standing position.'
    ],
    proTip: 'Fixes muscle imbalances between left and right leg dramatically.',
    precautions: 'Keep front knee stabilized directly over front ankle.'
  },
  {
    id: 'ex-leg-4',
    name: 'Leg Press Machine',
    bodyPart: 'legs',
    bodyPartLabel: 'Legs',
    targetMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings'],
    difficulty: 'Beginner',
    equipment: 'Machine',
    recommendedSets: '3 - 4 Sets',
    recommendedReps: '10 - 15 Reps',
    restTime: '90 seconds',
    instructions: [
      'Sit on leg press machine with feet hip-width on sled platform.',
      'Unlatch safety bars. Lower platform until knees bend at 90 degrees.',
      'Press sled back up through full foot contact.'
    ],
    proTip: 'High foot placement emphasizes glutes/hamstrings; low placement emphasizes quads.',
    precautions: 'NEVER lock out knees at top of extension!'
  },
  {
    id: 'ex-leg-5',
    name: 'Standing Calf Raises',
    bodyPart: 'legs',
    bodyPartLabel: 'Legs',
    targetMuscle: 'Gastrocnemius & Soleus (Calf Muscle)',
    secondaryMuscles: ['Achilles Tendon'],
    difficulty: 'Beginner',
    equipment: 'Machine',
    recommendedSets: '4 Sets',
    recommendedReps: '15 - 20 Reps',
    restTime: '45 - 60 seconds',
    instructions: [
      'Stand on calf machine step with balls of feet on edge and heels hanging low.',
      'Lower heels down as far as comfortable for deep stretch (2-second pause).',
      'Rise up on tiptoes as high as possible, holding peak squeeze for 1 second.'
    ],
    proTip: 'Pausing at the bottom stretch eliminates Achilles tendon elasticity bounce.',
    precautions: 'Keep knees straight but un-locked.'
  },

  // ABS & CORE
  {
    id: 'ex-abs-1',
    name: 'Hanging Knee/Leg Raises',
    bodyPart: 'abs',
    bodyPartLabel: 'Abs & Core',
    targetMuscle: 'Lower Rectus Abdominis & Hip Flexors',
    secondaryMuscles: ['Obliques', 'Grip Strength'],
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    recommendedSets: '3 Sets',
    recommendedReps: '12 - 15 Reps',
    restTime: '60 seconds',
    instructions: [
      'Hang from pull-up bar with overhand grip and dead-hang arms.',
      'Contract abs and curl knees/legs up toward chest level while tilting pelvis upward.',
      'Pause at top, lower legs down slowly without swinging.'
    ],
    proTip: 'Tilt your pelvis up at the top to engage abs instead of just hip flexors.',
    precautions: 'Avoid swinging body like a pendulum.'
  },
  {
    id: 'ex-abs-2',
    name: 'Cable Kneeling Woodchopper',
    bodyPart: 'abs',
    bodyPartLabel: 'Abs & Core',
    targetMuscle: 'Internal & External Obliques',
    secondaryMuscles: ['Transverse Abdominis', 'Shoulders'],
    difficulty: 'Intermediate',
    equipment: 'Cable',
    recommendedSets: '3 Sets',
    recommendedReps: '12 Reps per side',
    restTime: '60 seconds',
    instructions: [
      'Set cable pulley at top position with single handle. Kneel sideways to cable machine.',
      'Grip handle with both hands over shoulder, rotate torso diagonally down across body to opposite hip.',
      'Contract obliques, control rotation back to starting position.'
    ],
    proTip: 'Rotational core power transfers directly to athletic movements.',
    precautions: 'Rotate through torso rather than pulling with arms.'
  },
  {
    id: 'ex-abs-3',
    name: 'Ab Wheel Rollout',
    bodyPart: 'abs',
    bodyPartLabel: 'Abs & Core',
    targetMuscle: 'Transverse Abdominis & Full Core Bracing',
    secondaryMuscles: ['Lats', 'Chest', 'Shoulders'],
    difficulty: 'Advanced',
    equipment: 'Bodyweight',
    recommendedSets: '3 Sets',
    recommendedReps: '8 - 12 Reps',
    restTime: '60 - 90 seconds',
    instructions: [
      'Kneel on pad holding ab roller wheel on floor in front of knees.',
      'Tuck chin and round upper back slightly (hollow body posture). Roll wheel forward slowly.',
      'Extend as far as possible without arching lower spine, then pull back using core contraction.'
    ],
    proTip: 'One of the highest EMG-activated core exercises ever tested.',
    precautions: 'If lower back sags or feels pressure, decrease roll distance.'
  },
  {
    id: 'ex-abs-4',
    name: 'Weighted Decline Crunch',
    bodyPart: 'abs',
    bodyPartLabel: 'Abs & Core',
    targetMuscle: 'Upper Rectus Abdominis (Six-Pack Muscle)',
    secondaryMuscles: ['Hip Flexors'],
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    recommendedSets: '3 Sets',
    recommendedReps: '12 - 15 Reps',
    restTime: '60 seconds',
    instructions: [
      'Secure feet in decline bench pads. Hold weight plate or dumbbell against chest.',
      'Lower torso backward until back is near bench surface.',
      'Flex abs to curl ribcage toward hips, squeezing hard at top.'
    ],
    proTip: 'Focus on flexing spine into a C-shape rather than sitting straight up.',
    precautions: 'Do not pull on neck.'
  },
  {
    id: 'ex-abs-5',
    name: 'Forearm Elbow Plank',
    bodyPart: 'abs',
    bodyPartLabel: 'Abs & Core',
    targetMuscle: 'Transverse Abdominis Core Stability',
    secondaryMuscles: ['Glutes', 'Shoulders', 'Lower Back'],
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    recommendedSets: '3 Sets',
    recommendedReps: '45 - 60 seconds Hold',
    restTime: '60 seconds',
    instructions: [
      'Lie face down, resting on forearms with elbows under shoulders and feet hip-width.',
      'Lift body up into straight line from head to heels.',
      'Squeeze glutes, pull navel toward spine, and hold rigid static stance.'
    ],
    proTip: 'Actively pull elbows toward toes into floor (isometric contraction) to double core engagement.',
    precautions: 'Do not let hips drop or pike high in air.'
  }
];
