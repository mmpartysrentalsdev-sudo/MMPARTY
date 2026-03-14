/* ============================================
   SANITY.IO CONFIGURATION
   Update these values after setting up your
   Sanity project at https://www.sanity.io
   ============================================ */

const SANITY_CONFIG = {
  // TODO: Replace with your actual Sanity project ID
  projectId: '5dea27cf',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

/**
 * Run a GROQ query against the Sanity CDN API
 */
function sanityFetch(query, params = {}) {
  let url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${encodeURIComponent(query)}`;

  // Append params
  Object.entries(params).forEach(([key, value]) => {
    url += `&$${key}="${encodeURIComponent(value)}"`;
  });

  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Sanity API error: ${res.status}`);
      return res.json();
    })
    .then(data => data.result);
}

/**
 * Convert a Sanity image reference to a CDN URL
 * ref format: "image-{id}-{width}x{height}-{format}"
 */
function sanityImageUrl(ref, width) {
  if (!ref) return '';
  const parts = ref.replace('image-', '').split('-');
  const id = parts[0];
  const dimensions = parts[1];
  const format = parts[2];
  const baseUrl = `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${format}`;

  if (width) {
    return `${baseUrl}?w=${width}&fit=max&auto=format`;
  }
  return `${baseUrl}?auto=format`;
}
