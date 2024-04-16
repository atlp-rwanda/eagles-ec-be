export interface IUser {
  id?: Number
  name: String
  username: String
  email: String
  password: String
  isMerchant?: Boolean

  createdAt: Date
  updatedAt: Date
}
