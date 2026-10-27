import { forwardRef } from 'react';

/** variant: primary | secondary | ghost | danger */
const Button = forwardRef(function Button({ variant = 'primary', className = '', ...props }, ref) {
  return <button ref={ref} className={`btn btn-${variant} ${className}`} {...props} />;
});
export default Button;

export function IconButton({ danger, label, children, ...props }) {
  return (
    <button className={`icon-btn ${danger ? 'del' : ''}`} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
