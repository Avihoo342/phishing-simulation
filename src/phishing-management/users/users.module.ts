import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
   providers: [
    {
      provide: 'IUsersService',
      useClass: UsersService,
    },
  ],
  exports: ['IUsersService']
})
export class UsersModule {}