// Chalk default seed data

export const GYM_AREAS = ['Floor', 'Beam', 'Bars', 'Vault', 'Trampoline', 'Conditioning']

export const AREA_COLORS = {
  Floor:        '#FFD600',
  Beam:         '#FF6B2B',
  Bars:         '#00D1FF',
  Vault:        '#FF3CAC',
  Trampoline:   '#00E676',
  Conditioning: '#C77DFF',
}

export const BLOCK_TYPES = ['Warm Up', 'Flexibility', 'Strength', 'Area 1', 'Area 2', 'Area 3']

export const TEAM_COLORS = ['#FF6B2B', '#00D1FF', '#00E676', '#FF3CAC', '#C77DFF', '#FFD600']

export const DEFAULT_TEAMS = [
  { id: 't1', name: 'Team Apex',   level: 'Advanced',     color: '#FF6B2B', coachIds: ['c1','c2'] },
  { id: 't2', name: 'Team Nova',   level: 'Intermediate', color: '#00D1FF', coachIds: ['c3','c4'] },
  { id: 't3', name: 'Team Rise',   level: 'Beginner',     color: '#00E676', coachIds: ['c5','c6'] },
]

export const DEFAULT_COACHES = [
  { id: 'c1', name: 'Sarah Chen',   teamId: 't1', role: 'Head Coach' },
  { id: 'c2', name: 'Marcus Lee',   teamId: 't1', role: 'Assistant' },
  { id: 'c3', name: 'Ana Torres',   teamId: 't2', role: 'Head Coach' },
  { id: 'c4', name: 'Jordan Kim',   teamId: 't2', role: 'Assistant' },
  { id: 'c5', name: 'Lee Park',     teamId: 't3', role: 'Head Coach' },
  { id: 'c6', name: 'Priya Nair',   teamId: 't3', role: 'Assistant' },
]

// Practice schedule templates - which days/times each team practices
export const DEFAULT_SCHEDULES = [
  {
    id: 's1', teamId: 't1',
    days: [1, 3, 5], // Mon, Wed, Fri
    startTime: '16:00', endTime: '19:00',
    blocks: [
      { blockType: 'Warm Up',     durationMins: 15, gymArea: 'Floor' },
      { blockType: 'Flexibility', durationMins: 20, gymArea: 'Floor' },
      { blockType: 'Strength',    durationMins: 20, gymArea: 'Conditioning' },
      { blockType: 'Area 1',      durationMins: 40, gymArea: 'Bars' },
      { blockType: 'Area 2',      durationMins: 40, gymArea: 'Beam' },
      { blockType: 'Area 3',      durationMins: 40, gymArea: 'Floor' },
    ],
  },
  {
    id: 's2', teamId: 't2',
    days: [2, 4], // Tue, Thu
    startTime: '16:00', endTime: '18:30',
    blocks: [
      { blockType: 'Warm Up',     durationMins: 15, gymArea: 'Floor' },
      { blockType: 'Flexibility', durationMins: 15, gymArea: 'Floor' },
      { blockType: 'Strength',    durationMins: 15, gymArea: 'Conditioning' },
      { blockType: 'Area 1',      durationMins: 40, gymArea: 'Vault' },
      { blockType: 'Area 2',      durationMins: 40, gymArea: 'Trampoline' },
      { blockType: 'Area 3',      durationMins: 35, gymArea: 'Floor' },
    ],
  },
  {
    id: 's3', teamId: 't3',
    days: [1, 3], // Mon, Wed
    startTime: '17:00', endTime: '18:30',
    blocks: [
      { blockType: 'Warm Up',     durationMins: 15, gymArea: 'Floor' },
      { blockType: 'Flexibility', durationMins: 15, gymArea: 'Floor' },
      { blockType: 'Strength',    durationMins: 10, gymArea: 'Conditioning' },
      { blockType: 'Area 1',      durationMins: 25, gymArea: 'Bars' },
      { blockType: 'Area 2',      durationMins: 25, gymArea: 'Beam' },
      { blockType: 'Area 3',      durationMins: 0,  gymArea: '' },
    ],
  },
]

