import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';
import { UpdateDiffDto } from './dto/update-diff.dto';
import { PicksRepository } from '../picks/picks.repository';
import { Picks } from '../picks/picks.entity';
import { sendEmail } from '../email/emailFunctions';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: UsersRepository,
    @InjectRepository(Picks)
    private picksRepository: PicksRepository,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    Logger.log(`${users.length} Users returned!`);
    return users;
  }
  async getUserById(id: string): Promise<User> {
    const userById = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    return userById;
  }
  async elimByUsername(usernames: string[]) {
    const updateStatus = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ isactive: false })
      .where({ username: In(usernames) })
      .execute();

    if (updateStatus.affected === 0) {
      Logger.warn('No users Eliminated!');
    } else {
      Logger.log(`${updateStatus.affected} Users Eliminated!`);
    }
    return updateStatus;
  }
  async updateRunDiff(updateDiffDto: UpdateDiffDto) {
    const { week, team, diff } = updateDiffDto;
    const updateDiff = await this.picksRepository
      .createQueryBuilder()
      .update(Picks)
      .set({ run_diff: diff })
      .where({ week: week })
      .andWhere({ pick: team })
      .returning('"userId"')
      .execute();
    if (updateDiff.affected > 0) {
      Logger.log(
        `${updateDiff.affected} Users Affected!  Updating User Totals...`,
      );
      const userList = updateDiff.raw.map((x: { userId: string }) => x.userId);
      const usersToUpdate = await this.picksRepository
        .createQueryBuilder()
        .where({ userId: In(userList) })
        .andWhere({ week: updateDiffDto.week })
        .execute();
      for (let x = 0; x < usersToUpdate.length; x++) {
        await this.usersRepository
          .createQueryBuilder()
          .update(User)
          .set({ diff: () => `diff + ${usersToUpdate[x].Picks_run_diff}` })
          .where({ id: usersToUpdate[x].Picks_userId })
          .execute();
      }
    } else {
      Logger.warn('No user Diffs were updated!');
    }
    return updateDiff;
  }
  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.usersRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`No User with id ${id}`);
      } else {
        Logger.warn(`User Deleted Successfully`);
      }
    } catch (error) {
      Logger.error(`AN ERROR OCCURED: ${error.message}`);
      throw 500;
    }
  }
  async emailEmptyUsers(week: number): Promise<User[]> {
    const emailList = [];
    try {
      const users = await this.usersRepository.find({
        where: {
          isactive: true,
        },
      });
      for (let u = 0; u < users.length; u++) {
        if (users[u].picks.length === week - 1) {
          // emailList.push(users[u].email);
          const userEmail = users[u].email;
          const emailSubject = 'Pick Missing for MLBSG!';
          const emailBody = `
          Hi ${users[u].username}!  Our records indicate you haven't made a pick this week for
          MLB Survivor Game!  Make sure to get it in for week ${week} before the deadline!  If you believe you have
          received this email in error, please send us a message!
          `;
          await sendEmail(userEmail, emailBody, emailSubject);
        }
      }
      return emailList;
    } catch (error) {
      Logger.error(`ERROR WHILE GENERATING MISSING PICK EMAIL LIST: ${error}`);
      throw new Error(error.message);
    }
  }
}
