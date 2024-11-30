declare module '@/components/ui/input' {
    export const Input: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
  }
  
  declare module '@/components/ui/button' {
    export const Button: React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    }>;
  }
  
  declare module '@/components/ui/card' {
    export const Card: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
    export const CardContent: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  }
  
  