export const DEFAULT_LESSON_PLANS = [
  // === WARM UPS (8 plans, cycle every 8 visits) ===
  { id: 'wu1', blockType: 'Warm Up', title: 'WU1 - Dynamic Run',      content: '2 laps jog\nHigh knees x2 laps\nButt kicks x2 laps\nArm circles forward/back\nLeg swings front/side\nAnkle rolls', duration: 15 },
  { id: 'wu2', blockType: 'Warm Up', title: 'WU2 - Jump Rope Circuit', content: 'Jump rope 3 min\nJumping jacks x30\nSkip x2 laps\nGallop sideways x2 laps\nBear crawl x1 lap\nCrab walk x1 lap', duration: 15 },
  { id: 'wu3', blockType: 'Warm Up', title: 'WU3 - Hurdle Series',     content: 'Over-under hurdle series x3\nHigh skip x2 laps\nPower skip x2 laps\nLateral shuffle x2 laps\nBackpedal x2 laps', duration: 15 },
  { id: 'wu4', blockType: 'Warm Up', title: 'WU4 - Tumble Track Run',  content: 'Hurdle jumps x10\nBound x2 laps\nSpiral run x2 laps\nInchworm x1 lap\nWorld greatest stretch', duration: 15 },
  { id: 'wu5', blockType: 'Warm Up', title: 'WU5 - Partner Chase',     content: 'Partner tag 3 min\nShadow drill 2 min\nReaction cones x10\nSprint ladders x4\nLateral bounding x2', duration: 15 },
  { id: 'wu6', blockType: 'Warm Up', title: 'WU6 - Obstacle Course',   content: 'Cone weave run\nHurdle hop series\nBalance beam walk\nCrawl tunnel x3\nSprint finish x3', duration: 15 },
  { id: 'wu7', blockType: 'Warm Up', title: 'WU7 - Music Circuit',     content: 'Free move to music 2 min\nFreeze game x5\nMirror drill pairs\nFloor touch sprint x6\nCool jog 1 lap', duration: 15 },
  { id: 'wu8', blockType: 'Warm Up', title: 'WU8 - Relay Races',       content: 'Sprint relay x3\nSkip relay x2\nBackward relay x2\nCrab relay x2\nTeam celebration finish', duration: 15 },

  // === FLEXIBILITY (4 plans, cycle every 4 visits) ===
  { id: 'fl1', blockType: 'Flexibility', title: 'FLEX1 - Active Stretching', content: 'Leg swings front/back x20\nLeg swings lateral x20\nLunge with twist\nPigeon pose 60s each\nSeated straddle 90s\nForward fold 60s', duration: 20 },
  { id: 'fl2', blockType: 'Flexibility', title: 'FLEX2 - PNF Lower Body',    content: 'Contract-relax hamstrings 3x30s\nContract-relax hip flexors 3x30s\nSplits hold 90s each side\nMiddle splits 90s\nButterfly stretch 60s', duration: 20 },
  { id: 'fl3', blockType: 'Flexibility', title: 'FLEX3 - Back & Shoulder',   content: 'Cobra pose 3x30s\nBridge hold 3x30s\nScorpion stretch 30s each\nShoulder circles\nThread the needle 45s each\nChest opener 60s', duration: 20 },
  { id: 'fl4', blockType: 'Flexibility', title: 'FLEX4 - Full Body Flow',    content: 'Sun salutation x5\nWarrior flow x3 each\nLizard pose 60s\nPigeon to split flow\nSupine twist 45s each\nSavasana 2 min', duration: 20 },

  // === STRENGTH (4 plans, swap monthly) ===
  { id: 'st1', blockType: 'Strength', title: 'STR1 - Core Foundation',  content: 'Hollow body hold 3x30s\nSuperman hold 3x30s\nPlank 3x30s\nSide plank 3x20s each\nV-ups 3x12\nLeg raises 3x15', duration: 20 },
  { id: 'st2', blockType: 'Strength', title: 'STR2 - Upper Body Push',  content: 'Push-ups 3x15\nDiamond push-ups 3x10\nPike push-ups 3x10\nDips on bars 3x10\nShoulders circles weighted 3x20\nWrist conditioning 2x30s', duration: 20 },
  { id: 'st3', blockType: 'Strength', title: 'STR3 - Jump Power',       content: 'Box jumps 4x8\nBroad jumps 4x6\nDepth drops 3x8\nRebound jumps 3x10\nTuck jumps 3x12\nSplit jumps 3x10', duration: 20 },
  { id: 'st4', blockType: 'Strength', title: 'STR4 - Handstand Press',  content: 'Headstand hold 3x20s\nHandstand wall hold 3x30s\nShoulder shrugs inverted 3x10\nForward/back rock handstand\nStraddle lift attempts 3x5\nCompression work 3x10', duration: 20 },

  // === AREA 1 - BARS (5 plans) ===
  { id: 'b1', blockType: 'Area 1', title: 'BARS1 - Basic Shapes',    content: 'Kip drills on low bar 3x5\nCast to horizontal x10\nBackward hip circle x8\nForward hip circle x8\nGlide kip x5\nCompetition routine run-through x2', duration: 40 },
  { id: 'b2', blockType: 'Area 1', title: 'BARS2 - Release Drills',  content: 'Tap swings x10\nHalf turn drills x8\nCast to vertical attempts x5\nStraddle back x5\nSalto drill on strap bar\nSpotted giants x5', duration: 40 },
  { id: 'b3', blockType: 'Area 1', title: 'BARS3 - Giant Work',      content: 'Cast handstand drills x10\nForward giants x8\nBackward giants x8\nGiant half turn x5 each\nGiant full turn x5\nDismount rehearsal x5', duration: 40 },
  { id: 'b4', blockType: 'Area 1', title: 'BARS4 - Connection Skills', content: 'Kip + cast combo x8\nPirouette drills x10\nPike stalder attempt x5\nBar change connection x8\nFlight element drill\nFull routine x3', duration: 40 },
  { id: 'b5', blockType: 'Area 1', title: 'BARS5 - Conditioning Day', content: 'Skin the cat x10\nL-sit hold on bar 3x20s\nPull-up negatives 3x8\nMuscle up attempts 3x5\nBar hangs 3x30s\nGrip strength work', duration: 40 },

  // === AREA 2 - BEAM (4 plans) ===
  { id: 'bm1', blockType: 'Area 2', title: 'BEAM1 - Balance Series', content: 'Walk forward/back on line x5\nReleve walks x5\nPose holds 30s each\nArabesque balance x10\nScale 30s each side\nCartwheel on low beam x8', duration: 40 },
  { id: 'bm2', blockType: 'Area 2', title: 'BEAM2 - Leap & Jump',    content: 'Straight jump on line x10\nTuck jump on line x8\nStraddle jump x8\nLeap drills off line\nWolf jump x8\nSplit leap on beam x5', duration: 40 },
  { id: 'bm3', blockType: 'Area 2', title: 'BEAM3 - Acro Series',    content: 'Cartwheel on beam x8\nRound-off dismount x8\nBack walkover on low beam x6\nFront walkover x6\nHandstand on beam x5\nAcro combo x4', duration: 40 },
  { id: 'bm4', blockType: 'Area 2', title: 'BEAM4 - Full Routine',   content: 'Dance run-through x3\nAcro run-through x3\nMount practice x10\nDismount practice x10\nFull routine x4\nDeduction check with coach', duration: 40 },

  // === AREA 3 - FLOOR (5 plans) ===
  { id: 'f1', blockType: 'Area 3', title: 'FLOOR1 - Tumbling Pass 1', content: 'Round-off rebound x10\nRound-off back handspring x8\nLayout drills on tumble track\nFull twist drills\nPass 1 on floor x5\nCompete start sequence', duration: 40 },
  { id: 'f2', blockType: 'Area 3', title: 'FLOOR2 - Dance Elements', content: 'Switch ring leap x10\nSplit leap x10\nLeap series on line\nTour jeté drill x10\nDance passage x5\nChoreography run-through x3', duration: 40 },
  { id: 'f3', blockType: 'Area 3', title: 'FLOOR3 - Tumbling Pass 2', content: 'Front aerial drill x8\nFront handspring step-out x8\nDouble back on pit x5\nSpotted double back x5\nPass 2 on floor x5\nFull run-through x2', duration: 40 },
  { id: 'f4', blockType: 'Area 3', title: 'FLOOR4 - Full Routine',   content: 'Start value check\nFull routine x4\nDeduction analysis\nPassage clean-up\nEndurance set: 2 routines back-to-back x2\nCoach notes session', duration: 40 },
  { id: 'f5', blockType: 'Area 3', title: 'FLOOR5 - Choreography',   content: 'New music introduction\nCounting exercise x5\nArm port de bras x10\nExpression work\nPassage staging\nConnect to tumbling x3', duration: 40 },
]

