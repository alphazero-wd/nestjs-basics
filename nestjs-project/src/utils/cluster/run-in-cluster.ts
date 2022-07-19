import * as cluster from 'node:cluster';
import * as os from 'node:os';

export const runInCluster = (bootstrap: () => Promise<void>) => {
  console.log(os.cpus());
  const numberOfCores = 1;
  if (cluster.default.isPrimary) {
    for (let i = 0; i < numberOfCores; i++) {
      cluster.default.fork();
    }
  } else bootstrap();
};
