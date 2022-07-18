import cluster from 'cluster';
import os from 'os';

export const runInCluster = (bootstrap: () => Promise<void>) => {
  const numberOfCores = os.cpus().length;
  if (cluster.isPrimary) {
    for (let i = 0; i < numberOfCores; i++) {
      cluster.fork();
    }
  } else bootstrap();
};
