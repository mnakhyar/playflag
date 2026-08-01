# Kurikulum & Skill Tree — Flag Football 5v5 (IFAF 2023)

> **Cara pakai:** simpan sebagai `docs/skill-tree.md`. Tag bersama dua context lain saat membangun modul pembelajaran:
> `@docs/flag-football-context.md @docs/flag-football-strategy.md @docs/skill-tree.md`
>
> Berisi 78 node keterampilan terstruktur, kriteria penguasaan yang terukur, skema database, dan JSON siap seed.

---

## 1. Arsitektur tree

```
                         ┌─────────────────────┐
                         │   TIER 0 — GENERAL  │
                         │   10 node · GEN     │
                         │  Wajib untuk semua  │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
      ┌────────────────────┐               ┌────────────────────┐
      │ TIER 1 — OFFENSE   │               │ TIER 1 — DEFENSE   │
      │   6 node · OFF     │               │   6 node · DEF     │
      └─────────┬──────────┘               └─────────┬──────────┘
                │                                    │
      ┌─────────┴─────────┐               ┌──────────┴─────────┐
      ▼                   ▼               ▼                    ▼
┌───────────┐      ┌───────────┐    ┌────────────┐     ┌────────────┐
│    QB     │      │ RECEIVER  │    │PASS RUSHER │     │ DEF. BACK  │
│ 17 node   │      │ 17 node   │    │  14 node   │     │  16 node   │
│ TIER 2-5  │      │ TIER 2-5  │    │  TIER 2-5  │     │  TIER 2-5  │
└───────────┘      └─────┬─────┘    └────────────┘     └────────────┘
                         │
                   ┌─────▼─────┐
                   │  SNAPPER  │  ← sub-cabang Receiver
                   │  3 node   │     (di IFAF, snapper = receiver ke-4)
                   └───────────┘
```

### Tingkatan dalam tiap cabang posisi

| Tier | Nama | Arti | Warna UI |
|---|---|---|---|
| 2 | **Foundation** | Bisa ikut latihan tim tanpa jadi beban | Abu-abu |
| 3 | **Core** | Bisa dimainkan di pertandingan resmi | Biru |
| 4 | **Advanced** | Starter yang bisa diandalkan | Ungu |
| 5 | **Elite** | Pemain yang mengubah jalannya pertandingan | Emas |

### Aturan unlock

1. Semua node **GEN** wajib selesai sebelum cabang mana pun terbuka
2. Cabang **OFF** dan **DEF** bisa dibuka keduanya — pemain 5v5 hampir selalu main dua arah
3. Node posisi terbuka setelah cabangnya (OFF/DEF) selesai
4. Di dalam cabang posisi, tier berikutnya terbuka setelah **80% node tier sebelumnya** dikuasai
5. Tiap node punya 3 tingkat penguasaan: **Belajar → Bisa → Kuasai**

---

## 2. Sistem penilaian

Tiap node punya **kriteria penguasaan yang terukur** — bukan "pemain paham konsep X", tapi angka yang bisa dicek pelatih di lapangan. Ini yang membedakan kurikulum betulan dari daftar keinginan.

| Tingkat | Simbol | Arti | XP |
|---|---|---|---|
| Belum | ○ | Belum pernah dilatih | 0 |
| Belajar | ◔ | Paham konsep, eksekusi belum konsisten | 10 |
| Bisa | ◑ | Memenuhi kriteria di latihan | 25 |
| Kuasai | ● | Memenuhi kriteria **dalam pertandingan** | 50 |

Level pemain dari total XP: **Rookie** 0–299 · **Starter** 300–899 · **Veteran** 900–1799 · **All-Star** 1800–2999 · **Elite** 3000+

---

## 3. TIER 0 — GENERAL (wajib semua pemain)

