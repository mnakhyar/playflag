# Strategy Context — Flag Football 5v5 (IFAF 2023)

> **Cara pakai:** simpan sebagai `docs/flag-football-strategy.md`. Tag bersama rules context saat menulis modul playbook:
> `@docs/flag-football-context.md @docs/flag-football-strategy.md`
>
> File ini berisi route tree, formasi, konsep serangan, skema bertahan, **dan koordinat JSON siap pakai** untuk seed `plays_design`.

---

## 1. Batasan aturan yang membentuk seluruh strategi 5v5

Sebelum bicara play, pahami dulu kenapa flag football tidak bisa memakai playbook American football. Lima aturan IFAF ini yang menentukan segalanya:

| Aturan | Konsekuensi strategis |
|---|---|
| **5 pemain**: 1 snapper + 1 QB + 3 receiver | Tapi setelah snap, **snapper jadi receiver eligible** → efektif ada **4 target**. Snapper yang bisa lari route adalah senjata yang sering dilupakan tim amatir |
| **QB tidak boleh lari melewati scrimmage line** | Tidak ada scramble, tidak ada QB draw, tidak ada read option. Tekanan = QB harus melempar atau mati |
| **7 detik untuk melempar** | Route dalam harus tuntas ≤ 5 detik. Play dengan 3+ progresi read tidak realistis. **Maksimal 2 read + checkdown** |
| **Maks 2 blitzer, harus dari ≥7 yard** | Offense tahu tekanan datang dari mana dan kapan. Tapi juga: 2 blitzer = hanya 3 pemain yang bertahan melawan 4 receiver |
| **Tidak ada blocking sama sekali** | Semua perlindungan QB berasal dari **kecepatan lepas bola**, bukan pocket. Quick game bukan pilihan, tapi fondasi |
| **No-run zone 5 yd di depan tiap goal line** | Di red zone Anda **wajib** melempar. Defense tahu ini → red zone adalah situasi paling sulit di flag football |
| **Shielding = penalti 5 yard** | **Rub/pick route berisiko.** Ini beda besar dari flag football rekreasional Amerika yang membolehkannya. Rancang pemisahan lewat spacing, bukan lewat kontak |

**Kesimpulan yang harus tercermin di aplikasi:** flag football 5v5 adalah permainan **spacing dan timing**, bukan permainan physicality. Play terbaik adalah yang memaksa satu defender bertanggung jawab atas dua receiver.

---

## 2. Route tree

Penomoran standar 0–9. Ganjil ke luar (sideline), genap ke dalam (tengah).

| # | Nama | Kedalaman | Bentuk | Kapan dipakai |
|---|---|---|---|---|
| **0** | **Hitch / Stop** | 4–5 yd | Lari lurus, berhenti, putar badan ke QB | Lawan zone yang mundur, quick game, beat blitz |
| **1** | **Flat / Quick Out** | 2–4 yd | Menyudut cepat ke sideline | Beat blitz, checkdown, sideline untuk stop clock |
| **2** | **Slant** | 3–5 yd | 3 langkah lalu potong 45° ke dalam | **Play paling andal melawan blitz.** Bola keluar ≤2 detik |
| **3** | **Comeback** | 12–15 yd | Lari dalam, balik ke luar-belakang | Lawan man coverage yang bertahan jauh |
| **4** | **Curl** | 8–10 yd | Lari dalam, berhenti, putar ke QB | Lawan zone, isi celah antara underneath dan deep |
| **5** | **Out** | 8–12 yd | Potong tajam 90° ke sideline | Man coverage; aman karena keluar lapangan = incomplete |
| **6** | **In / Dig** | 8–12 yd | Potong tajam 90° ke tengah | Lawan zone; berbahaya kalau ada safety tengah |
| **7** | **Corner / Flag** | 10–15 yd | Lari dalam lalu menyudut ke pojok endzone | Senjata utama lawan single-high safety |
| **8** | **Post** | 12–18 yd | Lari luar lalu menyudut ke tengah dalam | Lawan 2-deep safety (belah tengah) |
| **9** | **Go / Fly / Streak** | 15+ yd | Lurus vertikal | Clear-out, atau lawan defender lambat |

### Route tambahan yang penting khusus flag football

