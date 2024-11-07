import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { decodePubSubData } from '../utils/helpers.utils';
import CustomError from '../errors/custom.error';
import { addNotificationLog } from '../services/customObject/notifications/addNotificationLogs.service';
import { messageHandler } from '../services/messaging/messageHandler.service';
import { resourceHandler } from '../services/messaging/resourceHandler.service';
import { logger } from '../utils/logger.utils';
dotenv.config();


export const post = async (request: Request, response: Response): Promise<Response | void> => {
  logger.info('Received PubSub request body:', JSON.stringify(request.body));
  logger.info('Received PubSub request message:', JSON.stringify(request.body.message));  
  const pubSubMessage = request.body.message;
  const pubSubDecodedMessage = decodePubSubData(pubSubMessage);

  try {
    // Fetch the order using commercetools
    const resourceData: any = await resourceHandler(pubSubDecodedMessage);

    // Send messages
    await messageHandler(resourceData);
    await addNotificationLog('whatsapp', true, pubSubDecodedMessage);
    return response.status(200).send('Message sent successfully');
  } catch (error: any) {
    await addNotificationLog('whatsapp', false, pubSubDecodedMessage, error);
    return response.status(error instanceof CustomError ? error.statusCode as number : 500).send(error.message);
  }
};
