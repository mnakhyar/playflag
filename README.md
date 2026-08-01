# PlayFlag

**Road to 2028** — aplikasi belajar flag football (IFAF 5v5) untuk pemula: skill tree bercabang → lesson / kuis / drill → dashboard progres, plus playbook Tim Saya.

Flag football akan menjadi olahraga Olimpiade 2028. Barrier entry tinggi karena ruleset berbeda dari tackle football (tidak ada “1st & 10”, line to gain = **middle**, non-kontak). PlayFlag membuat jalur belajar bertahap yang terasa mudah dan progresnya terlihat.

## Fitur saat ini (demo)

- **Onboarding** — nama tampilan + hero brand
- **Dashboard** — path % Road to 2028, streak, radar skill (Rules / Movement / Strategy), deep-link resume belajar
- **Skill tree bercabang (IFAF)** — hub navigasi:
  - **Fondasi (GEN)** → **Offense / Defense** → posisi (**QB**, **Receiver** + Snapper, **Pass Rusher**, **DB**)
  - Katalog node per cabang/posisi; mastery sederhana (Belajar → Bisa → Kuasai)
  - **Demo unlock:** semua cabang terbuka (`DEMO_UNLOCK_ALL`)
  - Node GEN interaktif memakai flow Phase 1: Lesson → Quiz → Drill
- **Tim Saya** — nama tim, roster 5, play editor Canvas:
  - Fokus **Offense / Defense**
  - Rute bent (polyline multi-titik)
  - Chip defense anonim + jalur coverage putus-putus
- **UI** — premium dark (Syne / Outfit), aset visual di `public/image/`
- **Persistensi** — state di `localStorage` key `playflag:v1` (tanpa backend; migrasi legacy level → skill id)

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
| Assets | WebP / PNG brand di `public/image/` |

## Demo checklist (2–3 menit)

1. Onboarding dengan nama → Dashboard  
2. Belajar: buka hub skill tree (Fondasi → Offense/Defense → posisi)  
3. Selesaikan satu skill GEN interaktif (lesson → kuis → drill)  
4. Dashboard: path % dan radar terbarui  
5. Tim Saya: edit roster, buka play — geser posisi, buat rute bent (≥1 belokan), coba chip Defense/coverage  
6. Refresh browser — state tetap ada  
7. Tidak ada fitur kompetisi / social / auth  

## Docs

- [Product Requirements](docs/prd/2026-08-01-playflag-prd.md)
- [Architecture RFC](docs/rfc/2026-08-01-playflag-architecture.md)
- [Skill tree kurikulum](docs/skill-tree.md)
- [Image prompt pack (Gemini)](docs/playflag-image-prompts.md)
- [IFAF Flag Football Rules context](flag-football-context-ifaf-2023.md)
- [Strategy context](flag-football-strategy-context.md)
- [Implementation plan (Phase 1)](docs/superpowers/plans/2026-08-01-playflag-phase1.md)

## Catatan

- UI copy: Bahasa Indonesia; istilah IFAF tetap English (flag pull, middle, down, blitz, no-running zone).
- Clear `localStorage` / tombol **Reset demo** di Dashboard menghapus progres.
- Unlock penuh aktif untuk demo; set `DEMO_UNLOCK_ALL = false` di `src/content/skillTree.ts` untuk aturan unlock bertahap (GEN wajib dulu, lalu OFF/DEF, lalu posisi).
- Route legacy `/learn/:levelId/...` dialihkan ke skill id (mis. level 1 → `GEN-01`).

## License

Hackathon / demo project — sesuaikan lisensi jika dirilis publik.
