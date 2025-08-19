import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const ErrorPage404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const BrokenLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="256"
    height="256"
    viewBox="0 0 256 256"
    className="error404-broken-link-svg"
  >
    <g
      style={{
        stroke: 'none',
        strokeWidth: 0,
        strokeDasharray: 'none',
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
        strokeMiterlimit: 10,
        fill: 'var(--svg-fill-color)',
        fillRule: 'nonzero',
        opacity: 1,
      }}
      transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
    >
      <path
        d="M 9.601 11.655 c -2.755 0 -4.997 -2.242 -4.997 -4.997 c 0 -2.755 2.242 -4.997 4.997 -4.997 c 2.755 0 4.997 2.242 4.997 4.997 C 14.598 9.414 12.356 11.655 9.601 11.655 z M 9.601 3.662 c -1.652 0 -2.997 1.344 -2.997 2.997 c 0 1.653 1.344 2.997 2.997 2.997 c 1.653 0 2.997 -1.344 2.997 -2.997 C 12.598 5.006 11.253 3.662 9.601 3.662 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 80.141 79.495 c -2.756 0 -4.997 -2.241 -4.997 -4.997 c 0 -2.755 2.241 -4.996 4.997 -4.996 s 4.997 2.241 4.997 4.996 C 85.138 77.254 82.896 79.495 80.141 79.495 z M 80.141 71.502 c -1.652 0 -2.997 1.344 -2.997 2.996 s 1.345 2.997 2.997 2.997 s 2.997 -1.345 2.997 -2.997 S 81.793 71.502 80.141 71.502 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 2.65 37.08 c -0.27 0 -0.52 -0.1 -0.71 -0.29 c -0.19 -0.19 -0.29 -0.45 -0.29 -0.71 c 0 -0.06 0 -0.13 0.02 -0.19 c 0.01 -0.07 0.03 -0.13 0.05 -0.19 c 0.03 -0.06 0.06 -0.12 0.09 -0.17 c 0.04 -0.06 0.08 -0.11 0.13 -0.16 c 0.09 -0.09 0.2 -0.16 0.32 -0.21 c 0.25 -0.1 0.53 -0.1 0.77 0 c 0.12 0.05 0.23 0.12 0.32 0.21 c 0.19 0.19 0.3 0.45 0.3 0.71 c 0 0.26 -0.11 0.52 -0.3 0.71 C 3.17 36.98 2.91 37.08 2.65 37.08 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 59.06 81.91 c -0.13 0 -0.26 -0.021 -0.38 -0.07 s -0.229 -0.12 -0.33 -0.22 c -0.189 -0.19 -0.29 -0.44 -0.29 -0.7 c 0 -0.14 0.021 -0.26 0.08 -0.39 c 0.05 -0.12 0.12 -0.23 0.21 -0.32 c 0.09 -0.101 0.2 -0.17 0.33 -0.22 c 0.36 -0.15 0.811 -0.061 1.09 0.22 c 0.09 0.09 0.16 0.2 0.21 0.32 c 0.051 0.119 0.08 0.25 0.08 0.39 c 0 0.26 -0.1 0.51 -0.29 0.7 C 59.58 81.81 59.33 81.91 59.06 81.91 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 43.84 2.37 c -0.27 0 -0.53 -0.1 -0.71 -0.29 c -0.19 -0.19 -0.29 -0.44 -0.29 -0.71 c 0 -0.26 0.1 -0.52 0.29 -0.7 c 0.37 -0.38 1.04 -0.38 1.41 0 c 0.19 0.18 0.29 0.44 0.29 0.7 c 0 0.27 -0.1 0.52 -0.29 0.71 C 44.36 2.27 44.1 2.37 43.84 2.37 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 2.283 77.378 H 1 c -0.552 0 -1 -0.447 -1 -1 s 0.448 -1 1 -1 h 1.283 c 0.552 0 1 0.447 1 1 S 2.835 77.378 2.283 77.378 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 8.711 77.378 H 7.428 c -0.552 0 -1 -0.447 -1 -1 s 0.448 -1 1 -1 h 1.283 c 0.552 0 1 0.447 1 1 S 9.263 77.378 8.711 77.378 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 4.855 74.805 c -0.552 0 -1 -0.447 -1 -1 v -1.282 c 0 -0.553 0.448 -1 1 -1 s 1 0.447 1 1 v 1.282 C 5.855 74.357 5.408 74.805 4.855 74.805 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 4.855 81.233 c -0.552 0 -1 -0.447 -1 -1 V 78.95 c 0 -0.553 0.448 -1 1 -1 s 1 0.447 1 1 v 1.283 C 5.855 80.786 5.408 81.233 4.855 81.233 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 72.776 12.288 h -1.282 c -0.553 0 -1 -0.448 -1 -1 s 0.447 -1 1 -1 h 1.282 c 0.553 0 1 0.448 1 1 S 73.329 12.288 72.776 12.288 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 79.205 12.288 h -1.283 c -0.553 0 -1 -0.448 -1 -1 s 0.447 -1 1 -1 h 1.283 c 0.553 0 1 0.448 1 1 S 79.758 12.288 79.205 12.288 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 75.35 9.715 c -0.553 0 -1 -0.448 -1 -1 V 7.432 c 0 -0.552 0.447 -1 1 -1 s 1 0.448 1 1 v 1.283 C 76.35 9.267 75.902 9.715 75.35 9.715 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 75.35 16.143 c -0.553 0 -1 -0.448 -1 -1 V 13.86 c 0 -0.552 0.447 -1 1 -1 s 1 0.448 1 1 v 1.283 C 76.35 15.695 75.902 16.143 75.35 16.143 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 16.42 58.312 c -0.338 0 -0.668 -0.171 -0.856 -0.481 c -3.988 -6.572 -5.056 -14.576 -2.93 -21.959 c 1.53 -5.313 4.572 -9.99 8.799 -13.524 c 3.552 -2.969 7.824 -5.015 12.355 -5.917 c 4.282 -0.852 8.779 -0.66 13.002 0.557 c 4.252 1.224 8.032 3.369 11.237 6.376 c 0.402 0.378 0.423 1.011 0.045 1.413 c -0.38 0.403 -1.011 0.422 -1.414 0.045 c -2.971 -2.788 -6.478 -4.777 -10.421 -5.913 c -3.975 -1.144 -8.031 -1.318 -12.059 -0.517 c -4.204 0.837 -8.167 2.735 -11.463 5.489 c -3.919 3.277 -6.741 7.615 -8.16 12.544 c -1.972 6.848 -0.981 14.271 2.718 20.368 c 0.287 0.472 0.136 1.087 -0.336 1.373 C 16.775 58.265 16.597 58.312 16.42 58.312 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 39.127 71.099 c -2.556 0 -5.118 -0.354 -7.608 -1.07 c -2.262 -0.651 -4.428 -1.584 -6.436 -2.772 c -0.475 -0.281 -0.633 -0.895 -0.352 -1.369 c 0.282 -0.475 0.894 -0.633 1.37 -0.352 c 1.862 1.102 3.871 1.967 5.971 2.571 c 6.785 1.954 14.155 0.994 20.223 -2.631 c 0.472 -0.281 1.087 -0.129 1.371 0.346 c 0.283 0.474 0.129 1.088 -0.346 1.371 C 49.007 69.771 44.081 71.099 39.127 71.099 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 10.223 65.293 c -2.968 0 -5.132 -0.735 -6.071 -2.434 c -1.422 -2.571 0.436 -6.571 5.372 -11.566 c 0.389 -0.392 1.021 -0.397 1.415 -0.008 c 0.393 0.388 0.396 1.021 0.008 1.414 c -4.066 4.114 -5.952 7.551 -5.044 9.193 c 1.7 3.072 13.542 1.379 30.417 -6.785 c 0.497 -0.237 1.096 -0.032 1.336 0.465 s 0.032 1.095 -0.465 1.336 C 27.354 61.667 16.812 65.293 10.223 65.293 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 23.721 50.125 c -0.408 0 -0.792 -0.252 -0.94 -0.658 c -3.267 -8.976 1.378 -18.936 10.353 -22.202 c 0.518 -0.19 1.092 0.078 1.281 0.598 c 0.189 0.519 -0.079 1.093 -0.598 1.282 c -7.938 2.889 -12.046 11.699 -9.157 19.639 c 0.188 0.519 -0.079 1.093 -0.598 1.281 C 23.95 50.105 23.834 50.125 23.721 50.125 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 57.911 53.755 c -0.354 0 -0.686 -0.188 -0.865 -0.499 l -6.32 -10.922 c -0.202 -0.349 -0.175 -0.786 0.069 -1.106 c 3.005 -3.95 7.242 -7.57 12.254 -10.47 c 9.702 -5.614 20.216 -7.225 26.162 -4.007 c 0.331 0.179 0.534 0.529 0.524 0.905 c -0.174 6.758 -6.81 15.071 -16.512 20.685 c -5.012 2.899 -10.262 4.77 -15.184 5.407 C 57.996 53.752 57.953 53.755 57.911 53.755 z M 52.794 41.915 l 5.646 9.756 c 4.472 -0.681 9.222 -2.423 13.782 -5.062 c 8.671 -5.018 14.917 -12.477 15.476 -18.38 c -5.397 -2.459 -14.977 -0.758 -23.646 4.259 C 59.49 35.127 55.612 38.377 52.794 41.915 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 57.933 63.189 c -0.172 0 -0.344 -0.044 -0.499 -0.133 c -0.309 -0.179 -0.5 -0.508 -0.501 -0.865 l -0.021 -9.435 c -0.001 -0.503 0.372 -0.929 0.872 -0.994 c 3.439 -0.444 7.188 -1.58 10.84 -3.281 c 0.38 -0.179 0.829 -0.099 1.127 0.196 c 0.298 0.296 0.38 0.745 0.205 1.126 l -3.961 8.663 c -0.086 0.188 -0.229 0.346 -0.408 0.449 l -7.152 4.139 C 58.278 63.145 58.105 63.189 57.933 63.189 z M 58.913 53.621 l 0.016 6.837 l 5.38 -3.113 l 2.748 -6.011 C 64.305 52.426 61.538 53.204 58.913 53.621 z M 65.085 58.051 h 0.01 H 65.085 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 51.59 42.833 c -0.17 0 -0.343 -0.043 -0.499 -0.134 l -8.169 -4.72 c -0.309 -0.179 -0.5 -0.508 -0.5 -0.865 c 0 -0.357 0.19 -0.687 0.499 -0.866 l 7.153 -4.139 c 0.18 -0.104 0.388 -0.149 0.594 -0.13 l 9.483 0.883 c 0.417 0.039 0.766 0.333 0.874 0.738 c 0.107 0.405 -0.049 0.834 -0.392 1.075 c -3.294 2.318 -6.146 5.003 -8.247 7.764 C 52.191 42.695 51.894 42.833 51.59 42.833 z M 45.42 37.112 l 5.92 3.42 c 1.67 -2.068 3.723 -4.079 6.04 -5.921 l -6.58 -0.612 L 45.42 37.112 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 71.74 43.331 c -2.025 0 -3.999 -1.049 -5.085 -2.925 c -0.785 -1.355 -0.994 -2.936 -0.591 -4.449 c 0.404 -1.513 1.373 -2.779 2.729 -3.563 l 0 0 c 1.357 -0.785 2.937 -0.993 4.449 -0.59 c 1.514 0.404 2.778 1.373 3.563 2.729 c 0.785 1.355 0.995 2.935 0.591 4.448 c -0.404 1.514 -1.373 2.779 -2.729 3.563 C 73.745 43.078 72.736 43.331 71.74 43.331 z M 69.795 34.125 c -0.894 0.517 -1.531 1.351 -1.798 2.348 c -0.266 0.997 -0.128 2.038 0.389 2.931 c 1.068 1.844 3.437 2.476 5.279 1.409 c 0.894 -0.517 1.532 -1.351 1.798 -2.348 c 0.267 -0.997 0.128 -2.038 -0.389 -2.931 c -0.517 -0.894 -1.351 -1.532 -2.348 -1.798 C 71.728 33.468 70.687 33.608 69.795 34.125 L 69.795 34.125 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 47.002 54.402 c -0.959 0 -1.821 -0.184 -2.52 -0.562 c -0.331 -0.18 -0.534 -0.529 -0.524 -0.905 c 0.057 -2.22 2.063 -4.795 5.113 -6.559 c 1.524 -0.883 3.13 -1.453 4.641 -1.648 c 0.407 -0.047 0.792 0.142 0.993 0.491 l 1.821 3.147 c 0.202 0.349 0.175 0.785 -0.069 1.106 c -0.922 1.213 -2.216 2.321 -3.742 3.203 C 50.758 53.809 48.724 54.402 47.002 54.402 z M 46.084 52.31 c 1.284 0.267 3.406 -0.079 5.63 -1.365 c 1.061 -0.613 2.011 -1.372 2.733 -2.178 l -1.125 -1.943 c -1.058 0.225 -2.189 0.671 -3.249 1.284 C 47.848 49.395 46.487 51.062 46.084 52.31 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 89 56.35 c -0.271 0 -0.521 -0.1 -0.71 -0.29 c -0.09 -0.1 -0.16 -0.21 -0.21 -0.33 c -0.061 -0.12 -0.08 -0.25 -0.08 -0.38 s 0.02 -0.26 0.08 -0.38 c 0.05 -0.12 0.12 -0.229 0.21 -0.32 c 0.37 -0.38 1.05 -0.38 1.42 0 c 0.09 0.091 0.16 0.2 0.21 0.32 S 90 55.22 90 55.35 c 0 0.271 -0.101 0.521 -0.29 0.71 C 89.52 56.25 89.27 56.35 89 56.35 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
      <path
        d="M 26.01 89.63 c -0.26 0 -0.51 -0.11 -0.71 -0.3 c -0.18 -0.19 -0.29 -0.44 -0.29 -0.7 c 0 -0.271 0.11 -0.53 0.29 -0.71 c 0.05 -0.05 0.1 -0.09 0.16 -0.13 c 0.05 -0.03 0.11 -0.061 0.17 -0.09 c 0.06 -0.021 0.12 -0.04 0.19 -0.051 c 0.19 -0.05 0.39 -0.02 0.58 0.051 c 0.12 0.05 0.23 0.13 0.32 0.22 c 0.19 0.18 0.29 0.439 0.29 0.71 c 0 0.13 -0.02 0.26 -0.07 0.38 c -0.05 0.12 -0.13 0.23 -0.22 0.32 c -0.09 0.1 -0.2 0.17 -0.32 0.22 C 26.27 89.6 26.15 89.63 26.01 89.63 z"
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
        //   fill: 'rgb(0,0,0)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform="matrix(1 0 0 1 0 0)"
        strokeLinecap="round"
      />
    </g>
  </svg>
);



  // Other SVG Icon Components (Home, Back, Search)
  const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 21H5C4.44772 21 4 20.5523 4 20V12.4142L12 4.41421L20 12.4142V20C20 20.5523 19.5523 21 19 21H15M9 21H15M9 21V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 21L16.65 16.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="error404-page" data-theme={document.documentElement.getAttribute('data-theme') || 'light'}>
      <div className="error404-container">
        <div className="error404-visual-section">
          <div className="error404-icon-container">
            <BrokenLinkIcon />
          </div>
          <div className="error404-number-display">404</div>
        </div>

        <div className="error404-title-section">
          <h1 className="error404-main-title">Page Not Found</h1>
        </div>

        <div className="error404-content-section">
          <p className="error404-description-message">
            Oops! The page you're looking for seems to have drifted away into space. It might have been moved, deleted, or you entered
            the wrong URL.
          </p>

          <div className="error404-action-buttons">
            <Link to="/" className="error404-btn error404-btn-primary">
              <HomeIcon />
              Go Home
            </Link>

            <button onClick={handleGoBack} className="error404-btn error404-btn-secondary">
              <BackIcon />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage404;
