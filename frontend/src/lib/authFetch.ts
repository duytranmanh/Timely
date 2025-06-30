
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
    // TODO: uncomment this once implementation is completed
    // const accessToken = localStorage.getItem("access")
    // const refreshToken = localStorage.getItem("refresh")

    // hardcoded values for development
    const accessToken = import.meta.env.VITE_DEV_ACCESS

    const refreshToken =  import.meta.env.VITE_DEV_REFRESH
  
    // Prepare headers
    const headers = new Headers(requestOptions.headers)
  
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }
  
    if (requestOptions.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }
  
    // Send the request
    const response = await fetch(requestUrl, {
      ...requestOptions,
      headers,
    })
  
    // If access token is expired and we haven't retried yet
    if (response.status === 401 && !hasRetried && refreshToken) {
      const refreshResponse = await fetch("/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      })
  
      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        localStorage.setItem("access", data.access)
  
        // Retry the original request with new token
        return authFetch(requestUrl, requestOptions, true)
      } else {
        // Refresh token is invalid or expired — log out user
        localStorage.clear()
        window.location.href = "/login"
      }
    }
  
    return response
  }
  