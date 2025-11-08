import { UserRole } from '@shared/enums/userEnum';

// Mapping de la hiérarchie : chaque rôle hérite directement des rôles listés
export const roleHierarchy: { [key: string]: UserRole[] } = {
    [UserRole.CLIENT]: [],
    [UserRole.GYM_OWNER]: [UserRole.CLIENT],
    [UserRole.ADMIN]: [UserRole.CLIENT, UserRole.GYM_OWNER],
};

// Fonction récursive pour vérifier l'héritage transitif des rôles
export function hasInheritedRole(currentRole: UserRole, requiredRole: UserRole): boolean {
    if (currentRole === requiredRole) return true;
    if (!roleHierarchy[currentRole]) return false; // Ajout d'une vérification de sécurité
    for (const inheritedRole of roleHierarchy[currentRole]) {
        if (hasInheritedRole(inheritedRole, requiredRole)) {
            return true;
        }
    }
    return false;
}