// Default rotation state - visitCount per team per blockType
export const DEFAULT_ROTATIONS = {
  't1_Warm Up':     { playlist: ['wu1','wu2','wu3','wu4','wu5','wu6','wu7','wu8'], visitCount: 0 },
  't1_Flexibility': { playlist: ['fl1','fl2','fl3','fl4'], visitCount: 0 },
  't1_Strength':    { playlist: ['st1','st2','st3','st4'], visitCount: 0 },
  't1_Area 1':      { playlist: ['b1','b2','b3','b4','b5'], visitCount: 0 },
  't1_Area 2':      { playlist: ['bm1','bm2','bm3','bm4'], visitCount: 0 },
  't1_Area 3':      { playlist: ['f1','f2','f3','f4','f5'], visitCount: 0 },

  't2_Warm Up':     { playlist: ['wu1','wu2','wu3','wu4','wu5','wu6','wu7','wu8'], visitCount: 3 },
  't2_Flexibility': { playlist: ['fl1','fl2','fl3','fl4'], visitCount: 1 },
  't2_Strength':    { playlist: ['st1','st2','st3','st4'], visitCount: 2 },
  't2_Area 1':      { playlist: ['b1','b2','b3','b4','b5'], visitCount: 1 },
  't2_Area 2':      { playlist: ['bm1','bm2','bm3','bm4'], visitCount: 2 },
  't2_Area 3':      { playlist: ['f1','f2','f3','f4','f5'], visitCount: 3 },

  't3_Warm Up':     { playlist: ['wu1','wu2','wu3','wu4','wu5','wu6','wu7','wu8'], visitCount: 5 },
  't3_Flexibility': { playlist: ['fl1','fl2','fl3','fl4'], visitCount: 2 },
  't3_Strength':    { playlist: ['st1','st2','st3','st4'], visitCount: 1 },
  't3_Area 1':      { playlist: ['b1','b2','b3','b4','b5'], visitCount: 2 },
  't3_Area 2':      { playlist: ['bm1','bm2','bm3','bm4'], visitCount: 3 },
  't3_Area 3':      { playlist: ['f1','f2','f3','f4','f5'], visitCount: 1 },
}
