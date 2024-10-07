import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guard/local-auth-guard';
import { LoginUserDto } from './users/dto/userLoginDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomAuthGuard } from './auth/guard/custom-auth-guard';
import { RefreshTokenGuard } from './auth/guard/refresh-guard';
import { RefreshTokenDto } from './auth/dto/refresh-token.dto';
import { HttpExceptionFilter } from './shared/exception-service';

@Controller()
@UseFilters(new HttpExceptionFilter('AppLogin'))
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Request() req) {
    const user = req.user;
    return this.appService.getRefreshToken(user);
  }

  @ApiBearerAuth()
  @UseGuards(CustomAuthGuard)
  @Post('/logout-all-sessions')
  logoutAll(@Request() req) {
    const user = req.user;
    return this.appService.logoutAllSessions(user);
  }

  @ApiBearerAuth()
  @UseGuards(CustomAuthGuard)
  @Post('/logout')
  logout(@Body() refreshTokenDto: RefreshTokenDto, @Request() req) {
    const user = req.user;
    return this.appService.logout(refreshTokenDto, user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(
    @Body() userLoginDto: LoginUserDto,
    @Request() req,
  ): Promise<{
    id: number;
    token: string;
    refreshToken: string;
    userName: string;
    email: string;
    userType: string;
  }> {
    const user = req.user;
    return this.appService.login(userLoginDto, user);
  }
}
