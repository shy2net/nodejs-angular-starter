import { ActionResponse } from './action-response';
import { UserProfile } from './user-profile';

export type LoginActionResponse = ActionResponse<{ token: string, profile: UserProfile}>
