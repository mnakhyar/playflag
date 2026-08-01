import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
let src = fs.readFileSync(path.join(root, 'src/content/skillTree.base.ts'), 'utf8')

const interactive = {
  'GEN-01': {
    category: 'Rules',
    lesson: {
      heading: 'Lapangan & aturan non-kontak',
      bullets: [
        'Flag football 5v5 IFAF: tidak ada tackling, blocking, atau kontak sengaja. Cabut flag lawan untuk menghentikan play.',
        'Field of play 50 yard x 25 yard, plus endzone 10 yard di tiap ujung.',
        'Middle line membagi lapangan. Line to gain pertama = middle, bukan "1st & 10".',
        'No-running zone: 5 yard di depan tiap goal line. Di zona ini offense wajib forward pass.',
        'Skor dasar: touchdown 6, try 1 (dari yard 5) atau 2 (dari yard 10). Safety 2.',
      ],
    },
    quiz: [
      {
        id: 'gen01q1',
        prompt: 'Apa line to gain pada seri down pertama (sisi sendiri)?',
        choices: ['10 yard ke depan', 'Middle', 'Goal line lawan', 'Scrimmage line'],
        correctIndex: 1,
      },
      {
        id: 'gen01q2',
        prompt: 'Di no-running zone, offense harus...',
        choices: [
          'Boleh run play bebas',
          'Wajib forward pass play',
          'Punt bola',
          'Ganti ke defense',
        ],
        correctIndex: 1,
      },
      {
        id: 'gen01q3',
        prompt: 'Bagaimana cara menghentikan ball carrier di flag football?',
        choices: [
          'Tackle ke tanah',
          'Block dengan bahu',
          'Cabut (pull) flag-nya',
          'Dorong keluar lapangan saja',
        ],
        correctIndex: 2,
      },
    ],
    drillInteractive: {
      title: 'Zone walk',
      instructions:
        'Berjalan di lapangan (atau di rumah dengan zona imajiner). Sebut keras tiap zona yang kamu masuki: endzone, middle, no-running zone. Target 5 reps.',
      targetReps: 5,
    },
  },
  'GEN-05': {
    category: 'Movement',
    lesson: {
      heading: 'Gerakan tanpa tackling',
      bullets: [
        'Flag belt dipakai di pinggang; dua flag di samping. Pull salah satu flag untuk menghentikan play.',
        'Approach dari samping atau depan dengan kaki ringan. Jangan dive atau wrap tubuh.',
        'Setelah pull, angkat flag tinggi agar wasit jelas melihat. Jangan lempar jauh.',
        'Sebagai ball carrier: lindungi flag dengan sudut tubuh, tapi jangan cover flag dengan tangan (flag guarding).',
        'Break & plant: ubah arah cepat tanpa kontak tubuh lawan.',
      ],
    },
    quiz: [
      {
        id: 'gen05q1',
        prompt: 'Setelah berhasil flag pull, apa yang sebaiknya dilakukan?',
        choices: [
          'Lempar flag ke sideline',
          'Angkat flag tinggi agar terlihat wasit',
          'Tarik belt lawan terus',
          'Dorong pemain ke tanah',
        ],
        correctIndex: 1,
      },
      {
        id: 'gen05q2',
        prompt: 'Menutupi flag dengan tangan disebut...',
        choices: ['Fair catch', 'Flag guarding', 'Holding', 'Blitz'],
        correctIndex: 1,
      },
      {
        id: 'gen05q3',
        prompt: 'Cara legal menghentikan runner adalah...',
        choices: ['Wrap tackle', 'Shoulder check', 'Pull salah satu flag', 'Trip kaki'],
        correctIndex: 2,
      },
    ],
    drillInteractive: {
      title: 'Flag pull',
      instructions:
        'Pasangkan belt (atau imitasikan). Latih approach + pull cepat 10 kali. Catat reps yang bersih tanpa kontak berlebih.',
      targetReps: 10,
    },
  },
  'GEN-08': {
    category: 'Strategy',
    lesson: {
      heading: '4 downs & line to gain = middle',
      bullets: [
        'Setiap seri: maksimal 4 down. Tidak ada first down karena yardage tetap. Seri baru muncul setelah melewati middle (sekali) atau menuju goal.',
        'Mulai dari yard 5 sendiri: target pertama = middle. Setelah melewati middle, dapat 4 down baru menuju goal line.',
        'Melewati middle dua kali dalam satu seri tidak memberi first down lagi.',
        'Gagal di down ke-4: lawan mulai dari yard 5 mereka (bukan spot bola mati).',
        'Panggil situasi dengan jelas: "2nd & Middle", "1st & Goal". Hindari format "2nd & 7".',
      ],
    },
    quiz: [
      {
        id: 'gen08q1',
        prompt: 'Setelah offense melewati middle pertama kali, mereka mendapat...',
        choices: [
          '1 down ekstra saja',
          '4 down baru menuju goal',
          'Field goal otomatis',
          'Harus punt',
        ],
        correctIndex: 1,
      },
      {
        id: 'gen08q2',
        prompt: 'Tampilan down yang benar di flag football adalah...',
        choices: ['2nd & 7', '2nd & Middle', '2nd & 10 yards', '2nd down only'],
        correctIndex: 1,
      },
      {
        id: 'gen08q3',
        prompt: 'Jika gagal di 4th down sebelum middle, defense mulai dari...',
        choices: ['Spot bola mati', 'Yard 5 sendiri', 'Middle', 'Endzone'],
        correctIndex: 1,
      },
    ],
    drillInteractive: {
      title: 'Down call',
      instructions:
        'Sebut keras 8 situasi down (contoh: 1st & Middle, 3rd & Goal, 4th & Middle). Bayangkan posisi bola relatif ke middle.',
      targetReps: 8,
    },
  },
}

function q(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function serializeInteractive(data) {
  const lessonBullets = data.lesson.bullets
    .map((b) => `      '${q(b)}',`)
    .join('\n')
  const quiz = data.quiz
    .map((item) => {
      const choices = item.choices.map((c) => `'${q(c)}'`).join(', ')
      return `    {
      id: '${item.id}',
      prompt: '${q(item.prompt)}',
      choices: [${choices}],
      correctIndex: ${item.correctIndex},
    }`
    })
    .join(',\n')
  const instr = data.drillInteractive.instructions
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
  return `    category: '${data.category}',
    lesson: {
      heading: '${q(data.lesson.heading)}',
      bullets: [
${lessonBullets}
      ],
    },
    quiz: [
${quiz}
    ],
    drillInteractive: {
      title: '${q(data.drillInteractive.title)}',
      instructions: \`${instr}\`,
      targetReps: ${data.drillInteractive.targetReps},
    },`
}

for (const [id, data] of Object.entries(interactive)) {
  const marker = `    id: '${id}',`
  const idx = src.indexOf(marker)
  if (idx < 0) throw new Error('missing ' + id)
  const interactiveLine = src.indexOf('    interactive: true,', idx)
  if (interactiveLine < 0) throw new Error('no interactive for ' + id)
  const insertAt = interactiveLine + '    interactive: true,'.length
  src = src.slice(0, insertAt) + '\n' + serializeInteractive(data) + src.slice(insertAt)
}

const out = path.join(root, 'src/content/skillTree.ts')
fs.writeFileSync(out, src)
fs.unlinkSync(path.join(root, 'src/content/skillTree.base.ts'))
console.log('wrote', out)
