import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';
import { UserRole } from '@shared/enums';



export const userSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    civility: z.string().optional(),
    roles: z.array(z.nativeEnum(UserRole)).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    isVerified: z.boolean().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserDto = Serialize<UserSchema>;

export const restrictedUserSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    civility: z.string().optional(),
    roles: z.array(z.nativeEnum(UserRole)).optional(),
});

export type RestrictedUserSchema = z.infer<typeof restrictedUserSchema>;
export type RestrictedUserDto = Serialize<RestrictedUserSchema>;

export const queryUsersSchema = z.object({
    page: z.string().min(1, 'Le numéro de page doit être supérieur à 0').optional(),
    limit: z.string().min(1, "Le nombre d'éléments par page doit être supérieur à 0").optional(),
    search: z.string().optional(),
    roles: z.array(z.nativeEnum(UserRole)).optional(),

});

export type QueryUsersSchema = z.infer<typeof queryUsersSchema>;
export type QueryUsersDto = Serialize<QueryUsersSchema>;

export const queryChatContactsSchema = z.object({
    page: z.string().min(1, 'Le numéro de page doit être supérieur à 0').optional(),
    limit: z.string().min(1, "Le nombre d'éléments par page doit être supérieur à 0").optional(),
    search: z.string().optional(),
    onlineOnly: z.string().optional(),
});

export type QueryChatContactsSchema = z.infer<typeof queryChatContactsSchema>;
export type QueryChatContactsDto = Serialize<QueryChatContactsSchema>;

export const updateUserSchema = z.object({
    email: z.string().email("Format d'email invalide"),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phone: z.string().optional(),
    civility: z.string().optional(),
    roles: z.array(z.nativeEnum(UserRole)).optional(),
    isVerified: z.boolean().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UpdateUserDto = Serialize<UpdateUserSchema>;

// Backward compatibility exports
export const GetAllUsers = queryUsersSchema;
export type GetAllUsers = QueryUsersSchema;
export type GetAllUsersDto = QueryUsersDto;

export const GetChatContacts = queryChatContactsSchema;
export type GetChatContacts = QueryChatContactsSchema;
export type GetChatContactsDto = QueryChatContactsDto;

export const UpdateUser = updateUserSchema;
export type UpdateUser = UpdateUserSchema;

export const contactFiltersSchema = z.object({
    search: z.string().optional(),
    onlineOnly: z.boolean().optional(),
});

export type ContactFiltersSchema = z.infer<typeof contactFiltersSchema>;
export type ContactFilters = Serialize<ContactFiltersSchema>;

export const basicUserSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    civility: z.string().optional(),
});

export type BasicUserSchema = z.infer<typeof basicUserSchema>;
export type BasicUserDto = Serialize<BasicUserSchema>;

export const contactUserSchema = basicUserSchema.extend({
    roles: z.array(z.nativeEnum(UserRole)).optional(),
    isOnline: z.boolean().optional(),
    lastSeen: z.string().optional(),
    unreadCount: z.number().optional(),
});

export type ContactUserSchema = z.infer<typeof contactUserSchema>;
export type ContactUserDto = Serialize<ContactUserSchema>;

export const contactsResponseSchema = z.object({
    contacts: z.array(contactUserSchema),
    pagination: z.object({
        currentPage: z.number(),
        totalPages: z.number(),
        totalItems: z.number(),
        nextPage: z.number(),
        previousPage: z.number(),
        perPage: z.number(),
    }),
});

export type ContactsResponseSchema = z.infer<typeof contactsResponseSchema>;
export type ContactsResponse = Serialize<ContactsResponseSchema>;