| ID | Keterampilan | Isi | Drill | Kriteria kuasai |
|---|---|---|---|---|
| **GEN-01** | Aturan Dasar IFAF 5v5 | 5 pemain, 4 down ke garis tengah, tidak ada tendangan, TD 6 / try 1-2, no-run zone | Kuis 20 soal + tonton 1 pertandingan sambil menyebut down & distance | Skor kuis ≥18/20 dan benar menyebut down & distance 10 play berturut-turut |
| **GEN-02** | Sikap Atletik | Lutut tertekuk, berat di ujung kaki, tangan siap, pandangan ke depan | Tahan sikap 30 detik, reaksi ke arah acak | Tetap seimbang saat didorong ringan dari 4 arah |
| **GEN-03** | Akselerasi & Perubahan Arah | 3 langkah pertama, menurunkan pinggul saat memotong | Pro agility 5-10-5, cone L-drill | 5-10-5 di bawah 5.5 detik, tanpa melebar saat memotong |
| **GEN-04** | Pemasangan Flag yang Benar | Sabuk pas di pinggang, flag menggantung bebas di kedua sisi, tidak tertutup baju | Cek sabuk berpasangan sebelum tiap latihan | Flag tidak pernah lepas sendiri dalam 1 sesi penuh |
| **GEN-05** | Deflag Dasar | Dua tangan, target pinggang bukan badan, ambil sudut ke depan runner | Deflag berpasangan kecepatan 50% → 100% | 8 dari 10 deflag berhasil pada percobaan pertama |
| **GEN-06** | Menangkap Bola | Berlian untuk bola tinggi, kelingking rapat untuk bola rendah, mata ikuti sampai masuk tangan | 50 tangkapan diam, 50 sambil lari | 45/50 diam, 40/50 sambil lari |
| **GEN-07** | Melempar Dasar | Grip di jahitan, langkah menyilang, follow-through ke bawah | 30 lemparan 10 yd berpasangan | 25/30 spiral, sampai ke dada penerima |
| **GEN-08** | Kesadaran Situasi | Selalu tahu: down keberapa, target middle/goal, posisi bola, sisa waktu, sisa timeout | Pelatih berteriak "situasi?" acak saat latihan | Jawab benar 10 kali berturut-turut tanpa jeda |
| **GEN-09** | Kondisi Fisik 40 Menit | Daya tahan interval — flag football adalah sprint berulang, bukan lari jauh | 10×40 yd sprint, istirahat 30 detik | Sprint ke-10 tidak lebih lambat 10% dari sprint pertama |
| **GEN-10** | Komunikasi & Sportivitas | Huddle, sinyal, **kembalikan flag ke lawan** (tidak melakukannya = penalti 10 yard) | Simulasi huddle 15 detik, latihan mengembalikan flag | Nol penalti unsportsmanlike dalam 3 pertandingan |

---

## 4. TIER 1 — OFFENSE (cabang)

| ID | Keterampilan | Isi | Kriteria kuasai |
|---|---|---|---|
| **OFF-01** | Formasi Dasar | Spread, Trips, Twins, Bunch, Stack, Empty — bisa berbaris benar dalam 5 detik | Berbaris benar di 6 formasi dari panggilan suara, tanpa ragu |
| **OFF-02** | Route Tree 0–9 | Hitch, flat, slant, comeback, curl, out, in, corner, post, go | Jalankan 10 route dari panggilan nomor, kedalaman meleset ≤1 yard |
| **OFF-03** | Timing & Spacing | Kenapa batas 7 detik mengubah segalanya; jarak minimal antar receiver | Jelaskan mengapa route >12 yd tidak bisa jadi read pertama |
| **OFF-04** | Snap & Alignment | Snap legal (sumbu bola tegak lurus SL, gerakan mundur menerus), semua pemain di belakang SL | 20 snap berturut-turut tanpa penalti false start / illegal snap |
| **OFF-05** | Membaca Coverage Pre-Snap | Man vs zone: jarak defender, arah pandangan mata, ada/tidaknya safety tengah | Identifikasi benar 8 dari 10 gambar coverage |
| **OFF-06** | Aturan Offense Kritis | QB tidak boleh lewat SL · satu forward pass per down · wajib pass di no-run zone · **shielding = penalti** · flag guarding = penalti + loss of down | Nol penalti offense akibat kekeliruan aturan dalam 3 pertandingan |

---

## 5. TIER 1 — DEFENSE (cabang)

