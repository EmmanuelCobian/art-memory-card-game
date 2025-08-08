const API_BASE_URL = "https://api.artic.edu/api/v1";
const USER_AGENT = `art-card-game (${import.meta.env.CONTACT_EMAIL})`;

/**
 * Fetches artwork details for a single artwork
 * @param {Object} artwork - Artwork object with api_link
 * @returns {Promise<string|null>} - Image URL or null if no image
 */
export const fetchArtworkDetails = async (artwork) => {
  try {
    const response = await fetch(artwork.api_link);
    if (!response.ok) {
      throw new Error(`Failed to fetch artwork details: ${response.status}`);
    }

    const res = await response.json();
    if (!res.data.image_id) {
      return null;
    }

    return `${res.config.iiif_url}/${res.data.image_id}/full/200,/0/default.jpg`;
  } catch (err) {
    console.error(`Error fetching artwork ${artwork.id}:`, err.message);
    return null;
  }
};

/**
 * Fetches a random page of artworks for a given style
 * @param {string} artStyle - The art style to search for
 * @param {number} cardNum - Number of cards to fetch
 * @param {number} totalPages - Total pages available
 * @returns {Promise<Object[]>} - Array of artwork objects with imageURL, flipped, and id
 */
export const fetchRandomArtworks = async (artStyle, cardNum, totalPages) => {
  const maxPage = Math.min(totalPages - 1, 100);
  const pageIdx = Math.floor(Math.random() * maxPage) + 1;
  const url = `${API_BASE_URL}/artworks/search?query[match][style_titles]=${artStyle}&limit=${cardNum}&page=${pageIdx}`;

  try {
    const response = await fetch(url, {
      headers: {
        "AIC-User_Agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artworks: ${response.status}`);
    }

    const res = await response.json();
    const imagePromises = res.data.map((artwork) =>
      fetchArtworkDetails(artwork)
    );
    const imageResults = await Promise.all(imagePromises);
    return imageResults.filter((image) => image !== null);
  } catch (err) {
    console.error("Error in fetchRandomArtworks:", err);
    throw err;
  }
};

/**
 * Fetches the total number of pages for a given art style
 * @param {string} artStyle - The art style to search for
 * @param {number} cardNum - Number of cards per page
 * @returns {Promise<number>} - Total number of pages
 */
export const fetchArtworkCount = async (artStyle, cardNum) => {
  const url = `${API_BASE_URL}/artworks/search?query[match][style_titles]=${artStyle}&limit=${cardNum}`;

  try {
    const response = await fetch(url, {
      headers: {
        "AIC-User_Agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artworks: ${response.status}`);
    }

    const res = await response.json();
    return res.pagination.total_pages;
  } catch (err) {
    console.error("Error in fetchArtworkCount:", err);
    throw err;
  }
};
