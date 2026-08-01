# PlayFlag — Image Prompt Pack (Gemini)

Dokumen ini merinci **semua aset gambar** yang dibutuhkan aplikasi **PlayFlag**, plus prompt siap tempel ke **Gemini (Nano Banana / Imagen)**.

Gunakan satu “visual bible” di bawah agar semua gambar terasa satu brand, bukan koleksi acak.

---

## 0. Visual bible (wajib ikut di setiap prompt)

### Brand

| Item | Nilai |
|---|---|
| Nama | **PlayFlag** |
| Tagline | Road to 2028 |
| Positioning | App belajar flag football IFAF 5v5 untuk pemula; olympic pathway feel, bukan game arcade |
| Mood | Athletic, cinematic, dusk-to-night field, confident, clean — bukan cartoon, bukan NFL tackle glamour |

### Palette (samakan dengan UI)

| Token | Hex | Pakai untuk |
|---|---|---|
| Night | `#0A0A0A` | Background UI / frame gelap |
| Turf deep | `#111111` | Surface gelap |
| Chalk | `#F5F5F7` | Highlight terang, garis kapur |
| Flag amber | `#E89A2B` | Aksen brand (bukan ungu) |
| Flag hot | `#F0B04A` | Highlight aksen |
| Field green | `#1A5C3A` | Rumput lapangan di editor |
| Endzone green | `#123D28` | Endzone lebih gelap |
| Flag belt accent | `#FF5A1F` | Flag fisik di pinggang (oranye keras, seperti favicon) |

### Aturan gaya generik (tambahkan di akhir hampir semua prompt)

```text
Style: premium sports photography / cinematic still, realistic athletes,
subtle film grain, natural dusk lighting, shallow depth of field where useful.
Color grade: deep charcoal blacks, muted greens, warm amber accent #E89A2B,
crisp chalk-white highlights. No purple neon, no cyberpunk glow, no cartoon,
no comic style, no heavy text overlays, no watermarks, no logos of real teams
or Olympics rings, no tackle pads or helmets (flag football only: soft caps or
no helmets, flag belts with two side flags). Southeast Asian / diverse athletes
welcome. Clean composition, mobile-app friendly framing.
```

### Negative prompt global (jika Gemini punya field negative / “avoid”)

```text
tackle football, NFL pads, hard helmet, blood, violence, cartoon, anime,
3D plastic render, purple neon, cyberpunk, cluttered UI mockups with fake text,
readable fake logos, Olympic rings, trademarked team logos, busy collage,
stock-photo handshake cliché, oversharpened HDR, text watermarks
```

### Cara pakai di Gemini

1. Copy **Prompt** + tempel **Style block** dari §0.
2. Set aspect ratio sesuai tabel aset.
3. Generate 2–4 variasi; pilih yang paling “gelap + amber + lapangan”, bukan yang terlalu cerah/siang.
4. Export PNG/WebP; crop sesuai `Export size` jika perlu.
5. Simpan ke folder yang disarankan di kolom **Path saran**.

---

## 1. Prioritas pengerjaan

| Prioritas | ID | Aset | Kenapa penting |
|---|---|---|---|
| P0 | A01 | Onboarding hero (full-bleed) | Layar pertama juri; brand harus hero-level |
| P0 | A02 | App icon / favicon mark | Tab browser + share |
| P0 | B01 | Field texture untuk play editor | Tim Saya = fitur demo utama |
| P1 | A03 | Dashboard atmosphere / header strip | Biar dashboard tidak flat |
| P1 | C01–C03 | Diagram lesson Level 1–3 | Lesson masih teks-only |
| P1 | D01–D03 | Illust drill Level 1–3 | Drill terasa “latihan sungguhan” |
| P2 | A04 | Skill tree journey backdrop | Path Road to 2028 |
| P2 | E01–E05 | Teaser thumb Level 4–8 | Locked node lebih menggoda |
| P2 | A05 | Empty / motivational moments | Radar kosong, streak, selesai level |
| P3 | F01–F03 | Marketing / pitch / OG share | Demo, social, README |