| ID | Keterampilan | Isi | Kriteria kuasai |
|---|---|---|---|
| **DEF-01** | Skema Dasar | 3-2 Zone, 2-2 Box, 1-3-1, Man + Free Rush, Cover 0 | Berbaris benar di 5 skema dari panggilan, dalam 5 detik |
| **DEF-02** | Sudut Kejar & Leverage | Kejar ke **titik di depan** runner, bukan posisi sekarang; jaga bantuan di dalam/luar | 9 dari 10 kejaran memotong runner, bukan mengejar dari belakang |
| **DEF-03** | Teknik Deflag Lanjutan | Dua tangan, jangan meraih ke belakang, jangan menerjang badan | 8/10 deflag berhasil pada runner kecepatan penuh, nol kontak ilegal |
| **DEF-04** | Aturan Blitz | Mulai **>7 yard**, satu tangan diangkat minimal 1 detik sebelum snap, **maks 2 blitzer**, rush lurus & cepat | 20 blitz berturut-turut tanpa penalti illegal signal / illegal rush |
| **DEF-05** | Komunikasi Defensif | Panggil coverage, umumkan formasi lawan, pass off receiver di zone | Panggilan terdengar dan benar di 10 snap berturut-turut |
| **DEF-06** | Penalti Defensif yang Harus Dihindari | Illegal flag pull (5 yd) · pass interference (10 yd + **otomatis first down**) · illegal contact (10 yd + first down) · offside | Nol penalti defensif dalam 2 pertandingan |

---

## 6. CABANG — QUARTERBACK (17 node)

Prasyarat: seluruh GEN + seluruh OFF

### Tier 2 · Foundation

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **QB-F1** | Grip & Mekanik Spiral | 40 lemparan 10 yd, fokus follow-through | 35/40 spiral rapat, akurat ke dada |
| **QB-F2** | Footwork Pasca-Snap | Drop 3 langkah, **selalu di belakang SL** — QB tidak boleh melewatinya | 20 drop berturut-turut, kaki tidak pernah melewati SL |
| **QB-F3** | Akurasi Jarak Dekat (0–7 yd) | 30 lemparan ke sasaran diam di 5 yd | 26/30 dalam radius 1 yard dari sasaran |
| **QB-F4** | Jam Internal 7 Detik | Latihan dengan stopwatch keras-keras, sadari kapan detik ke-5 | Melempar/hand-off sebelum 5 detik di 18 dari 20 snap |

### Tier 3 · Core

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **QB-C1** | Progresi 2 Read + Checkdown | Play mesh: crosser 1 → crosser 2 → snapper | 8/10 memilih target yang benar-benar paling terbuka |
| **QB-C2** | Membaca Coverage Pasca-Snap | Konfirmasi man/zone dalam 1 detik setelah snap | 8/10 identifikasi benar sambil menjalankan drop |
| **QB-C3** | Akurasi Menengah 8–15 yd | 30 lemparan out & dig ke receiver bergerak | 22/30 tepat waktu, di sisi jauh dari defender |
| **QB-C4** | Hot Read Anti-Blitz | Lihat 2 tangan terangkat pre-snap → langsung ganti ke slant/flat | 9/10 mengenali blitz dan melepas bola ≤2.5 detik |
| **QB-C5** | Rollout Lateral Legal | Bergerak menyamping di belakang SL untuk mengubah sudut lempar | 15 rollout tanpa sekalipun melewati SL |
| **QB-C6** | Ball Placement | Bola ke sisi yang jauh dari defender, bukan sekadar "ke arah receiver" | Pelatih menilai 8/10 penempatan aman |

### Tier 4 · Advanced

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **QB-A1** | Lemparan Antisipasi | Melempar sebelum receiver memotong | 7/10 komplet pada route out & comeback |
| **QB-A2** | Touch vs Velocity | Fade lembut, seam keras, back-shoulder | Menunjukkan 3 jenis lemparan berbeda pada situasi yang tepat |
| **QB-A3** | Manipulasi Safety | Menggeser safety dengan arah mata & bahu sebelum melempar | Rekaman video menunjukkan safety bergeser di 6/10 snap |
| **QB-A4** | Manajemen Jam & 2 Menit | Tahu kapan jam berhenti (first down, out of bounds, pass jatuh di 2 menit terakhir) | Menjalankan drive 2 menit tanpa membuang timeout sia-sia |
| **QB-A5** | Eksekusi No-Run Zone | Wajib pass, lapangan sempit, timing sangat ketat | Konversi 6/10 percobaan dari yard 5 |
| **QB-A6** | Mengenali Skema dari Pergerakan Awal | Membedakan 3-2 zone, 1-3-1, dan man dalam 2 detik pre-snap | 8/10 benar, diuji dengan video |

