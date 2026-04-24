
import type { SidebarNavItem, ModuleRoute } from "@app-types/navigation";

export const base_route = "/Bookstore";

export const routes: ModuleRoute[] = [
  { 
    path: base_route, 
    load: () => import("./home") 
  },
  { 
    path: `${base_route}/catalog`, 
    load: () => import("./catalog/catalog_list")
  },
];

export const navItem: SidebarNavItem = {
  id: "bookstore-home",
  title: "Bookstore",
  section: "module",
  order: 100,
  children: [
    { 
      id: "bookstore-home", 
      title: "Home", 
      path: base_route, 
      section: "module", 
      order: 101 
    },
    { 
      id: "bookstore-catalog", 
      title: "Catalog", 
      path: `${base_route}/catalog`, 
      section: "module", 
      order: 102 
    },
  ]
};
