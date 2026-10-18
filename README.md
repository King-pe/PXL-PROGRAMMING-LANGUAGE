# PXL Programming Language — Official Docs

Karibu kwenye mradi wa PXL — lugha ya programu iliyoundwa na Peter Joram. Hii repo ina tovuti ndogo ya nyaraka (Next.js) inayoonyesha muundo wa PXL, mifano ya sintaksia, na sehemu za kuanza kwa watumiaji na wasanidi.

Huu README umeandikwa kwa Kiswahili ili kuwasaidia watumiaji wa Tanzania na Afrika kwa jumla; sehemu za hatua kwa hatua zinaelezea jinsi ya kuendesha tovuti mahali kwa maendeleo na uzalisho.

## Muhtasari
- Mbegu: tovuti ya nyaraka iliyotengenezwa kwa Next.js + Tailwind CSS.
- Mwandishi: Peter Joram (King-pe)
- Lengo: kutoa nyaraka, mifano, na landing page ya PXL.

## Mahitaji
- Node.js 18+ (au LTS inayofaa)
- npm au yarn

## Jinsi ya kuanza (developer)
Hakikisha uko kwenye saraka ya repo baada ya ku-clone.

Kamwe unapoanza, endelea na hatua hizi:

```bash
# install dependencies
npm install

# run dev server
npm run dev

# build for production
npm run build

# start production server
npm run start
```

Ikiwa unatumia yarn:

```bash
yarn
yarn dev
```

## Njia ya kupeleka (deploy)
Inapendekezwa kutumia Vercel (kwa sababu Next.js imeundwa kwa Vercel):
1. Unganisha repo yako kwenye Vercel.
2. Vercel itagundua Next.js na kutumia `npm run build` kwa chaguo-msingi.
3. Hakikisha kuwa `NEXT_PUBLIC_*` env vars (ikiwa utazitumia) zimewekwa kwenye Vercel dashboard.

## Mjenzi wa mradi (What’s included)
- pages/index.tsx — ukurasa mkuu wa nyaraka (landing + examples)
- pages/_app.tsx — kuingiza global styles (Tailwind)
- tailwind.config.js — usanidi wa Tailwind (tayari katika repo)
- styles/globals.css — directives za Tailwind

## Hitilafu ndogo zilizorekebishwa
- Kutokana na uangalizi wa faili, niligundua kosa la kitanzo: pages/index.tsx ilikuwa ikitumia `P_DOCS` badala ya `PXL_DOCS` — nimefanya marekebisho ili mifano ionyeshwe kwa usahihi.

## Michango
Karibu kuchangia! Ili kuchangia:
1. Fork repo
2. Unda tawi jipya: git checkout -b feature/maoni-sawa
3. Tengeneza mabadiliko na uzifanye commit
4. Tuma pull request kuelezea mabadiliko

## Leseni
Mradi una leseni iliyo kwenye faili `LICENSE` kwenye repo.

## Mawasiliano
Mawasiliano: Peter Joram — (ona profaili ya GitHub: King-pe)

---

Asante kwa kushirikisha mradi wako — ninaweza pia:
- Kuongeza mfano wa README ya kiingereza
- Kurekebisha au kuparagrafu tena sehemu za kutumia PXL na kuunda sahihi zaidi ya sintaksia
- Kutoa template ya tovuti ya nyaraka (md -> pages) ili nyaraka ziongezeke kwa urahisi

Utakubali nianzishe pia Vercel deploy config?