### Tier 5 · Elite

| ID | Keterampilan | Kriteria kuasai |
|---|---|---|
| **QB-E1** | Audible & Penyesuaian Pre-Snap | Mengubah play berdasarkan coverage, 5/10 perubahan menghasilkan first down |
| **QB-E2** | Mengendalikan Tempo | Sengaja mempercepat/melambatkan tempo sesuai kebutuhan skor & jam |
| **QB-E3** | Keputusan 4th Down | Tidak ada punt — tiap 4th down keputusan. Rasio konversi ≥50% dalam satu musim |

---

## 7. CABANG — RECEIVER (17 node)

Prasyarat: seluruh GEN + seluruh OFF

### Tier 2 · Foundation

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **WR-F1** | Stance & Release Bersih | Keluar dari garis tanpa ragu, langkah pertama ke arah route | 20 release tanpa langkah palsu |
| **WR-F2** | Tangkapan Tinggi / Rendah / Jauh | 20 tangkapan tiap jenis | 17/20 tiap kategori |
| **WR-F3** | Kedalaman Route yang Tepat | Hitung langkah, bukan perasaan | 10 route berbeda, meleset ≤1 yard |
| **WR-F4** | Menangkap Sambil Lari Penuh | Bola dilempar ke depan, tangkap tanpa melambat | 15/20 tanpa mengurangi kecepatan |

### Tier 3 · Core

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **WR-C1** | Ketajaman Cut | Turunkan pinggul, 1 langkah plant, tanpa melebar | Cut selesai dalam 1 langkah di 8/10 percobaan |
| **WR-C2** | Pemisahan Tanpa Kontak | **Shielding = penalti 5 yard.** Pisah lewat kecepatan, tempo, dan fake — bukan badan | 10 route melawan man, nol penalti shielding |
| **WR-C3** | Membaca Coverage Saat Berlari | Man → lari terus. Zone → duduk di celah | 8/10 penyesuaian benar |
| **WR-C4** | Tangkapan Kontes | Tangan tinggi, mata tetap di bola meski ada defender | 12/20 tangkapan dalam kondisi diganggu |
| **WR-C5** | Kesadaran Sideline | Satu kaki di dalam; sengaja keluar untuk menghentikan jam | 8/10 tangkapan sideline dinyatakan sah |
| **WR-C6** | Menghindari Flag Guarding | Tidak menutupi flag dengan tangan/bola/badan — penalti + loss of down | Nol penalti flag guarding dalam 3 pertandingan |

### Tier 4 · Advanced

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **WR-A1** | Double Move | Sluggo, post-corner, whip | 3 double move meyakinkan, defender tertipu ≥5/10 |
| **WR-A2** | YAC & Menghindari Deflag | Setelah tangkap: potong, bukan lari lurus ke defender | Rata-rata ≥3 yard setelah tangkapan |
| **WR-A3** | Route dari Stack & Bunch | Timing keluar dari tumpukan tanpa bertabrakan dengan rekan | 10 snap dari bunch tanpa tabrakan dan tanpa penalti |
| **WR-A4** | Tempo Route | Lambat lalu cepat untuk memancing defender | Perubahan tempo terlihat jelas di video, defender salah langkah 6/10 |
| **WR-A5** | Menyerang Leverage Defender | Kalau defender di dalam, serang ke luar — dan sebaliknya | 8/10 memilih arah yang benar |

### Tier 5 · Elite

| ID | Keterampilan | Kriteria kuasai |
|---|---|---|
| **WR-E1** | Option / Choice Route | Sinkron penuh dengan QB — 8/10 membaca defender dengan keputusan yang sama dengan QB |
| **WR-E2** | Route No-Run Zone | Fade, back-shoulder, slant cepat di ruang sempit — konversi ≥50% |

### Sub-cabang · SNAPPER (3 node)

> Di IFAF, snapper langsung jadi **receiver eligible** setelah snap. Ini target keempat yang sering benar-benar tidak dijaga. Tim yang mengabaikan ini membuang satu senjata setiap snap.

