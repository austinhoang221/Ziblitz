export async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      // Add headers, authentication, or other request options here
      const requestOptions: RequestInit = {
        method: 'GET', // Default to GET method
        headers: {
          'Content-Type': 'application/json', // Example: set JSON content type
          // Add any other headers here
        },
        ...options, // Merge custom options
      };
  
      const response = await fetch(url, requestOptions);
  
      if (!response.ok) {
        // Handle non-2xx HTTP responses (e.g., 404, 500)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response based on content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data: T = await response.json();
        return data;
      } else {
        // Handle other content types (e.g., text, XML)
        const textData: T = await response.text() as T;
        return textData;
      }
    } catch (error) {
      // Handle fetch errors (e.g., network issues)
      console.error('Fetch error:', error);
      throw error; // Rethrow the error for further handling
    }
  }