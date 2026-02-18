import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

export function getIcon(iconName: string, props?: LucideProps) {
  const Icon = LucideIcons[
    iconName as IconName
  ] as React.ComponentType<LucideProps>;
  if (!Icon) {
    return <LucideIcons.Box {...props} />;
  }
  return <Icon {...props} />;
}

export { LucideIcons };
