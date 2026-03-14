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
  const host = SANITY_CONFIG.useCdn ? 'apicdn.sanity.io' : 'api.sanity.io';
  let url = `https://${SANITY_CONFIG.projectId}.${host}/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${encodeURIComponent(query)}`;

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
 * The id can contain hyphens, so we match from the end.
 */
function sanityImageUrl(ref, width) {
  if (!ref) return '';
  // Match the last two segments: dimensions (WxH) and format
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const id = match[1];
  const dimensions = match[2];
  const format = match[3];
  const baseUrl = `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${format}`;

  if (width) {
    return `${baseUrl}?w=${width}&fit=max&auto=format`;
  }
  return `${baseUrl}?auto=format`;
}
