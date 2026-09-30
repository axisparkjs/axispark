import { InjectionToken, Inject } from '@axisparkjs/di';

/** Injection token for the RabbitMQ options. */
export const RABBITMQ_OPTIONS = new InjectionToken('RABBITMQ_OPTIONS');
/** Injection token for the RabbitMQ logger. */
export const RABBITMQ_LOGGER = new InjectionToken('RABBITMQ_LOGGER');

/** Inject decorator for a specific RabbitMQ connection. */
export const InjectRabbitMQConnection = (name: string) => Inject(new InjectionToken(`RABBITMQ_CONNECTION_${name}`));
