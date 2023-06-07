export type ProjectTypes = {
  id: number;
  featuredId: string;
  title: string;
  description: string;
  useCategory: boolean;
  image: any;
  thumbnail: any;
  createdAt: Date;
  updatedAt: Date;
  categoriesStr: string;
  featured: {
    companyId: string;
    company: {
      image: any;
      name: {
        en: string;
        ko: string;
      };
    };
  };
  projectItems: ProjectItemTypes[];
  curCollectionName?: string;
};

export type ProjectItemTypes = {
  id: number;
  projectId: number;
  infoId: number;
  title: string;
  description: string;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