| ID | Keterampilan | Kriteria kuasai |
|---|---|---|
| **SNP-1** | Snap Legal & Konsisten | 25 snap berturut-turut ke tangan QB tanpa penalti |
| **SNP-2** | Release Cepat Pasca-Snap | Masuk ke flat/checkdown dalam 1.5 detik setelah snap |
| **SNP-3** | Checkdown yang Bisa Diandalkan | Selalu berada di penglihatan QB pada detik ke-4, tangkap 9/10 |

---

## 8. CABANG — PASS RUSHER (14 node)

Prasyarat: seluruh GEN + seluruh DEF

### Tier 2 · Foundation

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **RSH-F1** | Aturan Blitz IFAF | Mulai >7 yd · satu tangan diangkat ≥1 detik sebelum snap · maks 2 blitzer · rush harus **cepat dan lurus** ke titik QB | 20 blitz tanpa penalti illegal signal |
| **RSH-F2** | Start Eksplosif dari 7 Yard | Sprint 7 yard dari sikap siap | Menempuh 7 yard dalam ≤1.4 detik |
| **RSH-F3** | Jalur Lurus ke Titik QB | Belok atau melambat = kehilangan right of way | 10 rush berturut-turut, jalur lurus, dinilai video |

### Tier 3 · Core

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **RSH-C1** | Timing Snap | Baca tangan snapper, bukan bola | Nol offside dalam 20 snap, waktu reaksi ≤0.3 detik |
| **RSH-C2** | Menghindari Kontak | Illegal contact = 10 yard + otomatis first down. Rush **melewati**, bukan menembus | Nol penalti kontak dalam 3 pertandingan |
| **RSH-C3** | Deflag QB (Sack) | Sudut mendekat, tangan ke pinggang, jangan meraih ke atas | 6/10 sack pada QB yang menahan bola >4 detik |
| **RSH-C4** | Contain Rollout Lateral | QB tidak boleh lewat SL, tapi boleh geser menyamping — potong jalurnya | QB tidak berhasil geser >5 yard di 8/10 rush |
| **RSH-C5** | Mempertahankan Right of Way | Rush terus meski QB bergerak — melambat = hilang hak jalan | Dinilai wasit/pelatih: 9/10 rush sah |

### Tier 4 · Advanced

| ID | Keterampilan | Kriteria kuasai |
|---|---|---|
| **RSH-A1** | Koordinasi 2 Blitzer | Dua jalur yang tidak bertabrakan, satu contain satu tekan — 8/10 rush terkoordinasi |
| **RSH-A2** | Membaca Handoff & Fake | Tidak termakan fake, tetap ke QB kalau bola masih di tangannya — 8/10 benar |
| **RSH-A3** | Tangan Naik di Detik Terakhir | Menghalangi jalur lempar saat tidak sempat sack — ≥3 pass terganggu per pertandingan |
| **RSH-A4** | Disguise Blitz | Memberi sinyal di detik terakhir yang sah (≥1 detik sebelum snap) tanpa kena penalti |

### Tier 5 · Elite

| ID | Keterampilan | Kriteria kuasai |
|---|---|---|
| **RSH-E1** | Rush Berbasis Tendensi QB | Tahu QB lawan cenderung mundur/geser ke kanan, sesuaikan sudut — success rate naik ≥20% |
| **RSH-E2** | Tahu Kapan **Tidak** Blitz | Blitz = 3 defender lawan 4 receiver. Bisa menjelaskan dan memilih dengan benar 8/10 situasi |

---

## 9. CABANG — DEFENSIVE BACK (16 node)

Prasyarat: seluruh GEN + seluruh DEF

### Tier 2 · Foundation

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **DB-F1** | Backpedal | Punggung lurus, langkah pendek, tanpa berdiri tegak | Backpedal 15 yard tetap seimbang, 10 kali berturut-turut |
| **DB-F2** | Membuka Pinggul & Transisi | Backpedal → putar → sprint tanpa langkah sia-sia | Transisi dalam 1 langkah di 8/10 percobaan |
| **DB-F3** | Leverage & Cushion | Jaga jarak 5–7 yard, posisikan badan sesuai bantuan | Posisi benar di 9/10 snap |
| **DB-F4** | Disiplin Mata | Man: lihat pinggang receiver. Zone: lihat QB | Nol kali "tertipu" dalam 10 snap zone |

