import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as swagger from '@midwayjs/swagger';
import * as orm from '@midwayjs/typeorm';
import * as crossDom from '@midwayjs/cross-domain';
import * as upload from '@midwayjs/upload';
import * as staticFile from '@midwayjs/static-file';
import { join } from 'path';
import * as bodyParser from 'koa-bodyparser';
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
    upload,
    staticFile,
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
    this.app.use(bodyParser());
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    this.app.useFilter([BlindBoxErrorFilter]);
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }

  middlewares = [
    bodyParser(),  // ← 关键：让 POST 请求体能被解析
  ];
}
