/**
 * Badge Rule Types - Types of achievements that can earn badges
 */
export enum BadgeRuleType {
    // Training-based achievements
    TOTAL_SESSIONS = 'TOTAL_SESSIONS',           // Total number of training sessions
    TOTAL_DURATION = 'TOTAL_DURATION',           // Total minutes trained
    TOTAL_CALORIES = 'TOTAL_CALORIES',           // Total calories burned
    TOTAL_REPETITIONS = 'TOTAL_REPETITIONS',     // Total repetitions completed
    
    // Challenge-based achievements
    CHALLENGES_COMPLETED = 'CHALLENGES_COMPLETED', // Number of challenges completed
    CHALLENGES_CREATED = 'CHALLENGES_CREATED',     // Number of challenges created
    
    // Streak-based achievements
    TRAINING_STREAK = 'TRAINING_STREAK',         // Consecutive days with training
    
    // Social achievements
    CHALLENGES_WON = 'CHALLENGES_WON',           // Number of challenges won (1st place)
}