---

## 2. Spesifikasi aset & prompt

### A. Brand & layar utama

---

#### A01 — Onboarding hero (full-bleed background)

| Field | Spec |
|---|---|
| Dipakai di | `OnboardingPage` — background edge-to-edge di belakang brand **PlayFlag** |
| Aspect | **9:16** (mobile hero) + crop landscape **16:9** untuk desktop |
| Export size | 1080×1920 (mobile), 1920×1080 (desktop) |
| Path saran | `public/images/hero-onboarding.webp` |
| Overlay UI | Teks brand di atas gambar → bagian **bawah 40%** harus lebih gelap / clean agar form nama tetap terbaca |
| Jangan | Sticker, badge floating, teks “PlayFlag” di dalam gambar (teks digambar UI) |

**Prompt (EN — recommended for Gemini):**

```text
Cinematic full-bleed photograph of an outdoor flag football field at blue hour,
just after sunset. Camera low and wide, looking down the length of a green turf
field with a clear white middle line and darker green endzones. Two athletes in
athletic street-sports kits (no pads, no hard helmets) mid-action: one ball
carrier protecting the football, one defender reaching for a bright orange flag
on the carrier’s waist belt. Flags are clearly visible on both hips. Soft amber
rim light (#E89A2B warmth) on the edges of players; deep charcoal sky. Leave the
lower third of the frame darker and less busy for UI text overlay. No logos, no
text, no Olympic rings. Premium sports photography, realistic, subtle grain.
```

**Prompt singkat (ID — kalau mau eksperimen bilingual):**

```text
Foto sinematik lapangan flag football saat senja biru. Sudut lebar dari rendah,
garis tengah putih jelas, endzone hijau lebih gelap. Dua atlet tanpa pads/helm
keras: satu bawa bola, satu mau cabut flag oranye di pinggang. Cahaya amber hangat
di tepi tubuh, langit gelap charcoal. Sepertiga bawah frame lebih gelap dan kosong
untuk overlay UI. Tanpa teks, tanpa logo.
```

**Variasi yang berguna:**
- A01b: hero tanpa orang (hanya lapangan + senja) — lebih aman di bawah teks brand.
- A01c: close-up tangan menarik flag oranye (detail brand mark).

---

#### A02 — App icon / favicon mark

| Field | Spec |
|---|---|
| Dipakai di | Favicon, PWA icon, splash kecil |
| Aspect | **1:1** |
| Export size | 1024×1024 PNG (lalu downscale 64/180/512) |
| Path saran | `public/icons/playflag-icon-1024.png` |
| Catatan | Favicon sekarang stilisasi bendera oranye di tiang; boleh di-upgrade jadi mark lebih premium tapi tetap sederhana |

**Prompt:**

```text
Minimal app icon design on a dark charcoal square (#0A0A0A) with soft rounded
corners feel. Center: a bold geometric flag mark — a vertical chalk-white pole
and a sharp amber-orange flag shape (#E89A2B to #FF5A1F) suggesting motion to
the right, like a pulled flag. Tiny subtle green turf arc under the mark
(#1A5C3A). Flat vector, high-end sports brand, lots of negative space, no text,
no gradients neon, no 3D bevel, no Olympics rings. Clean, memorable, readable at 32px.
```

---

#### A03 — Dashboard atmosphere strip

| Field | Spec |
|---|---|
| Dipakai di | Atas `DashboardPage` (di belakang eyebrow “Road to 2028” / brand) |
| Aspect | **21:9** atau **3:1** wide strip |
| Export size | 2400×800 |
| Path saran | `public/images/dashboard-atmosphere.webp` |
| Jangan | Stats palsu, jadwal, kartu skor |

**Prompt:**

