import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity';

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
} as MidwayConfig;
