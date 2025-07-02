/**
 * Wrapper for fetch
 * Automatically send refresh request if access token is expired
 * @param requestUrl Url of the request
 * @param requestOptions Request header, {} by default
 * @param hasRetried has the request been retried, false by default
 * @returns a Promise
 */
export async function authFetch(
  requestUrl: RequestInfo,
  requestOptions: RequestInit = {},
  hasRetried: boolean = false
): Promise<Response> {
  const API_URL = import.meta.env.VITE_BACKEND_URL

  // Prepare headers
  const headers = new Headers(requestOptions.headers)

  if (requestOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  // Send the request
  const response = await fetch(requestUrl, {
    ...requestOptions,
    headers,
    credentials: "include"
  })

  // If access token is expired and we haven't retried yet
  if (response.status === 401 && !hasRetried) {
    const refreshResponse = await fetch(`${API_URL}/users/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })

    if (refreshResponse.ok) {
      const data = await refreshResponse.json()
      localStorage.setItem("access", data.access)

      // Retry the original request with new cookies
      return authFetch(requestUrl, requestOptions, true)
    } else {
      // Refresh token is invalid or expired — log out user
      localStorage.clear()
      window.location.href = "/login"
    }
  }

  return response
}
