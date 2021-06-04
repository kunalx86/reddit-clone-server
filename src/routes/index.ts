import { Router } from 'express';

// Export the base-router
const baseRouter = Router();
baseRouter.get('/', (_, res) => {
  res.send("Hello");
})
export default baseRouter;
