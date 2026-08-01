# PlayFlag

**Road to 2028** — aplikasi belajar flag football (IFAF 5v5) untuk pemula: lesson → kuis → drill → dashboard progres, plus playbook Tim Saya.

Flag football akan menjadi olahraga Olimpiade 2028. Barrier entry tinggi karena ruleset berbeda dari tackle football (tidak ada “1st & 10”, line to gain = **middle**, non-kontak). PlayFlag membuat jalur belajar bertahap yang terasa mudah dan progresnya terlihat.

## Phase 1 (demo)

- **Onboarding** — nama tampilan
- **Dashboard** — path % Road to 2028, streak, radar skill (Rules / Movement / Strategy)
- **Skill tree** — 8 node; level **1–3 penuh**, 4–8 teaser terkunci
- **Level flow** — Lesson → Quiz (3 soal) → Drill (timer + reps)
- **Tim Saya** — nama tim, roster 5, play editor Canvas (posisi drag + rute tap-to-tap)
- **Persistensi** — semua state di `localStorage` key `playflag:v1` (tanpa backend)

## Quick start

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite (biasanya `http://localhost:5173`).

```bash
npm run build    # production build ke dist/
npm run preview  # preview build
```

## Stack

| Layer | Pilihan |
|---|---|
| App | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom |
| State | Context + useReducer |
| Persist | localStorage |
| Charts | SVG manual (tanpa Chart.js) |

## Demo checklist (2–3 menit)

1. Onboarding dengan nama → Dashboard  
2. Belajar: lihat 8 node; Level 1 tersedia  
3. Selesaikan Level 1 (lesson → kuis → drill)  
4. Dashboard: path % dan radar terbarui  
5. Tim Saya: edit roster, buka play, geser posisi, buat ≥1 rute  
6. Refresh browser — state tetap ada  
7. Tidak ada fitur kompetisi / social / auth  

## Docs

- [Product Requirements](docs/prd/2026-08-01-playflag-prd.md)
- [Architecture RFC](docs/rfc/2026-08-01-playflag-architecture.md)
- [IFAF Flag Football Rules context](flag-football-context-ifaf-2023.md)
- [Implementation plan](docs/superpowers/plans/2026-08-01-playflag-phase1.md)

## Catatan

- UI copy: Bahasa Indonesia; istilah IFAF tetap English (flag pull, middle, down, blitz, no-running zone).
- Clear `localStorage` / tombol **Reset demo** di Dashboard menghapus progres.
- Level 4–8 sengaja terkunci di Phase 1 (roadmap konten).

## License

Hackathon / demo project — sesuaikan lisensi jika dirilis publik.
