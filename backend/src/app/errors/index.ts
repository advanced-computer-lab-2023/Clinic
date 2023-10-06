export class APIError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}
