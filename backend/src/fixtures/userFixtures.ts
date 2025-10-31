import { Prisma } from '@/config/client';
import { faker } from '@faker-js/faker';

import { UserRole, CivilityEnum } from '@shared/enums';

export const users: Prisma.UserCreateManyInput[] = [
    {
        id: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50',
        email: 'admin@template.fr',
        password: 'adminPassword',
        firstName: 'admin',
        lastName: 'Garnier',
        roles: JSON.stringify([UserRole.ADMIN]),
        phone: faker.phone.number(),
        civility: faker.helpers.arrayElement([CivilityEnum.Mr, CivilityEnum.Mrs]),
        birthDate: faker.date.past().toISOString(),
        acceptNewsletter: faker.datatype.boolean(),
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'bf0596a2-149e-42b7-94de-0a10774280eb',
        email: 'sdr@app.com',
        password: 'adminPassword',
        firstName: 'SDR',
        lastName: 'App',
        roles: JSON.stringify([UserRole.MODERATOR]),
        phone: faker.phone.number(),
        civility: faker.helpers.arrayElement([CivilityEnum.Mr, CivilityEnum.Mrs]),
        birthDate: faker.date.past().toISOString(),
        createdAt: new Date('2023-01-02T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    },
    {
        id: 'bf0596a2-149e-42b7-94de-0a10774280ec',
        email: 'contact@app.com',
        password: 'adminPassword',
        firstName: 'Contact',
        lastName: 'App',
        roles: JSON.stringify([UserRole.USER]),
        phone: faker.phone.number(),
        civility: faker.helpers.arrayElement([CivilityEnum.Mr, CivilityEnum.Mrs]),
        birthDate: faker.date.past().toISOString(),
        acceptNewsletter: faker.datatype.boolean(),
        createdAt: new Date('2023-01-02T10:00:00Z'),
        updatedAt: new Date('2023-01-02T10:00:00Z'),
    }
];

export const fakerUser = (): Prisma.UserCreateManyInput => {
    return {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: 'userPassword',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        civility: faker.helpers.arrayElement([CivilityEnum.Mr, CivilityEnum.Mrs]),
        birthDate: faker.date.past().toISOString(),
        acceptNewsletter: faker.datatype.boolean(),
        roles: [JSON.stringify([UserRole.USER])],
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };
};
