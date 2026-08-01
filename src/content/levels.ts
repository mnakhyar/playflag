import type { SkillCategory } from '../store/types'

export type LevelSeed = {
  id: number
  title: string
  category: SkillCategory
  statusInP1: 'full' | 'teaser'
  teaser?: string
  lesson?: { heading: string; bullets: string[] }
  quiz?: Array<{
    id: string
    prompt: string
    choices: string[]
    correctIndex: number
  }>
  drill?: {
    title: string
    instructions: string
    targetReps: number
  }
}

export const LEVELS: LevelSeed[] = [
  {
    id: 1,
    title: 'Rules dasar',
    category: 'Rules',
    statusInP1: 'full',
    lesson: {
      heading: 'Lapangan & aturan non-kontak',
      bullets: [
        'Flag football 5v5 IFAF: tidak ada tackling, blocking, atau kontak sengaja. Cabut flag lawan untuk menghentikan play.',
        'Field of play 50 yard × 25 yard, plus endzone 10 yard di tiap ujung.',
        'Middle line membagi lapangan. Line to gain pertama = middle — bukan “1st & 10”.',
        'No-running zone: 5 yard di depan tiap goal line. Di zona ini offense wajib forward pass.',
        'Skor dasar: touchdown 6, try 1 (dari yard 5) atau 2 (dari yard 10). Safety 2.',
      ],
    },
    quiz: [
      {
        id: 'l1q1',
        prompt: 'Apa line to gain pada seri down pertama (sisi sendiri)?',
        choices: ['10 yard ke depan', 'Middle', 'Goal line lawan', 'Scrimmage line'],
        correctIndex: 1,
      },
      {
        id: 'l1q2',
        prompt: 'Di no-running zone, offense harus…',
        choices: [
          'Boleh run play bebas',
          'Wajib forward pass play',
          'Punt bola',
          'Ganti ke defense',
        ],
        correctIndex: 1,
      },
      {
        id: 'l1q3',
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
    drill: {
      title: 'Zone walk',
      instructions:
        'Berjalan di lapangan (atau di rumah dengan zona imajiner). Sebut keras tiap zona yang kamu masuki: endzone, middle, no-running zone. Target 5 reps.',
      targetReps: 5,
    },
  },
  {
    id: 2,
    title: 'Flag pull & movement',
    category: 'Movement',
    statusInP1: 'full',
    lesson: {
      heading: 'Gerakan tanpa tackling',
      bullets: [
        'Flag belt dipakai di pinggang; dua flag di samping. Pull salah satu flag untuk menghentikan play.',
        'Approach dari samping atau depan dengan kaki ringan — jangan dive atau wrap tubuh.',
        'Setelah pull, angkat flag tinggi agar wasit jelas melihat; jangan lempar jauh.',
        'Sebagai ball carrier: lindungi flag dengan sudut tubuh, tapi jangan cover flag dengan tangan (flag guarding).',
        'Break & plant: ubah arah cepat tanpa kontak tubuh lawan.',
      ],
    },
    quiz: [
      {
        id: 'l2q1',
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
        id: 'l2q2',
        prompt: 'Menutupi flag dengan tangan disebut…',
        choices: ['Fair catch', 'Flag guarding', 'Holding', 'Blitz'],
        correctIndex: 1,
      },
      {
        id: 'l2q3',
        prompt: 'Cara legal menghentikan runner adalah…',
        choices: [
          'Wrap tackle',
          'Shoulder check',
          'Pull salah satu flag',
          'Trip kaki',
        ],
        correctIndex: 2,
      },
    ],
    drill: {
      title: 'Flag pull',
      instructions:
        'Pasangkan belt (atau imitasikan). Latih approach + pull cepat 10 kali. Catat reps yang bersih tanpa kontak berlebih.',
      targetReps: 10,
    },
  },
  {
    id: 3,
    title: 'Down & middle',
    category: 'Strategy',
    statusInP1: 'full',
    lesson: {
      heading: '4 downs & line to gain = middle',
      bullets: [
        'Setiap seri: maksimal 4 down. Tidak ada first down karena yardage tetap — hanya karena melewati middle (sekali) atau menuju goal.',
        'Mulai dari yard 5 sendiri: target pertama = middle. Setelah melewati middle, dapat 4 down baru menuju goal line.',
        'Melewati middle dua kali dalam satu seri tidak memberi first down lagi.',
        'Gagal di down ke-4: lawan mulai dari yard 5 mereka (bukan spot bola mati).',
        'Panggil situasi dengan jelas: “2nd & Middle”, “1st & Goal” — bukan “2nd & 7”.',
      ],
    },
    quiz: [
      {
        id: 'l3q1',
        prompt: 'Setelah offense melewati middle pertama kali, mereka mendapat…',
        choices: [
          '1 down ekstra saja',
          '4 down baru menuju goal',
          'Field goal otomatis',
          'Harus punt',
        ],
        correctIndex: 1,
      },
      {
        id: 'l3q2',
        prompt: 'Tampilan down yang benar di flag football adalah…',
        choices: ['2nd & 7', '2nd & Middle', '2nd & 10 yards', '2nd down only'],
        correctIndex: 1,
      },
      {
        id: 'l3q3',
        prompt: 'Jika gagal di 4th down sebelum middle, defense mulai dari…',
        choices: [
          'Spot bola mati',
          'Yard 5 sendiri',
          'Middle',
          'Endzone',
        ],
        correctIndex: 1,
      },
    ],
    drill: {
      title: 'Down call',
      instructions:
        'Sebut keras 8 situasi down (contoh: 1st & Middle, 3rd & Goal, 4th & Middle). Bayangkan posisi bola relatif ke middle.',
      targetReps: 8,
    },
  },
  {
    id: 4,
    title: 'Offense basics',
    category: 'Strategy',
    statusInP1: 'teaser',
    teaser: 'Formasi, snap, dan konsep rute dasar. Buka di tahap berikutnya — Road to 2028.',
  },
  {
    id: 5,
    title: 'Defense basics',
    category: 'Strategy',
    statusInP1: 'teaser',
    teaser: 'Coverage, rush, dan komunikasi defense. Buka di tahap berikutnya — Road to 2028.',
  },
  {
    id: 6,
    title: 'Situational plays',
    category: 'Strategy',
    statusInP1: 'teaser',
    teaser: 'Red zone, 4th down, dan clock management. Buka di tahap berikutnya — Road to 2028.',
  },
  {
    id: 7,
    title: 'Team chemistry drills',
    category: 'Movement',
    statusInP1: 'teaser',
    teaser: 'Timing route + chemistry QB-WR. Buka di tahap berikutnya — Road to 2028.',
  },
  {
    id: 8,
    title: 'Road to 2028 capstone',
    category: 'Rules',
    statusInP1: 'teaser',
    teaser: 'Uji akhir: rules + movement + strategy menuju Olimpiade 2028.',
  },
]

export function getLevel(id: number): LevelSeed | undefined {
  return LEVELS.find((l) => l.id === id)
}
