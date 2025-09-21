import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const SparklesIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export const DownloadIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const TrashIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const AddImageIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ResetViewIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
  </svg>
);

export const FilterIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
);

export const UploadIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const PolarBearIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" {...props}>
        <path d="M410.3 90.6c-4-1.2-8.2-1.3-12.3-.3-14.4 3.7-23.6 18.3-22.1 32.9 0 .4.1.8.1 1.2.1 3.2-.5 6.4-1.6 9.4-18.3 47.9-52.9 88.5-92.4 120.3-30.8 24.6-65.7 44.5-102.3 59.5-12.3 5-24.8 9.6-37.3 14.3-12.9 4.8-25.9 9.3-38.8 14-11.2 4.1-22.4 8.2-33.5 12.5-10.8 4.2-21.6 8.5-32.2 13.2-9.9 4.4-19.4 9.6-28.2 15.7-10.1 7-17.7 17-21.2 28.5-3.4 11.2-2.1 23.2 3.6 33.7 7.5 13.6 22.1 22.2 37.6 22.2 12.4 0 24.2-5.9 31.9-16.1 11.4-15 19.3-32.2 26.6-49.8 12.8-30.5 25.2-61.1 37.8-91.6 18.2-44.1 36.6-88.1 55.4-131.9 6.8-15.8 13.6-31.6 20.4-47.4 3.8-8.8 7.5-17.7 11.2-26.5 2-4.8 3.9-9.6 5.8-14.4 4.5-11.4 7.5-23.3 8.2-35.4.1-2 .1-4.1.1-6.1.5-14.5-7.5-28.2-21.5-33.1zm-186 150.3c-15.1 16.5-36.5 26.5-59.4 26.5-33.4 0-62.8-20.3-74.9-50.5-12.1-30.2 2.6-64.8 32.8-76.9 30.2-12.1 64.8 2.6 76.9 32.8 10.7 26.7 1.8 57.3-20.2 73.1-1.7 1.2-3.5 2.3-5.2 3zm117.9 76.4c-15.6 17.2-38.3 27.5-62.5 27.5-32.2 0-60.6-18.7-72.9-47.2-12.3-28.5 1.5-61.6 29.9-73.9 28.5-12.3 61.6 1.5 73.9 29.9 11.2 25.9 3.2 55.5-18.4 71.2z"/>
    </svg>
);