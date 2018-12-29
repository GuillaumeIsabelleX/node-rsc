import { Rsc } from './types';
import { deferRsc as defer } from '../../defer';

const localRsc: Rsc = {
 siteTitle : 'New Instance!',
};

localRsc['map'] = {
  centerPoint :  { lat: 3, lon: 4 },
};

localRsc['original'] = {
  // An original value passed to deferred function
  original: defer((cfg, original) => original),

  // This deferred function "skips" the previous one
  deferredOriginal: defer((cfg, original) => original),
};

export default localRsc;