| Nama | Bentuk | Catatan |
|---|---|---|
| **Drag / Shallow Cross** | 2–4 yd menyeberang lapangan horizontal | **Route paling produktif di 5v5.** Sulit dijaga zone, tidak butuh kontak |
| **Seam** | Lurus di celah antara dua safety | Pembunuh 2-deep zone |
| **Wheel** | Flat dulu lalu belok vertikal menyusur sideline | Mematikan lawan zone yang defendernya ikut ke flat |
| **Whip / Return** | Slant lalu balik arah 180° | Menghancurkan man coverage yang agresif |
| **Jerk** | Slant, hitch, lalu lanjut keluar | Untuk receiver yang jago fake |
| **Sluggo** (Slant-and-Go) | Fake slant lalu vertikal | Play besar setelah slant dipakai berkali-kali |
| **Post-Corner** | Fake post lalu ke pojok | Endzone, lawan safety tengah |
| **Option / Choice** | Receiver memilih in/out berdasarkan reaksi defender | Butuh QB & receiver yang benar-benar sinkron. Jangan dipakai tim baru |
| **Snapper Delay** | Snapper snap lalu lepas ke flat/checkdown | Sering benar-benar tidak dijaga. Wajib ada di playbook |

### Enum untuk aplikasi

```ts
export const ROUTES = [
  'hitch','flat','slant','comeback','curl','out','in','corner','post','go',
  'drag','seam','wheel','whip','jerk','sluggo','post_corner','option','snapper_delay',
] as const;

export const ROUTE_TREE_NUMBER: Record<string, number> = {
  hitch: 0, flat: 1, slant: 2, comeback: 3, curl: 4,
  out: 5, in: 6, corner: 7, post: 8, go: 9,
};

export const ROUTE_DEPTH_YD: Record<string, number> = {
  flat: 3, slant: 4, hitch: 5, drag: 3, snapper_delay: 3,
  curl: 9, out: 10, in: 10, whip: 6, jerk: 7,
  corner: 12, comeback: 13, post: 15, seam: 14, wheel: 12,
  go: 18, sluggo: 16, post_corner: 15, option: 8,
};
```

---

## 3. Formasi

Konvensi koordinat untuk semua diagram di file ini:

- `x`: 0 = sideline kiri, 1 = sideline kanan
- `y`: 1 = arah endzone sendiri, 0 = arah endzone lawan
- **Line of scrimmage di `y = 0.82`**
- Skala: **1 yard ≈ 0.041 pada sumbu y** (diagram menampilkan ±20 yard di depan LOS)

| Formasi | Susunan | Kekuatan | Kelemahan |
|---|---|---|---|
| **Spread** | 3 WR merata, C snap lalu lepas | Paling seimbang, QB bisa baca seluruh lapangan | Tidak memaksa defense bergeser |
| **Trips** | 3 WR satu sisi | Memaksa mismatch angka di satu sisi | Sisi kosong benar-benar kosong |
| **Trips Stack** | 3 WR bertumpuk vertikal satu sisi | Sulit di-jam, pemisahan alami tanpa kontak | Butuh timing rapi |
| **Twins / Deuce** | 2 WR satu sisi, 1 WR sisi lain | Seimbang tapi tetap punya sisi kuat | Prediktabel kalau dipakai terus |
| **Bunch** | 3 WR mengumpul rapat | Menciptakan kekacauan tanpa perlu shielding | Rawan penalti shielding kalau terlalu rapat |
| **Empty / Crunch** | C ikut ke bunch, QB sendirian | 4 receiver menyebar | Tidak ada checkdown dekat |

---

## 4. Konsep serangan inti

Enam konsep ini menutupi hampir seluruh kebutuhan tim 5v5. **Kuasai 6–8 play, bukan 20.** Tim yang menjalankan 8 play dengan yakin mengalahkan tim yang menjalankan 20 play dengan bingung.

### 4.1 Mesh — melawan man coverage

Dua receiver melakukan drag berlawanan arah dan menyilang dekat LOS. Defender man akan saling bertabrakan secara alami — **tanpa kontak yang disengaja**, jadi legal. Receiver ketiga lari go untuk menarik safety.

**Read QB:** crosser yang lebih dulu lepas → crosser kedua → snapper checkdown.

### 4.2 Flood — melawan zone

Tiga receiver menyerang satu sisi lapangan di **tiga kedalaman berbeda** (dalam ±15 yd, menengah ±8 yd, flat ±3 yd). Zone tidak bisa menutup tiga level dengan dua defender.

