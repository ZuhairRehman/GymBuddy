/**
 * UI component types used throughout the application
 */
import { ReactNode } from 'react';
import { ViewProps, TextInputProps, TouchableOpacityProps } from 'react-native';

// Button props
export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  textClassName?: string;
  children?: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
}

// Input props
export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  required?: boolean;
}

// Card props
export interface CardProps extends ViewProps {
  className?: string;
  children: ReactNode;
}

export interface CardHeaderProps extends ViewProps {
  className?: string;
  children: ReactNode;
}

export interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export interface CardContentProps extends ViewProps {
  className?: string;
  children: ReactNode;
}

export interface CardFooterProps extends ViewProps {
  className?: string;
  children: ReactNode;
}

// Modal props
export interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdropPress?: boolean;
}

export interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}

export interface ModalActionsProps {
  children: ReactNode;
  className?: string;
}

// DataTable props
export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => ReactNode;
  cell?: (info: { row: T }) => ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  className?: string;
  containerClassName?: string;
  rowClassName?: (row: T, index: number) => string | undefined;
  onRowPress?: (row: T) => void;
  pagination?: {
    pageSize: number;
    pageIndex: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
}

// Accordion props
export interface AccordionProps {
  items: {
    id: string;
    title: string;
    content: ReactNode;
  }[];
  multiple?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

// Container props
export interface ContainerProps extends ViewProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  avoidKeyboard?: boolean;
  safeArea?: boolean;
  centered?: boolean;
  paddingHorizontal?: boolean;
  paddingVertical?: boolean;
}

// Header props for the Screen component
export interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: ReactNode;
  className?: string;
}

// Screen props
export interface ScreenProps extends ViewProps {
  children: ReactNode;
  header?: HeaderProps;
  scrollable?: boolean;
  avoidKeyboard?: boolean;
  safeArea?: boolean;
  paddingHorizontal?: boolean;
  paddingVertical?: boolean;
  className?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarTranslucent?: boolean;
}

// Loading props
export interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
  className?: string;
  textClassName?: string;
}
