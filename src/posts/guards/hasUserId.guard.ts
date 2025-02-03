import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { Observable } from "rxjs";

@Injectable()
export class HasUserId implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const userId = request.headers['user-id']
        
        if(!userId || !isValidObjectId(userId)){
            throw new BadRequestException('Invalid id is provided')
        }

        request.userId = userId

        return true
    }
}