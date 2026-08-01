import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const nodes = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'skill-nodes.json'), 'utf8'),
)

function esc(s) {
  if (s == null) return ''
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
}

const interactiveIds = new Set(['GEN-01', 'GEN-05', 'GEN-08'])

const header = `import type { SkillCategory } from '../store/types'

export const DEMO_UNLOCK_ALL = true

export type SkillBranch = 'general' | 'offense' | 'defense'
export type SkillPosition = 'qb' | 'receiver' | 'snapper' | 'rusher' | 'db'
export type SkillTier = 0 | 1 | 2 | 3 | 4 | 5

export type SkillNode = {
  id: string
  name: string
  branch: SkillBranch
  position: SkillPosition | null
  tier: SkillTier
  tierLabel?: string
  description: string
  drill?: string
  masteryCriteria: string
  ruleRef?: string
  prereqs: string[]
  sortOrder: number
  interactive?: boolean
  category?: SkillCategory
  lesson?: { heading: string; bullets: string[] }
  quiz?: Array<{
    id: string
    prompt: string
    choices: string[]
    correctIndex: number
  }>
  drillInteractive?: {
    title: string
    instructions: string
    targetReps: number
  }
}

export const BRANCH_META: Record<
  SkillBranch,
  { id: SkillBranch; name: string; color: string; unlocks: string[] }
> = {
  general: {
    id: 'general',
    name: 'Fondasi',
    color: '#64748b',
    unlocks: ['offense', 'defense'],
  },
  offense: {
    id: 'offense',
    name: 'Offense',
    color: '#2563eb',
    unlocks: ['qb', 'receiver'],
  },
  defense: {
    id: 'defense',
    name: 'Defense',
    color: '#dc2626',
    unlocks: ['rusher', 'db'],
  },
}

export const POSITION_META: Array<{
  id: SkillPosition
  name: string
  branch: SkillBranch
  subBranch?: { id: SkillPosition; name: string }
}> = [
  { id: 'qb', name: 'Quarterback', branch: 'offense' },
  {
    id: 'receiver',
    name: 'Receiver',
    branch: 'offense',
    subBranch: { id: 'snapper', name: 'Snapper' },
  },
  { id: 'rusher', name: 'Pass Rusher', branch: 'defense' },
  { id: 'db', name: 'Defensive Back', branch: 'defense' },
]

export const TIER_LABELS: Record<number, string> = {
  0: 'General',
  1: 'Branch',
  2: 'Foundation',
  3: 'Core',
  4: 'Advanced',
  5: 'Elite',
}

/** Legacy level id → skill id for persist migration */
export const LEGACY_LEVEL_TO_SKILL: Record<number, string> = {
  1: 'GEN-01',
  2: 'GEN-05',
  3: 'GEN-08',
}

export const SKILLS: SkillNode[] = [
`

const parts = [header]

for (const n of nodes) {
  const lines = [
    '  {',
    `    id: '${n.id}',`,
    `    name: '${esc(n.name).replace(/'/g, "\\'")}',`,
    `    branch: '${n.branch}',`,
    `    position: ${n.position ? `'${n.position}'` : 'null'},`,
    `    tier: ${n.tier},`,
  ]
  if (n.tierLabel) {
    lines.push(`    tierLabel: '${esc(n.tierLabel).replace(/'/g, "\\'")}',`)
  }
  lines.push(`    description: \`${esc(n.description)}\`,`)
  if (n.drill) {
    lines.push(`    drill: \`${esc(n.drill)}\`,`)
  }
  lines.push(`    masteryCriteria: \`${esc(n.masteryCriteria)}\`,`)
  lines.push(`    prereqs: [],`)
  lines.push(`    sortOrder: ${n.sortOrder},`)
  if (interactiveIds.has(n.id)) {
    lines.push(`    interactive: true,`)
  }
  lines.push('  },')
  parts.push(lines.join('\n'))
}

parts.push(`]

export function getSkill(id: string): SkillNode | undefined {
  return SKILLS.find((s) => s.id === id)
}

export function skillsByBranch(branch: SkillBranch): SkillNode[] {
  return SKILLS.filter((s) => s.branch === branch && s.position == null)
}

export function skillsByPosition(position: SkillPosition): SkillNode[] {
  return SKILLS.filter((s) => s.position === position)
}

export function generalSkills(): SkillNode[] {
  return SKILLS.filter((s) => s.branch === 'general')
}
`)

const outPath = path.join(root, 'src/content/skillTree.base.ts')
fs.writeFileSync(outPath, parts.join('\n'))
console.log('wrote', outPath, 'skills', nodes.length)
