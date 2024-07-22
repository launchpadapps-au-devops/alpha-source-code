import { Controller, Post, Body, Get, Headers, UseGuards, Request, Req, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessagingService } from 'src/common/messaging.service';
import { PasswordDto } from 'src/common/dto/password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessagingService
  ) {}

  @ApiHeader({
     name: 'alpha-x-platform', 
     enum: ['alpha-admin-web', 'alpha-patient-mobile'],
     required: true, 
     description: 'Alpha X Platform' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'gajanand+pt01@launchpadapps.co',
        },
        password: {
          type: 'string',
          example: 'password',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Login successful',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
            },
            accessTokenExpiresAt: {
              type: 'string',
              example: '2021-08-25T06:58:42.000Z',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
            },
            refreshTokenExpiresAt: {
              type: 'string',
              example: '2021-08-25T06:58:42.000Z',
            },
          },
        },
        meta: {
          type: 'object',
        }
      },
    }
  })
  @Post('login')
  async login(
    @Req() req,
    @Headers('alpha-x-platform') platform: string,
    @Body() payload: {
    email: string;
    password: string;
  }) {

    const deviceInfo = req.headers['user-agent'];
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    return this.authService.login({
      ...payload,
      deviceInfo,
      platform,
      ipAddress
    });
  }


  @ApiBearerAuth()
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Logout successful',
        },
        data: {
          type: 'object',
          example: null
        },
        meta: {
          type: 'object',
        }
      },
    }
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'refreshToken',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Login successful',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
            },
            accessTokenExpiresAt: {
              type: 'string',
              example: '2021-08-25T06:58:42.000Z',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
            },
            refreshTokenExpiresAt: {
              type: 'string',
              example: '2021-08-25T06:58:42.000Z',
            },
          },
        },
        meta: {
          type: 'object',
        }
      },
    }
  })
  @Post('/refresh-token')
  async refreshToken(
    @Body() payload: {
      refreshToken: string;
    }
  ) {
    return this.authService.refreshToken(payload);
  }

  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: 'newpassword',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Password updated successfully, All session revoked. Please login again',
        },
        data: {
          type: 'object',
          example: null
        },
        meta: {
          type: 'object',
        }
      },
    }
  })
  @UseGuards(JwtAuthGuard)
  @Put('/password')
  async changePassword(
    @Request() req,
    @Body() payload: {
    password: PasswordDto;
  }) {
    return this.authService.changePassword(req.user.userId, payload);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'gajanand+pt10@launchpadapps.co',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'OTP sent successfully',
        },
        data: {
          type: 'object',
          example: null
        },
        meta: {
          type: 'object',
        }
      },
    }
  })
  @Post('/password/otp') 
  async sendForgotPasswordOtp(
    @Body() payload: {
      email: string;
    }
  ) {
    const user = await this.authService.getUserByEmail(payload);
    const { data } = await this.authService.getForgotPasswordOtp(payload.email);
    await this.messageService.publishToNotification(
      'notification.register',
      {
        recipients: [user.data.id],
        type: 'email',
        categoryId: 2, // Account Auth
        subcategoryId: 2, // Forgot Password OTP
        data: {
          ...user,
          ...data
        }
      }
    )

    return {
      message: 'OTP sent successfully',
      data: null,
      meta: {}
    }
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'abc@example.com',
        },
        otp: {
          type: 'number',
          example: 1234,
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Login successful',
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
            },
            accessTokenExpiresAt: {
              type: 'string',
              example: '2021-08-25T06:58:42.000Z',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
            },
            refreshTokenExpiresAt: {
              type: 'string',
              example: '2021-08-25T06:58:42.000Z',
            },
          },
        },
        meta: {
          type: 'object',
        }
      },
    }
  })
  @Post('/password/otp/verify')
  async confirmForgotPasswordOtp(
    @Request() req,
    @Body() payload: {
      email: string;
      otp: number;
    }
  ) {
    return this.authService.confirmForgotPasswordOtp(payload, req.user);
  }

  @ApiExcludeEndpoint()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'gajanand+pt01@launchpadapps.co',
        },
        otp: {
          type: 'string',
          example: '123456',
        },
        password: {
          type: 'string',
          example: 'password',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Password reset successfully',
        },
        data: {
          type: 'object',
          example: null
        },
        meta: {
          type: 'object',
        }
      },
    }
  })
  @Put('/password/reset')
  async resetPassword(
    @Body() payload: {
      email: string;
      otp: string;
      password: PasswordDto;
    }
  ) {
    return this.authService.resetPassword(payload);
  }

  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'Profile data',
      data: req.user,
      meta: {}
    }
  }
}
