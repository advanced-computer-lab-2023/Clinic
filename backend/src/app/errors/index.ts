export class APIError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

export class NotFoundError extends APIError {
  constructor() {
    super('Not found', 404)
  }
}
