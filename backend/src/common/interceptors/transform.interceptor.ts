import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformDates(data)));
  }

  private transformDates(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof Date) {
      return data.toISOString();
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformDates(item));
    }

    if (typeof data === "object") {
      const transformed: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] instanceof Date) {
            transformed[key] = data[key].toISOString();
          } else if (typeof data[key] === "object" && data[key] !== null) {
            transformed[key] = this.transformDates(data[key]);
          } else {
            transformed[key] = data[key];
          }
        }
      }
      return transformed;
    }

    return data;
  }
}
