import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as swagger from '@midwayjs/swagger';
import * as orm from '@midwayjs/typeorm';
import * as crossDom from '@midwayjs/cross-domain';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { BlindBoxErrorFilter } from './filter/blind_box.filter';
import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    koa,
    crossDom,
    orm,
    swagger,
    validate,
    {
      component: info,

      enabledEnvironment: ['local'],
    },
  ],

  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    this.app.useFilter([BlindBoxErrorFilter]);
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
