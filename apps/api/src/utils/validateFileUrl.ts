import axios from 'axios';

export async function validateFileUrl(url: string) {
  try {
    const response = await axios.head(url, { maxRedirects: 5 });
    const contentType = (response.headers['Content-Type'] as string) || '';
    if (contentType.includes('text/html') || contentType.includes('json')) {
      return { isValid: false };
    }

    return { isValid: true, type: contentType };
  } catch {
    return { isValid: false };
  }
}
