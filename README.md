# Sonox — Industry Demo Pages

This repository contains client-facing AI receptionist demos for nine industries, each available in English, Spanish and German.

## Industry demos

| Industry | English | Spanish | German | Assistant key |
| --- | --- | --- | --- | --- |
| Real Estate | `/real-estate/` | `/real-estate/es/` | `/real-estate/de/` | `realEstate` |
| Medical & Dental | `/medical-dental/` | `/medical-dental/es/` | `/medical-dental/de/` | `medicalDental` |
| Spas & Nail Salons | `/spas-nail-salons/` | `/spas-nail-salons/es/` | `/spas-nail-salons/de/` | `spasNailSalons` |
| Restaurants | `/restaurants/` | `/restaurants/es/` | `/restaurants/de/` | `restaurants` |
| HVAC | `/hvac/` | `/hvac/es/` | `/hvac/de/` | `hvac` |
| Car Dealerships | `/car-dealerships/` | `/car-dealerships/es/` | `/car-dealerships/de/` | `carDealerships` |
| Law Firms | `/law-firms/` | `/law-firms/es/` | `/law-firms/de/` | `lawFirms` |
| Property Management | `/property-management/` | `/property-management/es/` | `/property-management/de/` | `propertyManagement` |
| Aesthetic Salons | `/aesthetic-salons/` | `/aesthetic-salons/es/` | `/aesthetic-salons/de/` | `aestheticSalons` |

Base URL:

`https://dropshectorernesto-lang.github.io/VOICES-DEMO/`

## How to connect the correct Vapi agent later

You only need to edit **one file**:

`assets/assistant-config.js`

It contains this map:

```js
window.VOICES_ASSISTANTS = {
  realEstate: '',
  medicalDental: '',
  spasNailSalons: '',
  restaurants: '',
  hvac: '',
  carDealerships: '',
  lawFirms: '',
  propertyManagement: '',
  aestheticSalons: ''
};
```

When you create an assistant in Vapi, copy its Assistant ID and paste it between the quotes for the correct industry.

Example:

```js
window.VOICES_ASSISTANTS = {
  realEstate: '11111111-2222-3333-4444-555555555555',
  medicalDental: '',
  spasNailSalons: '',
  restaurants: '',
  hvac: '',
  carDealerships: '',
  lawFirms: '',
  propertyManagement: '',
  aestheticSalons: ''
};
```

That one Real Estate assistant will automatically be used on:

- `/real-estate/`
- `/real-estate/es/`
- `/real-estate/de/`

You do **not** need to edit those three pages individually.

## Temporary fallback agent

If an industry is still empty in `assets/assistant-config.js`, the demo uses the shared fallback assistant currently configured in `assets/industry-demo.js`.

This means the pages can still be tested before all nine dedicated assistants are ready.

Once every industry has its own assistant ID, the fallback is no longer used for those industries.

## Language behavior

Each locale page has its own:

- client-facing copy
- example call prompts
- opening greeting
- button/status text
- language context passed into the live demo

The English, Spanish and German versions of the same industry all use the **same industry assistant ID**. The page tells the assistant which language it should answer in for that demo.

## Files you normally need to edit

### To change an industry agent

Edit:

`assets/assistant-config.js`

### To change shared call behavior

Edit:

`assets/industry-demo.js`

### To change shared visual styling

Edit:

`assets/industry-demo.css`

### To change one page's client-facing copy

Edit that industry's language page, for example:

- English: `real-estate/index.html`
- Spanish: `real-estate/es/index.html`
- German: `real-estate/de/index.html`

## Important Vapi setup

The browser demo currently uses this public Vapi key in `assets/industry-demo.js`:

`c6c682a7-d151-470a-bee5-6818d2f13176`

For client demos to work, make sure your Vapi public-key settings allow the GitHub Pages origin:

`https://dropshectorernesto-lang.github.io`

If you restrict the public key to specific assistants, remember to add every new industry Assistant ID there as well.

## Safety notes for regulated / professional sectors

The shared demo context tells the assistant:

- medical/dental/aesthetic demos should not diagnose or recommend treatment
- legal demos should not provide legal advice
- the demo should not claim a booking, appointment or other action was actually confirmed unless a connected tool confirms it

Keep those boundaries in the final Vapi assistant prompts too.
