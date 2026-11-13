import { gql } from "@apollo/client";

export const CoachSchema = `
coach_id
phone_number
email
user_status
name
`;

export const getCoaches = gql`query coaches($user_status: UserStatus, $nextToken: String) {
    coaches(user_status: $user_status, next_token: $nextToken) {
      items {
       ${CoachSchema}
      }
      next_token
    }
}`;

export const getCoachInfo = gql`query coach($coach_id: String!) {
    coach(coach_id: $coach_id) {
        ${CoachSchema}
    }
}`;

export const getEnums = gql`
  query enums($name: String!) {
    __type(name: $name) {
      enumValues {
        name
      }
    }
  }
`;

export const createCoach = gql`mutation coachCreate($input: CoachInput) {
    coachCreate(input: $input) {
        ${CoachSchema}
    }
}`;

export const updateCoach = gql`mutation coachUpdate($input: CoachUpdateInput){
    coachUpdate(input: $input) {
        ${CoachSchema}
    }
}`;
