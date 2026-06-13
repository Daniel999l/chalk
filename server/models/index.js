import mongoose from 'mongoose'

// Team
const TeamSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  level:    { type: String, default: 'Beginner' },
  color:    { type: String, default: '#FF6B2B' },
  coachIds: [String],
}, { timestamps: true })

// Coach
const CoachSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  teamId: { type: String, required: true },
  role:   { type: String, default: 'Assistant' },
}, { timestamps: true })

// LessonPlan
const LessonPlanSchema = new mongoose.Schema({
  blockType: { type: String, required: true },
  title:     { type: String, required: true },
  content:   { type: String, default: '' },
  duration:  { type: Number, default: 0 },
}, { timestamps: true })

// BlockRotation — one per team per blockType
const BlockRotationSchema = new mongoose.Schema({
  teamId:     { type: String, required: true },
  blockType:  { type: String, required: true },
  playlist:   [String], // array of lessonPlan IDs
  visitCount: { type: Number, default: 0 },
}, { timestamps: true })
BlockRotationSchema.index({ teamId: 1, blockType: 1 }, { unique: true })

// PracticeInstance — generated practice for a team on a date
const PracticeInstanceSchema = new mongoose.Schema({
  teamId:   { type: String, required: true },
  date:     { type: String, required: true }, // 'YYYY-MM-DD'
  startTime:{ type: String },
  endTime:  { type: String },
  blocks: [{
    blockType:          String,
    durationMins:       Number,
    gymArea:            String,
    assignedPlanId:     String,
    assignedPlanTitle:  String,
    startTime:          String,
    endTime:            String,
  }],
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true })
PracticeInstanceSchema.index({ teamId: 1, date: 1 }, { unique: true })

// GymSchedule — what each coach is doing at each time slot per day
const GymScheduleSchema = new mongoose.Schema({
  date:    { type: String, required: true },
  coachId: { type: String, required: true },
  slots: [{
    slotId:   String,
    slotTime: String,
    area:     String,
  }],
}, { timestamps: true })
GymScheduleSchema.index({ date: 1, coachId: 1 }, { unique: true })

// Practice Schedule Template
const PracticeScheduleSchema = new mongoose.Schema({
  teamId:    { type: String, required: true, unique: true },
  days:      [Number],
  startTime: { type: String, default: '16:00' },
  endTime:   { type: String, default: '19:00' },
  blocks: [{
    blockType:    String,
    durationMins: Number,
    gymArea:      String,
  }],
}, { timestamps: true })

export const Team             = mongoose.model('Team', TeamSchema)
export const Coach            = mongoose.model('Coach', CoachSchema)
export const LessonPlan       = mongoose.model('LessonPlan', LessonPlanSchema)
export const BlockRotation    = mongoose.model('BlockRotation', BlockRotationSchema)
export const PracticeInstance = mongoose.model('PracticeInstance', PracticeInstanceSchema)
export const GymSchedule      = mongoose.model('GymSchedule', GymScheduleSchema)
export const PracticeSchedule = mongoose.model('PracticeSchedule', PracticeScheduleSchema)
