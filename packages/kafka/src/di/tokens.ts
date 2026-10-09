import { InjectionToken, Inject } from '@axisparkjs/di';

/** Injection token for the Kafka options. */
export const KAFKA_OPTIONS = new InjectionToken('KAFKA_OPTIONS');
/** Injection token for the Kafka logger. */
export const KAFKA_LOGGER = new InjectionToken('KAFKA_LOGGER');

/** Inject decorator for a specific Kafka connection. */
export const InjectKafkaConnection = (name: string) => Inject(new InjectionToken(`KAFKA_CONNECTION_${name}`));
export const InjectKafkaProducer = (name: string) => Inject(new InjectionToken(`KAFKA_PRODUCER_${name}`));
export const InjectKafkaConsumer = (name: string) => Inject(new InjectionToken(`KAFKA_CONSUMER_${name}`));
