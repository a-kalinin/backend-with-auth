import {
  Body,
  Controller,
  Example,
  Get, Header,
  Path,
  Post,
  Put,
  Request,
  Route, Security,
  Tags,
} from 'tsoa';
import { Request as RequestT } from 'express';
import { UserCreationParamsT, UserLoginRequestParamsT } from '../@types/requestDTO';
import { getUserDto, UserT } from '../responseModels/user';
import {
  ActionResponseT,
  SuccessResponseT,
  wrapSuccessActionResponse, wrapSuccessResponse,
} from '../responseModels/response';
import {
  activateUserActivationCode,
  createUser,
  getUserByEmail,
  getUserById,
  loginUser, resendActivationCode,
} from '../services/userService';
import { EmailT, UUID } from '../@types/string';
import { UserLoginResponseT } from '../@types/responseDTO';
import { refreshTokens, removeTokenBySession } from '../services/tokenService';

@Route('users')
export class UsersController extends Controller {
  /**
   * Returns user by his UUID
   */
  @Get('byId/{userId}')
  @Tags('user')
  public async getUserById(
    // @Request() req: RequestEx,
    @Path() userId: UUID,
  ): Promise<SuccessResponseT<UserT>> {
    return wrapSuccessResponse(await getUserById(userId));
  }

  /**
   * Returns user by email
   */
  @Get('byEmail/{email}')
  @Tags('user')
  public async getUserByEmail(
    @Path() email: EmailT,
  ): Promise<SuccessResponseT<UserT>> {
    return wrapSuccessResponse(await getUserByEmail(email));
  }


  /**
   * Creates new user. Use this for user's registration too.
   *
   * @example requestBody {
   *   "email": "user@example.com",
   *   "firstName": "John",
   *   "middleName": "Agent",
   *   "lastName": "Smith",
   *   "password": "secretPassword"
   * }
   *
   */
  @Example<ActionResponseT<UserT>>({
    content: { status: 'ok' },
  })
  @Put()
  @Tags('user')
  public async createUser(
    @Body() requestBody: UserCreationParamsT,
  ): Promise<ActionResponseT<void>> {
    return wrapSuccessActionResponse(await createUser(requestBody));
  }

  /**
   * Send activation code again.
   */
  @Get('reactivate/{email}')
  @Tags('user')
  public async resendActivationCode(
    @Path() email: EmailT,
  ): Promise<ActionResponseT<void>> {
    return wrapSuccessActionResponse(await resendActivationCode(email));
  }

  /**
   * Activate user by his activation code, sent by email.
   */
  @Get('activate/{code}')
  @Tags('user')
  public async activateCode(
    @Path() code: UUID,
  ): Promise<SuccessResponseT<UserT>> {
    return wrapSuccessResponse(await activateUserActivationCode(code));
  }

  /**
   * User log in.
   */
  @Post('login')
  @Tags('user')
  public async login(
    @Request() req: RequestT,
    @Body() requestBody: UserLoginRequestParamsT,
  ): Promise<SuccessResponseT<UserLoginResponseT>> {
    const { response, refreshToken } = await loginUser(requestBody);
    req.session.refreshToken = refreshToken;
    return wrapSuccessResponse(response);
  }

  /**
   * User self info.
   *
   * @example authorizationHeader "Bearer your_token"
   */
  @Get('me')
  @Tags('user')
  @Security('jwt', ['profile'])
  public async aboutMe(
    @Header('x-access-token') token: string,
    @Request() req: RequestT,
  ): Promise<SuccessResponseT<UserT | undefined>> {
    return wrapSuccessResponse(req.session.user && getUserDto(req.session.user));
  }

  /**
   * User log out.
   */
  @Get('logout')
  @Tags('user')
  public async logOut(
    @Request() req: RequestT,
  ): Promise<ActionResponseT<string>> {
    await removeTokenBySession(req.session);
    return wrapSuccessActionResponse();
  }

  /**
   * Refresh token.
   */
  @Get('refresh/{accessToken}')
  @Tags('user')
  public async refreshToken(
    @Request() req: RequestT,
    @Path() accessToken: string,
  ): Promise<SuccessResponseT<{ accessToken: string }>> {
    const { refreshToken } = req.session;
    const newTokens = await refreshTokens(accessToken, refreshToken);
    req.session.refreshToken = newTokens.refreshToken;

    return wrapSuccessResponse({ accessToken: newTokens.accessToken });
  }
}
