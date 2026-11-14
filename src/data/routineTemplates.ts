export interface RoutineTemplate {
  id: string;
  title: string;
  time: string;
  frequency: string;
  category: 'productivity' | 'health' | 'learning' | 'mindset';
  badge: string;
  badgeColor: string;
  description: string;
  subroutines: string[];
}