**Read QB:** dari dalam ke luar. Kalau deep tertutup, ambil menengah; kalau menengah tertutup, flat pasti terbuka.

### 4.3 Smash — melawan cover 2 / dua safety

Receiver luar hitch di 5 yd, receiver dalam corner di 12 yd. Cornerback harus memilih. **High-low read klasik**, dan yang paling mudah diajarkan ke QB baru.

### 4.4 Levels — melawan zone tengah

Dua route in/dig di kedalaman berbeda (5 yd dan 10 yd) di tengah lapangan. Linebacker zone hanya bisa menutup satu.

### 4.5 Spacing / Quick Game — melawan blitz

Semua route ≤5 yard, bola keluar dalam 2 detik. Slant + flat + hitch. **Ini jawaban baku saat lawan mengirim 2 blitzer.** Blitz berarti hanya 3 defender melawan 4 receiver — matematikanya menguntungkan Anda selama bola cepat keluar.

### 4.6 Vertical / Four Verts — situasi butuh yard besar

Semua receiver lari vertikal di jalur terpisah. Hanya efektif kalau QB punya waktu, jadi **jangan dipakai saat lawan blitz**.

---

## 5. Skema bertahan

Defense punya 5 pemain. Karena maks 2 boleh blitz dan blitzer harus mulai ≥7 yard, strukturnya selalu berupa **pembagian antara rusher dan coverage**.

| Skema | Susunan | Kapan dipakai | Kelemahan |
|---|---|---|---|
| **3-2 Zone** (base) | 3 underneath + 2 deep safety, 0 blitzer | **Default paling aman.** Mencegah big play | Route menengah 8–12 yd terbuka |
| **2-2 Box + 1 Blitz** | 1 blitzer, 2 underneath, 2 deep | Down & distance panjang | Flat kosong |
| **1-3-1** | 1 blitzer, 3 underneath melebar, 1 deep safety | Lawan quick game & drag | Rentan post & corner (single high) |
| **Man + Free Blitzer** | 1 blitzer, 4 man-to-man | 4th down, goal line, saat pemain Anda lebih cepat | Satu kalah duel = touchdown |
| **Cover 0 / All-Out** | 2 blitzer, 3 man | Situasi putus asa, 2 menit terakhir | Kalau bola keluar, tidak ada bantuan sama sekali |
| **Zero Blitz / Drop 5** | 0 blitzer, semua coverage | Melawan tim yang kuat quick game | QB punya 7 detik penuh — hampir selalu ketemu celah |

### Prinsip bertahan khusus flag football

1. **Sudut deflag lebih penting daripada kecepatan.** Kejar ke titik di depan runner, bukan ke posisi runner sekarang. Defender yang cepat tapi salah sudut akan terus ketinggalan.
2. **Blitz punya biaya matematis yang keras.** 2 blitzer = 3 defender melawan 4 receiver eligible. Blitz hanya masuk akal kalau QB lawan lambat mengambil keputusan.
3. **Di no-run zone, jangan jaga lari.** Aturan melarang lari di sana. Semua 5 pemain boleh fokus penuh ke coverage. Tim yang lupa ini membuang satu defender setiap red zone snap.
4. **4th down selalu percobaan.** Tidak ada punt. Siapkan skema 4th down spesifik, jangan pakai skema base.
5. **Jangan pernah cabut flag pemain yang bukan runner** — penalti 5 yard, dan sering terjadi karena refleks.

---

## 6. Peta situasi → strategi

Ini yang menghubungkan modul strategi ke rules engine. `getSituation()` mengembalikan salah satu dari ini, lalu playbook difilter.

| Situasi | Konteks IFAF | Offense | Defense |
|---|---|---|---|
| `backed_up` | Dalam 5 yd sendiri | Quick game. Ambil jarak aman dulu, jangan kreatif — safety = 2 poin lawan | Tekan. Keuntungan lapangan di pihak Anda |
| `own_half` | Target = middle | Konsep normal. Drag, mesh, flood | Base 3-2 zone |
| `crossed_middle` | Target = goal line | Buka playbook penuh. Corner, post, seam | Perketat deep, sisakan flat |
| `no_run_zone` | Dalam 5 yd dari goal lawan — **wajib pass** | Fade, slant, corner cepat, pick-free bunch. Timing ketat | **Semua 5 pemain coverage.** Tidak ada ancaman lari |
| `fourth_down` | Tidak ada punt — selalu percobaan | Play andalan yang sudah terbukti. Bukan play baru | Man + 1 blitzer, atau all-out kalau butuh stop |
| `two_minute` | Jam berhenti saat first down, out of bounds, pass jatuh | Route ke sideline, spike, hemat timeout | Jaga sideline, paksa ke tengah agar jam jalan |
| `try` | Dari yard 5 (1 poin) atau 10 (2 poin) | Yard 5: slant/fade cepat. Yard 10: mesh atau corner | Man coverage — lapangan terlalu sempit untuk zone |

