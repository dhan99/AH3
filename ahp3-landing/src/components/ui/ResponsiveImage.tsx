import Image, { ImageProps } from 'next/image';

interface ResponsiveImageProps extends ImageProps {
  className?: string;
}

export const ResponsiveImage = ({ 
  className = '', 
  style = {}, 
  fill,
  ...props 
}: ResponsiveImageProps) => {
  // If fill is true, don't add width and height auto to style
  const imageStyle = fill 
    ? { ...style }
    : { width: 'auto', height: 'auto', ...style };
    
  return (
    <Image 
      {...props} 
      fill={fill}
      className={`${className}`}
      style={imageStyle}
    />
  );
};
