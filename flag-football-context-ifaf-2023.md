# Flag Football Domain Context — IFAF Rules 2023 (5v5)

> **Cara pakai:** simpan sebagai `docs/flag-football-context.md` di repo. Setiap kali menulis prompt yang menyentuh logika pertandingan, tag file ini: `@docs/flag-football-context.md`. Ini mencegah Cursor memakai asumsi American football (10 yard first down, 4 quarter, field goal) yang **salah** untuk flag football.
>
> Sumber: [IFAF International Flag Football Rules 2023 (PDF resmi)](https://americanfootball.sport/wp-content/uploads/2023/05/FlagRules2023.pdf)

---

## 1. Dasar permainan

| Item | Nilai |
|---|---|
| Pemain di lapangan | Maks **5** per tim (boleh main dengan lebih sedikit; kurang dari 4 = forfeit) |
| Roster | Maks **15** pemain (5 main + 10 cadangan) |
| Gender | Satu tim harus satu gender (kecuali penyelenggara nasional mengubahnya) |
| Kontak | **Non-kontak.** Tidak ada blocking, tackling, kicking |
| Tidak ada | Helm, pelindung, kickoff, punt, field goal |
| Wasit | Minimal 2 (Referee, Down Judge, Field Judge, Side Judge) |
| Kapten | Maks 2 pemain + 2 pelatih yang boleh bicara dengan Referee |

### Varian
- **Flag Football (5v5)** — standar. Field of play 50 yd, endzone 2×10 yd, lebar 25 yd.
- **Flag 7v7** — sama, tapi lebar lapangan **30 yd**, maks 7 pemain, roster 20.
- **Beach Flag 4v4** — field of play 25 yd, tanpa middle line, maks 4 pemain, roster 10, waktu 2×15 menit, batas passing 5 detik, jarak blitz 5 yd, snap dari yard 1.

---

## 2. Lapangan

```
|<-3->|<--10-->|<------------- 50 yd -------------->|<--10-->|<-3->|
 safety  endzone   [5]                        [5]     endzone  safety
                    ^no-run             no-run^
                          |<--25-->|<--25-->|
                                 middle line
```

- **Field of play:** 50 yd × 25 yd lebar
- **End zone:** 10 yd di tiap ujung
- **No-running zone:** area **5 yd di depan tiap goal line** — di sini offense **wajib** melakukan forward pass play
- **Middle line:** persis di tengah. Titik tengahnya disebut **"middle"** dan inilah **line to gain** untuk seri down baru
- **Try mark:** yard **5** (1 poin) dan yard **10** (2 poin), di tengah lapangan
- Total ruang termasuk safety area: 76 yd × 31 yd
- Penyelenggara nasional boleh mengubah dimensi ±5 yd (maks 60×30, min 40×20; endzone min 8 yd)

---

## 3. Down & possession — INI YANG PALING SERING SALAH

> **Tidak ada "1st & 10".** Line to gain bukan jarak tetap, tapi **garis tengah lapangan**.

| Situasi | Aturan |
|---|---|
| Mulai seri | 4 down berturut-turut |
| Awal babak / setelah skor / safety / touchback | Snap dari **yard 5 sendiri** |
| Line to gain (di sisi sendiri) | **Middle** |
| Setelah melewati middle | 4 down baru untuk mencetak skor. Target = **goal line** |
| Melewati middle 2x dalam satu seri | **Tidak** dapat first down lagi |
| Gagal di down ke-4 | Defense ambil alih di **yard 5 sendiri** (bukan di tempat bola mati) |
| Interception | Defense ambil alih di **dead ball spot** |
| Setelah try | Lawan snap dari yard 5 sendiri |

**Implikasi untuk UI:** tampilkan down & distance sebagai **"2nd & Middle"** atau **"1st & Goal"**, bukan "2nd & 7". Ini detail kecil yang langsung menandakan aplikasi Anda paham olahraganya.

**Implikasi untuk skema DB:** ganti `yards_to_go INT` menjadi:

```sql
series_target text not null default 'middle'  -- 'middle' | 'goal'
```

---

## 4. Waktu

| Item | Nilai |
|---|---|
| Total | **40 menit** — 2 babak × 20 menit |
| Istirahat | 2 menit |
| Play clock | **25 detik** setelah bola ready for play |
| Batas QB melempar | **7 detik** setelah snap — lewat = loss of down di scrimmage line |
| Timeout | 2 per babak per tim, maks 60 detik, tidak bisa dibawa ke babak berikutnya |
| Jam jalan terus | Kecuali 2 menit terakhir tiap babak |
| Running clock | Jika selisih skor **≥ 30 poin**, jam tidak berhenti lagi sampai akhir babak |

**Jam berhenti di 2 menit terakhir** saat: first down diberikan, penalti diselesaikan, bola/pemain keluar lapangan, pass/fumble menyentuh tanah, skor terjadi (dan selama try), timeout.

---

## 5. Skor

| Kejadian | Poin |
|---|---|
| Touchdown | **6** |
| Try dari yard 5 | **1** |
| Try dari yard 10 | **2** |
| Touchdown defense saat try (pick-six on try) | **2** |
| Safety | **2** (untuk lawan) |
| Safety saat try | **1** (untuk lawan) |

Tim yang mencetak TD memilih 1 atau 2 poin **sebelum** bola ready for play, dan **tidak boleh berubah pikiran** setelah itu.

---

## 6. Posisi & penunjukan pemain

IFAF tidak memakai istilah posisi tradisional (WR/RB/CB). Yang dipakai adalah **peran per play**:

### Offense
| Istilah | Definisi |
|---|---|
| **Snapper** | Pemain yang melakukan snap. Tidak boleh menerima forward hand-off |
| **Quarterback** | Pemain yang **pertama** menguasai bola setelah snap. Otomatis juga runner pertama |
| **Passer** | Runner yang melempar legal pass |
| **Runner** | Siapa pun yang sedang memegang bola hidup |
| **Receiver** | Pemain offense selain snapper/runner |

### Defense
| Istilah | Definisi |
|---|---|
| **Blitzer** | Bertahan **>7 yd** dari scrimmage line saat snap, **DAN** memberi sinyal (satu tangan diangkat di atas kepala minimal 1 detik sebelum snap). Maks **2 blitzer** per play. Harus rush langsung, cepat, lurus ke titik QB menerima snap |
| **Rusher** | Bertahan >7 yd tapi **tanpa** sinyal, dan melewati scrimmage line secara legal |
| **Defender** | Sisanya. Yang <7 yd harus tetap di belakang scrimmage line sampai bola di-hand off / fake / dilempar QB |

**Untuk aplikasi:** field `position` di tabel `players` sebaiknya berisi peran praktis yang dipakai pelatih (`QB`, `C`/snapper, `WR`, `RUSH`, `DB`, `FLEX`) — tapi field `role` di play-by-play harus memakai istilah IFAF di atas.

### Aturan gerak yang membatasi strategi
- **QB tidak boleh lari melewati scrimmage line** — kecuali bola sudah dipegang pemain lain lalu dikembalikan, atau sudah disentuh defender saat melayang
- **Hanya 1 forward pass per down**, dan harus dilempar dari belakang scrimmage line
- **Hand-off boleh berkali-kali** selama kedua pemain di belakang scrimmage line
- **Backward pass (lateral) boleh** selama bola belum melewati scrimmage line
- **Di no-run zone, offense wajib forward pass play**
- Saat snap, **maks 1 pemain offense boleh bergerak**, dan tidak boleh ke arah gawang lawan

---

## 7. Penalti — tabel lengkap untuk dropdown aplikasi

Prinsip umum dari rulebook: **foul kontak & unsportsmanlike = 10 yard, foul non-kontak = 5 yard.**

### 10 yard

| Foul | Enforcement | Catatan |
|---|---|---|
| **Pass Interference** | Basic spot | Offense: loss of down. Defense: **automatic first down** |
| **Illegal Contact** | Basic spot | Loss of down. Defense: automatic first down |
| **Game Interference** (pelatih/cadangan mengganggu) | Basic spot | Sama seperti illegal contact |
| **Unsportsmanlike Conduct** | Dead ball spot | Dead ball foul |

### 5 yard + loss of down

| Foul |
|---|
| Illegal Forward Pass (dilempar dari depan SL / pass kedua / setelah runner lewat SL) |
| Illegal Backward Pass |
| Illegal Run Play (lari di no-run zone) — enforced dari scrimmage line |
| Flag Guarding (melindungi flag dengan tangan/badan) |
| Jumping / Diving oleh runner |
| Illegal Kick oleh runner |
| Illegal Batting |
| Forward hand-off ke snapper |

### 5 yard (tanpa loss of down)

| Foul | Enforcement |
|---|---|
| Delay of Game (lewat 25 detik) | Dead ball spot |
| False Start / Encroachment / Illegal Snap | Dead ball spot |
| Illegal Motion / Illegal Shift | Scrimmage line |
| Offside (defense) | Dead ball spot |
| Illegal Blitzer Signal (sinyal dari <7 yd, sinyal invalid, atau >2 blitzer) | Dead ball spot |
| Illegal Rush (defender <7 yd melewati SL terlalu cepat) | Scrimmage line |
| Shielding (menghalangi lawan) | Basic spot |
| Illegal Flag Pull (mencabut flag pemain yang bukan runner) | Basic spot |
| Illegal Kicking a Pass/Fumble | Basic spot |
| Illegal Participation (>5 pemain) | Scrimmage line |
| Illegal Substitution | Scrimmage line |
| Coach/cadangan di luar team area saat down | Scrimmage line |

### Loss of down saja (tanpa yard)

| Foul |
|---|
| **Batas 7 detik terlampaui** — bola mati di scrimmage line |
| Illegal Touching (pemain offense yang keluar lapangan sukarela lalu menyentuh pass) |

### Aturan tambahan yang perlu dikodekan
- Penalti dengan **loss of down** tetap menghitung down tersebut sebagai 1 dari 4
- **Offsetting fouls** (kedua tim melanggar) → down diulang
- Penalti **ditolak** → nomor down seperti seandainya foul tidak terjadi
- Penalti setelah **change of possession** → bola milik tim yang menguasai saat foul, down berikutnya = first down

---

## 8. Statistik

> **Catatan penting:** IFAF Rules 2023 adalah dokumen **aturan**, bukan standar statistik. Daftar di bawah **diturunkan** dari jenis-jenis play yang diakui rulebook — bukan skema resmi IFAF. Kalau turnamen Anda punya format stat sheet sendiri, itu yang menang.

### Passing
| Stat | Cara hitung |
|---|---|
| ATT | jumlah play `pass_complete` + `pass_incomplete` + `interception` |
| COMP | `pass_complete` |
| COMP% | COMP / ATT |
| YDS | total yards dari pass_complete |
| TD | pass_complete yang `is_touchdown` |
| INT | play `interception` |
| SACK | QB ter-deflag di belakang SL |
| 7-SEC | pelanggaran batas 7 detik |

### Receiving
TGT (targeted), REC, YDS, TD, YAC (yard setelah catch), DROP.

### Rushing
ATT, YDS, TD. Ingat: QB **tidak boleh** lari melewati SL, jadi rushing hampir selalu berasal dari hand-off atau lateral. Rushing yang tinggi = tim yang suka misdirection.

### Defense — ini jantung statistik flag football
| Stat | Keterangan |
|---|---|
| **FLAG PULLS (deflags)** | Ekuivalen tackle. Stat defensif paling penting |
| **SACKS** | Deflag QB di belakang scrimmage line |
| **INT** | Interception |
| **INT YDS / DEF TD** | Return dan pick-six |
| **PD** | Pass defended (bola dijatuhkan tanpa INT) |
| **FLAG PULLS FOR LOSS** | Deflag di belakang titik snap |
| **BLITZ ATT / BLITZ SUCCESS** | Blitz yang menghasilkan sack atau incompletion |

### Statistik tim
- Total yards, yards per play
- **First downs** = jumlah kali melewati middle (bukan konversi 10 yard)
- **4th down conversion rate** — sangat penting di flag football karena tidak ada punt, tiap 4th down adalah keputusan
- **No-run zone efficiency** — persentase skor saat snap di dalam 5 yard lawan
- Turnovers (INT + turnover on downs), turnover margin
- Penalti: jumlah + total yard
- Time of possession
- Points per possession

**Insight yang layak dipamerkan ke juri:** karena tidak ada punt dan tiap 4th down adalah percobaan, **4th down decision rate** dan **points per possession** jauh lebih informatif di flag football daripada statistik yang dipakai American football. Aplikasi yang menampilkan ini terlihat dirancang oleh orang yang paham olahraganya.

---

## 9. Enum untuk aplikasi

```ts
// Jenis play — untuk tombol input skor
export const PLAY_TYPES = [
  'pass_complete',
  'pass_incomplete',
  'interception',
  'sack',              // QB deflag di belakang SL
  'run',               // hand-off atau lateral, lalu dibawa lari
  'deflag',            // runner ter-deflag (akhir play normal)
  'penalty',
  'touchdown',
  'try_1pt',
  'try_2pt',
  'safety',
  'touchback',
  'turnover_on_downs',
] as const;

// Situasi — untuk rekomendasi play dari playbook
export const SITUATIONS = [
  'backed_up',       // di dalam 5 yard sendiri
  'own_half',        // sisi sendiri, target = middle
  'crossed_middle',  // sudah lewat middle, target = goal
  'no_run_zone',     // dalam 5 yard dari goal line lawan → WAJIB pass
  'fourth_down',
  'two_minute',
  'try',
] as const;

// Peran IFAF untuk play-by-play
export const OFFENSE_ROLES = ['snapper','quarterback','passer','runner','receiver'] as const;
export const DEFENSE_ROLES = ['blitzer','rusher','defender'] as const;

// Formasi umum 5v5 (5 pemain: 1 snapper, 1 QB, 3 receiver)
export const FORMATIONS = ['trips','spread','bunch','stack','trey','empty'] as const;
```

### Konstanta aturan (default IFAF 2023 5v5)

```ts
export const IFAF_2023_5V5 = {
  playersOnField: 5,
  rosterMax: 15,
  fieldLengthYd: 50,
  endzoneYd: 10,
  fieldWidthYd: 25,
  noRunZoneYd: 5,
  downsPerSeries: 4,
  lineToGain: 'middle',        // BUKAN 10 yard
  startYardLine: 5,
  halfLengthMin: 20,
  halves: 2,
  intermissionMin: 2,
  playClockSec: 25,
  passTimeLimitSec: 7,
  timeoutsPerHalf: 2,
  timeoutLengthSec: 60,
  blitzDistanceYd: 7,
  maxBlitzers: 2,
  qbCanRunBeyondSL: false,
  runningClockPointDiff: 30,
  points: { td: 6, try1: 1, try2: 2, defTdOnTry: 2, safety: 2, safetyOnTry: 1 },
  tryYardLines: { onePoint: 5, twoPoint: 10 },
} as const;
```

---

## 10. Tie breaker (untuk fitur klasemen)

Jika 2+ tim punya persentase (menang-seri-kalah) sama, urutkan bertahap:

1. Head-to-head percentage (jika semua tim saling bertemu)
2. Head-to-head net point differential
3. Head-to-head points scored
4. Total net point differential
5. Total points scored
6. Coin toss

**Overtime:** setelah 2 menit istirahat, coin toss. Tiap tim satu seri dari middle line (tidak ada first down di middle). Tiap tim menyimpan bola sampai skor atau kehabisan down. Jika masih seri setelah periode pertama, periode berikutnya = try 1 poin dari yard 5 bergantian.

---

## 11. Yang paling sering dikira Cursor tapi SALAH

Tempel bagian ini di `.cursorrules` juga.

| Cursor sering mengira | Kenyataan IFAF 5v5 |
|---|---|
| First down = 10 yard | First down = **melewati garis tengah**, sekali per seri |
| 4 quarter | **2 babak** × 20 menit |
| Ada field goal / punt / extra point kick | **Tidak ada tendangan sama sekali** |
| Lapangan 100 yard | **50 yard** field of play + 2×10 endzone |
| QB boleh scramble | QB **tidak boleh** lari melewati scrimmage line |
| Boleh lari di mana saja | **Dilarang lari** di no-run zone (5 yd depan tiap goal line) |
| Tackle | **Deflag** — cabut flag |
| PAT = 1 poin kick, 2PT = konversi | Try dari yard **5** = 1 poin, dari yard **10** = 2 poin, keduanya dari scrimmage |
| Fumble bisa direbut | Fumble yang menyentuh tanah = **bola mati**, tetap milik tim yang fumble |
| 11 pemain | **5** pemain |

---

**Sumber:** [IFAF International Flag Football Rules 2023 — 5 on 5 / non-contact (PDF)](https://americanfootball.sport/wp-content/uploads/2023/05/FlagRules2023.pdf)