---

## 7. Playbook siap seed — 8 play dengan koordinat JSON

Copy-paste langsung ke `seed.sql`. Formasi 5v5: `C` snapper, `QB`, receiver `X` (kiri), `Y` (tengah/kanan), `Z` (kanan luar).

### 7.1 MESH — Spread, lawan man

```json
{
  "name": "Mesh",
  "formation": "spread",
  "situation": "own_half",
  "notes": "Lawan man coverage. Read: crosser pertama -> crosser kedua -> C checkdown. Bola keluar 3 detik.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.50, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.15, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.72, "y": 0.82, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.88, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "x", "type": "drag",           "points": [[0.15,0.82],[0.20,0.70],[0.80,0.68]] },
      { "playerId": "y", "type": "drag",           "points": [[0.72,0.82],[0.67,0.70],[0.18,0.68]] },
      { "playerId": "z", "type": "go",             "points": [[0.88,0.82],[0.88,0.10]] },
      { "playerId": "c", "type": "snapper_delay",  "points": [[0.50,0.82],[0.50,0.74],[0.36,0.72]] }
    ]
  }
}
```

### 7.2 FLOOD — Trips, lawan zone

```json
{
  "name": "Flood Right",
  "formation": "trips",
  "situation": "own_half",
  "notes": "Tiga level satu sisi. Read dari dalam ke luar: corner -> out -> flat.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.50, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.68, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.80, "y": 0.82, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.92, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "x", "type": "corner", "points": [[0.68,0.82],[0.68,0.40],[0.90,0.26]] },
      { "playerId": "y", "type": "out",    "points": [[0.80,0.82],[0.80,0.50],[0.95,0.48]] },
      { "playerId": "z", "type": "flat",   "points": [[0.92,0.82],[0.97,0.72]] },
      { "playerId": "c", "type": "drag",   "points": [[0.50,0.82],[0.50,0.72],[0.20,0.70]] }
    ]
  }
}
```

### 7.3 SMASH — Twins, high-low klasik

```json
{
  "name": "Smash",
  "formation": "twins",
  "situation": "crossed_middle",
  "notes": "High-low pada cornerback. Kalau CB naik ke hitch, lempar corner. Kalau mundur, lempar hitch.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.50, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.14, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.78, "y": 0.82, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.90, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "z", "type": "hitch",  "points": [[0.90,0.82],[0.90,0.60]] },
      { "playerId": "y", "type": "corner", "points": [[0.78,0.82],[0.78,0.42],[0.95,0.28]] },
      { "playerId": "x", "type": "post",   "points": [[0.14,0.82],[0.14,0.40],[0.42,0.20]] },
      { "playerId": "c", "type": "flat",   "points": [[0.50,0.82],[0.44,0.74],[0.30,0.73]] }
    ]
  }
}
```

### 7.4 QUICK SLANTS — jawaban baku lawan blitz

```json
{
  "name": "Quick Slants",
  "formation": "spread",
  "situation": "fourth_down",
  "notes": "Anti-blitz. Bola keluar 2 detik. Semua route selesai di 4-5 yard.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.50, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.16, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.74, "y": 0.82, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.90, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "x", "type": "slant", "points": [[0.16,0.82],[0.16,0.74],[0.32,0.66]] },
      { "playerId": "y", "type": "slant", "points": [[0.74,0.82],[0.74,0.74],[0.60,0.66]] },
      { "playerId": "z", "type": "flat",  "points": [[0.90,0.82],[0.96,0.74]] },
      { "playerId": "c", "type": "hitch", "points": [[0.50,0.82],[0.50,0.68]] }
    ]
  }
}
```

### 7.5 RED ZONE FADE — no-run zone

