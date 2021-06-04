import { Router } from 'express';

// Export the base-router
const baseRouter = Router();
baseRouter.get('/', (_, res) => {
  res.json({
    message: "This is the Reddit Clone API",
  });
})
export default baseRouter;