### Tier 3 · Core

| ID | Keterampilan | Drill | Kriteria kuasai |
|---|---|---|---|
| **DB-C1** | Man Coverage — Mirroring | Ikuti pinggang, bukan kepala atau bahu | Receiver terbuka ≤3 dari 10 route |
| **DB-C2** | Zone Coverage — Landmark | Tahu titik jaga, pass off receiver yang keluar zona | Nol receiver lolos tanpa diserahkan, 10 snap |
| **DB-C3** | Break pada Bola | Baca lemparan, potong jalur | 6/10 sampai ke bola bersamaan receiver |
| **DB-C4** | Deflag Segera Setelah Tangkapan | Batasi YAC ke 0–2 yard | Rata-rata YAC yang diberikan ≤2 yard |
| **DB-C5** | Menghindari Pass Interference | 10 yard + **otomatis first down**. Mainkan bola, bukan badan | Nol PI dalam 3 pertandingan |
| **DB-C6** | Menghindari Illegal Flag Pull | Hanya boleh mencabut flag runner — 5 yard kalau salah | Nol penalti illegal flag pull |

### Tier 4 · Advanced

| ID | Keterampilan | Kriteria kuasai |
|---|---|---|
| **DB-A1** | Membaca Kombinasi Route | Kenali mesh, smash, flood, levels dalam 2 detik — 8/10 benar dari video |
| **DB-A2** | Deep Half vs Deep Third | Tahu bedanya dan tanggung jawabnya di 3-2 vs 1-3-1 — nol big play akibat salah zona |
| **DB-A3** | Interception | Tangan tinggi menjemput bola, bukan menunggu di dada — ≥1 INT per 3 pertandingan |
| **DB-A4** | Pertahanan No-Run Zone | Lari ilegal di sana → semua 5 pemain coverage penuh. Bisa jelaskan dan eksekusi | Konversi lawan di no-run zone turun di bawah 40% |
| **DB-A5** | Switch & Komunikasi Banjir | Menangani 2 receiver menyilang di zona yang sama | Nol kebingungan dalam 10 snap kombinasi |

### Tier 5 · Elite

| ID | Keterampilan | Kriteria kuasai |
|---|---|---|
| **DB-E1** | Memancing QB | Sengaja memberi celah lalu menutupnya — ≥2 INT hasil pancingan per musim |
| **DB-E2** | Pertahanan Sideline & 2 Menit | Paksa lawan ke tengah agar jam terus berjalan — dinilai pelatih dari rekaman |

---

## 10. Skema database

```sql
create table skills (
  id text primary key,                -- 'QB-C4'
  name text not null,
  branch text not null,               -- 'general' | 'offense' | 'defense'
  position text,                      -- null | 'qb' | 'receiver' | 'snapper' | 'rusher' | 'db'
  tier int not null,                  -- 0..5
  tier_label text,                    -- 'Foundation' | 'Core' | 'Advanced' | 'Elite'
  description text not null,
  drill text,
  mastery_criteria text not null,     -- HARUS terukur
  rule_ref text,                      -- referensi aturan IFAF terkait, mis. 'R 7-1-4'
  xp_max int default 50,
  sort_order int default 0
);

create table skill_prereqs (
  skill_id text references skills on delete cascade,
  requires_skill_id text references skills on delete cascade,
  primary key (skill_id, requires_skill_id)
);

create table player_skills (
  player_id int references players on delete cascade,
  skill_id text references skills on delete cascade,
  level text not null default 'not_started',
    -- 'not_started' | 'learning' | 'competent' | 'mastered'
  xp int default 0,
  verified_by text,                   -- nama pelatih yang mengesahkan
  verified_at timestamptz,
  note text,
  primary key (player_id, skill_id)
);

-- View untuk progres pemain
create view player_progress as
select
  p.id as player_id,
  p.name,
  coalesce(sum(ps.xp), 0) as total_xp,
  count(*) filter (where ps.level = 'mastered') as mastered_count,
  case
    when coalesce(sum(ps.xp),0) >= 3000 then 'Elite'
    when coalesce(sum(ps.xp),0) >= 1800 then 'All-Star'
    when coalesce(sum(ps.xp),0) >= 900  then 'Veteran'
    when coalesce(sum(ps.xp),0) >= 300  then 'Starter'
    else 'Rookie'
  end as player_level
from players p
left join player_skills ps on ps.player_id = p.id
group by p.id, p.name;
```

