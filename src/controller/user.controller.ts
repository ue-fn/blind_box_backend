import { Body, Controller, Post, Inject, Get, Query } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { ApiTags, ApiOperation } from '@midwayjs/swagger';

class registerDTO {
    username: string;
    password: string;
    avatar: string;
}
class loginDTO {
    username: string;
    password: string;
}

@ApiTags('用户模块')
@Controller('/user')
export class UserController {
    @Inject()
    userService: UserService;


    @Get('/')
    async getUser() {
        return 'User Controller is working!';
    }

    @Get('/ping')
    async ping() {
        return {
            status: 'alive',
            timestamp: new Date()
        };
    }

    @Post('/echo')
    async echo(@Body('body') body: string) {
        console.log('Raw Echo Body:', body);
        return body;
    }
    @Post('/register')
    @ApiOperation({ summary: '用户注册' })
    async register(@Body() registerData: registerDTO): Promise<any> {
        console.log('接收到的请求体:', registerData); // 调试用
        try {
            const user = await this.userService.register(
                registerData.username,
                registerData.password,
                registerData.avatar
            );
            
            // 如果返回false，表示用户名已存在
            if (user === false) {
                return {
                    success: false,
                    data: false,
                    message: '用户名已存在'
                };
            }
            
            return {
                success: true,
                data: user,
                message: '注册成功'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    @Post('/login')
    async login(
        @Body() loginData: loginDTO
    ): Promise<any> {
        try {
            console.log('接收到的请求体:', loginData); // 调试用
            const res = await this.userService.login(
                loginData.username,
                loginData.password
            );
            if (res) {
                const user = await this.userService.getUserInfo(loginData.username);
                return {
                    success: true,
                    user: user,
                    message: '登录成功'
                };
            } else {
                return {
                    success: false,
                    message: '用户名或密码错误'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            };

        }

    }

    @Get('/info')
    @ApiOperation({ summary: '根据用户ID查询用户信息' })
    async getUserInfoById(@Query('uid') uid: string): Promise<any> {
        try {
            console.log(uid)
            const user = await this.userService.getUserInfo(uid);
            if (user) {
                return {
                    success: true,
                    data: user,
                    message: '用户信息获取成功',
                };
            } else {
                return {
                    success: false,
                    message: '用户不存在',
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    @Get('/all')
    @ApiOperation({ summary: '获取所有用户' })
    async getAllUsers(): Promise<any> {
        try {
            const users = await this.userService.getAllUsers();
            return {
                success: true,
                data: users,
                message: '获取用户列表成功'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Get('/delete')
    @ApiOperation({ summary: '删除用户' })
    async deleteUser(@Query('username') username: string): Promise<any> {
        try {
            const result = await this.userService.deleteUserByUsername(username);
            if (result) {
                return {
                    success: true,
                    message: '用户删除成功'
                };
            } else {
                return {
                    success: false,
                    message: '用户不存在或删除失败'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}
