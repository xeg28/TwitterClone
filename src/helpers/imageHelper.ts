export function getSquareDimensionsPercentage(
  originalWidth: number,
  originalHeight: number
): { widthPercent: number; heightPercent: number } {

  const maxDimension = Math.max(originalWidth, originalHeight);
  const squareDimension = Math.min(originalWidth, originalHeight);
  const percentage = (squareDimension / maxDimension) * 100;

  let widthPercent: number;
  let heightPercent: number;

  if (originalWidth > originalHeight) {
    widthPercent = percentage;
    heightPercent = 100;
  } else if (originalHeight > originalWidth) {
    widthPercent = 100;
    heightPercent = percentage;
  } else {
    widthPercent = 100;
    heightPercent = 100;
  }
  return {
    widthPercent: widthPercent,
    heightPercent: heightPercent
  };
}

export function getBannerDimensions(
  originalWidth: number,
  originalHeight: number
)
  : { widthPercent: number; heightPercent: number } {


  let cropHeight = originalWidth/3;


  let heightPercent: number = (cropHeight / originalHeight) * 100;
  return {
    widthPercent: 100,
    heightPercent: heightPercent
  }
}