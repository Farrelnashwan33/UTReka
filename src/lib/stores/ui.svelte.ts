export interface BreadcrumbItem {
  label: string;
  href?: string;
  onclick?: () => void;
}

class UIStore {
  breadcrumbs = $state<BreadcrumbItem[]>([]);

  setBreadcrumbs(items: BreadcrumbItem[]) {
    this.breadcrumbs = items;
  }

  resetBreadcrumbs() {
    this.breadcrumbs = [];
  }
}

export const uiStore = new UIStore();