---

## 11. Struktur JSON untuk seed

```json
{
  "branches": [
    { "id": "general",  "name": "Fondasi",  "tier": 0, "color": "#64748b", "unlocks": ["offense","defense"] },
    { "id": "offense",  "name": "Offense",  "tier": 1, "color": "#2563eb", "requires": "general",
      "unlocks": ["qb","receiver"] },
    { "id": "defense",  "name": "Defense",  "tier": 1, "color": "#dc2626", "requires": "general",
      "unlocks": ["rusher","db"] }
  ],
  "positions": [
    { "id": "qb",       "name": "Quarterback",    "branch": "offense", "icon": "target",  "nodeCount": 17 },
    { "id": "receiver", "name": "Receiver",       "branch": "offense", "icon": "zap",     "nodeCount": 17,
      "subBranch": { "id": "snapper", "name": "Snapper", "nodeCount": 3 } },
    { "id": "rusher",   "name": "Pass Rusher",    "branch": "defense", "icon": "wind",    "nodeCount": 14 },
    { "id": "db",       "name": "Defensive Back", "branch": "defense", "icon": "shield",  "nodeCount": 16 }
  ],
  "tiers": [
    { "level": 2, "label": "Foundation", "color": "#94a3b8" },
    { "level": 3, "label": "Core",       "color": "#3b82f6" },
    { "level": 4, "label": "Advanced",   "color": "#8b5cf6" },
    { "level": 5, "label": "Elite",      "color": "#f59e0b" }
  ],
  "masteryLevels": [
    { "id": "not_started", "label": "Belum",   "symbol": "○", "xp": 0  },
    { "id": "learning",    "label": "Belajar", "symbol": "◔", "xp": 10 },
    { "id": "competent",   "label": "Bisa",    "symbol": "◑", "xp": 25 },
    { "id": "mastered",    "label": "Kuasai",  "symbol": "●", "xp": 50 }
  ],
  "playerLevels": [
    { "id": "rookie",   "label": "Rookie",   "minXp": 0    },
    { "id": "starter",  "label": "Starter",  "minXp": 300  },
    { "id": "veteran",  "label": "Veteran",  "minXp": 900  },
    { "id": "allstar",  "label": "All-Star", "minXp": 1800 },
    { "id": "elite",    "label": "Elite",    "minXp": 3000 }
  ]
}
```

Contoh satu node:

```json
{
  "id": "QB-C4",
  "name": "Hot Read Anti-Blitz",
  "branch": "offense",
  "position": "qb",
  "tier": 3,
  "tierLabel": "Core",
  "description": "Melihat dua tangan terangkat sebelum snap, langsung mengganti target ke slant atau flat.",
  "drill": "Pelatih acak mengirim 0/1/2 blitzer. QB harus mengenali dan melepas bola.",
  "masteryCriteria": "9 dari 10 kali mengenali blitz dan melepas bola dalam 2,5 detik.",
  "ruleRef": "R 7-1-4-d (maks 2 blitzer, sinyal wajib)",
  "prereqs": ["QB-F4", "OFF-05"],
  "xpMax": 50
}
```

---

## 12. Prompt Cursor

### Generate seed lengkap

```
@docs/skill-tree.md @api/schema.sql

Generate api/seed-skills.sql:

1. INSERT semua 78 node dari bagian 3-9 skill-tree.md ke tabel skills.
   Kolom mastery_criteria diisi PERSIS dari kolom "Kriteria kuasai" di tabel —
   jangan diringkas, itu bagian terpenting kurikulum ini.
2. INSERT skill_prereqs sesuai aturan unlock di bagian 1:
   - Semua node OFF dan DEF butuh seluruh node GEN
   - Node posisi tier 2 butuh seluruh node cabangnya (OFF atau DEF)
   - Node tier N butuh minimal 80% node tier N-1 di posisi yang sama
3. INSERT player_skills acak yang realistis untuk semua pemain di seed:
   - Pemain berposisi QB punya progres tinggi di cabang qb, rendah di db
   - 2-3 pemain dibuat "Elite", sebagian besar "Starter" atau "Veteran"
   - Level yang lebih tinggi hanya boleh ada kalau prasyaratnya sudah 'mastered'
```

