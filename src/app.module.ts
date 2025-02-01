import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { JwtAuthMiddleware } from './auth/middleware/jwt-auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // or your preferred database
      host: 'localhost',
      port: 5432,
      username: 'your_username',
      password: 'your_password',
      database: 'your_database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // set to false in production
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude('auth/(.*)', 'posts')  // Allow public access to GET /posts
      .forRoutes('*');  // Apply to all other routes
  }
}
