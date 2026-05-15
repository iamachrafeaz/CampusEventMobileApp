import { CATEGORY_OPTIONS, ORDER_OPTIONS, PERIOD_OPTIONS } from "@/constants/eventFilterOptions";

export type SelectedOrder = keyof typeof ORDER_OPTIONS

export type SelectedCategory = keyof typeof CATEGORY_OPTIONS

export type SelectedPeriod = keyof typeof PERIOD_OPTIONS