```text
Wide cinematic atmosphere plate of empty flag football turf at dusk, shot from
slightly above. Soft chalk yard lines fade into darkness. A single amber light
streak on the horizon. Deep blacks, muted green field (#1A5C3A), warm accent
glow. Abstract and calm — no players, no text, no scoreboard. Suitable as a
subtle header background behind white UI typography. Premium, sparse, editorial.
```

---

#### A04 — Skill tree journey backdrop

| Field | Spec |
|---|---|
| Dipakai di | Background lembut di `LearnTreePage` |
| Aspect | **9:16** |
| Export size | 1080×1920 |
| Path saran | `public/images/skill-tree-path.webp` |

**Prompt:**

```text
Vertical editorial image of a quiet outdoor training path next to a flag
football field at night, lit by sparse warm amber lights. A long chalk-white
line or painted path leads into the distance like a journey of 8 steps toward
2028. Mood: focused, hopeful, athletic discipline. No people in sharp focus
(optional tiny silhouettes far away). No text, no neon purple, no clutter.
Dark charcoal frame, green turf edge visible on one side.
```

---

#### A05 — Motivational / empty states

Generate **3 frame** terpisah (atau satu batch 3 panel).

| Sub-ID | Momen UI                 | Mood                                                |
| ------ | ------------------------ | --------------------------------------------------- |
| A05a   | Radar skill masih kosong | Calm, “mulai dari nol”                              |
| A05b   | Streak hidup             | Energy kecil, ember/api lembut (bukan cartoon fire) |
| A05c   | Level selesai            | Quiet win — bukan confetti berlebihan               |

**Prompt A05a:**

```text
Minimal still life: an unused chalk circle drawn on dark green turf, empty
center, soft dusk light. Metaphor for an empty skill radar. No text. Moody,
premium, sparse.
```

**Prompt A05b:**

```text
Close-up of a warm amber ember glow on dark charcoal background, subtle motion
blur like a living streak of discipline. Abstract, elegant, not cartoon fire,
not flames filling the frame. Color #E89A2B dominant accent.
```

**Prompt A05c:**

```text
Athlete kneeling briefly on flag football turf after a clean flag pull drill,
holding an orange flag up for the referee to see. Night practice lights, quiet
satisfaction, no celebration chaos. Cinematic, realistic, no text.
```

---

### B. Lapangan (Play Editor)

Ini aset paling teknis. Editor sekarang menggambar lapangan flat `#1A5C3A` di canvas. Texture nyata akan langsung naik kelas demo.

---

#### B01 — Field texture top-down (untuk canvas / CSS background)

| Field       | Spec                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| Dipakai di  | Background `PlayCanvas` (bisa sebagai image + garis digambar ulang di canvas)                                         |
| Aspect      | **10:13** (mendekati rasio canvas app: width × 1.3 height) atau **3:4**                                               |
| Export size | 1200×1560                                                                                                             |
| Path saran  | `public/images/field-texture.webp`                                                                                    |
| Critical    | Harus **top-down / slightly isometric**, bukan perspective dramatis. Garis harus lurus agar rute pemain tetap terbaca |
|             |                                                                                                                       |

**Prompt (field kosong — recommended):**

```text
Top-down orthographic view of a compact 5v5 flag football field, vertical
portrait orientation. Realistic short green turf texture (#1A5C3A), darker green
endzones (#123D28) at top and bottom (~12% each). Crisp but soft chalk-white
middle line across the center. Optional faint 5-yard style tick marks, not busy.
No players, no ball, no text labels, no logos, no shadows of stadium roofs.
Even lighting, slightly desaturated, suitable as a UI playbook background.
Flat enough for drawing arrows on top. Photoreal turf fiber detail, subtle wear.
```

**Prompt B01b — field dengan zona belajar (untuk lesson, bukan editor):**

```text
Same top-down 5v5 flag football field as a clean instructional diagram photo,
but with three subtle translucent zone washes (not neon):
1) endzones darker green,
2) a thin band near each goal line suggesting no-running zone,
3) bright but soft white middle line labeled area left blank for UI text.
No players. Educational, clear, premium sports academy look. No cluttered legends.
```

