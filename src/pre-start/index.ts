/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import path from 'path';
import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';



(() => {
  // Setup command line options
  const options = commandLineArgs([
    {
      name: 'env',
      alias: 'e',
      defaultValue: 'development',
      type: String,
    },
  ]);
  // Set the env file
  const result2 = dotenv.config({
    path: path.join(__dirname, `env/${options.env}.env`),
  });
  // In case of Docker container, env will be provided at runtime
  // Hence the check is put
  // And if it is in production without Docker it would still work
  if (!(process.env.DOCKER_ENV === 'yes')) {
    if (result2.error) {
      throw result2.error;
    }
  }
})();
