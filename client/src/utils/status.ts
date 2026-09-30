export const STATUS_CODES: Record<string, number> = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409
}

export function getStatusColor(
  status: string
): 'green-500' | 'blue-500' | 'red-500' | undefined {
  const code = STATUS_CODES[status]

  if (!code) {
    return undefined
  }

  if (code < 300) {
    return 'green-500'
  }

  if (code < 400) {
    return 'blue-500'
  }

  return 'red-500'
}