```json
{
  "name": "Fade / Slant Combo",
  "formation": "twins",
  "situation": "no_run_zone",
  "notes": "WAJIB pass (no-run zone). Fade ke pojok endzone + slant sebagai read kedua. Lapangan sempit, timing harus tepat.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.50, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.14, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.76, "y": 0.82, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.90, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "z", "type": "corner", "points": [[0.90,0.82],[0.92,0.50],[0.96,0.22]] },
      { "playerId": "y", "type": "slant",  "points": [[0.76,0.82],[0.76,0.74],[0.58,0.60]] },
      { "playerId": "x", "type": "corner", "points": [[0.14,0.82],[0.12,0.50],[0.06,0.22]] },
      { "playerId": "c", "type": "hitch",  "points": [[0.50,0.82],[0.50,0.70]] }
    ]
  }
}
```

### 7.6 STACK WHEEL — lawan man agresif

```json
{
  "name": "Stack Wheel",
  "formation": "trips_stack",
  "situation": "crossed_middle",
  "notes": "Stack menciptakan pemisahan alami tanpa shielding. Wheel dari flat, defender zone biasanya tidak ikut.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.50, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.80, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.80, "y": 0.88, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.18, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "x", "type": "in",    "points": [[0.80,0.82],[0.80,0.52],[0.52,0.50]] },
      { "playerId": "y", "type": "wheel", "points": [[0.80,0.88],[0.94,0.80],[0.95,0.30]] },
      { "playerId": "z", "type": "drag",  "points": [[0.18,0.82],[0.22,0.70],[0.62,0.68]] },
      { "playerId": "c", "type": "flat",  "points": [[0.50,0.82],[0.42,0.74],[0.28,0.73]] }
    ]
  }
}
```

### 7.7 LEVELS — lawan zone tengah

```json
{
  "name": "Levels",
  "formation": "spread",
  "situation": "own_half",
  "notes": "Dua dig di kedalaman berbeda. Linebacker zone hanya bisa menutup satu.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.50, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.16, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.74, "y": 0.82, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.90, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "x", "type": "in",   "points": [[0.16,0.82],[0.16,0.62],[0.52,0.60]] },
      { "playerId": "y", "type": "in",   "points": [[0.74,0.82],[0.74,0.44],[0.44,0.42]] },
      { "playerId": "z", "type": "go",   "points": [[0.90,0.82],[0.90,0.08]] },
      { "playerId": "c", "type": "flat", "points": [[0.50,0.82],[0.44,0.74],[0.30,0.73]] }
    ]
  }
}
```

### 7.8 FOUR VERTS — butuh yard besar

```json
{
  "name": "Four Verts",
  "formation": "empty",
  "situation": "two_minute",
  "notes": "Empat jalur vertikal terpisah. JANGAN dipakai saat lawan blitz - butuh 4 detik penuh.",
  "diagram": {
    "players": [
      { "id": "c",  "label": "C",  "x": 0.34, "y": 0.82, "role": "snapper" },
      { "id": "qb", "label": "QB", "x": 0.50, "y": 0.92, "role": "quarterback" },
      { "id": "x",  "label": "X",  "x": 0.10, "y": 0.82, "role": "receiver" },
      { "id": "y",  "label": "Y",  "x": 0.66, "y": 0.82, "role": "receiver" },
      { "id": "z",  "label": "Z",  "x": 0.92, "y": 0.82, "role": "receiver" }
    ],
    "routes": [
      { "playerId": "x", "type": "go",   "points": [[0.10,0.82],[0.10,0.06]] },
      { "playerId": "c", "type": "seam", "points": [[0.34,0.82],[0.34,0.10]] },
      { "playerId": "y", "type": "seam", "points": [[0.66,0.82],[0.66,0.10]] },
      { "playerId": "z", "type": "go",   "points": [[0.92,0.82],[0.92,0.06]] }
    ]
  }
}
```

---

## 8. Enum defense untuk aplikasi

