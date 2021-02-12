import { UserInputDTO, LoginInputDTO } from "./entities/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { HashManager } from "./services/HashManager";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

export class UserBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private hashManager: HashManager,
      private authenticator: Authenticator,
      private userDatabase: UserDatabase,
   ) { }

   async createUser(user: UserInputDTO) {

      if (!user.name || !user.email || !user.password || !user.role) {
         throw new CustomError(422, "Missing input")
      }

      if (user.email.indexOf("@") === -1) {
         throw new CustomError(422, "All addresses must have an @")
      }

      if (user.password.length < 6) {
         throw new CustomError(422, "Password must have at least 6 characters")
      }
   
      const id = this.idGenerator.generate();

      const hashPassword = await this.hashManager.hash(user.password)

      await this.userDatabase.createUser(
         id,
         user.email,
         user.name,
         hashPassword,
         user.role
      )

      const accessToken = this.authenticator.generateToken({
         id,
         role: user.role
      })

      return accessToken
   }

   async getUserByEmail(user: LoginInputDTO) {

      const userFromDB = await this.userDatabase.getUserByEmail(user.email)

      const passwordIsCorrect = await this.hashManager.compare(
         user.password,
         userFromDB.password
      )

      const accessToken = this.authenticator.generateToken({
         id: userFromDB.id,
         role: userFromDB.role
      })

      if (!passwordIsCorrect) {
         throw new CustomError(401, "Invalid credentials!")
      }

      return accessToken
   }
}