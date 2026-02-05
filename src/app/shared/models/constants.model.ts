export interface UILabels {
  readonly [key: string]: string;
}

export interface ValidationMessages {
  readonly required: string;
  readonly email: string;
  readonly minLength: (min: number) => string;
  readonly min: (min: number) => string;
  readonly custom: string;
}

export interface FormLabels {
  readonly [key: string]: string;
}

export interface ButtonLabels {
  readonly [key: string]: string;
}

export interface StatusLabels {
  readonly [key: string]: string;
}

export interface ToastMessages {
  readonly [key: string]: {
    readonly severity: 'success' | 'info' | 'warn' | 'error';
    readonly summary: string;
    readonly detail: string;
  };
}