**Prompt B01c — field night with chalk play already drawn (marketing only):**

```text
Top-down night photo of a flag football field with simple chalk route arrows
already drawn in white and one amber arrow (#E89A2B). Five small dark player
dots with white initials style marks — abstract, not realistic faces. Looks like
a coach’s playbook come to life. No readable team names.
```

**Tips integrasi kode:**
- Pakai B01 sebagai `drawImage` full-bleed di `drawField`, lalu tetap stroke middle + endzone label di canvas.
- Atau set `background-image` di wrapper canvas dan biarkan canvas transparan untuk chips/rute saja.

---

#### B02 — Field side view (atmosfer Tim Saya)

| Field | Spec |
|---|---|
| Dipakai di | Header `TeamPage` |
| Aspect | **16:9** |
| Export size | 1920×1080 |
| Path saran | `public/images/team-field-side.webp` |

**Prompt:**

```text
Side-angle cinematic photo of a small flag football practice field at night,
cones on the sideline, a discarded orange flag belt in the foreground, empty
field stretching back. Amber practical lights, deep blacks, green turf.
Suggests “my team’s playbook starts here.” No text, no logos.
```

---

### C. Diagram lesson (Level 1–3)

PRD menyebut lesson boleh punya **1 diagram opsional**. Saat ini `LessonPage` hanya bullets — gambar di sini langsung menambah value belajar.

Simpan: `public/images/lessons/level-{n}.webp`  
Aspect semua: **4:3** atau **16:10**, export ~1600×1200.

---

#### C01 — Level 1: Lapangan & zona (Rules)

**Konteks lesson:** field 50×25 + endzone 10yd, middle, no-running zone, non-kontak.

**Prompt:**

```text
Clean educational sports diagram, top-down simplified 5v5 flag football field,
premium academy textbook style on dark charcoal background (#0A0A0A). Green field
rectangle with darker endzones. Mark clearly with elegant thin chalk lines:
MIDDLE line across center, and two NO-RUNNING ZONE bands 5 yards before each
goal line (subtle amber translucent wash #E89A2B at low opacity). Minimal labels
in clean sans-serif all-caps small text: ENDZONE, MIDDLE, NO-RUNNING ZONE.
No cartoon mascots, no 3D, no clutter. Looks like a high-end rules card.
```

---

#### C02 — Level 2: Flag pull mechanics (Movement)

**Konteks lesson:** belt + 2 flag samping, approach, angkat flag, larangan flag guarding.

**Prompt:**

```text
Educational close-up sequence style in one frame (triptych layout with clear
gutters) on dark charcoal background:
Panel 1: waist of athlete wearing flag belt with two bright orange flags on hips.
Panel 2: defender’s hand cleanly pulling one orange flag — no tackling.
Panel 3: defender holding the flag high overhead for the referee.
Realistic photo style, consistent lighting, amber accent on flags (#FF5A1F),
no blood, no pads, no helmets. Sparse captions optional: BELT, PULL, SHOW.
Premium sports instruction photography.
```

---

#### C03 — Level 3: 4 downs & middle (Strategy)

**Konteks lesson:** 4 downs, line to gain = middle, “2nd & Middle”, “1st & Goal”.

**Prompt:**

```text
Clean strategy diagram on dark charcoal: a vertical field schematic with MIDDLE
line emphasized in chalk white. Show a simple drive path with four small amber
dots labeled 1 2 3 4 as downs progressing from own side toward middle, then a
second set of four dots from middle toward goal. Elegant arrows. Tiny labels:
"1st & Middle", "1st & Goal". High-end sports analytics aesthetic, not a busy
infographic. No fake logos, no cartoon.
```

---

### D. Illust drill (Level 1–3)

Aspect: **1:1** atau **4:5**, dipakai di atas instruksi drill.  
Path: `public/images/drills/{zone-walk|flag-pull|down-call}.webp`

