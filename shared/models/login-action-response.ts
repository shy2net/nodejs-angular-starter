import { ActionResponse } from './action-response';
import { UserProfile } from './user-profile';

export interface LoginActionResponse extends ActionResponse<any> {
    token: string;
    profile: UserProfile;
}
