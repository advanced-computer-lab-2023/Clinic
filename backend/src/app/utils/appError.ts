class AppError extends Error {
  statusCode: number
  httpStatusText: string

  constructor(message: string, statusCode: number, httpStatusText: string) {
    super(message)
    this.statusCode = statusCode
    this.httpStatusText = httpStatusText
  }
}

export class NotFoundError extends AppError {
  constructor() {
    super('Not Found', 404, 'Not Found')
  }
}

export default AppError
