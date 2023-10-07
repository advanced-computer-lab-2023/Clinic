export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public type: string = 'APIError'
  ) {
    super(message)
  }
}

export class NotFoundError extends APIError {
  constructor() {
    super('Not found', 404)
  }
}