---

#### D01 — Drill “Zone walk”

```text
Night practice photo: a young athlete walking deliberately across a flag
football field, pointing toward the middle line, learning zones. Soft cones
mark endzone / middle / no-running zone. Calm instructional mood, amber sideline
light, realistic, no text overlays.
```

---

#### D02 — Drill “Flag pull”

```text
Dynamic but controlled photo of a defender pulling an orange side-flag from a
ball carrier during flag football practice. Both athletes athletic wear only
(no pads). Motion freeze, chalk dust or turf particles subtle. Focus on the flag
in hand. Cinematic dusk lighting, amber accent.
```

---

#### D03 — Drill “Down call”

```text
Quarterback or captain at the line of scrimmage on a small flag football field,
hand signals / mouth open calling a down situation at night practice. Teammates
blurred behind. Mood: clarity and communication. No readable play wristband text.
Premium sports photo.
```

---

### E. Teaser thumb Level 4–8 (locked nodes)

Aspect **1:1**, 800×800. Path: `public/images/teasers/level-{4..8}.webp`  
Beri sedikit **desaturation / darker** agar terasa “terkunci”.

| Level | Judul | Prompt inti |
|---|---|---|
| 4 | Offense basics | Formasi 5 offense di line, QB di shotgun, rute hint tipis putih |
| 5 | Defense basics | 5 defense spread, satu pemain siap blitz (tanpa kontak) |
| 6 | Situational plays | Jam malam, papan situasi abstract “4th down” tanpa teks ramai |
| 7 | Team chemistry drills | Lima pemain sync warm-up / high-five ringan di sideline |
| 8 | Road to 2028 capstone | Siluet lapangan + horizon amber “menuju 2028”, epic tapi bersih |

**Template prompt teaser:**

```text
Square cinematic still for a locked skill-tree node about "{TITLE}".
Flag football only (no tackle pads). Mood: intriguing preview, slightly darker
and more mysterious than unlocked content. Amber accent #E89A2B, deep green turf,
charcoal shadows. No text, no logos, no Olympic rings. Premium sports photography.
Subject: {SUBJECT DETAIL}.
```

Isi `{SUBJECT DETAIL}` dari tabel di atas.

---

### F. Marketing / pitch / Open Graph

---

#### F01 — Open Graph / link preview

| Field | Spec |
|---|---|
| Aspect | **1.91:1** (~1200×630) |
| Path saran | `public/og-playflag.png` |

**Prompt:**

```text
Wide promotional key visual for a learning app called PlayFlag (do NOT render
the word PlayFlag in the image). Flag football field at dusk as dominant
full-bleed background, one athlete pulling an orange flag in midground.
Left side slightly darker for future title space. Premium, olympic-pathway
ambition without using Olympic rings. Amber and charcoal grade.
```

---

#### F02 — README / pitch hero

```text
Editorial hero image: diverse small team of five flag football players walking
onto a lit field at night, holding flag belts, calm confidence. Feels like the
start of a journey to 2028. Cinematic, realistic, no text.
```

---

#### F03 — Brand kit board (opsional, 1 gambar ringkas)

Kalau mau satu board untuk juri/deck:

```text
Premium brand guidelines board on dark charcoal canvas, clean 3x3 grid with
gutters. PlayFlag flag-football learning app. Panels: (1) geometric amber flag
logo mark, (2) color chips #0A0A0A #1A5C3A #E89A2B #F5F5F7, (3) typography
specimen blank lines, (4) field photography crop, (5) flag belt detail,
(6) mobile UI silhouette mock without fake dense text, (7) chalk line detail,
(8) athlete flag pull still, (9) wordmark area left empty. Sparse labels, high-end
identity studio aesthetic. No clutter, no purple.
```

---

## 3. Mapping cepat: layar → aset

