const ANILIST_API_URL = 'https://graphql.anilist.co';

export const fetchAniList = async (query, variables = {}) => {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(json.errors ? json.errors[0].message : 'Failed to fetch from AniList');
  }

  return json.data;
};

// COMMON FRAGMENTS
const MEDIA_FRAGMENT = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  description(asHtml: false)
  genres
  tags {
    name
    rank
  }
  averageScore
  popularity
  status
  chapters
  volumes
  format
  startDate {
    year
    month
    day
  }
`;

// QUERIES

export const GET_TRENDING = `
  query ($page: Int, $perPage: Int, $countryOfOrigin: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(sort: TRENDING_DESC, type: MANGA, countryOfOrigin: $countryOfOrigin) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

export const GET_POPULAR = `
  query ($page: Int, $perPage: Int, $countryOfOrigin: String) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: MANGA, countryOfOrigin: $countryOfOrigin) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

export const GET_BY_GENRE = `
  query ($page: Int, $perPage: Int, $genre: String, $countryOfOrigin: String) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: MANGA, genre: $genre, countryOfOrigin: $countryOfOrigin) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

export const GET_UPDATED = `
  query ($page: Int, $perPage: Int, $countryOfOrigin: String) {
    Page(page: $page, perPage: $perPage) {
      media(sort: UPDATED_AT_DESC, type: MANGA, countryOfOrigin: $countryOfOrigin) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

export const GET_DETAILS = `
  query ($id: Int) {
    Media(id: $id, type: MANGA) {
      ${MEDIA_FRAGMENT}
      characters(sort: ROLE, perPage: 10) {
        edges {
          role
          node {
            id
            name {
              full
              native
            }
            image {
              large
            }
          }
        }
      }
      recommendations(perPage: 10, sort: RATING_DESC) {
        edges {
          node {
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
            }
          }
        }
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              romaji
              english
            }
            type
            coverImage {
              large
            }
          }
        }
      }
    }
  }
`;
