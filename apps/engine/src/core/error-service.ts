import { appendFile } from 'node:fs/promises';
import { RedisService } from './redis-service';

export class ErrorService {
   handleError(error: Error, clientId: string) {
      const errorMessage = this.createErrorMessage(error);

      RedisService.getInstance().sendToClient(clientId, {
         type: 'ERROR',
         payload: errorMessage
      });

      this.logError(error);
   }

   private createErrorMessage(error: any) {
      return {
         type: 'Error',
         code: error.code ?? 'UNSPECIFIED',
         message: error.message ?? 'An error occurred',
         timestamp: Date.now(),
         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
   }

   logError(error: any) {
      const logEntry = {
         timestamp: new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'medium'
         }).format(new Date()),
         error: {
            name: error.name,
            message: error.message,
            // Format stack as multiline for readability
            stack: error.stack
               ? error.stack.split('\n').map((line: string) => line.trim())
               : undefined
         }
      };

      appendFile(
         './error.log',
         '\n' + JSON.stringify(logEntry, null, 2),
         'utf-8'
      );
   }
}
