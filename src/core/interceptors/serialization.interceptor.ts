import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassContructor {
  new (...args: any[]): object;
}

export function serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((response: any) => {
        response.data = plainToInstance(this.dto, response.data, {
          excludeExtraneousValues: true,
        });

        return response.res.status(response.statusCode).send(response.data);
      }),
    );
  }
}