```ts
export const DEFENSIVE_SCHEMES = [
  { id: 'zone_3_2',   name: '3-2 Zone',        blitzers: 0, deep: 2, underneath: 3, useWhen: 'base' },
  { id: 'box_2_2',    name: '2-2 Box + Blitz', blitzers: 1, deep: 2, underneath: 2, useWhen: 'long_yardage' },
  { id: 'zone_1_3_1', name: '1-3-1 Zone',      blitzers: 1, deep: 1, underneath: 3, useWhen: 'vs_quick_game' },
  { id: 'man_free',   name: 'Man + Free Rush', blitzers: 1, deep: 0, underneath: 4, useWhen: 'fourth_down' },
  { id: 'cover_0',    name: 'Cover 0 All-Out', blitzers: 2, deep: 0, underneath: 3, useWhen: 'desperation' },
  { id: 'drop_5',     name: 'Drop 5',          blitzers: 0, deep: 2, underneath: 3, useWhen: 'no_run_zone' },
] as const;

export const COVERAGE_TYPES = ['man','zone','match'] as const;
```

---

## 9. Prompt Cursor untuk modul strategi

```
@docs/flag-football-context.md @docs/flag-football-strategy.md @api/schema.sql

Generate api/seed-playbook.sql — INSERT ke tabel plays_design untuk semua 6 tim.

Pakai 8 play yang ada di bagian 7 flag-football-strategy.md sebagai basis.
Tiap tim dapat 6 play acak dari 8 itu, dengan variasi nama sedikit
(misal "Mesh" -> "Mesh Kanan") supaya tiap tim terasa punya playbook sendiri.

Isi times_called antara 4-15 dan times_successful yang masuk akal
(success rate 30-70%, dan play situasi no_run_zone success rate-nya lebih rendah
karena red zone memang lebih sulit).

Kolom diagram diisi persis JSON dari file strategy, sebagai JSONB.
```

```
@docs/flag-football-strategy.md @web/src/lib/gameState.ts

Buat web/src/lib/playRecommendation.ts:

export function recommendPlays(plays: PlayDesign[], situation: Situation): PlayDesign[]

Aturan:
- Filter play yang situation-nya cocok, taruh di atas
- Urutkan berdasarkan success rate (times_successful/times_called), minimal 3 kali
  dipanggil baru dihitung — kalau kurang, taruh di bawah play yang sudah teruji
- Untuk situasi 'no_run_zone', BUANG semua play yang punya route bertipe 'run'
  karena lari ilegal di zona itu
- Untuk situasi 'fourth_down' dan 'two_minute', prioritaskan play dengan
  ROUTE_DEPTH_YD rata-rata yang cukup untuk mencapai target
- Kembalikan maksimal 6 play

Ekspor juga getSchemeRecommendation(situation) yang mengembalikan skema bertahan
yang disarankan dari DEFENSIVE_SCHEMES sesuai kolom useWhen.
```

---

## 10. Yang sering dikira Cursor tapi salah di flag football

| Cursor sering menulis | Kenyataan 5v5 |
|---|---|
| Play dengan pass protection / blocking scheme | **Tidak ada blocking.** Hilangkan seluruh konsep O-line |
| QB scramble / rollout keluar pocket | QB tidak boleh lewat scrimmage line. Rollout **lateral** masih boleh |
| Rub / pick route sebagai andalan | **Shielding = penalti 5 yard.** Pemisahan harus dari spacing |
| Running back, tight end, fullback | Hanya ada snapper, QB, dan 3 receiver |
| Play action dari handoff dalam | Handoff boleh, tapi keduanya harus di belakang SL |
| Route 15-20 yard sebagai read pertama | Batas 7 detik. Read pertama harus ≤10 yard |
| Play khusus untuk 3rd & 2 | Tidak ada "& 2". Distance-nya selalu **middle** atau **goal** |
| Punt formation | Tidak ada punt. 4th down selalu percobaan |

---

**Sumber:**
- [IFAF International Flag Football Rules 2023 — 5 on 5 (PDF)](https://americanfootball.sport/wp-content/uploads/2023/05/FlagRules2023.pdf)
- [FlagSketch — 5v5 Flag Football Plays & Formations Guide](https://flagsketch.com/strategy/offense/5v5-flag-football-plays-formations-guide/)
- [Flag Football Finder — 3 Simple 5v5 Defenses](https://www.flagfootballfinder.com/blog/3-simple-5v5-flag-football-defenses-for-beginner-coaches)
- [NFL FLAG — 5 on 5 Playbook](https://nflflag.com/coaches/flag-football-rules/5-on-5-flag-football-playbook)
- [Youth Flag Football HQ — Defense Strategy Guide (5-on-5)](https://youthflagfootballhq.com/flag-football-defense-strategy-guide-5-on-5/)
