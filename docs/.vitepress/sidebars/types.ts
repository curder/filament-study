export interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

export interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

export type Sidebar = SidebarGroup[];

