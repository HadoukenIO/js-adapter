import { Identity } from '../identity';

export function validateIdentity(identity: Identity): string {
    let errorMsg;

    if (typeof identity !== 'object' || typeof identity.uuid !== 'string') {
        errorMsg = 'Not a valid identity object';
    }
    return errorMsg;
}
