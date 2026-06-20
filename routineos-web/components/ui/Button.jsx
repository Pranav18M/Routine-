'use client';

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  success: 'btn-success',
  outline: 'btn-outline',
};
const sizeClass = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-lg' };

export default function Button({
  children, variant = 'primary', size = 'md', className = '',
  disabled, loading, fullWidth, onClick, type = 'button', ...props
}) {
  const cls = ['btn', variantClass[variant] || variantClass.primary, sizeClass[size] || sizeClass.md, fullWidth ? 'btn-full' : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls} {...props}>
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}
