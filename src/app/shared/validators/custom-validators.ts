export class CustomValidators {
  static sanitizeInput(value: string): string {
    if (!value) return '';
    return value.trim().replace(/\s+/g, ' ');
  }

  static sanitizeNumber(value: number | null): number | null {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    if (isNaN(num) || num < 0) return null;
    return Math.floor(num);
  }
}
