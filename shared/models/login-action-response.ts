import { ActionResponse } from './action-response';
import { UserProfile } from './user-profile';

export interface LoginActionResponse extends ActionResponse<{ token: string, profile: UserProfile}> {

}
