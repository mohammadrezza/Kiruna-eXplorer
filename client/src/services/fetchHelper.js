const url = 'http://localhost:3001';

async function fetchRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache',
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${url}${endpoint}`, options);

  if (!response.ok) {
    const errDetail = await response.json();
    const errorMessage =
      errDetail.error || errDetail.message || 'Something went wrong.';
    throw new Error(errorMessage);
  }

  return response.json();
}

export default fetchRequest;
