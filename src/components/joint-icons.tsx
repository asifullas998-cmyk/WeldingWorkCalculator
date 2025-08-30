// This component is for SVG icons related to welding joints.
export const ButtJointIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 22H21V26H4V22Z" fill="hsl(var(--secondary-foreground))" />
        <path d="M27 22H44V26H27V22Z" fill="hsl(var(--secondary-foreground))" />
        <path d="M22 18L26 18L26 30L22 30L22 18Z" fill="hsl(var(--accent))" />
    </svg>
);

export const FilletJointIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 24H44V44H24V24Z" fill="hsl(var(--secondary-foreground))" />
        <path d="M4 4H24V24H4V4Z" fill="hsl(var(--secondary-foreground))" />
        <path d="M24 4L4 24H24V4Z" fill="hsl(var(--accent))" />
    </svg>
);

export const LapJointIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 26H36V34H4V26Z" fill="hsl(var(--secondary-foreground))" />
        <path d="M12 14H44V22H12V14Z" fill="hsl(var(--secondary-foreground))" />
        <path d="M12 22L12 26L4 26L12 22Z" fill="hsl(var(--accent))" />
    </svg>
);

export const CornerJointIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="8" height="30" fill="hsl(var(--secondary-foreground))" />
        <rect x="12" y="34" width="30" height="8" fill="hsl(var(--secondary-foreground))" />
        <path d="M12 4L12 34L4 34L12 4Z" fill="hsl(var(--accent))" />
    </svg>
);

export const TJointIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="34" width="40" height="8" fill="hsl(var(--secondary-foreground))" />
        <rect x="20" y="4" width="8" height="30" fill="hsl(var(--secondary-foreground))" />
        <path d="M20 34L20 20L4 34H20Z" fill="hsl(var(--accent))" />
    </svg>
);
