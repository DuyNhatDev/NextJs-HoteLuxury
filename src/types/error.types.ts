import { HttpStatus } from 'http-status-ts'

export type HttpErrorPayload = {
  message: string
  [key: string]: any
}

export type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public payload: HttpErrorPayload,
    message = 'Lỗi HTTP'
  ) {
    super(message)
  }
}

export class EntityError extends HttpError {
  constructor(payload: EntityErrorPayload) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, payload, 'Lỗi thực thể')
  }
}
