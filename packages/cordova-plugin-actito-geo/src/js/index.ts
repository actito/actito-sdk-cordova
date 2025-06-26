import { ActitoGeo } from './actito-geo';
import { bootstrap } from './events';

export * from './models/actito-beacon';
export * from './models/actito-heading';
export * from './models/actito-location';
export * from './models/actito-region';
export * from './models/actito-visit';

export * from './permissions';

export default ActitoGeo;

bootstrap();
