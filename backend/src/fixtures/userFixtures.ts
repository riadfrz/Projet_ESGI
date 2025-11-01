import { Prisma, Civility, Role } from '@/config/client';
import { faker } from '@faker-js/faker';

export const users: Prisma.UserCreateManyInput[] = [
    {
        id: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50',
        email: 'admin@template.fr',
        firstName: 'admin',
        lastName: 'Garnier',
        role: Role.ADMIN,
        phone: faker.phone.number(),
        civility: Civility.MRS,
        birthDate: faker.date.past(),
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'bf0596a2-149e-42b7-94de-0a10774280eb',
        email: 'user@app.com',
        firstName: 'SDR',
        lastName: 'App',
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
        firstName: 'Contact',
        lastName: 'App',
        role: Role.CLIENT,
        phone: faker.phone.number(),
        civility: Civility.OTHER,
        birthDate: faker.date.past(),
        createdAt: new Date('2023-01-02T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    }
];

export const fakerUser = (): Prisma.UserCreateManyInput => {
    return {
        id: faker.string.uuid(),
        email: faker.internet.email(),
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
