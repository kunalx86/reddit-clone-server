import './pre-start'; // Must be the first import
import logger from '@shared/Logger';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { __prod__ } from '@shared/constants';
import mikroConfig from "./mikro-orm.config";
import { EntityManager } from '@mikro-orm/postgresql';

(async () => {

  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();
  const app = express();
  const { BAD_REQUEST } = StatusCodes;

  // /************************************************************************************
  //  *                              Set basic express settings
  //  ***********************************************************************************/

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Show routes called in console during development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  // Security
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }
  
  app.use((req, res, next) => {
    RequestContext.create(orm.em as EntityManager, next);
  })

  // Add APIs
  app.use('/api', BaseRouter);

  // Print API errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  });

  // Start the server
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
  });
})().catch(err => console.error(err));