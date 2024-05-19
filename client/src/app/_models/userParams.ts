import { User } from "./user";

export class UserParams {
    // note: jest to klasa przechowująca właściwości przekazywane przy pobieraniu użytkowników w membersService
    gender: string;
    minAge: number = 18;
    maxAge: number = 99;
    pageNumber: number = 1;
    pageSize: number = 20;
    orderBy: string = 'lastActive';

    constructor(user: User) {
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}