const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Appointment {
    _id: ID!
    patient: String!
    comments: String!
    fromDate: String!
    toDate: String!
    createdBy: User!
}

type User{
    _id: ID!
    email: String!
    password: String
    createdAppointments: [Appointment!]
}

input UserInput{
    email: String!
    password: String!
}

type AuthData{
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type RootQuery {
    appointments(id: String!): [Appointment!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createAppointment(appointmentInput: AppointmentInput): Appointment
    createUser(userInput: UserInput): User
    deleteAppointment(appointmentId: ID!): Appointment
    updateAppointment(id: ID!, updateAppointment: UpdateAppointment): Appointment
}

input AppointmentInput {
    patient: String!
    comments: String!
    fromDate: String!
    toDate: String!
}

schema {
    query: RootQuery
    mutation: RootMutation
}

input UpdateAppointment {
    patient: String
    comments: String
    fromDate: String
    toDate: String
}

    
        `);