### Halaman skill tree

```
@docs/skill-tree.md @web/src/api.ts

Buat web/src/pages/SkillTree.tsx untuk route /player/:id/skills.

Layout:
- Header: nama pemain, posisi, badge level (Rookie..Elite), progress bar total XP
- Peta cabang: tiga kolom — Fondasi, Offense, Defense. Cabang yang belum
  terbuka ditampilkan abu-abu dan terkunci.
- Klik cabang -> daftar posisi di dalamnya
- Klik posisi -> node dikelompokkan per tier, tiap tier satu baris horizontal
  yang bisa di-scroll
- Node: kartu kecil berisi simbol penguasaan (○ ◔ ◑ ●), nama, dan warna tier.
  Node terkunci: opacity 40% + ikon gembok.
- Klik node -> panel geser dari bawah berisi deskripsi, drill, kriteria penguasaan,
  referensi aturan, dan 4 tombol untuk mengubah tingkat penguasaan.

Garis penghubung antar tier digambar pakai SVG absolute positioned di belakang kartu.
Mobile-first. Tanpa library. Bahasa Indonesia.
```

### Logika unlock

```
@docs/skill-tree.md

Buat web/src/lib/skillTree.ts:

export function isUnlocked(skillId, playerSkills, allSkills, prereqs): boolean
  -- true jika SEMUA prereq sudah minimal 'competent'

export function tierProgress(position, tier, playerSkills): number
  -- persentase node tier itu yang sudah 'mastered'

export function nextRecommended(playerSkills, allSkills, prereqs, position): Skill[]
  -- 3 node yang sudah terbuka, belum 'mastered', tier terendah dulu.
  -- Ini yang ditampilkan di dashboard pemain sebagai "Latihan berikutnya".

export function playerLevel(totalXp): { id: string; label: string; nextAt: number | null }

Fungsi murni, tanpa fetch, tanpa React.
```

---

## 13. Catatan implementasi untuk hackathon 3 jam

Modul ini **terlalu besar** untuk 3 jam. Kalau tetap ingin muncul di demo, ambil irisan tipisnya saja:

| Ambil | Lewati |
|---|---|
| Satu halaman read-only: skill tree untuk **satu** posisi (QB), data dari seed | Editing progres, verifikasi pelatih, XP realtime |
| Badge level pemain di halaman statistik — satu query ke `player_progress` | Seluruh peta cabang interaktif |
| Panel "Latihan berikutnya" berisi 3 node — `nextRecommended()` hardcoded hasilnya | Logika unlock penuh |

Yang paling murah dan paling berdampak: **badge level pemain di leaderboard statistik.** Satu kolom tambahan, tapi langsung menunjukkan ke juri bahwa aplikasi Anda punya dimensi pembinaan, bukan sekadar pencatat skor. Sisanya tunjukkan sebagai roadmap di slide.

---

## 14. Ringkasan jumlah node

| Cabang | Node |
|---|---|
| General (Tier 0) | 10 |
| Offense (Tier 1) | 6 |
| Defense (Tier 1) | 6 |
| Quarterback | 17 |
| Receiver | 17 (termasuk 3 Snapper) |
| Pass Rusher | 14 |
| Defensive Back | 16 |
| **Total** | **86** |

Jalur terpendek dari nol ke Elite di satu posisi: **10 GEN + 6 cabang + 17 posisi = 33 node.** Dengan asumsi 2 node dikuasai per pekan latihan, itu sekitar **4 bulan** — kira-kira satu musim penuh. Angka ini sengaja dibuat realistis; kurikulum yang bisa diselesaikan dalam 2 minggu bukan kurikulum.

---

**Sumber aturan:** [IFAF International Flag Football Rules 2023 — 5 on 5 (PDF)](https://americanfootball.sport/wp-content/uploads/2023/05/FlagRules2023.pdf)
