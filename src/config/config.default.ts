import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity';
import { join } from 'path';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752930957301_3597',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'backend.db',
        synchronize: true,
        logging: true,
        entities: [...Object.values(entities)],
      },
    },
  },
  swagger: {
    title: 'API文档',
    description: '项目API文档',
    version: '1.0',
    termsOfService: '',
    contact: {
      name: 'API支持',
      url: '',
      email: ''
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    },
    auth: {
      authType: 'basic',
    }
  },
  upload: {
    // 模式选择：
    //   file 模式将上传的文件存储到本地临时目录中
    //   stream 模式将上传的文件存储为流，不存储到本地
    mode: 'file',
    // 文件存储路径
    fileSize: '10mb',
    // 白名单
    whitelist: ['.jpg', '.jpeg', '.png', '.gif'],
    // 上传目录
    tmpdir: join(__dirname, '../../public/uploads'),
    // 上传的文件模式
    cleanTimeout: 5 * 60 * 1000, // 5 minutes
  },
  
  // 静态文件服务
  staticFile: {
    prefix: '/public',
    dir: join(__dirname, '../../public'),
  },
} as MidwayConfig;
