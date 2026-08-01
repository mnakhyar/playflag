import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const md = fs.readFileSync(
  path.join(root, 'flag-football-skill-tree-curriculum.md'),
  'utf8',
)

function parseTable(section) {
  const lines = section
    .split('\n')
    .filter((l) => l.startsWith('|') && !l.includes('---'))
  const rows = []
  for (const line of lines) {
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => c.replace(/\*\*/g, ''))
    if (cells.length < 3) continue
    if (cells[0] === 'ID' || cells[0].includes('Keterampilan')) continue
    if (!/^[A-Z]{2,3}-/.test(cells[0])) continue
    rows.push(cells)
  }
  return rows
}

function sliceBetween(startMarker, endMarker) {
  const start = md.indexOf(startMarker)
  if (start < 0) throw new Error(`Missing ${startMarker}`)
  const end = endMarker ? md.indexOf(endMarker, start + startMarker.length) : -1
  return md.slice(start, end > 0 ? end : undefined)
}

const nodes = []
let sort = 0

function pushNode(partial) {
  nodes.push({
    prereqs: [],
    ...partial,
    sortOrder: sort++,
  })
}

// GEN — 5 cols: id, name, description, drill, criteria
{
  const section = sliceBetween('## 3. TIER 0', '## 4. TIER 1 — OFFENSE')
  for (const cells of parseTable(section)) {
    pushNode({
      id: cells[0],
      name: cells[1],
      branch: 'general',
      position: null,
      tier: 0,
      description: cells[2],
      drill: cells[3],
      masteryCriteria: cells[4],
    })
  }
}

// OFF — 4 cols: id, name, description, criteria
{
  const section = sliceBetween('## 4. TIER 1 — OFFENSE', '## 5. TIER 1 — DEFENSE')
  for (const cells of parseTable(section)) {
    pushNode({
      id: cells[0],
      name: cells[1],
      branch: 'offense',
      position: null,
      tier: 1,
      tierLabel: 'Branch',
      description: cells[2],
      masteryCriteria: cells[3],
    })
  }
}

// DEF
{
  const section = sliceBetween('## 5. TIER 1 — DEFENSE', '## 6. CABANG — QUARTERBACK')
  for (const cells of parseTable(section)) {
    pushNode({
      id: cells[0],
      name: cells[1],
      branch: 'defense',
      position: null,
      tier: 1,
      tierLabel: 'Branch',
      description: cells[2],
      masteryCriteria: cells[3],
    })
  }
}

function parsePosition(startMarker, endMarker, position, branch) {
  const section = sliceBetween(startMarker, endMarker)
  const tiers = [
    { label: 'Foundation', tier: 2, marker: '### Tier 2' },
    { label: 'Core', tier: 3, marker: '### Tier 3' },
    { label: 'Advanced', tier: 4, marker: '### Tier 4' },
    { label: 'Elite', tier: 5, marker: '### Tier 5' },
  ]
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i]
    const idx = section.indexOf(t.marker)
    if (idx < 0) continue
    let end = section.length
    for (let j = i + 1; j < tiers.length; j++) {
      const n = section.indexOf(tiers[j].marker, idx + 1)
      if (n >= 0) {
        end = n
        break
      }
    }
    const sub = section.indexOf('### Sub-cabang', idx + 1)
    if (sub >= 0 && sub < end) end = sub
    const block = section.slice(idx, end)
    for (const cells of parseTable(block)) {
      const hasDrillCol = cells.length >= 4
      pushNode({
        id: cells[0],
        name: cells[1],
        branch,
        position,
        tier: t.tier,
        tierLabel: t.label,
        description: hasDrillCol ? cells[2] : cells[2],
        drill: hasDrillCol ? cells[2] : undefined,
        masteryCriteria: hasDrillCol ? cells[3] : cells[2],
      })
    }
  }

  if (position === 'receiver') {
    const snpIdx = section.indexOf('### Sub-cabang')
    if (snpIdx >= 0) {
      for (const cells of parseTable(section.slice(snpIdx))) {
        if (!cells[0].startsWith('SNP')) continue
        pushNode({
          id: cells[0],
          name: cells[1],
          branch: 'offense',
          position: 'snapper',
          tier: 2,
          tierLabel: 'Foundation',
          description: cells[2],
          masteryCriteria: cells[2],
        })
      }
    }
  }
}

parsePosition(
  '## 6. CABANG — QUARTERBACK',
  '## 7. CABANG — RECEIVER',
  'qb',
  'offense',
)
parsePosition(
  '## 7. CABANG — RECEIVER',
  '## 8. CABANG — PASS RUSHER',
  'receiver',
  'offense',
)
parsePosition(
  '## 8. CABANG — PASS RUSHER',
  '## 9. CABANG — DEFENSIVE BACK',
  'rusher',
  'defense',
)
parsePosition(
  '## 9. CABANG — DEFENSIVE BACK',
  '## 10. Skema database',
  'db',
  'defense',
)

console.log('nodes:', nodes.length)
console.log(nodes.map((n) => n.id).join(', '))
fs.writeFileSync(
  path.join(__dirname, 'skill-nodes.json'),
  JSON.stringify(nodes, null, 2),
)
