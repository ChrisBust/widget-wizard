import * as React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="2em"
    height="2em"
    {...props}
  >
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="M32 40h192l-22.6 124.3a15.9 15.9 0 0 1-15.3 11.7H60.9a15.9 15.9 0 0 1-15.3-11.7L22 72"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="m128 176 34-56-34-56-34 56zM22 72h212"
    />
  </svg>
);

export default Logo;
