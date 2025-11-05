import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';
import { UserRole, CivilityEnum } from '@shared/enums';



export const userSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().nullable().optional(),
    civility: z.nativeEnum(CivilityEnum).nullable().optional(),
    birthDate: z.string().nullable().optional(),
    role: z.nativeEnum(UserRole),
    points: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserDto = Serialize<UserSchema>;

export const restrictedUserSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    civility: z.nativeEnum(CivilityEnum).nullable().optional(),
    role: z.nativeEnum(UserRole),
});

export type RestrictedUserSchema = z.infer<typeof restrictedUserSchema>;
export type RestrictedUserDto = Serialize<RestrictedUserSchema>;

export const queryUsersSchema = z.object({
    page: z.string().min(1, 'Le numéro de page doit être supérieur à 0').optional(),
    limit: z.string().min(1, "Le nombre d'éléments par page doit être supérieur à 0").optional(),
    search: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
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
    email: z.string().email("Format d'email invalide").optional(),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
    phone: z.string().nullable().optional(),
    civility: z.nativeEnum(CivilityEnum).nullable().optional(),
    birthDate: z.string().nullable().optional(),
    role: z.nativeEnum(UserRole).optional(),
    points: z.number().optional(),
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
    civility: z.nativeEnum(CivilityEnum).nullable().optional(),
});

export type BasicUserSchema = z.infer<typeof basicUserSchema>;
export type BasicUserDto = Serialize<BasicUserSchema>;

export const contactUserSchema = basicUserSchema.extend({
    role: z.nativeEnum(UserRole),
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

// ============================================================================
// Current User Response (for authenticated user)
// ============================================================================

export const currentUserResponseSchema = basicUserSchema.extend({
    role: z.nativeEnum(UserRole),
    createdAt: z.string(),
});

export type CurrentUserResponseSchema = z.infer<typeof currentUserResponseSchema>;
export type CurrentUserResponseDto = Serialize<CurrentUserResponseSchema>;