import httpClient from './httpClient.js';

function getErrorMessage(error) {
  return error.response?.data?.message || 'Unable to analyze this webpage. Please try again.';
}

async function analyzeUrl(url) {
  try {
    const response = await httpClient.post('/audit', { url });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export { analyzeUrl };
