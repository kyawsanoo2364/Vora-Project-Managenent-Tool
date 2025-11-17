import axios from 'axios';

// Define the shape of the return object
interface ValidationResult {
  isValid: boolean;
  type?: string;
}

export async function validateFileUrl(url: string): Promise<ValidationResult> {
  try {
    // 1. Use axios.head for maximum efficiency
    const response = await axios.head(url);

    // 2. Check the HTTP status code for success (2xx range)
    if (response.status < 200 || response.status >= 300) {
      // Treat non-successful status codes (4xx, 5xx) as invalid
      return { isValid: false };
    }

    const contentType = (response.headers['content-type'] as string) || '';

    // This assumes you want to reject links that point to rendered pages/APIs.
    if (contentType.includes('text/html') || contentType.includes('json')) {
      return { isValid: false };
    }

    // 4. If status is 2xx and content type is acceptable, it's valid
    return { isValid: true, type: contentType };
  } catch (error) {
    // This catches network errors, DNS issues, or non-2xx status codes (if axios is configured to throw on non-2xx)
    // Note: By default, axios throws for status >= 300.

    // Check if the error is a known Axios error (e.g., 404, 500)
    if (axios.isAxiosError(error) && error.response) {
      // If a response was received but the status was bad (e.g., 404)
      return { isValid: false };
    }

    // Catch all other network/unknown errors
    return { isValid: false };
  }
}
