// Sonox industry assistant configuration.
// Replace an empty string with the Vapi Assistant ID for that industry.
// Example: realEstate: '12345678-1234-1234-1234-123456789abc'
//
// All EN / ES / DE pages for an industry use the same assistant ID.
// Until an industry-specific ID is added, the shared fallback demo assistant is used.

window.VOICES_ASSISTANTS = {
  realEstate: '26f9db02-f0c8-49ee-bf5f-a25c63f9d721',
  medicalDental: '',
  spasNailSalons: '',
  restaurants: '',
  hvac: '',
  carDealerships: '',
  lawFirms: '',
  propertyManagement: '',
  aestheticSalons: ''
};

// Optional hard call limits per industry, in seconds.
// Real Estate is capped at 120 seconds to control demo usage costs.
window.SONOX_CALL_LIMITS = {
  realEstate: 120
};
