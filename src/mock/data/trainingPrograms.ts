export interface TrainingProgram {
  id: string
  title: string
  provider: string
  category: string
  durationHours: number
}

export const trainingPrograms: TrainingProgram[] = [
  { id: 'TRN-001', title: 'Effective Communication Skills', provider: 'Internal L&D', category: 'Soft Skills', durationHours: 8 },
  { id: 'TRN-002', title: 'Project Management Fundamentals', provider: 'PMI Demo Institute', category: 'Management', durationHours: 16 },
  { id: 'TRN-003', title: 'Advanced React Development', provider: 'TechAcademy', category: 'Technical', durationHours: 24 },
  { id: 'TRN-004', title: 'Workplace Safety Orientation', provider: 'Internal L&D', category: 'Compliance', durationHours: 4 },
  { id: 'TRN-005', title: 'Leadership Essentials', provider: 'Leadership Institute', category: 'Management', durationHours: 12 },
  { id: 'TRN-006', title: 'Data Privacy & Security Awareness', provider: 'Internal L&D', category: 'Compliance', durationHours: 4 },
  { id: 'TRN-007', title: 'Customer Service Excellence', provider: 'Internal L&D', category: 'Soft Skills', durationHours: 8 },
  { id: 'TRN-008', title: 'Financial Literacy for Managers', provider: 'FinEd Demo', category: 'Management', durationHours: 10 },
  { id: 'TRN-009', title: 'Agile & Scrum Foundations', provider: 'TechAcademy', category: 'Technical', durationHours: 16 },
  { id: 'TRN-010', title: 'Diversity, Equity & Inclusion', provider: 'Internal L&D', category: 'Soft Skills', durationHours: 6 },
]
