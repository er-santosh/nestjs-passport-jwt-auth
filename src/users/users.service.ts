import { User, UserDocument } from './entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
