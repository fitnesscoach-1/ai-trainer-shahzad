export type NavLinkItem = {
  label: string;
  path?: string;
  children?: {
    label: string;
    path: string;
  }[];
};

export const navLinks: NavLinkItem[] = [
  {
    label: "Workout Generator",
    path: "/workout",
  },
  {
    label: "Diet Plan Generator",
    path: "/diet",
  },
  {
    label: "Health Calculators",
    children: [
      {
        label: "BMI Calculator",
        path: "/bmi",
      },
      {
        label: "BMR Calculator",
        path: "/bmr",
      },
    ],
  },
  {
    label: "Contact",
    path: "/contact",
  },
];
