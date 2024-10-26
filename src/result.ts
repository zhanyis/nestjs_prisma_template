import { ApiProperty } from '@nestjs/swagger';

export const SUCCESS_CODE = 200;

export class ResultData {
  constructor(code = SUCCESS_CODE, message?: string, data?: any) {
    this.code = code;
    this.message = message;
    this.data = data || null;
  }

  @ApiProperty({ type: 'number', default: SUCCESS_CODE })
  code: number;

  @ApiProperty({ type: 'string', default: 'ok' })
  message?: string;

  data?: any;

  static ok(message?: string, data?: any): ResultData {
    return new ResultData(SUCCESS_CODE, message, data);
  }

  static fail(code: number, message?: string, data?: any) {
    return new ResultData(code, message, data);
  }
}