| Layar / komponen | Aset utama | Nice-to-have |
|---|---|---|
| Onboarding | A01 | A02 splash |
| Dashboard | A03 | A05a/b |
| Skill tree | A04 | E01–E05 |
| Lesson L1–L3 | C01–C03 | — |
| Drill L1–L3 | D01–D03 | — |
| Tim Saya | B02 | — |
| Play editor canvas | B01 | B01c (hanya marketing) |
| Share / README | F01–F02 | F03 |

---

## 4. Checklist kualitas sebelum masuk repo

- [ ] Tidak ada Olympic rings / logo klub nyata  
- [ ] Tidak ada helm keras / shoulder pads (ini flag, bukan tackle)  
- [ ] Flag di pinggang terlihat jelas (oranye/amber)  
- [ ] Grade warna selaras: gelap + hijau lapangan + aksen amber  
- [ ] Bagian untuk overlay teks cukup gelap / kosong  
- [ ] Tidak ada teks AI yang typo di dalam gambar (lebih aman: **tanpa teks**)  
- [ ] File WebP/PNG dioptimasi (<300KB untuk UI inline jika bisa; hero boleh lebih besar)  
- [ ] Nama file konsisten: `kebab-case` di `public/images/...`

---

## 5. Workflow generate yang efisien (Gemini Pro)

1. **Hari 1 — P0:** A01 (2 variasi: with/without athletes) + A02 + B01.  
2. **Hari 2 — P1:** C01–C03 + D01–D03 + A03.  
3. **Hari 3 — P2:** A04 + teaser E + empty states A05.  
4. **Opsional:** F01 untuk share link demo.

**Trik konsistensi:** setelah dapat 1 gambar “hero” yang bagus, unggah sebagai **reference image** di Gemini lalu minta:
“Match this color grade, lighting, and turf texture exactly; new subject: …”

**Trik upscale:** generate di rasio benar → upscale → crop aman untuk safe-area UI (jangan crop tengah aksi penting).

---

## 6. Prompt “batch director” (opsional)

Kalau mau Gemini bantu merencanakan set lengkap dalam satu chat:

```text
You are the art director for PlayFlag, a dark athletic flag-football learning
app (Road to 2028). Palette: #0A0A0A, #1A5C3A, #E89A2B, #F5F5F7. No tackle
football gear, no Olympic rings, no purple neon.

I need production-ready image prompts for:
1) mobile onboarding hero 9:16
2) top-down playbook field texture 3:4
3) level 1 field zones diagram 4:3
4) flag pull drill photo 1:1
5) app icon 1:1

For each: give final English prompt, aspect ratio, what to leave empty for UI
overlay, and 3 negative constraints. Keep a consistent cinematic dusk look.
```

---

## 7. Catatan integrasi (untuk nanti di kode)

Belum wajib diimplementasikan sekarang; ini agar hasil generate langsung punya “rumah”:

```text
public/
  images/
    hero-onboarding.webp
    dashboard-atmosphere.webp
    skill-tree-path.webp
    field-texture.webp
    team-field-side.webp
    lessons/
      level-1-zones.webp
      level-2-flag-pull.webp
      level-3-downs.webp
    drills/
      zone-walk.webp
      flag-pull.webp
      down-call.webp
    teasers/
      level-4.webp
      ...
    empty/
      radar.webp
      streak.webp
      level-complete.webp
  og-playflag.png
  icons/
    playflag-icon-1024.png
```

Usulan pemakaian UI (selaras design rules project):
- **Onboarding:** `A01` full-bleed background; brand “PlayFlag” tetap teks HTML hero-level (jangan dibakar ke gambar).
- **Lesson:** satu diagram di bawah heading, sebelum bullets.
- **Drill:** satu gambar persegi di atas instruksi.
- **Play editor:** texture `B01` di bawah stroke canvas.
- **Jangan** taruh kartu/stats di atas hero image.

---

*Dokumen ini selaras dengan PRD PlayFlag (IFAF 5v5, Road to 2028) dan token warna di `src/index.css`.*
