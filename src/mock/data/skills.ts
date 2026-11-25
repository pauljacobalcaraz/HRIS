export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export interface Skill {
  id: string
  name: string
}

export const skills: Skill[] = [
  { id: 'SKL-COMM', name: 'Communication' },
  { id: 'SKL-LEADERSHIP', name: 'Leadership' },
  { id: 'SKL-TECH', name: 'Technical Proficiency' },
  { id: 'SKL-PROBLEM', name: 'Problem Solving' },
  { id: 'SKL-PROJECT', name: 'Project Management' },
]

export interface EmployeeSkill {
  id: string
  employeeId: string
  skillId: string
  level: SkillLevel
}

const EMPLOYEE_IDS = ['EMP-0006', 'EMP-0007', 'EMP-0008', 'EMP-0009', 'EMP-0010']
const LEVEL_CYCLE: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

function buildEmployeeSkills(): EmployeeSkill[] {
  const list: EmployeeSkill[] = []
  let counter = 1
  for (const employeeId of EMPLOYEE_IDS) {
    skills.forEach((skill, idx) => {
      list.push({
        id: `ESK-${String(counter).padStart(4, '0')}`,
        employeeId,
        skillId: skill.id,
        level: LEVEL_CYCLE[(counter + idx) % LEVEL_CYCLE.length],
      })
      counter++
    })
  }
  return list
}

export const employeeSkills: EmployeeSkill[] = buildEmployeeSkills()
