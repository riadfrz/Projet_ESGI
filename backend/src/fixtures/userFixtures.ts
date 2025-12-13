import { Prisma, Civility, Role } from '@/config/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

// Default passwords for seeded users
const ADMIN_PASSWORD = 'adminPassword';
const CLIENT_PASSWORD = 'clientPassword';
const USER_PASSWORD = 'userPassword';

// Helper to hash passwords synchronously for fixtures
const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const users: Prisma.UserCreateManyInput[] = [
    {
        id: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50',
        email: 'admin@template.fr',
        password: hashPassword(ADMIN_PASSWORD),
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
        phone: faker.phone.number(),
        civility: Civility.MR,
        birthDate: faker.date.past(),
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'bf0596a2-149e-42b7-94de-0a10774280eb',
        email: 'gymowner@app.com',
        password: hashPassword(ADMIN_PASSWORD),
        firstName: 'Gym',
        lastName: 'Owner',
        role: Role.GYM_OWNER,
        phone: faker.phone.number(),
        civility: Civility.MR,
        birthDate: faker.date.past(),
        createdAt: new Date('2023-01-02T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    },
    {
        id: 'bf0596a2-149e-42b7-94de-0a10774280ec',
        email: 'contact@app.com',
        password: hashPassword(ADMIN_PASSWORD),
        firstName: 'Contact',
        lastName: 'App',
        role: Role.ADMIN,
        phone: faker.phone.number(),
        civility: Civility.MRS,
        birthDate: faker.date.past(),
        createdAt: new Date('2023-01-02T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    },
    {
        id: 'c1a89e50-1b27-4b6a-b8a6-8a3b5f85df51',
        email: 'client1@example.com',
        password: hashPassword(CLIENT_PASSWORD),
        firstName: 'Jean',
        lastName: 'Dupont',
        role: Role.CLIENT,
        phone: faker.phone.number(),
        civility: Civility.MR,
        birthDate: new Date('1985-05-15'),
        createdAt: new Date('2023-01-03T10:00:00Z'),
        updatedAt: new Date('2023-01-03T10:00:00Z'),
    },
    {
        id: 'c1a89e50-1b27-4b6a-b8a6-8a3b5f85df52',
        email: 'client2@example.com',
        password: hashPassword(CLIENT_PASSWORD),
        firstName: 'Marie',
        lastName: 'Martin',
        role: Role.CLIENT,
        phone: faker.phone.number(),
        civility: Civility.MRS,
        birthDate: new Date('1990-08-22'),
        createdAt: new Date('2023-01-04T10:00:00Z'),
        updatedAt: new Date('2023-01-04T10:00:00Z'),
    },
    {
        id: 'c1a89e50-1b27-4b6a-b8a6-8a3b5f85df53',
        email: 'client3@example.com',
        password: hashPassword(CLIENT_PASSWORD),
        firstName: 'Pierre',
        lastName: 'Bernard',
        role: Role.CLIENT,
        phone: faker.phone.number(),
        civility: Civility.MR,
        birthDate: new Date('1978-12-10'),
        createdAt: new Date('2023-01-05T10:00:00Z'),
        updatedAt: new Date('2023-01-05T10:00:00Z'),
    },
];

export const fakerUser = (): Prisma.UserCreateManyInput => {
    return {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: hashPassword(USER_PASSWORD),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        civility: faker.helpers.arrayElement([Civility.MR, Civility.MRS, Civility.OTHER]),
        birthDate: faker.date.past(),
        role: Role.CLIENT,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };
};

