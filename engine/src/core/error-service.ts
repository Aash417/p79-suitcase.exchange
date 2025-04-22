import { appendFile } from 'node:fs/promises';
import { RedisPublisher } from './redis-publisher';

export class ErrorService {
   handleError(error: Error, clientId: string) {
      const errorMessage = this.createErrorMessage(error);

      RedisPublisher.getInstance().sendToClient(clientId, {
         type: 'ERROR',
         payload: errorMessage,
      });

      this.logError(error);
   }

   private createErrorMessage(error: any) {
      return {
         type: 'Error',
         code: error.code || 'UNSPECIFIED',
         message: error.message || 'An error occurred',
         timestamp: Date.now(),
         stack:
            process.env.NODE_ENV === 'development' ? error.stack : undefined,
      };
   }

   private logError(error: any) {
      const logEntry = {
         timestamp: new Date().toISOString(),
         error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
         },
      };

      appendFile('./error.log', '\n' + JSON.stringify(logEntry, null, 2));
   }
}
